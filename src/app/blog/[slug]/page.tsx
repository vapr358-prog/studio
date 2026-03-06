'use client';

import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { notFound, useParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es, ca } from 'date-fns/locale';
import { useI18n } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostPage() {
  const { language } = useI18n();
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const postDate = new Date(post.date);
  const locale = language === 'ca' ? ca : es;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <div className="mb-8 text-left">
        <Button variant="ghost" asChild className="text-primary hover:text-primary/80 p-0 hover:bg-transparent">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {language === 'es' ? 'Volver al blog' : 'Tornar al blog'}
          </Link>
        </Button>
      </div>

      <article className="bg-white/85 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-white/20">
        <header className="mb-8">
          <h1 className="font-headline text-4xl md:text-5xl mb-4 text-center text-primary leading-tight">
            {post.title[language]}
          </h1>
          <div className="text-center text-muted-foreground italic">
            <span>{language === 'es' ? 'Publicado por ' : 'Publicat per '} {post.author} {language === 'es' ? ' el ' : ' el '}</span>
            <time dateTime={post.date}>
              {format(postDate, "d 'de' MMMM, yyyy", { locale })}
            </time>
          </div>
        </header>

        <div className="rounded-2xl overflow-hidden shadow-lg mb-10 aspect-video border-4 border-white bg-muted">
          <Image
            src={post.image.url}
            alt={post.title[language]}
            width={1200}
            height={675}
            className="w-full h-full object-cover"
            priority
            data-ai-hint={post.image.hint}
          />
        </div>

        <Separator className="my-10 bg-primary/10"/>

        <div
          className="prose prose-lg lg:prose-xl max-w-none mx-auto prose-p:text-foreground/90 prose-headings:text-primary prose-headings:font-headline prose-strong:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content[language] }}
        />
      </article>
    </div>
  );
}
