/**
 * API route handler for fetching server status from BetterStack.
 * Features:
 * - Uptime monitoring status
 * - Error handling
 * - Status response formatting
 
 */

import { NextResponse } from 'next/server';

import { KASCA_SERVER_MONITOR_ID } from '@/lib/constants';
import type { BetterStackResponse } from '@/components/features/server-status/lib/types';

// export const runtime = 'edge';

const getFallbackStatusResponse = (reason: string) =>
  NextResponse.json({ data: null, degraded: true, reason }, { status: 200 });

export async function GET() {
  const apiKey = process.env.BETTERSTACK_API_KEY;

  if (!KASCA_SERVER_MONITOR_ID || !apiKey) {
    return getFallbackStatusResponse('BetterStack monitoring is not configured');
  }

  try {
    const response = await fetch(
      `https://uptime.betterstack.com/api/v2/monitors/${KASCA_SERVER_MONITOR_ID}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      return getFallbackStatusResponse('BetterStack API request failed');
    }

    const data = (await response.json()) as BetterStackResponse;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching server status:', error);
    return getFallbackStatusResponse('Unexpected status fetch error');
  }
}
