
const { sendBrevoEmail } = require('../lib/brevo');

// Manual mock of process.env since we aren't using dotenv package yet
const fs = require('fs');
const path = require('path');

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
    console.log("API KEY Length:", process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.length : 0);

    const result = await sendBrevoEmail({
        to: 'kd5000@example.com', // Just testing if the API accepts it
        subject: 'Test Email from CLI',
        htmlContent: '<p>This is a test.</p>'
    });

    console.log("Send Result:", result);
}

test();
