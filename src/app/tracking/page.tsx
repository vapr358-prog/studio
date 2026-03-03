'use client';

import TrackingClient from '@/components/tracking/TrackingClient';
import { useI18n } from '@/context/LanguageContext';

export default function TrackingPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl">{t('track_title')}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('track_sub')}
          </p>
        </div>
        <TrackingClient />
      </div>
    </div>
  );
}