import { blogPosts } from '@/lib/blog-data';
import { BlogCard } from '@/components/BlogCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Lee nuestras últimas historias, recetas y noticias del mundo de la pastelería en Sweet Queen.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
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
