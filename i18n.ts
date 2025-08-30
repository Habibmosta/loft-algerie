import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  let messages = {};
  
  try {
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}, using empty fallback`);
  }

  return {
    messages
  };
});