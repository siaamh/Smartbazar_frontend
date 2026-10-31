import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api/auth.api';
import { useToastStore } from '../stores/toastStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: () => {
      setServerErrors({});
      setGeneralError('');
      addToast('Account created! Please log in.', 'success');
      navigate('/login');
    },
    onError: (error: any) => {
      setServerErrors({});
      setGeneralError('');

      const responseData = error?.response?.data;

      if (responseData?.errors && typeof responseData.errors === 'object') {
        // Backend returns field-level errors e.g.
        // { errors: { username: ["A user with that username already exists."], ... } }
        const fieldErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(responseData.errors)) {
          fieldErrors[field] = Array.isArray(messages)
            ? (messages as string[]).join(' ')
            : String(messages);
        }
        setServerErrors(fieldErrors);
      } else if (responseData?.message) {
        setGeneralError(responseData.message);
      } else {
        setGeneralError('Registration failed. Please try again.');
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerErrors({});
    setGeneralError('');
    mutation.mutate(data);
  };

  // Helper: merge Zod error with server error for a field
  const fieldError = (name: keyof RegisterFormData) =>
    errors[name]?.message || serverErrors[name];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[#065F46] tracking-wider">
            VERDANT
          </Link>
          <h1 className="text-xl font-bold text-[#1C1917] mt-4">Create your account</h1>
          <p className="text-sm text-[#78716C] mt-1">Join Verdant and start shopping today.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="First name"
                error={fieldError('first_name')}
                {...register('first_name')}
              />
              <Input
                label="Last Name"
                placeholder="Last name"
                error={fieldError('last_name')}
                {...register('last_name')}
              />
            </div>

            <Input
              label="Username"
              placeholder="Choose a username"
              autoComplete="username"
              error={fieldError('username')}
              {...register('username')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              error={fieldError('email')}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              autoComplete="new-password"
              helperText="Minimum 8 characters"
              error={fieldError('password')}
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

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={fieldError('password2')}
              {...register('password2')}
            />

            {/* General server error (non-field) */}
            {generalError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {generalError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={mutation.isPending}
              leftIcon={<UserPlus size={16} />}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#78716C] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#065F46] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
