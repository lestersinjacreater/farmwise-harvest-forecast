import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FileBarChart, FileText, MessageSquare, BarChart2, Calendar, CloudRain, Droplets, Thermometer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface FormData {
  location: string;
  landSize: string;
  cropType: string;
  soilType: string;
  irrigationMethod: string;
}

const Reports = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("yield");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed (0 is January)
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    console.log('📊 Loading agricultural reports data...');
    setIsLoading(true);

    // Simulate loading data from a backend
    setTimeout(() => {
      // Get saved form data
      const savedFormData = localStorage.getItem('lastFormData');
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
        console.log('📋 Retrieved form data from storage:', JSON.parse(savedFormData));
      }

      const storedPredictions = localStorage.getItem('predictions');
      if (storedPredictions) {
        const parsedPredictions = JSON.parse(storedPredictions);
        setPredictions(parsedPredictions);
        console.log('📈 Retrieved predictions from storage:', parsedPredictions.length, 'records');

        const ratingData = parsedPredictions
          .filter((pred: any) => pred.rating !== null)
          .map((pred: any) => ({
            rating: pred.rating || 0,
            crop: pred.crop
          }));
        setRatings(ratingData);
      }

      setIsLoading(false);
      console.log('✅ Agricultural reports data loaded successfully');
    }, 4000);

    const handleStorageChange = () => {
      const updatedPredictions = localStorage.getItem('predictions');
      if (updatedPredictions) {
        setPredictions(JSON.parse(updatedPredictions));
      }
      
      const updatedFormData = localStorage.getItem('lastFormData');
      if (updatedFormData) {
        setFormData(JSON.parse(updatedFormData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, navigate]);

  // Generate weather data from February this year to current month, influenced by location
  const generateWeatherData = () => {
    const months = [];
    const startMonth = 1; // February is 1 in 0-indexed month
    
    // Location-based rainfall patterns
    const locationFactors: Record<string, { rainfall: number, temperature: number }> = {
      'Nairobi': { rainfall: 85, temperature: 22 },
      'Mombasa': { rainfall: 110, temperature: 28 },
      'Kisumu': { rainfall: 120, temperature: 25 },
      'Nakuru': { rainfall: 90, temperature: 20 },
      'Eldoret': { rainfall: 100, temperature: 18 },
      'Kiambu': { rainfall: 85, temperature: 21 },
      'Nyeri': { rainfall: 95, temperature: 19 },
      'Meru': { rainfall: 90, temperature: 20 },
      'Kakamega': { rainfall: 130, temperature: 24 }
    };
    
    // Default factors if location not found
    const defaultFactors = { rainfall: 100, temperature: 22 };
    
    // Get factors based on selected location or use default
    const factors = formData ? 
      (locationFactors[formData.location as keyof typeof locationFactors] || defaultFactors) : 
      defaultFactors;
    
    for (let month = startMonth; month <= currentMonth; month++) {
      const date = new Date(currentYear, month, 1);
      
      // Seasonal rainfall pattern - higher in April and May (months 3-4)
      const seasonalRainfall = month >= 3 && month <= 4 ? 1.4 : 1.0;
      
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        rainfall: Math.round(factors.rainfall * seasonalRainfall + Math.random() * 40 + (month * 15)),
        temperature: factors.temperature + Math.round(Math.random() * 3) + (month < 6 ? month * 0.5 : (10 - month) * 0.5)
      });
    }
    
    return months;
  };

  const weatherData = generateWeatherData();

  // Generate soil data based on selected soil type
  const generateSoilData = () => {
    const defaultSoilData = [
      { name: 'Nitrogen', value: 45 },
      { name: 'Phosphorus', value: 30 },
      { name: 'Potassium', value: 25 },
      { name: 'Organic Matter', value: 15 },
      { name: 'pH', value: 6.5 },
    ];
    
    if (!formData) return defaultSoilData;
    
    // Adjust soil properties based on soil type
    const soilFactors: Record<string, { n: number, p: number, k: number, om: number, ph: number }> = {
      'Loam': { n: 1.0, p: 1.0, k: 1.0, om: 1.0, ph: 6.5 },
      'Clay': { n: 1.2, p: 0.8, k: 1.1, om: 0.9, ph: 6.2 },
      'Sandy': { n: 0.7, p: 0.6, k: 0.8, om: 0.7, ph: 5.8 },
      'Silt': { n: 0.9, p: 1.1, k: 0.9, om: 0.8, ph: 6.8 },
      'Peat': { n: 1.3, p: 0.7, k: 0.6, om: 1.6, ph: 5.5 },
      'Chalky': { n: 0.8, p: 1.2, k: 0.7, om: 0.5, ph: 7.5 }
    };
    
    const factors = soilFactors[formData.soilType] || soilFactors['Loam'];
    
    return [
      { name: 'Nitrogen', value: Math.round(45 * factors.n) },
      { name: 'Phosphorus', value: Math.round(30 * factors.p) },
      { name: 'Potassium', value: Math.round(25 * factors.k) },
      { name: 'Organic Matter', value: Math.round(15 * factors.om) },
      { name: 'pH', value: factors.ph },
    ];
  };

  const soilData = generateSoilData();

  const generateAccuracyData = () => {
    const months = [];
    const startMonth = 1; // February is 1 in 0-indexed month
    
    for (let month = startMonth; month <= currentMonth; month++) {
      const date = new Date(currentYear, month, 1);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        accuracy: 80 + Math.round(Math.random() * 5) + (month - 1) * 2
      });
    }
    
    return months;
  };

  const modelAccuracyData = generateAccuracyData();

  const ratingDistribution = [
    { name: '5 Stars', value: ratings.filter(r => r.rating === 5).length || 2 },
    { name: '4 Stars', value: ratings.filter(r => r.rating === 4).length || 5 },
    { name: '3 Stars', value: ratings.filter(r => r.rating === 3).length || 3 },
    { name: '2 Stars', value: ratings.filter(r => r.rating === 2).length || 1 },
    { name: '1 Star', value: ratings.filter(r => r.rating === 1).length || 0 },
  ];

  const COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

  // Generate yield data using stored predictions or example data
  const generateYieldData = () => {
    if (predictions.length > 0) {
      return predictions.map(pred => ({
        name: pred.crop,
        yield: typeof pred.yield === 'number' ? pred.yield : parseInt(pred.yield),
        date: pred.date
      }));
    }
    
    // Get the crop type from form data if available
    const cropType = formData?.cropType || 'Maize';
    
    // Generate sample data between February and now
    const crops = [cropType, 'Beans', 'Rice', 'Potatoes'].filter((c, i) => i === 0 || c !== cropType);
    return crops.map((crop, index) => {
      // Spread dates between February and current month
      const month = Math.min(1 + index, currentMonth);
      const day = 5 + (index * 7) % 25;
      const date = new Date(currentYear, month, day);
      
      // Make the user's selected crop have a higher yield
      const yieldBase = crop === cropType ? 2500 : 1500;
      
      return {
        name: crop,
        yield: yieldBase + Math.round(Math.random() * 3000) * (index + 1),
        date: date.toISOString().split('T')[0]
      };
    });
  };

  const yieldData = generateYieldData();

  // Generate factor influence data based on form data
  const generateFactorInfluenceData = () => {
    if (!formData) {
      return [
        { factor: 'Rainfall', influence: 35 },
        { factor: 'Soil Type', influence: 25 },
        { factor: 'Irrigation', influence: 20 },
        { factor: 'Temperature', influence: 15 },
        { factor: 'Other', influence: 5 },
      ];
    }
    
    // Adjust factor influence based on irrigation method
    let irrigationInfluence = 20;
    switch(formData.irrigationMethod) {
      case 'Drip': irrigationInfluence = 30; break;
      case 'Sprinkler': irrigationInfluence = 25; break;
      case 'Flood': irrigationInfluence = 20; break;
      case 'Manual': irrigationInfluence = 15; break;
      case 'None': irrigationInfluence = 5; break;
    }
    
    // Adjust rainfall influence based on location
    const rainfallFactors: Record<string, number> = {
      'Mombasa': 25,
      'Kisumu': 40,
      'Nakuru': 35,
      'Eldoret': 40,
      'Nairobi': 30
    };
    const rainfallInfluence = rainfallFactors[formData.location as keyof typeof rainfallFactors] || 35;
    
    // Adjust soil influence based on soil type
    const soilInfluenceFactors: Record<string, number> = {
      'Loam': 30,
      'Clay': 25,
      'Sandy': 20,
      'Silt': 25,
      'Peat': 35,
      'Chalky': 15
    };
    const soilInfluence = soilInfluenceFactors[formData.soilType] || 25;
    
    // Calculate temperature influence (remainder to 100)
    const otherInfluence = 5;
    const temperatureInfluence = 100 - rainfallInfluence - soilInfluence - irrigationInfluence - otherInfluence;
    
    return [
      { factor: 'Rainfall', influence: rainfallInfluence },
      { factor: 'Soil Type', influence: soilInfluence },
      { factor: 'Irrigation', influence: irrigationInfluence },
      { factor: 'Temperature', influence: temperatureInfluence },
      { factor: 'Other', influence: otherInfluence },
    ];
  };

  const factorInfluenceData = generateFactorInfluenceData();

  const generateModelUpdates = () => {
    const updates = [];
    const startMonth = 1; // February is 1 in 0-indexed month
    
    for (let month = startMonth; month <= currentMonth; month++) {
      const day = 10 + (month % 20);
      const date = new Date(currentYear, month, day);
      
      let title, description;
      
      if (month === 1) {
        title = "February 2024 Update";
        description = "Initial machine learning model integration with historical yield data from Kenya Agricultural Research Institute.";
      } else if (month === 2) {
        title = "March 2024 Update";
        description = "Added support for coffee and tea yield predictions. Implemented region-specific climate adjustment factors.";
      } else if (month === 3) {
        title = "April 2024 Update";
        description = "Enhanced prediction accuracy for maize and beans by 8%. Integrated seasonal rainfall pattern analysis.";
      } else if (month === 4) {
        title = "May 2024 Update";
        description = "Improved soil composition influence factors based on national soil survey data. Added pest prevalence prediction.";
      } else if (month === 5) {
        title = "June 2024 Update";
        description = "Improved rainfall distribution modeling for Eastern Kenya regions. Added AI-powered recommendation engine.";
      } else {
        title = `${date.toLocaleString('default', { month: 'long' })} ${currentYear} Update`;
        description = "Continuous model refinement based on user feedback and seasonal crop yield data.";
      }
      
      updates.push({
        version: `v${month + 1}.${Math.floor(Math.random() * 9) + 1}`,
        date: date,
        title: title,
        description: description
      });
    }
    
    return updates.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  const modelUpdates = generateModelUpdates();

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <Navbar />
        <div className="pt-24 px-4 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Agricultural Reports & Analytics</h1>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading Reports</CardTitle>
                <CardDescription>
                  Retrieving your agricultural analytics data...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p>Loading agricultural analytics from database...</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
                <div className="space-y-3">
                  <div className="h-[200px] w-full bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-[150px] bg-gray-100 rounded-md animate-pulse"></div>
                    <div className="h-[150px] bg-gray-100 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Agricultural Reports & Analytics</h1>
          
          <Tabs defaultValue="yield" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="yield" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Yield Predictions</span>
                <span className="sm:hidden">Yield</span>
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2">
                <CloudRain className="h-4 w-4" />
                <span className="hidden sm:inline">Weather & Soil</span>
                <span className="sm:hidden">Conditions</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback & Model</span>
                <span className="sm:hidden">Feedback</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="yield" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-farm-leaf" />
                    Crop Yield Prediction Report
                  </CardTitle>
                  <CardDescription>
                    Estimated crop yields based on your farm parameters and our predictive models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Predicted Yields by Crop Type</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={yieldData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Yield (kg/hectare)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="yield" fill="#84cc16" name="Yield (kg/hectare)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Key Influencing Factors</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={factorInfluenceData}
                            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="factor" type="category" />
                            <Tooltip />
                            <Bar dataKey="influence" fill="#22c55e" name="Influence (%)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="glass-panel rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Recommendations for Improving Yield</h3>
                      <ul className="space-y-3">
                        <li className="leaf-bullet text-foreground/80">
                          Optimize irrigation scheduling based on rainfall patterns shown in the weather report.
                        </li>
                        <li className="leaf-bullet text-foreground/80">
                          Consider applying additional nitrogen fertilizer to improve soil composition.
                        </li>
                        <li className="leaf-bullet text-foreground/80">
                          Implement pest monitoring to reduce potential crop losses.
                        </li>
                        <li className="leaf-bullet text-foreground/80">
                          Adjust planting dates based on temperature forecasts to optimize germination.
                        </li>
                        <li className="leaf-bullet text-foreground/80">
                          Consider intercropping to improve soil health and maximize land use.
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weather" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-blue-500" />
                    Weather & Soil Condition Report
                  </CardTitle>
                  <CardDescription>
                    Key weather and soil conditions affecting your crops from February {currentYear} to {new Date().toLocaleString('default', { month: 'long' })} {currentYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                      <Calendar className="h-4 w-4" />
                      Rainfall Distribution (mm) - {currentYear}
                    </h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weatherData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="rainfall" stroke="#0ea5e9" name="Rainfall (mm)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                        <Thermometer className="h-4 w-4" />
                        Temperature Variations (°C)
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={weatherData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[15, 30]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="temperature" stroke="#f97316" name="Temperature (°C)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                        <Droplets className="h-4 w-4" />
                        Soil Nutrient Composition
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={soilData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8b5cf6" name="Level" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 glass-panel rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Impact Analysis on Crop Growth</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-md border border-border/50 p-4">
                        <h4 className="font-medium text-blue-500 mb-2">Rainfall Impact</h4>
                        <p className="text-foreground/80">
                          Current rainfall patterns indicate adequate moisture for most crops during the main growing season.
                          Irrigation may be needed during dry spells in February and March.
                        </p>
                      </div>
                      
                      <div className="rounded-md border border-border/50 p-4">
                        <h4 className="font-medium text-orange-500 mb-2">Temperature Impact</h4>
                        <p className="text-foreground/80">
                          Temperature patterns are within optimal range for maize and beans growth.
                          Rice cultivation may benefit from slightly higher temperatures in the planting phase.
                        </p>
                      </div>
                      
                      <div className="rounded-md border border-border/50 p-4">
                        <h4 className="font-medium text-purple-500 mb-2">Soil Conditions</h4>
                        <p className="text-foreground/80">
                          Soil analysis suggests adequate fertility with room for improvement in nitrogen levels.
                          Consider nitrogen-fixing cover crops or targeted fertilizer application.
                        </p>
                      </div>
                      
                      <div className="rounded-md border border-border/50 p-4">
                        <h4 className="font-medium text-green-500 mb-2">Recommendation</h4>
                        <p className="text-foreground/80">
                          Based on soil and weather conditions, consider staggered planting dates
                          to maximize rainfall utilization and optimize nutrient availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    User Feedback & Model Improvement Report
                  </CardTitle>
                  <CardDescription>
                    Analysis of user feedback and model performance from February {currentYear} to {new Date().toLocaleString('default', { month: 'long' })} {currentYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Accuracy Ratings from Farmers</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ratingDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {ratingDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Model Accuracy Improvement ({currentYear})</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={modelAccuracyData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[75, 100]} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="accuracy" stroke="#d946ef" strokeWidth={2} name="Prediction Accuracy" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Common Discrepancies & Model Improvements</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue Identified</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Affected Crops</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Model Adjustment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Implementation Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Overestimation during drought periods</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Maize, Beans</td>
                            <td className="px-6 py-4 text-sm">Added drought sensitivity factor</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Feb {currentYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Implemented
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Underestimation for irrigated farms</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Rice, Tomatoes</td>
                            <td className="px-6 py-4 text-sm">Improved irrigation efficiency calculation</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Mar {currentYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Implemented
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Regional yield variations not captured</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Coffee, Tea</td>
                            <td className="px-6 py-4 text-sm">Added microclimate factors for highland areas</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Apr {currentYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                In Progress
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Pest impact not adequately factored</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">All Crops</td>
                            <td className="px-6 py-4 text-sm">Developing pest prevalence prediction module</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">May {currentYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Planned
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="glass-panel rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Recent Model Updates ({currentYear})</h3>
                    <div className="space-y-4">
                      {modelUpdates.map((update, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 text-sm font-medium">{update.version}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{update.title}</h4>
                            <p className="text-sm text-foreground/80">
                              {update.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;
