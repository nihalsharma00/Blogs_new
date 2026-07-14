import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateSitemap = async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.WEB_URL || 'http://localhost:5173';
    
    const [posts, categories, genres, tags] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.genre.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.tag.findMany({
        select: { slug: true, updatedAt: true },
      })
    ]);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ['/', '/about', '/contact', '/privacy', '/terms'];
    for (const page of staticPages) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Posts
    for (const post of posts) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/post/${post.slug}</loc>\n`;
      sitemap += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>daily</changefreq>\n`;
      sitemap += `    <priority>0.9</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Categories
    for (const category of categories) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/category/${category.slug}</loc>\n`;
      sitemap += `    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Genres
    for (const genre of genres) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/genre/${genre.slug}</loc>\n`;
      sitemap += `    <lastmod>${genre.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Tags
    for (const tag of tags) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/tag/${tag.slug}</loc>\n`;
      sitemap += `    <lastmod>${tag.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.5</priority>\n`;
      sitemap += `  </url>\n`;
    }

    sitemap += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    res.status(500).json({ success: false, message: 'Failed to generate sitemap' });
  }
};
