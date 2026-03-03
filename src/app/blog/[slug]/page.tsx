'use client';

import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { notFound, useParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es, ca } from 'date-fns/locale';
import { useI18n } from '@/context/LanguageContext';

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
    <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl mb-4 text-center">
          {post.title[language]}
        </h1>
        <div className="text-center text-muted-foreground">
          <span>{language === 'es' ? 'Publicado por ' : 'Publicat per '} {post.author} {language === 'es' ? ' el ' : ' el '}</span>
          <time dateTime={post.date}>
            {format(postDate, "d 'de' MMMM, yyyy", { locale })}
          </time>
        </div>
      </header>

      <div className="rounded-lg overflow-hidden shadow-lg mb-8 aspect-video">
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

      <Separator className="my-8"/>

      <div
        className="prose prose-lg lg:prose-xl max-w-none mx-auto prose-p:text-foreground prose-headings:text-foreground prose-headings:font-headline prose-strong:text-foreground"
        dangerouslySetInnerHTML={{ __html: post.content[language] }}
      />
    </article>
  );
}
