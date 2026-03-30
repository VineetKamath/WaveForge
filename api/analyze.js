import { z } from 'zod';
import { analyzePortfolio } from '../backend/services/waveEngine.js';

export const runtime = 'nodejs';
export const config = { runtime: 'nodejs' };

const analyzeSchema = z.object({
  portfolio: z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string(),
    services: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        criticality: z.enum(['low', 'medium', 'high', 'critical']),
        dependencies: z.array(z.string()),
        uptimeSLA: z.number(),
      })
    ),
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
      const parsed = analyzeSchema.parse(body);
      const result = await analyzePortfolio(parsed.portfolio);

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
      if (error && error.code === 'CYCLE_DETECTED') {
        return new Response(
          JSON.stringify({ error: error.message, code: 'CYCLE_DETECTED', details: error.details }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          error: error?.message || 'Internal Server Error',
          code: 'ANALYZE_ERROR',
          details: null,
        }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }
  },
};

