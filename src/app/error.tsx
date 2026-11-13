'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';

type RouteErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorFallback
      title="حدث خطأ غير متوقع"
      message="يمكنك المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى التواصل مع قسم التقنية والتطوير."
      digest={error.digest}
      onRetry={reset}
    />
  );
}
