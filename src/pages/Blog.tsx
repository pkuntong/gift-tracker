import React from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  // Sample blog post data
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Gift Ideas for Any Occasion',
      excerpt: 'Struggling to find the perfect gift? Check out our curated list of versatile gift ideas that work for birthdays, anniversaries, and more.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      date: 'May 5, 2025',
      category: 'Gift Ideas',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'How to Budget for Holiday Gift Giving',
      excerpt: 'The holiday season can be expensive. Learn practical strategies to plan your gift budget and avoid January financial stress.',
      image: 'https://images.unsplash.com/photo-1520695625556-c2a7bfe87a3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      date: 'April 28, 2025',
      category: 'Budgeting',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Personalized Gifts That Make a Lasting Impression',
      excerpt: 'Discover why personalized gifts create a stronger emotional connection and how to create meaningful custom presents.',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      date: 'April 15, 2025',
      category: 'Gift Ideas',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Sustainable Gift Giving: Eco-Friendly Options',
      excerpt: 'Reduce your environmental impact while still giving thoughtful presents with our guide to sustainable gift options.',
      image: 'https://images.unsplash.com/photo-1575389371771-2ee5b9489a9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      date: 'April 7, 2025',
      category: 'Sustainability',
      readTime: '8 min read'
    },
    {
      id: 5,
      title: 'Digital Gift Ideas for the Tech Enthusiast',
      excerpt: 'From subscription services to digital experiences, explore modern gift options for the technology lovers in your life.',
      image: 'https://images.unsplash.com/photo-1519219788971-8d9797e0928e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      date: 'March 30, 2025',
      category: 'Technology',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'Last-Minute Gift Ideas That Don\'t Feel Last-Minute',
      excerpt: 'We\'ve all been there – find out how to secure thoughtful gifts even when you\'re short on time.',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      date: 'March 22, 2025',
      category: 'Gift Ideas',
      readTime: '4 min read'
    }
  ];

  const categories = [
    'All Categories',
    'Gift Ideas',
    'Budgeting',
    'Sustainability',
    'Technology',
    'Seasonal',
    'DIY Gifts'
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Gift Giving Resources</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Tips, guides, and inspiration to help you find the perfect gifts for every occasion
          </p>
        </div>

        {/* Category Filter */}
        <div className="my-8 flex justify-center flex-wrap gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium ${index === 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    <span>{post.category}</span>
                  </p>
                  <div className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">Publication date and read time</span>
                  </div>
                  <div className="ml-0">
                    <p className="text-sm text-gray-500">
                      {post.date} · {post.readTime}
                    </p>
                    <div className="flex mt-2">
                      <Link to={`/blog/${post.id}`} className="text-indigo-600 hover:text-indigo-500">
                        Read full article
                        <span aria-hidden="true"> →</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gray-50 rounded-lg px-6 py-10 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-16">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Subscribe to our gift-giving newsletter
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-gray-500">
              Get monthly tips, seasonal gift ideas, and exclusive discounts delivered to your inbox.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs rounded-md"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-gray-500">
              We care about your data. Read our{' '}
              <Link to="/privacy" className="font-medium text-gray-900 underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
