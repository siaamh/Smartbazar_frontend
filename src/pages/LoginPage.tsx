import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[#065F46] tracking-wider">
            VERDANT
          </Link>
          <h1 className="text-xl font-bold text-[#1C1917] mt-4">Sign in to your account</h1>
          <p className="text-sm text-[#78716C] mt-1">Welcome back! Enter your credentials below.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Username"
              placeholder="Enter your username"
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#78716C] hover:text-[#1C1917]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />
            </div>

            {login.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                Invalid username or password. Please try again.
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={login.isPending}
              leftIcon={<LogIn size={16} />}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[#78716C] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#065F46] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
