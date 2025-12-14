import { NextResponse } from 'next/server';
import { sendBrevoEmail } from '@/lib/brevo';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Please provide email param' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const hasKey = !!apiKey;
    const keyPreview = hasKey ? `${apiKey.substring(0, 5)}...` : 'MISSING';

    console.log("Testing Email on Vercel...");
    console.log("Key Configured:", hasKey);

    try {
        const success = await sendBrevoEmail({
            to: email,
            subject: 'Vercel Deployment Test',
            htmlContent: '<h1>It Works!</h1><p>Your environment variables are correct.</p>'
        });

        return NextResponse.json({
            status: success ? 'sent' : 'failed',
            env_check: {
                has_api_key: hasKey,
                key_preview: keyPreview,
                node_env: process.env.NODE_ENV
            },
            send_result: success
        });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
