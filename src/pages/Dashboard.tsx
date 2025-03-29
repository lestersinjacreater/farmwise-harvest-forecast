import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import YieldForm from '@/components/YieldForm';
import PredictionResult from '@/components/PredictionResult';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<{ yield: number; unit: string } | null>(null);
  const [welcomeAnimation, setWelcomeAnimation] = useState(true);
  const [seasonalAlert, setSeasonalAlert] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Animation timing
    setTimeout(() => {
      setWelcomeAnimation(false);
    }, 1500);
  }, [isAuthenticated, navigate]);

  // Set a random seasonal alert on page load
  useEffect(() => {
    const alerts = [
      "The Kenya Meteorological Department predicts above-average rainfall in Eastern Kenya during the upcoming short rains. Plan your planting schedule accordingly.",
      "Expect lower than usual temperatures and occasional frosts in the highlands. Protect tender crops with appropriate coverings.",
      "A dry spell is forecasted for Central Kenya in the coming weeks. Consider scheduling irrigation and water conservation practices.",
      "The forecast indicates a surge in wind speeds across coastal regions. Secure loose materials and consider windbreaks for vulnerable crops.",
      "Unseasonal showers are predicted for Western Kenya. Monitor local weather updates closely and adjust your crop protection strategies."
    ];
    setSeasonalAlert(alerts[Math.floor(Math.random() * alerts.length)]);
  }, []);

  const handlePrediction = (result: { yield: number; unit: string }) => {
    setPrediction(result);
  };

  // Current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
          <div className="mb-12 relative overflow-hidden">
            <div
              className={`transition-all duration-1000 ${
                welcomeAnimation ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-20 absolute'
              }`}
            >
              <h1 className="text-4xl font-bold mb-2 animate-fade-in">
                {getGreeting()}, <span className="text-farm-leaf">{user.name}</span>
              </h1>
              <p className="text-foreground/80 animate-fade-in animate-delay-300">
                Welcome to MazaoSmart, your Kenyan crop yield prediction platform.
              </p>
            </div>
            
            <div
              className={`transition-all duration-1000 delay-500 ${
                !welcomeAnimation ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-20'
              }`}
            >
              <h2 className="text-2xl font-bold mb-6">Mazao Yield Prediction</h2>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Side panel with stats and tips */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Your Shamba Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-foreground/80">Account</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-foreground/80">Email</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-foreground/80">Predictions</span>
                    <span>{prediction ? '1' : '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/80">Member Since</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Farming Tips</h3>
                <ul className="space-y-3">
                  <li className="leaf-bullet text-foreground/80">
                    For maize in Central Kenya, plant at the onset of long rains in March-April.
                  </li>
                  <li className="leaf-bullet text-foreground/80">
                    Apply DAP fertilizer at planting time and CAN fertilizer when the maize is knee-high.
                  </li>
                  <li className="leaf-bullet text-foreground/80">
                    Intercrop beans with maize to maximize land use and improve soil fertility.
                  </li>
                  <li className="leaf-bullet text-foreground/80">
                    In Western Kenya, space maize at 75cm between rows and 30cm between plants.
                  </li>
                </ul>
              </div>
              
              <div className="glass-panel rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-farm-soil-light to-farm-soil p-4 text-white">
                  <h3 className="font-bold">Seasonal Alert</h3>
                </div>
                <div className="p-4">
                  <p className="text-foreground/80">
                    {seasonalAlert}
                  </p>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Project Information</h3>
                <p className="text-foreground/80 mb-4">
                  This application is a final year software engineering project from Kirinyaga University, demonstrating 
                  how technology can be applied to Kenyan agriculture.
                </p>
                <a href="/About" className="text-farm-leaf hover:underline">View project details →</a>
              </div>
            </div>
            
            {/* Main yield prediction form and results */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Enter Your Farm Details</h3>
                <YieldForm onPredict={handlePrediction} />
              </div>
              
              {prediction && <PredictionResult prediction={prediction} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
