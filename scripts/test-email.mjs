
import { sendBrevoEmail } from '../lib/brevo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local manually
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) process.env[key.trim()] = val.trim();
    });
} catch (e) {
    console.error("Could not read .env.local");
}

async function test() {
    console.log("Testing Email Sending...");
    console.log("API KEY Present:", !!process.env.BREVO_API_KEY);

    const result = await sendBrevoEmail({
        to: 'kd5000@example.com',
        subject: 'Test Email from CLI',
        htmlContent: '<p>This is a test.</p>'
    });

    console.log("Send Result:", result);
}

test();
