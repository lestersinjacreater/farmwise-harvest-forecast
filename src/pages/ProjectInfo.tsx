
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const ProjectInfo = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel rounded-xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6">Final Year Project Information</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-farm-leaf">About This Project</h2>
                <p className="text-foreground/80">
                  MazaoSmart is a crop yield prediction system developed as a final year software engineering 
                  project at Kirinyaga University. The project demonstrates how modern web technologies and 
                  machine learning concepts can be applied to create practical solutions for Kenyan farmers.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-farm-leaf">Project Objectives</h2>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>To develop a user-friendly interface for crop yield prediction specifically for Kenyan farmers</li>
                  <li>To demonstrate the application of machine learning concepts in agricultural technology</li>
                  <li>To create a prototype that could be further developed with actual backend services</li>
                  <li>To address food security challenges through technology innovation</li>
                  <li>To showcase software engineering skills acquired throughout the degree program</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-farm-leaf">Project Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold">John Kamau</h3>
                    <p className="text-sm text-foreground/70">Frontend Development, UI/UX Design</p>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold">Faith Wangari</h3>
                    <p className="text-sm text-foreground/70">Machine Learning Concepts, Data Modeling</p>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold">Peter Ochieng</h3>
                    <p className="text-sm text-foreground/70">User Research, Documentation</p>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold">Elizabeth Njeri</h3>
                    <p className="text-sm text-foreground/70">Testing, Quality Assurance</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-farm-leaf">Supervision</h2>
                <p className="text-foreground/80">
                  This project was supervised by Dr. James Mwangi, Department of Computer Science, 
                  Kirinyaga University, under the 2023/2024 academic year final year project program.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-farm-leaf">Disclaimer</h2>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-foreground/80 text-sm">
                    This application is a prototype developed for academic demonstration purposes only. 
                    The yield predictions are simulated and not based on actual machine learning models. 
                    In a production environment, this system would integrate with weather data APIs, 
                    soil analysis databases, and trained ML models to provide accurate predictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-12">
            <Link to="/" className="btn-primary inline-block px-8 py-3">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="py-8 px-4 bg-muted/50 text-center">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} MazaoSmart - Kirinyaga University Final Year Project
        </p>
      </footer>
    </div>
  );
};

export default ProjectInfo;
