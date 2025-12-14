# Deployment: Real Estate Snapshot

Since this is a new project, follow these steps to deploy it separately from the YouTube tool.

1.  **Create New Repo (GitHub)**:
    *   Go to [https://github.com/new](https://github.com/new).
    *   Name it `real-estate-snapshot`.
    *   Do NOT check "Initialize with README".
    *   Click **Create**.

2.  **Push Code**:
    Run these commands in your *real-estate-snapshot* folder:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/real-estate-snapshot.git
    git branch -M main
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username).*

3.  **Deploy on Vercel**:
    *   Go to Vercel Dashboard -> **Add New** -> **Project**.
    *   Import `real-estate-snapshot`.
    *   Click **Deploy**.
    *   *(Optional)* Add `BREVO_API_KEY` later if you enable email sending.

You will have a live URL in minutes!
