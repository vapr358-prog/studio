import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Entrada no encontrada',
    }
  }
 
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const postDate = new Date(post.date);

  return (
    <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl mb-4 text-center">{post.title}</h1>
        <div className="text-center text-muted-foreground">
          <span>Publicado por {post.author} el </span>
          <time dateTime={post.date}>
            {format(postDate, "d 'de' MMMM, yyyy", { locale: es })}
          </time>
        </div>
      </header>

      <div className="rounded-lg overflow-hidden shadow-lg mb-8 aspect-video">
        <Image
          src={post.image.url}
          alt={post.title}
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
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
