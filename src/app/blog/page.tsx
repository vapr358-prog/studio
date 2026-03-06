'use client';

import { blogPosts } from '@/lib/blog-data';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';

export default function BlogPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8 text-left">
        <Button variant="secondary" asChild className="shadow-md border border-white/30 px-6 bg-white/95 hover:bg-white text-primary font-bold">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('back_to_start')}
          </Link>
        </Button>
      </div>

      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Nuestro Blog Dulce</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Historias, consejos y deliciosas inspiraciones de nuestro obrador a tu pantalla.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
