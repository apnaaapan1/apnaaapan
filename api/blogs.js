import { MongoClient, ObjectId } from 'mongodb';

// Reuse existing env vars for DB
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnapan_contacts';

// Simple admin protection using a shared secret (also used as admin token)
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!MONGODB_URI) {
  // Log once at cold start – helps during deployment/debugging
  console.error('BLOGS API: MONGODB_URI is not set. Blog features will not work.');
}

let cachedClient = null;

async function getDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await cachedClient.connect();
  }

  const db = cachedClient.db(DATABASE_NAME);
  return {
    db,
    collection: db.collection('blogs'),
  };
}

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  const headerSecret =
    req.headers['x-admin-token'] ||
    req.headers['X-Admin-Token'] ||
    req.headers['x-admin-secret'] ||
    req.headers['X-Admin-Secret'];
  return headerSecret === ADMIN_SECRET;
}

function sanitizeBlogInput(body) {
  const {
    title,
    slug,
    readTime,
    heroImage,
    content,
    status,
  } = body || {};

  return {
    title: typeof title === 'string' ? title.trim() : '',
    slug: typeof slug === 'string' ? slug.trim().toLowerCase() : '',
    readTime: typeof readTime === 'string' ? readTime.trim() : '',
    heroImage: typeof heroImage === 'string' ? heroImage.trim() : '',
    content: Array.isArray(content)
      ? content.map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean)
      : [],
    status: status === 'draft' ? 'draft' : 'published',
  };
}

export default async function handler(req, res) {
  const { method, query } = req;

  // Public endpoints: GET
  if (method === 'GET') {
    try {
      const { db, collection } = await getDb();

      const { slug, includeDrafts } = query || {};
      const isAdminRequest = isAdmin(req);

      const filter = {};

      if (slug) {
        filter.slug = slug;
      }

      if (!isAdminRequest || includeDrafts !== 'true') {
        // Public: only published
        filter.status = 'published';
      }

      if (slug) {
        const doc = await collection.findOne(filter);
        if (!doc) {
          return res.status(404).json({ message: 'Blog not found' });
        }
        return res.status(200).json({
          blog: {
            id: doc._id.toString(),
            title: doc.title,
            slug: doc.slug,
            readTime: doc.readTime,
            heroImage: doc.heroImage,
            content: doc.content,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          },
        });
      }

      const docs = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        blogs: docs.map((doc) => ({
          id: doc._id.toString(),
          title: doc.title,
          slug: doc.slug,
          readTime: doc.readTime,
          heroImage: doc.heroImage,
          content: doc.content,
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
      });
    } catch (error) {
      console.error('BLOGS API GET error:', error);
      return res.status(500).json({
        message: 'Failed to fetch blogs',
        error: 'BLOGS_GET_ERROR',
      });
    }
  }

  // Admin-only endpoints: POST, PUT, DELETE
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  if (method === 'POST') {
    try {
      const { db, collection } = await getDb();
      const blog = sanitizeBlogInput(req.body);

      if (!blog.title || !blog.slug) {
        return res.status(400).json({
          message: 'Title and slug are required',
          error: 'MISSING_FIELDS',
        });
      }

      // Ensure unique slug
      const existing = await collection.findOne({ slug: blog.slug });
      if (existing) {
        return res.status(409).json({
          message: 'Slug already exists. Please choose another.',
          error: 'DUPLICATE_SLUG',
        });
      }

      const now = new Date();
      const doc = {
        ...blog,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(doc);

      return res.status(201).json({
        message: 'Blog created successfully',
        id: result.insertedId.toString(),
      });
    } catch (error) {
      console.error('BLOGS API POST error:', error);
      return res.status(500).json({
        message: 'Failed to create blog',
        error: 'BLOGS_CREATE_ERROR',
      });
    }
  }

  if (method === 'PUT') {
    try {
      const { db, collection } = await getDb();
      const { id } = req.body || {};

      if (!id) {
        return res.status(400).json({
          message: 'Blog id is required',
          error: 'MISSING_ID',
        });
      }

      const blog = sanitizeBlogInput(req.body);

      const update = {
        $set: {
          title: blog.title,
          slug: blog.slug,
          readTime: blog.readTime,
          heroImage: blog.heroImage,
          content: blog.content,
          status: blog.status,
          updatedAt: new Date(),
        },
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        update
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: 'Blog not found',
          error: 'NOT_FOUND',
        });
      }

      return res.status(200).json({
        message: 'Blog updated successfully',
      });
    } catch (error) {
      console.error('BLOGS API PUT error:', error);
      return res.status(500).json({
        message: 'Failed to update blog',
        error: 'BLOGS_UPDATE_ERROR',
      });
    }
  }

  if (method === 'DELETE') {
    try {
      const { db, collection } = await getDb();
      const { id } = req.body || {};

      if (!id) {
        return res.status(400).json({
          message: 'Blog id is required',
          error: 'MISSING_ID',
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: 'Blog not found',
          error: 'NOT_FOUND',
        });
      }

      return res.status(200).json({
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      console.error('BLOGS API DELETE error:', error);
      return res.status(500).json({
        message: 'Failed to delete blog',
        error: 'BLOGS_DELETE_ERROR',
      });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ message: 'Method not allowed' });
}


