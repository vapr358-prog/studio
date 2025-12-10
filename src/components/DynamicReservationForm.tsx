"use client";

import dynamic from 'next/dynamic';

const ReservationForm = dynamic(() => import('@/components/ReservationForm'), {
  ssr: false,
  loading: () => <p className="text-center p-8">Cargando formulario...</p>,
});

export default function DynamicReservationForm() {
    return <ReservationForm />;
}
