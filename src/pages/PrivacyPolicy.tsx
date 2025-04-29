import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Gift Tracker. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
          <p>We collect and process the following types of personal data:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Identity Data (name, username)</li>
            <li>Contact Data (email address, phone number)</li>
            <li>Technical Data (IP address, browser type, device information)</li>
            <li>Usage Data (how you use our website and services)</li>
            <li>Marketing and Communications Data (your preferences in receiving marketing)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing</h2>
          <p>We process your personal data on the following legal bases:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Your consent</li>
            <li>Performance of a contract</li>
            <li>Legal obligations</li>
            <li>Legitimate interests</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
            used, or accessed in an unauthorized way, altered, or disclosed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
            <br />
            Email: privacy@gifttracker.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 