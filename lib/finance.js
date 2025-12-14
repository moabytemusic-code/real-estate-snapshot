export function calculateMortgage(principal, rate, years) {
    if (rate === 0) return principal / (years * 12);
    const r = rate / 100 / 12;
    const n = years * 12;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function analyzeDeal(inputs) {
    const {
        price, rent, taxesMo, insuranceMo, hoaMo, downPaymentPercent, rate, term
    } = inputs;

    // 1. Initial Investment
    const downPayment = price * (downPaymentPercent / 100);
    const closingCosts = price * 0.03; // Estimate 3%
    const totalCashInvested = downPayment + closingCosts;
    const loanAmount = price - downPayment;

    // 2. Expenses
    const mortgagePayment = calculateMortgage(loanAmount, rate, term);
    const vacancy = rent * 0.05; // 5% vacancy
    const maintenance = rent * 0.05; // 5% maintenance
    const totalExpensesMo = taxesMo + insuranceMo + hoaMo + vacancy + maintenance;

    // 3. Cash Flow
    const monthlyCashFlow = rent - mortgagePayment - totalExpensesMo;
    const annualCashFlow = monthlyCashFlow * 12;

    // 4. Returns
    const coc = (annualCashFlow / totalCashInvested) * 100;

    // Cap Rate = NOI / Price
    const annualNOI = (rent * 12) - (totalExpensesMo * 12);
    const capRate = (annualNOI / price) * 100;

    // 5. Scoring (0-10)
    let score = 5;
    const feedback = [];

    // Cash Flow Check
    if (monthlyCashFlow > 200) { score += 2; feedback.push("Strong positive cash flow (>$200/mo)"); }
    else if (monthlyCashFlow > 0) { score += 1; feedback.push("Positive cash flow, but thin"); }
    else { score -= 3; feedback.push("Negative cash flow - High risk"); }

    // CoC Check
    if (coc > 12) { score += 2; feedback.push("Excellent Cash-on-Cash Return (>12%)"); }
    else if (coc > 8) { score += 1; feedback.push("Good CoC Return (8-12%)"); }
    else if (coc < 0) { score -= 2; feedback.push("You are losing money on this equity."); }

    // 1% Rule Check (Rent should be ~1% of Price)
    const rentRatio = (rent / price) * 100;
    if (rentRatio >= 1) { score += 1; feedback.push("Meets the 1% Rule"); }
    else if (rentRatio < 0.7) { score -= 1; feedback.push("Rent is low relative to price"); }

    return {
        monthlyCashFlow: Math.round(monthlyCashFlow),
        annualCashFlow: Math.round(annualCashFlow),
        capRate: capRate.toFixed(2),
        coc: coc.toFixed(2),
        totalCashInvested: Math.round(totalCashInvested),
        score: Math.max(0, Math.min(10, score)),
        feedback,
        verdict: score >= 8 ? "BUY IT NOW" : score >= 6 ? "Solid Deal" : score >= 4 ? "Marginal" : "WALK AWAY"
    };
}
