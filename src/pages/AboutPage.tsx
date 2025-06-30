import React from 'react';
import { Mail, Github, Linkedin, Award, Zap } from 'lucide-react';
import BoltBadge from '../components/BoltBadge';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-500 pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
            <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About AI Career Coach
          </h1>
          <div className="mb-6">
            <BoltBadge />
          </div>
        </div>

        <div className="space-y-12">
          {/* App Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                AI Career Coach is an innovative web application designed to revolutionize how professionals 
                approach their career development. Built with cutting-edge AI technology, our platform provides 
                personalized guidance, resume analysis, and interview preparation to help you achieve your career goals.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Whether you're just starting your career journey, looking to make a transition, or aiming for 
                your next promotion, our AI-powered tools provide the insights and practice you need to succeed 
                in today's competitive job market.
              </p>
            </div>
          </div>

          {/* Hackathon Context */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hackathon Project</h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300">Built with Bolt.new</h3>
              </div>
              <p className="text-purple-800 dark:text-purple-200">
                This application was created as part of a hackathon using Bolt.new's powerful AI-driven 
                development platform. Bolt.new enabled rapid prototyping and deployment of this full-featured 
                career coaching application with modern web technologies.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-colors duration-500">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Technologies</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• React & TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• React Router</li>
                  <li>• Lucide Icons</li>
                  <li>• Vite Build Tool</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-colors duration-500">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features Implemented</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Responsive Design</li>
                  <li>• Career Goal Assessment</li>
                  <li>• Resume Analysis</li>
                  <li>• Mock Interviews</li>
                  <li>• AI Video Integration Ready</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <a
                    href="mailto:contact@aicareercoach.app"
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>contact@aicareercoach.app</span>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow the Project</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>View on GitHub</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Future Roadmap */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Future Enhancements</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Planned Features</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Real-time Tavus AI video integration</li>
                  <li>• Advanced analytics dashboard</li>
                  <li>• Industry-specific coaching modules</li>
                  <li>• Progress tracking and goal setting</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Improvements</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• User authentication system</li>
                  <li>• Cloud storage integration</li>
                  <li>• Mobile app development</li>
                  <li>• API integrations with job boards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}