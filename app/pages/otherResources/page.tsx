'use client';

import React from 'react';

const OtherResourcesPage = () => {
  const resources = [
    {
      id: 'youtube',
      title: 'Advanced JavaScript Concepts - YouTube',
      description: 'A detailed YouTube tutorial covering advanced JavaScript concepts like closures, promises, and async/await.',
      link: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
      type: 'Video',
      thumbnail: 'https://img.youtube.com/vi/Oe421EPjeBE/0.jpg',
    },
    {
      id: 'coursera',
      title: 'Coursera: Full-Stack Web Development',
      description: 'A Coursera specialization that teaches full-stack web development, including front-end and back-end technologies.',
      link: 'https://www.coursera.org/specializations/full-stack',
      type: 'Course',
      thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/coursera-favicon-v2.png',
    },
    {
      id: 'tutorial',
      title: 'CSS Tricks: A Complete Guide to Flexbox',
      description: 'A comprehensive guide to CSS Flexbox layout, with examples and use cases.',
      link: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      type: 'Tutorial',
      thumbnail: 'https://css-tricks.com/favicon.ico',
    },
    {
      id: 'documentation',
      title: 'React Official Documentation',
      description: 'The official React documentation provides in-depth guides and tutorials for building React applications.',
      link: 'https://reactjs.org/docs/getting-started.html',
      type: 'Documentation',
      thumbnail: 'https://reactjs.org/favicon.ico',
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-[#F5F1EE] font-sans">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Additional Resources
        </h1>
        <p className="mb-8 text-center text-base text-gray-700">
          Explore these additional resources to deepen your knowledge and skills. These include video tutorials, online courses, and official documentation.
        </p>

        <ul className="space-y-6">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <img
                src={resource.thumbnail}
                alt={`${resource.title} thumbnail`}
                className="w-20 h-20 rounded-md object-cover"
              />

              {/* Resource Details */}
              <div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {resource.title}
                </a>
                <p className="mt-2 text-sm text-gray-600">{resource.description}</p>
                <span className="mt-2 inline-block text-xs font-medium text-gray-500">
                  Type: {resource.type}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OtherResourcesPage;