
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  location: string;
  landSize: string;
  cropType: string;
  soilType: string;
  irrigationMethod: string;
};

interface YieldFormProps {
  onPredict: (prediction: { yield: number; unit: string }) => void;
}

const YieldForm: React.FC<YieldFormProps> = ({ onPredict }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    landSize: '',
    cropType: '',
    soilType: 'Loam',
    irrigationMethod: 'Drip',
  });

  const cropTypes = ['Maize', 'Beans', 'Potatoes', 'Coffee', 'Tea', 'Tomatoes', 'Kale', 'Wheat', 'Rice'];
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos', 
    'Nyeri', 'Meru', 'Kakamega', 'Bungoma', 'Kisii', 'Embu', 'Kitui', 'Makueni'
  ];
  const soilTypes = ['Loam', 'Clay', 'Sandy', 'Silt', 'Peat', 'Chalky'];
  const irrigationMethods = ['Drip', 'Sprinkler', 'Flood', 'Manual', 'None'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.location || !formData.landSize || !formData.cropType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // Generate a random "prediction"
      const predictions = {
        "Maize": { base: 2000, variance: 500, unit: "kg/hectare" },
        "Beans": { base: 1500, variance: 300, unit: "kg/hectare" },
        "Potatoes": { base: 25000, variance: 5000, unit: "kg/hectare" },
        "Coffee": { base: 800, variance: 200, unit: "kg/hectare" },
        "Tea": { base: 12000, variance: 3000, unit: "kg/hectare" },
        "Tomatoes": { base: 35000, variance: 10000, unit: "kg/hectare" },
        "Kale": { base: 18000, variance: 4000, unit: "kg/hectare" },
        "Wheat": { base: 3500, variance: 700, unit: "kg/hectare" },
        "Rice": { base: 4500, variance: 900, unit: "kg/hectare" },
      };
      
      const cropInfo = predictions[formData.cropType as keyof typeof predictions] || 
        { base: 2000, variance: 500, unit: "kg/hectare" };
      
      const landSizeNum = parseFloat(formData.landSize);
      
      const yieldPerHectare = Math.round(cropInfo.base + (Math.random() * cropInfo.variance * 2 - cropInfo.variance));
      const totalYield = Math.round(yieldPerHectare * landSizeNum);
      
      onPredict({ 
        yield: totalYield,
        unit: cropInfo.unit
      });
      
      toast({
        title: "Prediction Complete",
        description: "We've analyzed your farm data and generated a yield prediction."
      });
      
      setIsLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="input-label">
            County/Region <span className="text-destructive">*</span>
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field w-full"
            required
          >
            <option value="" disabled>Select your county</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="landSize" className="input-label">
            Land Size (hectares) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            id="landSize"
            name="landSize"
            min="0.1"
            step="0.1"
            placeholder="e.g., 1.5"
            value={formData.landSize}
            onChange={handleChange}
            className="input-field w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cropType" className="input-label">
            Crop Type <span className="text-destructive">*</span>
          </label>
          <select
            id="cropType"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            className="input-field w-full"
            required
          >
            <option value="" disabled>Select crop type</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="soilType" className="input-label">
            Soil Type
          </label>
          <select
            id="soilType"
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            className="input-field w-full"
          >
            {soilTypes.map((soil) => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="irrigationMethod" className="input-label">
          Irrigation Method
        </label>
        <select
          id="irrigationMethod"
          name="irrigationMethod"
          value={formData.irrigationMethod}
          onChange={handleChange}
          className="input-field w-full"
        >
          {irrigationMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing Data...</span>
          </div>
        ) : (
          "Predict Yield"
        )}
      </button>
    </form>
  );
};

export default YieldForm;
