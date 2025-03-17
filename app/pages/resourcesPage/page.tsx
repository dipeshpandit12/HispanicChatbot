'use client';

import React from 'react';

const ResourcesPage = () => {
  const resources = [
    {
      id: 'youtube',
      title: 'Web Development Basics - YouTube',
      description: 'This beginner-friendly YouTube tutorial covers the fundamentals of web development, including HTML, CSS, and JavaScript. It’s perfect for those starting their journey in building websites.',
      link: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
      type: 'Video',
      thumbnail: 'https://img.youtube.com/vi/UB1O30fR-EE/0.jpg',
      colorClasses: 'text-red-600',
    },
    {
      id: 'coursera',
      title: 'Coursera: Web Development Specialization',
      description: 'A comprehensive specialization offered by Coursera that teaches web development from scratch. It includes hands-on projects, covering topics like responsive design, front-end frameworks, and back-end development.',
      link: 'https://www.coursera.org/specializations/web-design',
      type: 'Course',
      thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/coursera-favicon-v2.png',
      colorClasses: 'text-blue-600',
    },
    {
      id: 'freecodecamp',
      title: 'FreeCodeCamp: Responsive Web Design',
      description: 'A free and interactive course that teaches you how to create responsive websites. You’ll learn about CSS Flexbox, Grid, and accessibility while building real-world projects.',
      link: 'https://www.freecodecamp.org/learn/responsive-web-design/',
      type: 'Course',
      thumbnail: 'https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.png',
      colorClasses: 'text-green-600',
    },
    {
      id: 'mdn',
      title: 'MDN Web Docs',
      description: 'The Mozilla Developer Network (MDN) provides in-depth documentation and tutorials for web development. It’s an essential resource for learning HTML, CSS, JavaScript, and modern web APIs.',
      link: 'https://developer.mozilla.org/en-US/',
      type: 'Documentation',
      thumbnail: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
      colorClasses: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EE] font-sans">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          Web Development Resources
        </h1>
        <p className="mb-12 text-center text-lg text-gray-700">
          Explore these resources to learn more about web development and enhance your skills. Each resource is carefully selected to provide valuable insights and practical knowledge.
        </p>

        <ul className="space-y-8">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="flex items-start space-x-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {/* Thumbnail */}
              <img
                src={resource.thumbnail}
                alt={`${resource.title} thumbnail`}
                className="w-32 h-32 rounded-md object-cover"
              />

              {/* Resource Details */}
              <div className="flex-1">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl font-semibold hover:underline ${resource.colorClasses}`}
                >
                  {resource.title}
                </a>
                <p className="mt-2 text-gray-600 text-lg">{resource.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-gray-500">
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

export default ResourcesPage;