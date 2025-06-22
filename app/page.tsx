'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  FileText, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  const features = [
    {
      icon: FileText,
      title: 'Multiple Question Types',
      description: 'Create diverse exams with multiple choice, true/false, and open-ended questions.'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Set time limits and deadlines to create structured exam experiences.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track performance with comprehensive results and scoring analytics.'
    },
    {
      icon: Users,
      title: 'Easy Sharing',
      description: 'Share exams with participants through secure, unique links.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">ExamCraft</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsAuthDialogOpen(true)}>
                  Sign In
                </Button>
                <Button onClick={() => setIsAuthDialogOpen(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Professional Exam Creation Platform
          </Badge>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Create Professional Exams
            <span className="block text-muted-foreground">in Minutes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Design, manage, and analyze exams with our comprehensive platform. 
            Perfect for educators, trainers, and organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
              Start Creating Exams
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for creating, managing, and analyzing exams
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <feature.icon className="h-10 w-10 mb-2 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Intuitive Interface</h2>
          <p className="text-lg text-muted-foreground">
            Clean, modern design that makes exam creation effortless
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Sample Quiz</h3>
                  <Badge>Published</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  15 questions • 60 minutes • 150 points
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Multiple choice questions
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    True/False questions
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Open-ended responses
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-2xl font-bold">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              4.9/5 Rating
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Drag-and-drop question builder</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Real-time collaboration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Automated grading system</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Detailed performance analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of educators and professionals who trust ExamCraft 
            for their assessment needs.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Create Your First Exam
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <GraduationCap className="h-4 w-4" />
            <span className="font-semibold">ExamCraft</span>
          </div>
          <p>Professional exam creation platform • Built with modern technology</p>
        </div>
      </footer>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}