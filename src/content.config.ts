import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog yazilari: src/content/blog/ altindaki .md dosyalari.
// Ust kisimdaki (frontmatter) alanlar asagidaki semaya uymali.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['tr', 'en']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Ayni yazinin diger dildeki versiyonunun dosya adi (uzantisiz), varsa.
    translation: z.string().optional(),
  }),
});

export const collections = { blog };
