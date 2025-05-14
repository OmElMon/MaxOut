import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, User, Award, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Header component that provides navigation for the application.
 * Features:
 * - Responsive design with mobile menu
 * - Scrolling effects
 * - Active link highlighting
 * - Brand logo with navigation links
 */
const Header: React.FC = () => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for scroll detection
  const [scrolled, setScrolled] = useState(false);
  
  // Get current route location
  const location = useLocation();

  // Effect for handling scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow and compact header when scrolled past 10px
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Toggles the mobile menu visibility
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links configuration
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Workouts', path: '/workouts' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Progress', path: '/progress' },
    { name: 'Trainer', path: '/trainer' },
  ];

  /**
   * Checks if a given path matches the current route
   * @param {string} path - The path to check
   * @returns {boolean} - True if the path matches current route
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-purple-900/95 shadow-lg py-2' : 'bg-gradient-to-b from-purple-900 to-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand logo and name */}
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="text-pink-500" size={28} />
          <span className="font-bold text-xl text-white tracking-wider">
            <span className="text-pink-400">Max</span>
            <span className="text-blue-400">Out</span>
          </span>
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm uppercase tracking-wide font-medium transition-colors ${
                isActive(link.path) 
                  ? 'text-pink-400 border-b-2 border-pink-400' // Active link style
                  : 'text-gray-100 hover:text-pink-300' // Inactive link style
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop utility icons - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/achievements" 
            className="text-white hover:text-pink-300 transition-colors"
            title="Achievements"
          >
            <Award size={20} />
          </Link>
          <Link 
            to="/profile" 
            className="text-white hover:text-pink-300 transition-colors"
            title="Profile"
          >
            <User size={20} />
          </Link>
        </div>

        {/* Mobile Menu Button - visible only on mobile */}
        <button 
          className="md:hidden text-white hover:text-pink-300 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - appears when menu button is clicked */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-purple-900/95 border-t border-purple-800 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {/* Mobile navigation links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 px-4 rounded-md transition-colors ${
                    isActive(link.path) 
                      ? 'text-pink-400 bg-purple-800/50' // Active link style
                      : 'text-white hover:bg-purple-800/30' // Inactive link style
                  }`}
                  onClick={() => setIsMenuOpen(false)} // Close menu when link is clicked
                >
                  {link.name}
                </Link>
              ))}
              
              <hr className="border-purple-700 my-2" />
              
              {/* Mobile utility links */}
              <Link
                to="/achievements"
                className="py-2 px-4 rounded-md text-white hover:bg-purple-800/30 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Award size={18} />
                <span>Achievements</span>
              </Link>
              <Link
                to="/profile"
                className="py-2 px-4 rounded-md text-white hover:bg-purple-800/30 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;