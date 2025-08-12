import { PageProperties } from './page-properties';

type Link = {
  label: string;
  href: string;
};

export type HomePageProperties = PageProperties & {
  links: Link[];
};
