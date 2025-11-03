'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user) {
      router.replace('/dashboard');
    } else if (!isLoading) {
      // If not authenticated and not loading, redirect to auth
      router.replace('/auth');
    }
  }, [user, isLoading, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // This should be briefly shown before redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
      <div className="text-center">
        <h1 className="text-large-title text-[rgb(var(--color-text-primary))] mb-4">
          UNDO
        </h1>
        <p className="text-body text-[rgb(var(--color-text-secondary))]">
          Reset Your Mind. Rebuild Your Life.
        </p>
      </div>
    </div>
  );
}