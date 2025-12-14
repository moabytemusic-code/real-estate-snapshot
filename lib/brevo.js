export async function sendBrevoEmail({ to, subject, htmlContent }) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'noreply@example.com';
    const senderName = process.env.SENDER_NAME || 'Real Estate Deal Snapshot';

    if (!apiKey) {
        console.error("❌ ERROR: BREVO_API_KEY is missing in Environment Variables!");
        return false;
    }

    console.log(`📧 Attempting to send email to ${to} from ${senderEmail}`);

    const url = 'https://api.brevo.com/v3/smtp/email';

    const body = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Brevo API Error:", response.status, errorText);
            return false;
        }

        console.log("✅ Email sent successfully via Brevo!");
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

export async function createBrevoContact({ email, attributes = {} }) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) return false;

    console.log(`👤 Adding contact to Brevo: ${email}`);

    const url = 'https://api.brevo.com/v3/contacts';

    // Basic payload to create/update contact
    const body = {
        email: email,
        updateEnabled: true, // If they exist, update them
        attributes: attributes
        // listIds: [2] // If user supplies a list ID in .env, we could use it here
    };

    // If user has a list ID set in env, add it
    if (process.env.BREVO_LIST_ID) {
        body.listIds = [parseInt(process.env.BREVO_LIST_ID)];
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Ignore "Contact already exists" if updateEnabled didn't catch it
            console.error("⚠️ Brevo Contact Error:", response.status, errorText);
            return false;
        }

        console.log("✅ Contact added/updated in Brevo!");
        return true;
    } catch (error) {
        console.error("Failed to add contact:", error);
        return false;
    }
}
