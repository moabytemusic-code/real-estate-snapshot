"use client";
import { useState } from 'react';
import { Building2, DollarSign, Percent, ArrowRight, Lock, CheckCircle, Sparkles, CircleHelp, X } from 'lucide-react';
import './globals.css';

export default function Home() {
    const [step, setStep] = useState('input');
    const [showHelp, setShowHelp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        price: 300000,
        rent: 2500,
        taxesMo: 300,
        insuranceMo: 100,
        hoaMo: 0,
        downPaymentPercent: 20,
        rate: 7.0,
        term: 30
    });
    const [results, setResults] = useState(null);
    const [email, setEmail] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const calculate = async (withEmail = false) => {
        setLoading(true);
        try {
            const payload = { ...inputs };
            if (withEmail) payload.email = email;

            const res = await fetch('/api/analyze-deal', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            setResults(data);
            if (withEmail && data.type === 'full') setStep('success');
            else setStep('teaser');
        } catch (e) {
            alert("Error analyzing deal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pb-20 p-4">
            {/* Header */}
            <header className="text-center py-10 max-w-2xl mx-auto">
                <div className="flex justify-center gap-2 mb-4">
                    <Building2 className="text-emerald-500" size={40} />
                    <h1 className="text-3xl text-emerald-500">Real Estate Deal Snapshot™</h1>
                </div>
                <p className="text-slate-400">Stop guessing. Know instantly if a property is a Cash Cow or a Money Pit.</p>
            </header>

            <div className="max-w-xl mx-auto">

                {/* INPUT FORM */}
                {step === 'input' && (
                    <div className="card">
                        <h2 className="text-xl mb-4 text-white">Property Details</h2>

                        <div className="grid-2 mb-4">
                            <div>
                                <label className="text-sm block mb-2">Purchase Price ($)</label>
                                <input type="number" name="price" value={inputs.price} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="text-sm block mb-2">Monthly Rent ($)</label>
                                <input type="number" name="rent" value={inputs.rent} onChange={handleInputChange} />
                            </div>
                        </div>

                        <h3 className="text-lg mb-3 mt-6 text-white">Expenses (Monthly)</h3>
                        <div className="grid-2 mb-4">
                            <div>
                                <label className="text-sm block mb-2">Property Taxes</label>
                                <input type="number" name="taxesMo" value={inputs.taxesMo} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="text-sm block mb-2">Insurance</label>
                                <input type="number" name="insuranceMo" value={inputs.insuranceMo} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm block mb-2">HOA / Misc</label>
                            <input type="number" name="hoaMo" value={inputs.hoaMo} onChange={handleInputChange} />
                        </div>

                        <h3 className="text-lg mb-3 mt-6 text-white">Financing</h3>
                        <div className="grid-2 mb-4">
                            <div>
                                <label className="text-sm block mb-2">Down Payment (%)</label>
                                <input type="number" name="downPaymentPercent" value={inputs.downPaymentPercent} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="text-sm block mb-2">Interest Rate (%)</label>
                                <input type="number" name="rate" value={inputs.rate} onChange={handleInputChange} />
                            </div>
                        </div>

                        <button onClick={() => calculate(false)} className="btn-primary mt-6" disabled={loading}>
                            {loading ? 'Crunching Numbers...' : 'Analyze This Deal'}
                        </button>
                    </div>
                )}

                {/* TEASER RESULTS */}
                {step === 'teaser' && results && (
                    <div className="card text-center animate-fade-in">
                        <h2 className="text-2xl mb-2 text-white">Deal Verdict</h2>
                        <div className={`text-4xl font-bold mb-2 ${results.score >= 6 ? 'text-green' : 'text-red'}`}>
                            {results.verdict}
                        </div>
                        <div className="text-slate-400 mb-8">Deal Score: {results.score}/10</div>

                        <div className="bg-slate-900 p-6 rounded-lg mb-6 border border-slate-700">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                                <span className="text-slate-400">Monthly Cash Flow</span>
                                <span className="blur-sm select-none text-emerald-400 font-bold">$420.00</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                                <span className="text-slate-400">Cash-on-Cash Return</span>
                                <span className="blur-sm select-none text-sky-400 font-bold">12.5%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Cap Rate</span>
                                <span className="blur-sm select-none text-white font-bold">7.2%</span>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
                            <Lock className="mx-auto mb-2 text-primary" />
                            <h3 className="text-xl font-bold text-white mb-2">Unlock Full Breakdown</h3>
                            <p className="text-sm text-slate-400 mb-4">Enter your email to see the real numbers and get a printable PDF report.</p>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="mb-4"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button onClick={() => calculate(true)} className="btn-primary">
                                Unlock My Report
                            </button>
                        </div>
                        <button onClick={() => setStep('input')} className="text-sm text-slate-500 mt-4 underline">Edit Inputs</button>
                    </div>
                )}

                {/* SUCCESS */}
                {step === 'success' && results && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="text-green w-20 h-20 mb-4" />
                        <h2 className="text-3xl text-white font-bold mb-2">Report Unlocked!</h2>
                        <p className="text-slate-400 mb-8 text-center">We've sent the full PDF breakdown to <b>{email}</b>.</p>

                        <div className="card w-full mb-8">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                                <span className="text-slate-400">Monthly Cash Flow</span>
                                <span className="text-emerald-400 font-bold text-xl">${results.monthlyCashFlow}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                                <span className="text-slate-400">Cash-on-Cash Return</span>
                                <span className="text-sky-400 font-bold text-xl">{results.coc}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Cap Rate</span>
                                <span className="text-white font-bold text-xl">{results.capRate}%</span>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700">
                                <h4 className="text-white mb-2">What's Good:</h4>
                                <ul className="list-disc pl-5 text-green text-sm">
                                    {results.feedback.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </div>

                        {results.ai && (
                            <div className="card w-full mb-8 border-emerald-500/30 bg-emerald-900/10">
                                <h3 className="text-xl text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                    <Sparkles size={20} /> AI Investment Analysis
                                </h3>

                                <div className="mb-4">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wide opacity-70">Listing Description</h4>
                                    <p className="text-slate-300 italic mt-1 text-sm bg-slate-900/50 p-3 rounded">{results.ai.listing_description}</p>
                                </div>

                                <div className="grid grid-2 gap-4">
                                    <div>
                                        <h4 className="text-white font-bold text-sm opacity-70">Investment Thesis</h4>
                                        <p className="text-slate-300 text-sm mt-1">{results.ai.investment_thesis}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm opacity-70">Ideal Tenant</h4>
                                        <p className="text-slate-300 text-sm mt-1">{results.ai.renter_persona}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-700/50">
                                    <h4 className="text-white font-bold text-sm opacity-70">Value-Add Strategy</h4>
                                    <p className="text-emerald-300 text-sm mt-1">💡 {results.ai.value_add_strategy}</p>
                                </div>
                            </div>
                        )}

                        {/* Monetization / Recommended Tools */}
                        <div className="w-full text-center mt-8">
                            <h3 className="text-xl text-white font-bold mb-6">Tools for Smart Investors</h3>
                            <div className="grid grid-2">
                                <a href="https://www.biggerpockets.com" target="_blank" className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-emerald-500 transition block no-underline">
                                    <h4 className="text-white font-bold">BiggerPockets</h4>
                                    <p className="text-slate-400 text-sm mt-1">#1 Real estate community & calculators.</p>
                                </a>
                                <a href="https://www.roofstock.com" target="_blank" className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-emerald-500 transition block no-underline">
                                    <h4 className="text-white font-bold">Roofstock</h4>
                                    <p className="text-slate-400 text-sm mt-1">Buy rental properties with tenants in place.</p>
                                </a>
                            </div>
                        </div>

                        <button onClick={() => { setStep('input'); setResults(null); }} className="mt-10 text-slate-500 underline">Analyze Another Deal</button>
                    </div>
                )}

            </div>
            {/* Help Button */}
            <button
                onClick={() => setShowHelp(true)}
                className="fixed top-4 right-4 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-white px-3 py-2 rounded-full transition flex items-center gap-2 z-50 backdrop-blur-sm"
            >
                <span className="font-bold text-sm">How To Use</span> <CircleHelp size={20} />
            </button>

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-6 rounded-xl max-w-sm w-full relative border border-slate-600">
                        <button
                            onClick={() => setShowHelp(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Building2 size={24} className="text-emerald-500" /> How it Works
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-emerald-500 shrink-0">1</div>
                                <div><strong className="text-white block">Input Details</strong><p className="text-slate-400 text-sm">Enter Price, Rent, and Financing info.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-emerald-500 shrink-0">2</div>
                                <div><strong className="text-white block">Crunch Numbers</strong><p className="text-slate-400 text-sm">Get instant Cash Flow & Cap Rate.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-emerald-500 shrink-0">3</div>
                                <div><strong className="text-white block">Unlock Insights</strong><p className="text-slate-400 text-sm">Get AI Investment Thesis & PDF.</p></div>
                            </div>
                        </div>

                        <button onClick={() => setShowHelp(false)} className="btn-primary mt-6 w-full py-2">Got it</button>
                    </div>
                </div>
            )}
        </main >
    );
}
