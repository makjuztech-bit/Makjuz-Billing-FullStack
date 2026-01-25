import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Eye, EyeOff, Smartphone, Lock, User, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const branches = [
  { id: 'main', name: 'Main Branch - Kanchipuram' },
  { id: 'chennai', name: 'Chennai Branch' },
  { id: 'coimbatore', name: 'Coimbatore Branch' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('main');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username, password, branch);
      if (success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Try: admin/demo123');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = () => {
    if (mobile.length === 10) {
      setOtpSent(true);
      toast.success('OTP sent to your mobile');
    } else {
      toast.error('Enter valid 10-digit mobile number');
    }
  };

  const handleOtpLogin = () => {
    if (otp === '123456') {
      toast.success('OTP verified!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid OTP. Try: 123456');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream silk-pattern flex flex-col">
      {/* Header with Language Switch */}
      <header className="flex justify-end p-4">
        <LanguageSwitch />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-maroon shadow-maroon mb-4">
              <Store className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Silk Saree POS
            </h1>
            <p className="mt-2 text-muted-foreground">
              Premium Billing System for Silk Showrooms
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="font-display text-2xl text-center">
                {t('login.title')}
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="otp" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    {t('login.otp')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">{t('login.username')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="username"
                          placeholder="Enter username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('login.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">{t('login.branch')}</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="w-full">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : t('login.title')}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                      >
                        {t('login.forgot')}
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="otp">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="mobile"
                          placeholder="Enter 10-digit mobile"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="pl-10"
                          disabled={otpSent}
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-2 animate-fade-in">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="text-center text-lg tracking-widest"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="branch-otp">{t('login.branch')}</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="w-full">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!otpSent ? (
                      <Button
                        type="button"
                        variant="gold"
                        size="lg"
                        className="w-full"
                        onClick={handleOtpRequest}
                      >
                        Send OTP
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="gold"
                          size="lg"
                          className="w-full"
                          onClick={handleOtpLogin}
                        >
                          Verify & Login
                        </Button>
                        <button
                          type="button"
                          className="w-full text-sm text-primary hover:underline"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                          }}
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm font-medium text-primary">Demo Credentials</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Username: <code className="rounded bg-muted px-1">admin</code> | Password: <code className="rounded bg-muted px-1">demo123</code>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              OTP: <code className="rounded bg-muted px-1">123456</code>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2024 Silk Saree POS. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
