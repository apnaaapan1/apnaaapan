const { MongoClient, ObjectId } = require('mongodb');

// Reuse existing env vars for DB
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

// Simple admin protection using a shared secret (also used as admin token)
const ADMIN_SECRET = process.env.ADMIN_SECRET;

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
        collection: db.collection('team_members'),
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

function sanitizeTeamInput(body) {
    const { name, role, linkedin, image, status } = body || {};

    return {
        name: typeof name === 'string' ? name.trim() : '',
        role: typeof role === 'string' ? role.trim() : '',
        linkedin: typeof linkedin === 'string' ? linkedin.trim() : '',
        image: typeof image === 'string' ? image.trim() : '',
        status: status === 'draft' ? 'draft' : 'published',
    };
}

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, query } = req;

    // Public endpoints: GET
    if (method === 'GET') {
        try {
            const { collection } = await getDb();
            const { includeDrafts } = query || {};
            const isAdminRequest = isAdmin(req);

            const filter = {};
            if (!isAdminRequest || includeDrafts !== 'true') {
                filter.status = 'published';
            }

            const docs = await collection
                .find(filter)
                .toArray();

            return res.status(200).json({
                team: docs.map((doc) => ({
                    id: doc._id.toString(),
                    name: doc.name,
                    role: doc.role,
                    linkedin: doc.linkedin,
                    image: doc.image,
                    status: doc.status,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                })),
            });
        } catch (error) {
            console.error('TEAM API GET error:', error);
            return res.status(500).json({
                message: 'Failed to fetch team members',
                error: 'TEAM_GET_ERROR',
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
            const { collection } = await getDb();
            const member = sanitizeTeamInput(req.body);

            if (!member.name || !member.role) {
                return res.status(400).json({
                    message: 'Name and role are required',
                    error: 'MISSING_FIELDS',
                });
            }

            const now = new Date();
            const doc = {
                ...member,
                createdAt: now,
                updatedAt: now,
            };

            const result = await collection.insertOne(doc);

            return res.status(201).json({
                message: 'Team member added successfully',
                id: result.insertedId.toString(),
            });
        } catch (error) {
            console.error('TEAM API POST error:', error);
            return res.status(500).json({
                message: 'Failed to add team member',
                error: 'TEAM_CREATE_ERROR',
            });
        }
    }

    if (method === 'PUT') {
        try {
            const { collection } = await getDb();
            const { id } = req.body || {};

            if (!id) {
                return res.status(400).json({
                    message: 'Member id is required',
                    error: 'MISSING_ID',
                });
            }

            const member = sanitizeTeamInput(req.body);

            const update = {
                $set: {
                    name: member.name,
                    role: member.role,
                    linkedin: member.linkedin,
                    image: member.image,
                    status: member.status,
                    updatedAt: new Date(),
                },
            };

            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                update
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({
                    message: 'Team member not found',
                    error: 'NOT_FOUND',
                });
            }

            return res.status(200).json({
                message: 'Team member updated successfully',
            });
        } catch (error) {
            console.error('TEAM API PUT error:', error);
            return res.status(500).json({
                message: 'Failed to update team member',
                error: 'TEAM_UPDATE_ERROR',
            });
        }
    }

    if (method === 'DELETE') {
        try {
            const { collection } = await getDb();
            const { id } = req.body || {};

            if (!id) {
                return res.status(400).json({
                    message: 'Member id is required',
                    error: 'MISSING_ID',
                });
            }

            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    message: 'Team member not found',
                    error: 'NOT_FOUND',
                });
            }

            return res.status(200).json({
                message: 'Team member deleted successfully',
            });
        } catch (error) {
            console.error('TEAM API DELETE error:', error);
            return res.status(500).json({
                message: 'Failed to delete team member',
                error: 'TEAM_DELETE_ERROR',
            });
        }
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ message: 'Method not allowed' });
};
