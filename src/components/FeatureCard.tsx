
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = "0" }) => {
  return (
    <div className={`glass-panel rounded-xl p-6 card-hover animate-fade-in ${delay}`}>
      <div className="bg-gradient-to-br from-farm-leaf to-farm-leaf-light w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </div>
  );
};

export default FeatureCard;
