# Plan: Add Quote Tweets & Replies

## Current State

The CLI (`x.ts`) currently supports a single command:
- `x post "text"` — posts a basic tweet

The `postTweet()` function sends a simple `{ text }` body to the Twitter v2 API (`/2/tweets`).

## Goal

Add support for:
1. **Quote tweets** — retweet with your own commentary
2. **Replies** — respond to an existing tweet

## Twitter API v2 Reference

The `/2/tweets` endpoint accepts these additional fields:

```json
{
  "text": "Your tweet text",
  "quote_tweet_id": "1234567890",       // for quote tweets
  "reply": {                             // for replies
    "in_reply_to_tweet_id": "1234567890"
  }
}
```

## Implementation Plan

### 1. Extend `postTweet()` function

Add optional parameters for quote and reply:

```typescript
interface TweetOptions {
  text: string;
  quoteTweetId?: string;    // for quote tweets
  replyToId?: string;       // for replies
}

async function postTweet(options: TweetOptions, config: XConfig) {
  // Build request body dynamically
  const body: Record<string, any> = { text: options.text };
  
  if (options.quoteTweetId) {
    body.quote_tweet_id = options.quoteTweetId;
  }
  
  if (options.replyToId) {
    body.reply = { in_reply_to_tweet_id: options.replyToId };
  }
  
  // ... rest of OAuth + fetch logic
}
```

### 2. Add CLI commands

New command structure:

```
x post "text"                           # basic tweet
x quote <tweet_id> "text"               # quote tweet  
x reply <tweet_id> "text"               # reply to tweet
```

### 3. Add helper: Extract tweet ID from URL

Users will often paste full URLs like:
- `https://x.com/user/status/1234567890`
- `https://twitter.com/user/status/1234567890`

Add a helper to extract the ID:

```typescript
function extractTweetId(input: string): string {
  // If it's a URL, extract the ID from /status/ID
  const match = input.match(/\/status\/(\d+)/);
  return match ? match[1] : input;
}
```

### 4. Update help text

```
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
```

### 5. Update prompt file

Update `x.prompt.md` to document the new commands for Zo.

## Tasks

- [ ] Add `TweetOptions` interface
- [ ] Refactor `postTweet()` to accept options object
- [ ] Add `extractTweetId()` helper function
- [ ] Add `quote` command to CLI
- [ ] Add `reply` command to CLI
- [ ] Update help text
- [ ] Update `x.prompt.md` with new commands
- [ ] Test all three commands

## Notes

- Tweet ID is always numeric and typically 19 digits
- Quote tweets show the original tweet embedded below your text
- Replies appear in the thread under the original tweet
- Both require the original tweet to be public (or from an account you follow)

