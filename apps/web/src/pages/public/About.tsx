import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About VlogPlatform</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to VlogPlatform, your premier destination for discovering, reading, and sharing engaging content across a multitude of genres. We believe that everyone has a story to tell, and our mission is to provide the canvas for those stories to be seen and heard by a global audience.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
        <p className="leading-relaxed">
          In a world increasingly dominated by fleeting content, VlogPlatform stands as a beacon for meaningful expression. Our platform is designed to seamlessly blend written narratives with engaging video content, creating a rich, multimodal experience that goes beyond traditional blogging. We strive to foster a vibrant community where creators and audiences can connect on a deeper level.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Diverse Content:</strong> From tech tutorials and travel diaries to deep-dive essays and daily vlogs, our platform supports a wide array of categories and tags.</li>
          <li><strong>Creator-First Tools:</strong> A comprehensive dashboard and intuitive editor empower creators to focus on what they do best: creating.</li>
          <li><strong>Interactive Community:</strong> Engage with content through our robust commenting system, likes, and social sharing features.</li>
          <li><strong>Modern Aesthetics:</strong> A sleek, accessible, and responsive design with multiple themes to suit your reading preference.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-4">Join Our Community</h2>
        <p className="leading-relaxed">
          Whether you're here to share your journey or to find inspiration, VlogPlatform is your home. <a href="/register" className="text-primary hover:underline">Create an account today</a> and start exploring the world of endless stories.
        </p>
      </div>
    </div>
  );
};
