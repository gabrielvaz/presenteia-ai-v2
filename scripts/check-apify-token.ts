
import { ApifyClient } from 'apify-client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log(`Loading .env.local from ${envPath}`);
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.error(".env.local not found!");
    process.exit(1);
}

async function check() {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) {
        console.error("APIFY_API_TOKEN missing.");
        return;
    }
    console.log(`Testing Token: ${token.slice(0, 5)}...`);

    const client = new ApifyClient({ token });
    try {
        const user = await client.user().get();
        if (user) {
            console.log(`✅ Token Valid! User: ${user.username}`);
            // Optional: Check quota if possible or just try a lighter actor
            console.log("Everything looks good. Restart your dev server to use it.");
        } else {
            console.error("❌ Token invalid (User not found).");
        }
    } catch (e: any) {
        console.error("❌ Token Error:", e.message);
    }
}

check();
