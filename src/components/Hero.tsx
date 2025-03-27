
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const keywords = [
  'Maize',
  'Coffee',
  'Tea',
  'Irrigation',
  'Harvest',
  'Beans',
  'Potatoes',
  'Tomatoes',
  'Sukuma',
  'Bananas'
];

const Hero = () => {
  const [visibleKeywords, setVisibleKeywords] = useState<string[]>([]);

  useEffect(() => {
    // Randomly position keywords for animation
    const timer = setInterval(() => {
      const visibleCount = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...keywords].sort(() => 0.5 - Math.random());
      setVisibleKeywords(shuffled.slice(0, visibleCount));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background animated keywords */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {keywords.map((keyword, index) => (
          <div
            key={keyword}
            className={`absolute text-farm-leaf-light/10 font-bold transform transition-opacity duration-1000 ${
              visibleKeywords.includes(keyword) ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              fontSize: `${Math.random() * 3 + 2}rem`,
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              zIndex: 0,
            }}
          >
            {keyword}
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="z-10 max-w-4xl mx-auto text-center">
        <h1 className="font-bold mb-4 animate-fade-in">
          <span className="text-gradient">Cultivate Insights.</span>
          <br /> 
          <span className="text-gradient animate-delay-400">Harvest Success.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-in animate-delay-700">
          Empower your farming decisions with FarmWise, Kenya's premier crop yield prediction platform combining traditional knowledge with modern technology.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-1000">
          <Link to="/signup" className="btn-primary w-full sm:w-auto py-3 px-8 text-center">
            Get Started
          </Link>
          <Link to="/login" className="btn-outline w-full sm:w-auto py-3 px-8 text-center">
            Log In
          </Link>
        </div>
      </div>
      
      {/* Curved shape divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
