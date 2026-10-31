import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Package, Heart, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUpdateMe } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  STAFF: 'Staff Member',
  CUSTOMER: 'Customer',
};

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const updateMe = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      username: user?.username || '',
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateMe.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#1C1917] mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          {/* User card */}
          <div className="bg-white rounded-xl border border-[#E7E5E4] p-5 text-center">
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-3">
              <User size={28} className="text-[#065F46]" />
            </div>
            <p className="font-semibold text-[#1C1917]">{user?.first_name || user?.username}</p>
            <p className="text-xs text-[#78716C]">{user?.email}</p>
            {user?.role && (
              <span className="inline-block mt-2 text-xs bg-[#D1FAE5] text-[#065F46] px-3 py-1 rounded-full font-medium">
                {ROLE_LABELS[user.role] || user.role}
              </span>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
            {[
              { to: '/account/orders', icon: <Package size={16} />, label: 'My Orders' },
              { to: '/account/wishlist', icon: <Heart size={16} />, label: 'Wishlist' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-5 py-3.5 text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors border-b border-[#E7E5E4] last:border-0"
              >
                <span className="text-[#78716C]">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Profile form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E7E5E4] p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-[#065F46]" />
              <h2 className="text-lg font-bold text-[#1C1917]">Profile Information</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="First name"
                  error={errors.first_name?.message}
                  {...register('first_name')}
                />
                <Input
                  label="Last Name"
                  placeholder="Last name"
                  error={errors.last_name?.message}
                  {...register('last_name')}
                />
              </div>
              <Input
                label="Username"
                placeholder="username"
                error={errors.username?.message}
                {...register('username')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="submit"
                  loading={updateMe.isPending}
                  disabled={!isDirty}
                >
                  Save Changes
                </Button>
                {isDirty && (
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors"
                  >
                    Discard
                  </button>
                )}
              </div>
            </form>

            {user?.date_joined && (
              <p className="text-xs text-[#78716C] mt-5 pt-4 border-t border-[#E7E5E4]">
                Member since {new Date(user.date_joined).toLocaleDateString('en-BD', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
