
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo, allow any login with valid format
      if (formData.email.includes('@') && formData.password.length >= 6) {
        // Extract name from email (just for demo)
        const name = formData.email.split('@')[0];
        
        login({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          email: formData.email,
        });
        
        toast({
          title: "Login successful!",
          description: "Welcome back to FarmWise.",
        });
        
        navigate('/dashboard');
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Invalid email or password',
        }));
        
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 flex justify-center items-center min-h-screen">
        <div className="glass-panel rounded-xl p-8 max-w-md w-full animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-foreground/80">Log in to access your FarmWise dashboard</p>
          </div>
          
          {errors.general && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6 animate-shake">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`input-field w-full ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-farm-leaf hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`input-field w-full ${errors.password ? 'border-destructive' : ''}`}
              />
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full py-3 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging In...</span>
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-foreground/80">
              Don't have an account?{' '}
              <Link to="/signup" className="text-farm-leaf hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
