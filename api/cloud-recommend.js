import { z } from 'zod';
import { getCloudRecommendation } from '../backend/utils/claude.js';

export const runtime = 'nodejs';
export const config = { runtime: 'nodejs' };

const cloudSchema = z.object({
  service: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    criticality: z.string(),
    dependencies: z.array(z.string()),
    uptimeSLA: z.number(),
  }),
});

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', code: 'INVALID_JSON', details: null }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    try {
      const parsed = cloudSchema.parse(body);
      const result = await getCloudRecommendation(parsed.service);

      return new Response(JSON.stringify(result), {
        headers: { 'content-type': 'application/json' },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: 'Validation Error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
          }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          error: error?.message || 'Internal Server Error',
          code: 'CLOUD_ERROR',
          details: null,
        }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }
  },
};

