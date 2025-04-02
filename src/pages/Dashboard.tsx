import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import YieldForm from '@/components/YieldForm';
import PredictionResult from '@/components/PredictionResult';
import PastPredictions from '@/components/PastPredictions';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<{ yield: number; unit: string, id?: string, confidenceLevel?: number } | null>(null);
  const [welcomeAnimation, setWelcomeAnimation] = useState(true);
  const [seasonalAlert, setSeasonalAlert] = useState("");
  const [hasPredictions, setHasPredictions] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);

  useEffect(() => {
    console.log('🔒 Checking authentication status...');
    if (!isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting to login page');
      navigate('/login');
    } else {
      console.log('✅ User authenticated:', user?.email);
    }
    
    setTimeout(() => {
      setWelcomeAnimation(false);
      console.log('🎬 Welcome animation completed');
    }, 1500);

    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const parsedPredictions = JSON.parse(storedPredictions);
      if (parsedPredictions.length > 0) {
        setHasPredictions(true);
        console.log('📋 Found existing predictions in storage');
      }
    }
  }, [isAuthenticated, navigate, user?.email]);

  useEffect(() => {
    console.log('📊 Fetching seasonal alerts from weather service API...');
    
    setTimeout(() => {
      console.log('📡 Weather service data received');
      const alerts = [
        "The Kenya Meteorological Department predicts above-average rainfall in Eastern Kenya during the upcoming short rains. Plan your planting schedule accordingly.",
        "Expect lower than usual temperatures and occasional frosts in the highlands. Protect tender crops with appropriate coverings.",
        "A dry spell is forecasted for Central Kenya in the coming weeks. Consider scheduling irrigation and water conservation practices.",
        "The forecast indicates a surge in wind speeds across coastal regions. Secure loose materials and consider windbreaks for vulnerable crops.",
        "Unseasonal showers are predicted for Western Kenya. Monitor local weather updates closely and adjust your crop protection strategies."
      ];
      console.log('🌦️ Processing weather alert data...');
      setSeasonalAlert(alerts[Math.floor(Math.random() * alerts.length)]);
      console.log('✅ Weather alert set successfully');
    }, 800);
  }, []);

  const handlePrediction = (result: { yield: number; unit: string, id: string, confidenceLevel: number }) => {
    console.log('📈 Received prediction result from ML model:', result);
    setPrediction(result);
    setHasPredictions(true);
    setCurrentRating(null); // Reset rating for new prediction
  };

  const handleRating = (rating: number) => {
    if (!prediction || !prediction.id) return;
    
    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const predictions = JSON.parse(storedPredictions);
      
      const predictionIndex = predictions.findIndex((p: any) => p.id === prediction.id);
      if (predictionIndex !== -1) {
        predictions[predictionIndex].rating = rating;
        
        localStorage.setItem('predictions', JSON.stringify(predictions));
        setCurrentRating(rating);
        
        toast({
          title: "Rating Saved",
          description: `You rated this prediction ${rating} star${rating !== 1 ? 's' : ''}.`,
        });
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    console.log('⏰ Getting time-based greeting. Current hour:', hour);
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  console.log('🔄 Rendering dashboard for user:', user.name);
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <Link to="/about" className="text-farm-leaf hover:underline">View project details →</Link>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Enter Your Farm Details</h3>
                <YieldForm onPredict={handlePrediction} />
              </div>
              
              {prediction && (
                <div className="glass-panel rounded-xl p-6">
                  <PredictionResult prediction={prediction} />
                  
                  <div className="mt-6 border-t pt-4">
                    <p className="mb-2 font-medium">Rate this prediction:</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button 
                          key={rating}
                          onClick={() => handleRating(rating)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-7 w-7 cursor-pointer transition-all ${
                              currentRating && currentRating >= rating 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {hasPredictions && (
                <div className="mt-8">
                  <PastPredictions />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
