import { z } from 'zod';

export const articleMetaSchema = z
  .object({
    title: z.string(),
    date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, 'Date must be in DD-MM-YYYY format (e.g., 31-12-2026)'),
    tags: z.array(z.string()),
  })
  .catchall(z.unknown());

export type ArticleMeta = z.infer<typeof articleMetaSchema>;
