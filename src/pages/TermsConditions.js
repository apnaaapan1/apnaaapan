import React, { useEffect } from 'react';

const TermsConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#EFE7D5] py-16 px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 border border-[#e5e2d8]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4 border-b pb-6">
                    Terms & Conditions
                </h1>

                <div className="space-y-4 mb-10 text-gray-600 font-medium">
                    <p><span className="text-gray-800 font-bold">Effective Date:</span> 7th Feb 2026</p>
                    <p><span className="text-gray-800 font-bold">Brand:</span> Apnaaapan</p>
                    <p><span className="text-gray-800 font-bold">Registered Company:</span> Workpark Private Limited</p>
                    <p><span className="text-gray-800 font-bold">Business Type:</span> Creative & Digital Marketing Agency</p>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans space-y-8">
                    <p className="text-lg">
                        Welcome to <span className="text-orange-600 font-bold">Apnaaapan</span>. These Terms & Conditions (“Terms”) govern your access to and use of our website and services. By accessing our website, submitting inquiries, or engaging with our services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.
                    </p>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">1. Introduction</h2>
                        <p>
                            Apnaaapan, operated by <span className="font-semibold">Workpark Private Limited</span>, provides creative and digital marketing services including branding, social media marketing, performance marketing, web development, content creation, and lead generation.
                        </p>
                        <p>
                            These Terms define the rules and conditions for using our website, engaging with our content, and communicating with us through forms, ads, WhatsApp, email, or any other channels.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">2. Use of Website</h2>
                        <p>You agree to use our website only for lawful purposes. You must not:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use the website for any illegal, harmful, or fraudulent activity</li>
                            <li>Attempt to gain unauthorized access to our systems or data</li>
                            <li>Copy, scrape, or misuse website content without permission</li>
                            <li>Disrupt or interfere with the security or performance of the website</li>
                        </ul>
                        <p>We reserve the right to restrict or terminate access to users who violate these Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">3. Services & Engagement</h2>
                        <p>
                            Information on our website is provided for general informational purposes and does not constitute a binding offer. Actual service scope, timelines, deliverables, and pricing will be defined through formal proposals, agreements, or contracts shared separately.
                        </p>
                        <p>
                            Submitting an inquiry or form does not guarantee acceptance of a project or engagement. We reserve the right to accept or decline any inquiry at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">4. Intellectual Property</h2>
                        <p>
                            All content on this website, including text, graphics, logos, visuals, designs, videos, and branding elements, is the intellectual property of Apnaaapan or its licensors unless stated otherwise.
                        </p>
                        <p>
                            You may not copy, reproduce, distribute, modify, or use any content without prior written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">5. User Submissions</h2>
                        <p>By submitting information, content, or materials to us (including via contact forms, emails, WhatsApp, or campaign forms), you confirm that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>The information provided is accurate and lawful</li>
                            <li>You have the right to share such information</li>
                            <li>You grant us the right to use the information for responding to your inquiry and providing our services</li>
                        </ul>
                        <p>We are not responsible for the accuracy of information submitted by users.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">6. Third-Party Links & Tools</h2>
                        <p>
                            Our website may contain links to third-party websites or use third-party tools (such as analytics platforms, ad platforms, payment gateways, or communication tools).
                        </p>
                        <p>
                            We do not control these third-party platforms and are not responsible for their content, policies, or practices. Your interaction with third-party services is governed by their respective terms and policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">7. Data Collection & Communication Consent</h2>
                        <p>By submitting your details through our website, Meta Ads, Google Ads, WhatsApp inquiries, or newsletter forms, you consent to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Being contacted by Apnaaapan via phone, email, WhatsApp, or other communication channels</li>
                            <li>Receiving information related to our services, proposals, offers, and updates</li>
                        </ul>
                        <p>You may opt out of marketing communications at any time by contacting us or using provided unsubscribe options.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, Apnaaapan and Workpark Private Limited shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use or inability to use the website</li>
                            <li>Reliance on information provided on the website</li>
                            <li>Any errors, omissions, or interruptions in website content or availability</li>
                        </ul>
                        <p>All services are provided on a best-effort basis unless otherwise specified in a written agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">9. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless Apnaaapan and Workpark Private Limited from any claims, damages, liabilities, or expenses arising out of your misuse of the website, violation of these Terms, or infringement of any rights of a third party.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">10. Termination of Access</h2>
                        <p>
                            We reserve the right to suspend or terminate access to our website or services at any time, without prior notice, if we believe that a user has violated these Terms or engaged in unlawful or harmful activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">11. Governing Law & Jurisdiction</h2>
                        <p>
                            These Terms shall be governed by and interpreted in accordance with the laws of India, including the Information Technology Act, 2000 and applicable rules. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">12. Changes to These Terms</h2>
                        <p>
                            We may update these Terms from time to time to reflect changes in our services, business practices, or legal requirements. Any changes will be posted on this page with an updated effective date. Continued use of the website after changes implies acceptance of the revised Terms.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">13. Contact Information</h2>
                        <p className="mb-4">For any questions or concerns regarding these Terms & Conditions, please contact:</p>
                        <div className="space-y-2 text-gray-800 font-medium">
                            <p>Apnaaapan (Workpark Private Limited)</p>
                            <p className="flex items-center gap-2">
                                <span>📧</span> <a href="mailto:grow@apnaaapan.com" className="text-orange-600 hover:underline">grow@apnaaapan.com</a>
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

export default TermsConditions;
