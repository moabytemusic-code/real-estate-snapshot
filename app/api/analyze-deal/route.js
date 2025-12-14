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
        // TODO: Send email via Brevo here
        /*
           await sendBrevoEmail({
             to: email, 
             subject: "Your Deal Snapshot", 
             htmlContent: ...
           });
           await createBrevoContact({ email, attributes: { LEAD_SOURCE: "RE_Snapshot" }});
        */

        return NextResponse.json({
            type: 'full',
            ...results,
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
