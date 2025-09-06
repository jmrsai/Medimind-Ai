
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon, Logo } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Passwords do not match.',
      });
      return;
    }
    if (password.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: 'Password must be at least 6 characters long.',
        });
        return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signup Successful',
        description: 'Your account has been created. Please log in.',
      });
      router.push('/login');
    } catch (error: any) {
      let description = 'An unknown error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email address is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        description = 'Please enter a valid email address.';
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({
            title: "Signup Successful",
            description: "Welcome to MediMind AI.",
        });
        router.push('/');
    } catch (error: any) {
        let description = "An unknown error occurred.";
        if (error.code === 'auth/popup-closed-by-user') {
            description = "The sign-up process was cancelled.";
        }
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: description,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  }

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join MediMind AI to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
           <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
          </div>
           <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2" />}
              Google
          </Button>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{' '}
            <Link href="/login" className="underline font-semibold hover:text-primary">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
