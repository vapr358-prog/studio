'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es, ca } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useI18n } from '@/context/LanguageContext';

export default function ReservationForm() {
  const [date, setDate] = React.useState<Date | undefined>();
  const { t, language } = useI18n();
  const locale = language === 'ca' ? ca : es;

  return (
    <Card className="shadow-lg">
      <form action="https://formspree.io/f/your_form_id" method="POST">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('form_details')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form_name')}</Label>
            <Input id="name" name="name" placeholder={t('form_name_placeholder')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('form_email')}</Label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('form_phone')}</Label>
            <Input id="phone" name="phone" placeholder={t('form_phone_placeholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">{t('form_guests')}</Label>
            <Input id="guests" name="guests" type="number" placeholder={t('form_guests_placeholder')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="event-date">{t('form_event_date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale }) : <span>{t('form_select_date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(day) => day < new Date()}
                  locale={locale}
                />
              </PopoverContent>
            </Popover>
            <input type="hidden" name="event-date" value={date ? date.toISOString() : ''} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="flavors">{t('form_flavors')}</Label>
            <Textarea
              id="flavors"
              name="flavors"
              placeholder={t('form_flavors_placeholder')}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="design">{t('form_design')}</Label>
            <Textarea
              id="design"
              name="design"
              placeholder={t('form_design_placeholder')}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" size="lg">
            {t('form_submit')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}