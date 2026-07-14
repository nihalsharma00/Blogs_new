import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and VlogPlatform ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. User Representations</h2>
        <p>
          By using the Site, you represent and warrant that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>All registration information you submit will be true, accurate, current, and complete.</li>
          <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
          <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
          <li>You are not a minor in the jurisdiction in which you reside.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Prohibited Activities</h2>
        <p>
          You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
        </p>
        <p>As a user of the Site, you agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
          <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
          <li>Circumvent, disable, or otherwise interfere with security-related features of the Site.</li>
          <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Generated Contributions</h2>
        <p>
          The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Site Management</h2>
        <p>
          We reserve the right, but not the obligation, to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Monitor the Site for violations of these Terms and Conditions.</li>
          <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms and Conditions.</li>
          <li>In our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable any of your Contributions or any portion thereof.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
        <p>
          In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="/contact" className="text-primary hover:underline">our contact page</a>.
        </p>
      </div>
    </div>
  );
};
