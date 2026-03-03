import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { es, ca } from 'date-fns/locale';
import { useI18n } from '@/context/LanguageContext';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { language } = useI18n();
  const postDate = new Date(post.date);
  const locale = language === 'ca' ? ca : es;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`} className="block aspect-video">
          <Image
            src={post.image.url}
            alt={post.title[language]}
            width={800}
            height={450}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            data-ai-hint={post.image.hint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <p className="text-sm text-muted-foreground mb-2">
          {format(postDate, "d 'de' MMMM, yyyy", { locale })}
        </p>
        <CardTitle className="font-headline text-2xl mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title[language]}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground leading-relaxed">
          {post.excerpt[language]}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href={`/blog/${post.slug}`}>
            {language === 'es' ? 'Leer más' : 'Llegir més'} &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
