
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FileBarChart, FileText, MessageSquare, BarChart2, Calendar, CloudRain, Droplets, Thermometer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("yield");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed (0 is January)
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const parsedPredictions = JSON.parse(storedPredictions);
      setPredictions(parsedPredictions);

      const ratingData = parsedPredictions
        .filter((pred: any) => pred.rating !== null)
        .map((pred: any) => ({
          rating: pred.rating || 0,
          crop: pred.crop
        }));
      setRatings(ratingData);
    }

    const handleStorageChange = () => {
      const updatedPredictions = localStorage.getItem('predictions');
      if (updatedPredictions) {
        setPredictions(JSON.parse(updatedPredictions));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, navigate]);

  // Generate weather data from February this year to current month
  const generateWeatherData = () => {
    const months = [];
    const startMonth = 1; // February is 1 in 0-indexed month
    
    for (let month = startMonth; month <= currentMonth; month++) {
      const date = new Date(currentYear, month, 1);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        rainfall: 80 + Math.round(Math.random() * 50) + (month * 20),
        temperature: 20 + Math.round(Math.random() * 5) + (month < 6 ? month : 10 - month)
      });
    }
    
    return months;
  };

  const weatherData = generateWeatherData();

  const soilData = [
    { name: 'Nitrogen', value: 45 },
    { name: 'Phosphorus', value: 30 },
    { name: 'Potassium', value: 25 },
    { name: 'Organic Matter', value: 15 },
    { name: 'pH', value: 6.5 },
  ];

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

  // Update yieldData dates to be between February and now
  const generateYieldData = () => {
    if (predictions.length > 0) {
      return predictions.map(pred => ({
        name: pred.crop,
        yield: typeof pred.yield === 'number' ? pred.yield : parseInt(pred.yield),
        date: pred.date
      }));
    }
    
    // Generate sample data between February and now
    const crops = ['Maize', 'Beans', 'Rice', 'Potatoes'];
    return crops.map((crop, index) => {
      // Spread dates between February and current month
      const month = Math.min(1 + index, currentMonth);
      const day = 5 + (index * 7) % 25;
      const date = new Date(currentYear, month, day);
      return {
        name: crop,
        yield: 1500 + Math.round(Math.random() * 3000) * (index + 1),
        date: date.toISOString().split('T')[0]
      };
    });
  };

  const yieldData = generateYieldData();

  const factorInfluenceData = [
    { factor: 'Rainfall', influence: 35 },
    { factor: 'Soil Type', influence: 25 },
    { factor: 'Irrigation', influence: 20 },
    { factor: 'Temperature', influence: 15 },
    { factor: 'Other', influence: 5 },
  ];

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
