
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero section */}
      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-bold mb-4 animate-fade-in">
              <span className="text-gradient">About FarmWise</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto animate-fade-in animate-delay-200">
              We're on a mission to empower Kenyan farmers with data-driven insights to increase crop yields and improve livelihoods.
            </p>
          </div>
          
          {/* Vision and mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="glass-panel rounded-xl p-8 animate-fade-in animate-delay-300">
              <div className="bg-gradient-to-br from-farm-leaf to-farm-leaf-light w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-foreground/80">
                To create a future where every Kenyan farmer has access to advanced agricultural technology, enabling them to make data-driven decisions that maximize yields while promoting sustainable farming practices.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-8 animate-fade-in animate-delay-500">
              <div className="bg-gradient-to-br from-farm-crop to-farm-soil-light w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-foreground/80">
                To provide accessible, accurate crop yield predictions and agricultural recommendations that combine traditional farming knowledge with modern data science, helping farmers increase productivity and improve their economic outcomes.
              </p>
            </div>
          </div>
          
          {/* Story section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-foreground/80 max-w-3xl mx-auto">
                FarmWise was born from the desire to bridge the gap between traditional farming wisdom and modern agricultural technology.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-8 animate-fade-in">
              <div className="prose prose-lg max-w-none text-foreground/90">
                <p>
                  In 2021, a team of agricultural experts, data scientists, and software engineers came together with a shared vision: to create a platform that would empower Kenyan farmers with data-driven insights tailored to their specific needs and growing conditions.
                </p>
                <p>
                  We recognized that while Kenya has a rich agricultural heritage, many farmers lacked access to modern tools and technologies that could help them optimize their crop yields and adapt to changing climate conditions.
                </p>
                <p>
                  After extensive research and collaboration with farming communities across Kenya, we developed FarmWise — a platform that combines traditional farming knowledge with advanced data analytics to provide accurate crop yield predictions and personalized recommendations.
                </p>
                <p>
                  Today, FarmWise is helping thousands of Kenyan farmers make more informed decisions about their crops, leading to increased yields, reduced waste, and improved livelihoods.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-foreground/80 max-w-3xl mx-auto">
                Meet the dedicated professionals behind FarmWise
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'John Kamau',
                  role: 'Founder & CEO',
                  bio: 'Agricultural economist with over 15 years of experience in Kenyan agriculture.'
                },
                {
                  name: 'Amina Ochieng',
                  role: 'Chief Agricultural Officer',
                  bio: 'Expert in crop science with a focus on sustainable farming practices.'
                },
                {
                  name: 'Daniel Mwangi',
                  role: 'Lead Data Scientist',
                  bio: 'Specializes in predictive modeling for agricultural applications.'
                },
                {
                  name: 'Grace Njeri',
                  role: 'Community Outreach',
                  bio: 'Works directly with farming communities to gather feedback and provide training.'
                }
              ].map((member, index) => (
                <div key={index} className="glass-panel rounded-xl p-6 text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-farm-leaf">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-farm-leaf mb-2">{member.role}</p>
                  <p className="text-foreground/80 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA section */}
          <div className="mb-20">
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
                  <p className="text-foreground/80 mb-8">
                    Be part of our mission to transform Kenyan agriculture through technology and data-driven insights.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/signup" className="btn-primary w-full sm:w-auto py-3 px-8 text-center">
                      Get Started Today
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
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

export default About;
