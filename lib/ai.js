import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function generateDealInsights(inputs, financialResults) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY");
    }

    const prompt = `
    Act as a savage Real Estate Investment Analyst (like a mix of Warren Buffett and a modern flipper).

    Analyze this rental property deal:
    - Purchase Price: $${inputs.price}
    - Monthly Rent: $${inputs.rent}
    - Calculated Cash Flow: $${financialResults.monthlyCashFlow}/mo
    - Cash-on-Cash Return: ${financialResults.coc}%
    - Cap Rate: ${financialResults.capRate}%

    Output a JSON response (raw JSON, no markdown) with:
    {
      "listing_description": "<A punchy, investor-focused 3-sentence listing description highlighting the cash flow potential>",
      "investment_thesis": "<A 2-sentence verdict on why this is a buy or a pass, focusing on the numbers>",
      "renter_persona": "<Describe the ideal tenant for this price point in 1 sentence>",
      "value_add_strategy": "<One creative idea to increase rent based on the price point (e.g. add LVP flooring, pet rent)>"
    }
  `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Real Estate Investment Analyst AI." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (err) {
        console.error("AI Deal Analysis Failed:", err);
        return null; // Handle gracefully in the API
    }
}
