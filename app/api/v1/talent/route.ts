import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Dynamic Rate Limiters
const ratelimitPro = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, '1 m'),
  analytics: true,
});

const ratelimitBasic = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Bearer token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  // 1. Look up the API key in the database
  // Note: Added 'tier' to subscriptions assuming we'll have it or can fallback
  const { data: recruiter, error: authError } = await supabaseAdmin
    .from('recruiters')
    .select('id, api_calls_count, subscriptions(status, tier)')
    .eq('api_key', token)
    .single();

  if (authError || !recruiter) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 403 });
  }

  // 2. Verify active subscription
  const activeSub = recruiter.subscriptions?.find((s: any) => s.status === 'active');
  if (!activeSub) {
    return NextResponse.json({ error: 'Active subscription required to access the B2B API.' }, { status: 403 });
  }

  const tier = activeSub.tier?.toLowerCase() === 'pro' ? 'pro' : 'basic';

  // 3. Dynamic Rate Limiting via Upstash
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const limiter = tier === 'pro' ? ratelimitPro : ratelimitBasic;
    const { success, limit, reset, remaining } = await limiter.limit(recruiter.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for your subscription tier. Try again later or upgrade.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'X-Subscription-Tier': tier
          }
        }
      );
    }
  }

  // 4. Process Request
  try {
    const url = new URL(req.url);
    const queryStr = url.searchParams.get('query');
    const country = url.searchParams.get('country');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const maxLimit = Math.min(limit, tier === 'pro' ? 100 : 20); // enforce limit based on tier

    let query = supabaseAdmin
      .from('candidate_profiles')
      .select('id, full_name, current_title, industry, skills, country, city, experience_years, employment_status, preferred_work, highest_education, salary_expectation, completeness_score, linkedin_url, github_url, portfolio_url, updated_at')
      .eq('consent_recruiter_share', true)
      .eq('consent_version', 'v2.0')
      .is('deleted_at', null)
      .limit(maxLimit);

    if (queryStr) {
      query = query.ilike('current_title', `%${queryStr}%`);
    }
    if (country) {
      query = query.eq('country', country);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // 5. Increment API Call Count asynchronously (don't block the response)
    supabaseAdmin.rpc('increment_api_calls', { row_id: recruiter.id }).then(({ error }: any) => {
      if (error) {
        supabaseAdmin
          .from('recruiters')
          .update({ api_calls_count: (recruiter.api_calls_count || 0) + 1 })
          .eq('id', recruiter.id)
          .then();
      }
    });

    return NextResponse.json({
      success: true,
      meta: {
        results: data.length,
        tier,
      },
      data
    });
  } catch (error: any) {
    logger.error('talent', 'API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
