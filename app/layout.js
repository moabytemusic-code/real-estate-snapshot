import './globals.css'

export const metadata = {
    title: 'Real Estate Deal Snapshot™ | Instant Investment Analysis',
    description: 'Analyze rental property deals in seconds. Calculate Cash Flow, Cap Rate, and Cash-on-Cash Return instantly.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    )
}
