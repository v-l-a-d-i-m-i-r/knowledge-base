import { PageProperties } from './page-properties';

export type ArticlePageProperties = PageProperties & {
  article: string;
  tags: string[];
  date: string;
  readTime: string;
};
