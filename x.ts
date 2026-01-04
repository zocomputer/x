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

// --- Helpers ---

function extractTweetId(input: string): string {
  // Extract tweet ID from URL like https://x.com/user/status/1234567890
  const match = input.match(/\/status\/(\d+)/);
  return match ? match[1] : input;
}

// --- API ---

interface TweetOptions {
  text: string;
  quoteTweetId?: string;
  replyToId?: string;
}

async function postTweet(options: TweetOptions, config: XConfig) {
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

  // Build request body
  const body: Record<string, unknown> = { text: options.text };

  if (options.quoteTweetId) {
    body.quote_tweet_id = options.quoteTweetId;
  }

  if (options.replyToId) {
    body.reply = { in_reply_to_tweet_id: options.replyToId };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
  x post <text>                 Post a tweet
  x quote <tweet_id|url> <text> Quote tweet with commentary
  x reply <tweet_id|url> <text> Reply to a tweet
  x help                        Show this help

Examples:
  x post "Hello from the CLI!"
  x quote 1234567890 "This is so true!"
  x quote https://x.com/user/status/1234567890 "Great thread"
  x reply 1234567890 "Thanks for sharing!"
`;

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "help" || command === "-h") {
  console.log(HELP);
  process.exit(0);
}

const config = getConfig();

if (command === "post") {
  const text = args.slice(1).join(" ");

  if (!text) {
    console.error('Usage: x post "Your tweet here"');
    process.exit(1);
  }

  if (text.length > 280) {
    console.error(`Error: Tweet is ${text.length} chars (max 280)`);
    process.exit(1);
  }

  console.log(`Posting: "${text}"`);

  try {
    const result = await postTweet({ text }, config);
    console.log("✓ Posted!");
    console.log(`  https://x.com/i/status/${result.data.id}`);
  } catch (error) {
    console.error("✗ Failed:", error);
    process.exit(1);
  }
} else if (command === "quote") {
  const tweetIdOrUrl = args[1];
  const text = args.slice(2).join(" ");

  if (!tweetIdOrUrl || !text) {
    console.error('Usage: x quote <tweet_id|url> "Your commentary here"');
    process.exit(1);
  }

  const quoteTweetId = extractTweetId(tweetIdOrUrl);

  if (text.length > 280) {
    console.error(`Error: Tweet is ${text.length} chars (max 280)`);
    process.exit(1);
  }

  console.log(`Quoting tweet ${quoteTweetId}: "${text}"`);

  try {
    const result = await postTweet({ text, quoteTweetId }, config);
    console.log("✓ Quote tweeted!");
    console.log(`  https://x.com/i/status/${result.data.id}`);
  } catch (error) {
    console.error("✗ Failed:", error);
    process.exit(1);
  }
} else if (command === "reply") {
  const tweetIdOrUrl = args[1];
  const text = args.slice(2).join(" ");

  if (!tweetIdOrUrl || !text) {
    console.error('Usage: x reply <tweet_id|url> "Your reply here"');
    process.exit(1);
  }

  const replyToId = extractTweetId(tweetIdOrUrl);

  if (text.length > 280) {
    console.error(`Error: Tweet is ${text.length} chars (max 280)`);
    process.exit(1);
  }

  console.log(`Replying to tweet ${replyToId}: "${text}"`);

  try {
    const result = await postTweet({ text, replyToId }, config);
    console.log("✓ Replied!");
    console.log(`  https://x.com/i/status/${result.data.id}`);
  } catch (error) {
    console.error("✗ Failed:", error);
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
