import { z } from "zod";

const text = (max) => z.string().trim().max(max);
const optionalImage = z.string().url().max(600).nullable().optional();

export const contentSchema = z.object({
  brandName: text(80),
  hero: z.object({
    eyebrow: text(120),
    title: text(200),
    subtitle: text(600),
    cta1: text(60),
    cta2: text(60)
  }),
  stats: z
    .array(z.object({ value: text(30), label: text(60) }))
    .max(6),
  about: z.object({ title: text(120), text: text(800) }),
  services: z
    .array(
      z.object({
        icon: z.enum(["wheat", "truck", "elevator", "silo", "dryer"]),
        title: text(120),
        text: text(800),
        image: optionalImage
      })
    )
    .max(12),
  advantagesTitle: text(120),
  advantages: z.array(text(200)).max(20),
  cta: z.object({ title: text(120), text: text(800), button: text(60) }),
  contact: z.object({
    phone: text(60),
    email: text(120),
    address: text(200)
  }),
  seo: z.object({
    title: text(160),
    description: text(320),
    keywords: text(300)
  }),
  images: z.object({
    logo: optionalImage,
    favicon: optionalImage,
    hero: optionalImage
  })
});
