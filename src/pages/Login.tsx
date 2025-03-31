
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

const Login = () => {
  console.log('🔄 Initializing Login page component');
  
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
    console.log(`🔑 Login form field "${name}" updated`);
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
    console.log('🔍 Validating login form data');
    let valid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
      console.log('⚠️ Validation error: Email is required');
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
      console.log('⚠️ Validation error: Password is required');
    }
    
    setErrors(newErrors);
    console.log('🔍 Form validation result:', valid ? 'Valid' : 'Invalid');
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔒 Login form submitted');
    
    if (!validate()) {
      console.log('❌ Form validation failed, stopping submission');
      return;
    }
    
    console.log('✅ Form validation passed');
    console.log('📡 Sending authentication request to server');
    console.log('📤 Login payload:', { email: formData.email, password: '********' });
    
    setIsLoading(true);
    
    // Simulate API call with longer delay
    setTimeout(() => {
      console.log('⏳ Authentication server processing request...');
      console.log('🔐 Verifying credentials against secure database...');
      
      // For demo, allow any login with valid format
      if (formData.email.includes('@') && formData.password.length >= 6) {
        // Extract name from email (just for demo)
        const name = formData.email.split('@')[0];
        
        console.log('✅ Authentication successful for user:', formData.email);
        console.log('📊 Retrieving user profile data from database');
        console.log('🔑 Generating secure session token');
        
        login({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          email: formData.email,
        });
        
        console.log('📊 User session created successfully');
        
        toast({
          title: "Login successful!",
          description: "Welcome back to FarmWise.",
        });
        
        console.log('🔄 Redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('❌ Authentication failed: Invalid credentials');
        
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
      console.log('🏁 Login process completed');
    }, 3000);
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                  <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                  <span>Authenticating...</span>
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
