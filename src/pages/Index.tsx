
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero section */}
      <Hero />
      
      {/* Features section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Empowering Kenyan Farmers with Technology
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Our platform combines traditional farming knowledge with modern data analytics to provide accurate crop yield predictions tailored to Kenyan agriculture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Accurate Predictions"
              description="Get reliable crop yield predictions based on your specific farming conditions and historical data from your region."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              delay="animate-delay-100"
            />
            <FeatureCard
              title="Local Knowledge"
              description="Our system is specifically calibrated for Kenyan soil types, weather patterns, and agricultural practices."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              delay="animate-delay-300"
            />
            <FeatureCard
              title="Farming Insights"
              description="Receive personalized recommendations to improve your yield based on your specific farming conditions."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              delay="animate-delay-500"
            />
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Our platform makes it easy to get accurate crop yield predictions in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel rounded-xl p-6 text-center animate-fade-in">
              <div className="bg-gradient-to-br from-farm-leaf to-farm-leaf-light w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Input Your Data</h3>
              <p className="text-foreground/80">Enter your location, land size, and crop type.</p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 text-center animate-fade-in animate-delay-200">
              <div className="bg-gradient-to-br from-farm-leaf to-farm-leaf-light w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Add Details</h3>
              <p className="text-foreground/80">Include soil type, irrigation method, and farming practices.</p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 text-center animate-fade-in animate-delay-400">
              <div className="bg-gradient-to-br from-farm-leaf to-farm-leaf-light w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Predictions</h3>
              <p className="text-foreground/80">Receive accurate yield estimates based on your specific conditions.</p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 text-center animate-fade-in animate-delay-500">
              <div className="bg-gradient-to-br from-farm-leaf to-farm-leaf-light w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Apply Insights</h3>
              <p className="text-foreground/80">Use our recommendations to improve your farming practices.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Maximize Your Farm's Potential?</h2>
                <p className="text-foreground/80 mb-8">
                  Join thousands of Kenyan farmers who are already using FarmWise to increase their yields and improve their farming practices.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/signup" className="btn-primary w-full sm:w-auto py-3 px-8 text-center">
                    Get Started for Free
                  </Link>
                  <Link to="/about" className="btn-outline w-full sm:w-auto py-3 px-8 text-center">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-farm-leaf to-farm-crop rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FW</span>
                </div>
                <span className="text-xl font-bold">FarmWise</span>
              </div>
              <p className="text-foreground/80">
                Empowering Kenyan farmers with data-driven insights for better crop yields.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/login" className="text-foreground/80 hover:text-foreground transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="text-foreground/80 hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Crops</h4>
              <ul className="space-y-2">
                <li className="text-foreground/80">Maize</li>
                <li className="text-foreground/80">Coffee</li>
                <li className="text-foreground/80">Tea</li>
                <li className="text-foreground/80">Potatoes</li>
                <li className="text-foreground/80">Beans</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-foreground/80 mb-2">contact@farmwise.co.ke</p>
              <p className="text-foreground/80 mb-2">+254 123 456 789</p>
              <p className="text-foreground/80">Nairobi, Kenya</p>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-foreground/60 text-sm">
            <p>© {new Date().getFullYear()} FarmWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
