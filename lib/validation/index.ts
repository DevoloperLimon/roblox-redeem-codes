import * as z from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const GameSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description is too short"),
  shortDescription: z.string().max(160, "Short description should be under 160 characters"),
  gameImage: z.string().url("Must be a valid URL"),
  bannerImage: z.string().url("Must be a valid URL"),
  officialGameUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  seoTitle: z.string(),
  seoDescription: z.string(),
  seoKeywords: z.array(z.string()),
});

export const CodeSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
  code: z.string().min(1, "Code is required"),
  reward: z.string().min(1, "Reward description is required"),
  status: z.enum(['Working', 'Expired', 'Upcoming']),
  expiryDate: z.date().optional().nullable(),
});

export const GlobalSettingsSchema = z.object({
  websiteName: z.string(),
  tagline: z.string(),
  logo: z.string().url(),
  favicon: z.string().url(),
  contactEmail: z.string().email(),
  footerText: z.string(),
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal("")),
    discord: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
  maintenanceMode: z.boolean(),
  googleAnalyticsId: z.string(),
  adsenseId: z.string(),
});
