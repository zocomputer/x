#!/usr/bin/env bun

import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";

// --- Config ---

interface XConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

function getConfig(): XConfig {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_KEY_SECRET || process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET || process.env.X_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error("Missing required environment variables:");
    if (!apiKey) console.error("  - X_API_KEY");
    if (!apiSecret) console.error("  - X_API_KEY_SECRET (or X_API_SECRET)");
    if (!accessToken) console.error("  - X_ACCESS_TOKEN");
    if (!accessSecret) console.error("  - X_ACCESS_TOKEN_SECRET (or X_ACCESS_SECRET)");
    console.error("\nSet them in .env or export them to your shell.");
    process.exit(1);
  }

  return { apiKey, apiSecret, accessToken, accessSecret };
}

// --- API ---

async function postTweet(text: string, config: XConfig) {
  const oauth = new OAuth({
    consumer: { key: config.apiKey, secret: config.apiSecret },
    signature_method: "HMAC-SHA1",
    hash_function: (baseString, key) =>
      CryptoJS.HmacSHA1(baseString, key).toString(CryptoJS.enc.Base64),
  });

  const token = { key: config.accessToken, secret: config.accessSecret };
  const url = "https://api.twitter.com/2/tweets";
  const requestData = { url, method: "POST" as const };
  const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

  const response = await fetch(url, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`X API Error: ${JSON.stringify(error, null, 2)}`);
  }

  return response.json();
}

// --- CLI ---

const HELP = `
x-cli - Simple X (Twitter) posting CLI

Usage:
  bun x.ts post <text>    Post a tweet
  bun x.ts help           Show this help

Examples:
  bun x.ts post "Hello from the CLI!"
`;

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "help" || command === "-h") {
  console.log(HELP);
  process.exit(0);
}

if (command === "post") {
  const text = args.slice(1).join(" ");

  if (!text) {
    console.error('Usage: bun x.ts post "Your tweet here"');
    process.exit(1);
  }

  if (text.length > 280) {
    console.error(`Error: Tweet is ${text.length} chars (max 280)`);
    process.exit(1);
  }

  const config = getConfig();
  console.log(`Posting: "${text}"`);

  try {
    const result = await postTweet(text, config);
    console.log("✓ Posted!");
    console.log(`  https://x.com/i/status/${result.data.id}`);
  } catch (error) {
    console.error("✗ Failed:", error);
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}


