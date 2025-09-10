import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { interestOptions } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  name: string;
  age: string;
  studentContact: string;
  alternateContact: string;
  email: string;
  password: string;
  interests: string[];
  marks: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    studentContact: '',
    alternateContact: '',
    email: '',
    password: '',
    interests: [],
    marks: ''
  });
  
  const { register } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const isStep1Valid = () => {
    return formData.name && formData.age && formData.studentContact && 
           formData.alternateContact && formData.email && formData.password;
  };

  const isStep2Valid = () => {
    return formData.interests.length > 0 && formData.marks;
  };

  const handleNext = () => {
    if (isStep1Valid()) {
      setStep(2);
    } else {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid()) {
      toast({
        title: "Incomplete form",
        description: "Please complete all fields in step 2.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        age: parseInt(formData.age),
        studentContact: formData.studentContact,
        alternateContact: formData.alternateContact,
        email: formData.email,
        interests: formData.interests,
        marks: parseFloat(formData.marks)
      });

      if (success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to your learning journey!",
        });
      } else {
        toast({
          title: "Registration failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Join Our Platform</CardTitle>
        <CardDescription>
          Step {step} of 2: {step === 1 ? 'Basic Information' : 'Interests & Academic Details'}
        </CardDescription>
        <Progress value={step * 50} className="mt-4" />
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentContact">Student Contact *</Label>
                <Input
                  id="studentContact"
                  placeholder="+91 9876543210"
                  value={formData.studentContact}
                  onChange={(e) => handleInputChange('studentContact', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternateContact">Alternate Contact *</Label>
                <Input
                  id="alternateContact"
                  placeholder="+91 9876543211"
                  value={formData.alternateContact}
                  onChange={(e) => handleInputChange('alternateContact', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            <Button 
              onClick={handleNext}
              className="w-full bg-gradient-primary hover:bg-primary-dark transition-smooth"
            >
              Continue to Step 2
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Student Interests *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select your career goals, preferred subjects, and skill areas
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label
                        htmlFor={interest}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marks">Latest Academic Percentage/Grade *</Label>
                <Input
                  id="marks"
                  type="number"
                  placeholder="e.g., 85.5"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.marks}
                  onChange={(e) => handleInputChange('marks', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-primary hover:bg-primary-dark transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </div>
          </form>
        )}
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary-dark"
          >
            Already have an account? Sign in here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};