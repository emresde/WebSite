import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Post = CollectionEntry<'blog'>;

/** Yayinlanmis yazilar (draft olanlar sadece `npm run dev` sirasinda gorunur), yeniden eskiye. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('blog', (p) => p.data.lang === lang && (import.meta.env.DEV || !p.data.draft));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postPath(p: Post): string {
  return p.data.lang === 'tr' ? `/blog/${p.id}/` : `/en/blog/${p.id}/`;
}
