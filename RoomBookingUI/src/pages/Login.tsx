import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext handles API call
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password); // call API via context

      if (success) {
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        });
        navigate('/admin'); // redirect to admin dashboard
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-50" />
        <div className="relative z-10 p-12 flex flex-col justify-center">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="p-3 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">RoomBook</span>
          </Link>
          <h1 className="text-4xl font-bold text-primary-foreground mb-6">
            Welcome to the
            <span className="block text-accent">Admin Portal</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-md">
            Manage your meeting rooms, review booking requests, and maintain your workspace efficiently.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-semibold">✓</span>
              </div>
              <span>Full room management capabilities</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-semibold">✓</span>
              </div>
              <span>Real-time booking oversight</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-semibold">✓</span>
              </div>
              <span>Comprehensive analytics dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to booking
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg gradient-accent">
              <Building2 className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">RoomBook</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">Admin Sign In</h2>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sachin.tech"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Credentials:</strong><br />
              Email: admin@sachin.tech<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
