import { NextResponse } from 'next/server';
import { analyzeDeal } from '@/lib/finance';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, ...financials } = body;

        // Run the numbers
        const results = analyzeDeal(financials);

        if (!email) {
            // TEASER MODE
            return NextResponse.json({
                type: 'teaser',
                score: results.score,
                verdict: results.verdict,
                // Hide the specific numbers in teaser
                monthlyCashFlow: null,
                coc: null
            });
        }

        // FULL MODE (Email Gated)

        let aiInsights = null;
        // Only run AI if using full mode (save cost/time)
        if (process.env.OPENAI_API_KEY) {
            const { generateDealInsights } = require('@/lib/ai');
            aiInsights = await generateDealInsights(financials, results);
        }

        // TODO: Send email via Brevo here
        /*
           await sendBrevoEmail({ ... });
        */

        return NextResponse.json({
            type: 'full',
            ...results,
            ai: aiInsights, // { listing_description, investment_thesis, ... }
            recommendedActions: [
                "Make an offer at 5% below asking",
                "Shop for lower insurance rates",
                "Verify HOA restrictions on rentals"
            ]
        });

    } catch (error) {
        return NextResponse.json({ error: 'Calculations failed' }, { status: 500 });
    }
}
