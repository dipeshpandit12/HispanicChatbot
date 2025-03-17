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
      thumbnail: 'https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg', // High-quality YouTube thumbnail
      colorClasses: 'text-red-600',
    },
    {
      id: 'coursera',
      title: 'Coursera: Full-Stack Web Development',
      description: 'A Coursera specialization that teaches full-stack web development, including front-end and back-end technologies.',
      link: 'https://www.coursera.org/specializations/full-stack',
      type: 'Course',
      thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/3V3v9u5Z6X9u9v8v9v9/fullstack.jpg', // High-quality Coursera image
      colorClasses: 'text-blue-600',
    },
    {
      id: 'tutorial',
      title: 'CSS Tricks: A Complete Guide to Flexbox',
      description: 'A comprehensive guide to CSS Flexbox layout, with examples and use cases.',
      link: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      type: 'Tutorial',
      thumbnail: 'https://css-tricks.com/wp-content/uploads/2018/10/css-tricks-logo.png', // High-quality CSS Tricks logo
      colorClasses: 'text-green-600',
    },
    {
      id: 'documentation',
      title: 'React Official Documentation',
      description: 'The official React documentation provides in-depth guides and tutorials for building React applications.',
      link: 'https://reactjs.org/docs/getting-started.html',
      type: 'Documentation',
      thumbnail: 'https://reactjs.org/logo-og.png', // High-quality React logo
      colorClasses: 'text-purple-600',
    },
    {
      id: 'freecodecamp',
      title: 'FreeCodeCamp: Responsive Web Design',
      description: 'Learn responsive web design with hands-on projects and certifications.',
      link: 'https://www.freecodecamp.org/learn',
      type: 'Course',
      thumbnail: 'https://design-style-guide.freecodecamp.org/downloads/fcc_primary_large.jpg', // High-quality FreeCodeCamp image
      colorClasses: 'text-teal-600',
    },
    {
      id: 'mdn',
      title: 'MDN Web Docs: JavaScript',
      description: 'Comprehensive documentation for JavaScript, including guides and references.',
      link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      type: 'Documentation',
      thumbnail: 'https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png', // High-quality MDN logo
      colorClasses: 'text-orange-600',
    },
    {
      id: 'udemy',
      title: 'Udemy: Modern React with Redux',
      description: 'A popular Udemy course for mastering React and Redux.',
      link: 'https://www.udemy.com/course/react-redux/',
      type: 'Course',
      thumbnail: 'https://img-b.udemycdn.com/course/750x422/705264_caa9_11.jpg', // High-quality Udemy course image
      colorClasses: 'text-yellow-600',
    },
    {
      id: 'github',
      title: 'GitHub: Awesome JavaScript',
      description: 'A curated list of awesome JavaScript libraries, frameworks, and resources.',
      link: 'https://github.com/sorrycc/awesome-javascript',
      type: 'Repository',
      thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', // High-quality GitHub logo
      colorClasses: 'text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-[#F5F1EE] to-[#EDE7E3] font-sans">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Page Title */}
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          Additional Resources
        </h1>
        <p className="mb-12 text-center text-lg text-gray-700">
          Explore these additional resources to deepen your knowledge and skills. These include video tutorials, online courses, and official documentation.
        </p>

        {/* Resource Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <img
                src={resource.thumbnail}
                alt={`${resource.title} thumbnail`}
                className="w-full h-32 object-cover"
              />

              {/* Resource Details */}
              <div className="p-3">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-sm font-semibold hover:underline ${resource.colorClasses}`}
                >
                  {resource.title}
                </a>
                <p className="mt-1 text-xs text-gray-600">{resource.description}</p>
                <span className="mt-2 inline-block text-xs font-medium text-gray-500">
                  Type: {resource.type}
                </span>
              </div>

              {/* Decorative Border */}
              <div
                className={`h-1 w-full ${resource.colorClasses} bg-gradient-to-r from-transparent via-gray-300 to-transparent`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherResourcesPage;