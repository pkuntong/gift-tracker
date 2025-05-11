import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Gift Tracker</h1>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Gift Tracker is a modern web application designed to help you organize and track your gift-giving all year round.
              Our mission is to eliminate the stress of remembering important occasions and finding the perfect gifts for your loved ones.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Story</h2>
            <p className="mb-4">
              Gift Tracker was born out of a simple need: keeping track of gift ideas throughout the year. 
              We found ourselves scrambling at the last minute for birthdays, holidays, and special occasions, 
              often forgetting great gift ideas we had months earlier.
            </p>
            <p className="mb-4">
              Founded in 2023, our team of gift-giving enthusiasts created this platform to solve this common problem 
              and make thoughtful gift-giving easier for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Features</h2>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Comprehensive gift idea tracking for all your friends and family</li>
              <li>Calendar integration to never miss important dates</li>
              <li>Budget management to help you plan your gift expenses</li>
              <li>Wishlists sharing capabilities</li>
              <li>Integration with popular e-commerce platforms</li>
              <li>Secure payment processing for gift purchases</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Team</h2>
            <p className="mb-4">
              We're a passionate team of developers, designers, and gift-giving enthusiasts dedicated to creating 
              the best possible experience for our users. Our diverse backgrounds and expertise come together 
              to deliver a product that's both powerful and easy to use.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Contact Us</h2>
            <p className="mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you! Visit our <a href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact page</a> to get in touch with our team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
