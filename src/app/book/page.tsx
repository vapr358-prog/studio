'use client';

import DynamicReservationForm from '@/components/DynamicReservationForm';
import { useI18n } from '@/context/LanguageContext';

export default function BookPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl">{t('book_title')}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('book_sub')}
          </p>
        </div>
        <DynamicReservationForm />
      </div>
    </div>
  );
}