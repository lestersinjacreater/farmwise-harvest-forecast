
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 ${
        isScrolled ? 'py-2 glass-panel shadow-sm' : 'py-4 bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-farm-leaf to-farm-crop rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">FW</span>
          </div>
          <span className="text-xl font-bold hidden sm:inline-block">FarmWise</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/90 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground/90 hover:text-foreground transition-colors">
            About
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-foreground/90 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 rounded-lg overflow-hidden animate-fade-in">
          <div className="flex flex-col px-4 py-2 space-y-2">
            <Link to="/" className="py-2 text-foreground/90 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="py-2 text-foreground/90 hover:text-foreground transition-colors">
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="py-2 text-foreground/90 hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-foreground/90 hover:text-foreground transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 text-foreground/90 hover:text-foreground transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="py-2 text-foreground/90 hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
