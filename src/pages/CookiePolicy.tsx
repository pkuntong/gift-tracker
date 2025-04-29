import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          This Cookie Policy explains how Gift Tracker ("we," "our," or "us") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p className="mb-4">
          Cookies set by the website owner (in this case, Gift Tracker) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Why Do We Use Cookies</h2>
        <p className="mb-4">
          We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Types of Cookies We Use</h2>
        
        <h3 className="text-xl font-medium mb-3">4.1 Essential Cookies</h3>
        <p className="mb-4">
          These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.
        </p>
        
        <h3 className="text-xl font-medium mb-3">4.2 Performance and Functionality Cookies</h3>
        <p className="mb-4">
          These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
        </p>
        
        <h3 className="text-xl font-medium mb-3">4.3 Analytics and Customization Cookies</h3>
        <p className="mb-4">
          These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you in order to enhance your experience.
        </p>
        
        <h3 className="text-xl font-medium mb-3">4.4 Advertising Cookies</h3>
        <p className="mb-4">
          These cookies are used to make advertising messages more relevant to you and your interests. They also perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. How Can You Control Cookies</h2>
        <p className="mb-4">
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in our cookie consent banner.
        </p>
        <p className="mb-4">
          You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
        </p>
        <p className="mb-4">
          In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" className="text-indigo-600 hover:underline">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" className="text-indigo-600 hover:underline">http://www.youronlinechoices.com</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Do Not Track Signals</h2>
        <p className="mb-4">
          Some browsers have incorporated "Do Not Track" (DNT) features that can send a signal to the websites you visit indicating you do not wish to be tracked. Because there is not yet a common understanding of how to interpret the DNT signal, our website does not currently respond to browser DNT signals.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Cookies That Have Been Set in the Past</h2>
        <p className="mb-4">
          If you have disabled one or more cookies, we may still use information collected from cookies prior to your disabled preference being set, however, we will stop using the disabled cookie to collect any further information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to This Cookie Policy</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p className="mb-4">
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our use of cookies or other technologies, please contact us at:
        </p>
        <p className="mb-4">
          Email: privacy@gifttracker.com<br />
          Address: [Your Business Address]
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy; 