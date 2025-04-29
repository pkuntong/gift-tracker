import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-lg">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using Gift Tracker, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
            If you do not agree with any of these terms, you are prohibited from using or accessing Gift Tracker.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily access Gift Tracker for personal, non-commercial use only. This license does not include:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose</li>
            <li>Attempting to reverse engineer any software contained in Gift Tracker</li>
            <li>Removing any copyright or other proprietary notations</li>
            <li>Transferring the materials to another person</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p>When you create an account with Gift Tracker, you must provide accurate and complete information. You are responsible for:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Maintaining the security of your account</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
          <p>Some features of Gift Tracker require a paid subscription. By subscribing, you agree to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Pay all fees in accordance with the pricing and payment terms presented to you</li>
            <li>Provide accurate and complete billing information</li>
            <li>Authorize us to charge your chosen payment method</li>
            <li>Accept that subscriptions automatically renew unless cancelled</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Content Guidelines</h2>
          <p>Users are responsible for all content they post, upload, or share through Gift Tracker. Content must not:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Contain harmful or malicious code</li>
            <li>Be defamatory, obscene, or offensive</li>
            <li>Violate privacy rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p>
            Gift Tracker is provided "as is" without any warranties, expressed or implied. We do not warrant that:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>The service will be uninterrupted or error-free</li>
            <li>Defects will be corrected</li>
            <li>The service is free of viruses or other harmful components</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall Gift Tracker be liable for any damages arising out of the use or inability to use the service, 
            even if we have been notified of the possibility of such damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or 
            through the service. Your continued use of Gift Tracker after such modifications constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            Email: legal@gifttracker.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 