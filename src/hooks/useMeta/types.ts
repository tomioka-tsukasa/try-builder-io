export type MetaType = {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogTitle?: string;
  ogSiteName?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  customMeta?: Array<{ name: string; content: string }>;
};

export type UseMetaReturn = {
  meta: MetaType;
};
