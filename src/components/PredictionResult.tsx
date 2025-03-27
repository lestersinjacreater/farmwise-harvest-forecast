
import { useState, useEffect } from 'react';

interface PredictionResultProps {
  prediction: {
    yield: number;
    unit: string;
  } | null;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prediction) {
      setIsVisible(true);
      setCount(0);
      
      // Animate counting up to the yield value
      const duration = 1500; // ms
      const interval = 20; // ms
      const steps = duration / interval;
      const increment = prediction.yield / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= prediction.yield) {
          setCount(prediction.yield);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, interval);
      
      return () => clearInterval(timer);
    } else {
      setIsVisible(false);
    }
  }, [prediction]);

  if (!prediction || !isVisible) return null;

  const unitParts = prediction.unit.split('/');
  const yieldUnit = unitParts[0];
  const areaUnit = unitParts[1] || 'hectare';

  // Generate random tips based on prediction
  const tips = [
    "Consider using drought-resistant varieties if your area has unpredictable rainfall.",
    "Proper spacing can increase your yield by allowing each plant adequate access to nutrients.",
    "Regular monitoring for pests and diseases can help prevent significant crop losses.",
    "Applying organic fertilizer can improve soil health and boost yields sustainably.",
    "Implement crop rotation to prevent soil nutrient depletion and reduce pest buildup."
  ];

  const randomTips = [...tips].sort(() => 0.5 - Math.random()).slice(0, 2);

  return (
    <div className="mt-8 animate-scale-in">
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-farm-leaf to-farm-leaf-light p-4 text-white">
          <h3 className="text-xl font-bold">Yield Prediction Results</h3>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-farm-leaf mb-2">
              {count.toLocaleString()} <span className="text-2xl">{yieldUnit}</span>
            </div>
            <p className="text-muted-foreground">Estimated total yield for your farm</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="glass-panel rounded-lg p-4">
              <div className="text-xl font-semibold mb-1">{Math.round(prediction.yield / 10).toLocaleString()} {yieldUnit}</div>
              <p className="text-sm text-muted-foreground">Per 0.1 {areaUnit}</p>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <div className="text-xl font-semibold mb-1">{(prediction.yield / 100).toLocaleString()} {yieldUnit}</div>
              <p className="text-sm text-muted-foreground">Per 0.01 {areaUnit}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {randomTips.map((tip, index) => (
                <li key={index} className="leaf-bullet text-foreground/80">{tip}</li>
              ))}
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Note: This prediction is based on historical data and current input parameters. 
            Actual yields may vary due to weather conditions, farming practices, and other factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
