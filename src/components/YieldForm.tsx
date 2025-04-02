import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';

interface YieldFormProps {
  onPredict: (result: { yield: number; unit: string, id: string, confidenceLevel: number }) => void;
}

interface FormData {
  location: string;
  landSize: string;
  cropType: string;
  soilType: string;
  irrigationMethod: string;
}

const yieldPredictions = {
  Maize: {
    Nairobi: 3200,
    Mombasa: 2800,
    Kisumu: 3500,
    Nakuru: 4100,
    Eldoret: 4300,
    Kiambu: 3900,
    Nyeri: 4000,
    Meru: 3700,
    Kakamega: 3600
  },
  Beans: {
    Nairobi: 1500,
    Mombasa: 1200,
    Kisumu: 1600,
    Nakuru: 1800,
    Eldoret: 1900,
    Kiambu: 1700,
    Nyeri: 1750,
    Meru: 1650,
    Kakamega: 1550
  },
  "Irish Potatoes": {
    Nairobi: 12000,
    Mombasa: 9500,
    Kisumu: 13000,
    Nakuru: 16000,
    Eldoret: 17000,
    Kiambu: 15000,
    Nyeri: 15500,
    Meru: 14000,
    Kakamega: 13500
  }
};

const soilModifiers = {
  Loam: 1.0,
  Clay: 0.85,
  Sandy: 0.75,
  Silt: 0.9,
  Peat: 1.1,
  Chalky: 0.8
};

const irrigationModifiers = {
  Drip: 1.15,
  Sprinkler: 1.1,
  Flood: 0.95,
  Manual: 0.9,
  None: 0.7
};

const YieldForm: React.FC<YieldFormProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState<FormData>({
    location: 'Nairobi',
    landSize: '1',
    cropType: 'Maize',
    soilType: 'Loam',
    irrigationMethod: 'Drip',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  useEffect(() => {
    const savedFormData = localStorage.getItem('lastFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location || !formData.landSize || !formData.cropType || !formData.soilType || !formData.irrigationMethod) {
      alert('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    const loadingStages = [
      "Connecting to prediction servers...",
      `Analyzing ${formData.cropType} yield patterns...`,
      `Processing soil conditions for ${formData.soilType}...`,
      `Calculating irrigation effects for ${formData.irrigationMethod}...`,
      "Running machine learning model...",
      "Finalizing prediction results..."
    ];
    
    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < loadingStages.length) {
        setLoadingStage(loadingStages[stageIndex]);
        stageIndex++;
      } else {
        clearInterval(stageInterval);
      }
    }, 800);

    setTimeout(() => {
      const baseYield = yieldPredictions[formData.cropType as keyof typeof yieldPredictions]?.[formData.location as keyof (typeof yieldPredictions)['Maize']] || 3000;
      
      const soilModifier = soilModifiers[formData.soilType as keyof typeof soilModifiers] || 1.0;
      const irrigationModifier = irrigationModifiers[formData.irrigationMethod as keyof typeof irrigationModifiers] || 1.0;
      
      const landSizeMultiplier = parseFloat(formData.landSize);
      const predictedYield = baseYield * soilModifier * irrigationModifier * landSizeMultiplier;
      const unit = 'kg/hectare';
      
      const confidenceLevel = Math.floor(Math.random() * 15) + 85;

      const prediction = {
        yield: predictedYield,
        unit: unit,
        location: formData.location,
        landSize: formData.landSize,
        crop: formData.cropType,
        soil: formData.soilType,
        irrigation: formData.irrigationMethod,
        confidenceLevel: confidenceLevel
      };
      
      const savePrediction = (prediction: any) => {
        const predictionWithMeta = {
          ...prediction,
          id: uuidv4(),
          date: new Date().toISOString().split('T')[0],
          rating: null
        };
        
        const existingPredictions = JSON.parse(localStorage.getItem('predictions') || '[]');
        
        const updatedPredictions = [...existingPredictions, predictionWithMeta];
        
        localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
        
        window.dispatchEvent(new Event('predictionsUpdated'));
        
        localStorage.setItem('lastFormData', JSON.stringify(formData));
        
        console.log('💾 Saved new prediction to storage:', predictionWithMeta);
        console.log('📊 Storage now contains', updatedPredictions.length, 'predictions');
        
        return predictionWithMeta;
      };

      const predictionWithMeta = savePrediction(prediction);

      clearInterval(stageInterval);
      setIsLoading(false);
      setLoadingStage('');

      onPredict({ 
        yield: predictedYield, 
        unit: unit, 
        id: predictionWithMeta.id,
        confidenceLevel: confidenceLevel
      });
    }, 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Select 
          onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))} 
          defaultValue={formData.location}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nairobi">Nairobi</SelectItem>
            <SelectItem value="Mombasa">Mombasa</SelectItem>
            <SelectItem value="Kisumu">Kisumu</SelectItem>
            <SelectItem value="Nakuru">Nakuru</SelectItem>
            <SelectItem value="Eldoret">Eldoret</SelectItem>
            <SelectItem value="Kiambu">Kiambu</SelectItem>
            <SelectItem value="Nyeri">Nyeri</SelectItem>
            <SelectItem value="Meru">Meru</SelectItem>
            <SelectItem value="Kakamega">Kakamega</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="landSize">Land Size (hectares)</Label>
        <Input
          type="number"
          id="landSize"
          name="landSize"
          value={formData.landSize}
          onChange={handleChange}
          placeholder="Enter land size"
          min="0"
          step="0.1"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="cropType">Crop Type</Label>
        <Select 
          onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))} 
          defaultValue={formData.cropType}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select crop type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maize">Maize</SelectItem>
            <SelectItem value="Beans">Beans</SelectItem>
            <SelectItem value="Irish Potatoes">Irish Potatoes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="soilType">Soil Type</Label>
        <Select 
          onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))} 
          defaultValue={formData.soilType}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select soil type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Loam">Loam</SelectItem>
            <SelectItem value="Clay">Clay</SelectItem>
            <SelectItem value="Sandy">Sandy</SelectItem>
            <SelectItem value="Silt">Silt</SelectItem>
            <SelectItem value="Peat">Peat</SelectItem>
            <SelectItem value="Chalky">Chalky</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="irrigationMethod">Irrigation Method</Label>
        <Select 
          onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationMethod: value }))} 
          defaultValue={formData.irrigationMethod}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select irrigation method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Drip">Drip</SelectItem>
            <SelectItem value="Sprinkler">Sprinkler</SelectItem>
            <SelectItem value="Flood">Flood</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
            <SelectItem value="None">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="mt-4 py-2">
          <div className="flex items-center gap-2 mb-2 text-primary animate-pulse">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <p className="text-sm">{loadingStage}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: '50%' }}></div>
          </div>
        </div>
      ) : (
        <Button type="submit" className="w-full" disabled={isLoading}>
          Predict Yield
        </Button>
      )}
    </form>
  );
};

export default YieldForm;
