import { NextResponse } from 'next/server';
import { analyzeDeal } from '@/lib/finance';
import { sendBrevoEmail, createBrevoContact } from '@/lib/brevo';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, ...financials } = body;
        console.log("Analyzing deal for:", email);

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

        // Send email via Brevo
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h1 style="color: #10B981;">Real Estate Deal Snapshot™</h1>
              <p>Here is the breakdown for your property analysis.</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top:0;">Verdict: ${results.verdict} (Score: ${results.score}/10)</h2>
                <ul>${results.feedback.map(f => `<li>${f}</li>`).join('')}</ul>
              </div>
    
              <h3>💰 Financial Highlight</h3>
              <ul>
                <li><strong>Monthly Cash Flow:</strong> $${results.monthlyCashFlow}</li>
                <li><strong>Cash-on-Cash Return:</strong> ${results.coc}%</li>
                <li><strong>Cap Rate:</strong> ${results.capRate}%</li>
                <li><strong>Total Cash Invested:</strong> $${results.totalCashInvested}</li>
              </ul>
              
              ${aiInsights ? `
              <h3>🤖 AI Analyst Insights</h3>
              <div style="background: #eef; padding: 15px; border-radius: 8px;">
                 <p><strong>Thesis:</strong> ${aiInsights.investment_thesis}</p>
                 <p><strong>Strategy:</strong> ${aiInsights.value_add_strategy}</p>
                 <p><strong>Tenant:</strong> ${aiInsights.renter_persona}</p>
              </div>
              ` : ''}
              
              <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
                <p><strong>Recommended Tools for Investors:</strong></p>
                <p>
                  🏠 <a href="https://www.biggerpockets.com" style="color: #10B981; text-decoration: none; font-weight: bold;">BiggerPockets</a> - Community & Calculators<br/>
                  🏘️ <a href="https://www.roofstock.com" style="color: #10B981; text-decoration: none; font-weight: bold;">Roofstock</a> - Buy turnkey rentals
                </p>
              </div>
            </div>
        `;

        console.log("Sending email to:", email);
        const success = await sendBrevoEmail({
            to: email,
            subject: `Deal Snapshot: $${financials.price} Property`,
            htmlContent: htmlContent
        });
        console.log("Email sent result:", success);

        await createBrevoContact({
            email,
            attributes: {
                FIRSTNAME: 'Real Estate Investor',
                LEAD_SOURCE: "RE_Snapshot"
            }
        });

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
