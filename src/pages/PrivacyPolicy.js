import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#EFE7D5] py-16 px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 border border-[#e5e2d8]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4 border-b pb-6">
                    Privacy Policy
                </h1>

                <div className="space-y-4 mb-10 text-gray-600 font-medium">
                    <p><span className="text-gray-800 font-bold">Effective Date:</span> 7th Feb 2026</p>
                    <p><span className="text-gray-800 font-bold">Brand:</span> Apnaaapan</p>
                    <p><span className="text-gray-800 font-bold">Registered Company:</span> Workpark Private Limited</p>
                    <p><span className="text-gray-800 font-bold">Business Type:</span> Creative & Digital Marketing Agency</p>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans space-y-8">
                    <p className="text-lg">
                        <span className="text-orange-600 font-bold">Apnaaapan</span> (“we”, “our”, “us”) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website or interact with our services.
                    </p>
                    <p>
                        By accessing or using our website, submitting forms, or contacting us, you agree to the terms of this Privacy Policy.
                    </p>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">1. Introduction</h2>
                        <p>
                            This Privacy Policy outlines how Apnaaapan, operated by Workpark Private Limited, collects and processes information from users who visit our website, submit inquiries, or engage with our marketing campaigns. Our website is primarily used for lead generation, client inquiries, and showcasing our services and portfolio.
                        </p>
                        <p>
                            We comply with applicable data protection laws in India, including the Information Technology Act, 2000 and related rules, and follow globally accepted privacy best practices inspired by GDPR principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Information</h3>
                        <p>We may collect personal details such as:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Company name</li>
                            <li>Job title</li>
                            <li>Any information you submit through contact forms, WhatsApp inquiries, newsletter signups, or campaign landing pages</li>
                        </ul>
                        <p>This data may be collected via:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Website contact forms</li>
                            <li>Meta (Facebook/Instagram) lead forms</li>
                            <li>Google Ads lead forms</li>
                            <li>WhatsApp messages or calls</li>
                            <li>Newsletter subscription forms</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">Non-Personal Information</h3>
                        <p>We may automatically collect certain non-personal information such as:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>IP address</li>
                            <li>Browser type and device information</li>
                            <li>Pages visited, time spent on site</li>
                            <li>Referral sources</li>
                            <li>Cookies and usage data</li>
                        </ul>
                        <p className="mt-2">This helps us understand how users interact with our website and improve performance.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Respond to your inquiries and requests</li>
                            <li>Contact you regarding our services</li>
                            <li>Share proposals, quotations, and service information</li>
                            <li>Improve our website, services, and marketing campaigns</li>
                            <li>Send newsletters or updates (only if you opt in)</li>
                            <li>Run targeted advertising and retargeting campaigns</li>
                            <li>Maintain internal records and business communication</li>
                        </ul>
                        <p className="mt-2">We do not sell your personal information to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">4. Cookies & Tracking Technologies</h2>
                        <p>Our website uses cookies and similar tracking technologies to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Enhance user experience</li>
                            <li>Understand user behavior</li>
                            <li>Track performance of marketing campaigns</li>
                            <li>Measure website traffic and engagement</li>
                        </ul>
                        <p className="mt-2">You can control or disable cookies through your browser settings. Some features of the website may not function properly if cookies are disabled.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">5. Third-Party Services</h2>
                        <p>We may use trusted third-party tools and platforms for analytics, advertising, communication, and payments, including but not limited to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Google Analytics</li>
                            <li>Meta Ads (Facebook & Instagram)</li>
                            <li>Google Ads</li>
                            <li>Email marketing tools</li>
                            <li>CRM and automation platforms</li>
                            <li>Payment gateways (if applicable in future)</li>
                        </ul>
                        <p className="mt-2">These third-party providers may collect and process data in accordance with their own privacy policies. We encourage you to review their policies separately.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">6. Data Security</h2>
                        <p>
                            We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, misuse, loss, or disclosure. While we strive to use commercially acceptable means to protect your information, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">7. Data Retention Policy</h2>
                        <p>We retain your personal information only for as long as necessary to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Fulfill the purposes outlined in this Privacy Policy</li>
                            <li>Comply with legal, regulatory, or contractual obligations</li>
                            <li>Resolve disputes and enforce agreements</li>
                        </ul>
                        <p className="mt-2">When data is no longer required, it is securely deleted or anonymized.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">8. User Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate or incomplete data</li>
                            <li>Request deletion of your personal information</li>
                            <li>Withdraw consent or opt out of marketing communications at any time</li>
                            <li>Request information on how your data is processed</li>
                        </ul>
                        <p className="mt-2">To exercise your rights, please contact us using the details provided below.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">9. Sharing of Information</h2>
                        <p>We may share your information with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Internal team members for service delivery</li>
                            <li>Trusted partners or service providers who assist in operations (under confidentiality obligations)</li>
                            <li>Legal or regulatory authorities when required by law</li>
                        </ul>
                        <p className="mt-2">We never sell or rent your personal data to third parties for marketing purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">10. Children’s Privacy</h2>
                        <p>
                            Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a child has shared personal data with us, please contact us and we will take appropriate steps to delete such information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">11. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. Any updates will be posted on this page with a revised effective date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">12. Contact Information</h2>
                        <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, you can contact us at:</p>
                        <div className="space-y-2 text-gray-800 font-medium">
                            <p>Apnaaapan (Workpark Private Limited)</p>
                            <p className="flex items-center gap-2">
                                <span>📧</span> <a href="mailto:grow@apnaaapan.com" className="text-orange-600 hover:underline">Grow@apnaaapan.com</a>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>📞</span> <a href="tel:+919587773274" className="text-orange-600 hover:underline">+91-9587773274</a>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
