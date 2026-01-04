---
title: Post to X
description: Post tweets, quote tweets, and replies to X (Twitter)
tags:
  - x
  - twitter
  - social
tool: true
---

Post content to X using the X CLI.

## Setup

Make sure your X API credentials are configured in [Settings > Developers](/settings#developers):
- `X_API_KEY`
- `X_API_KEY_SECRET` (or `X_API_SECRET`)
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET` (or `X_ACCESS_SECRET`)

[Get your API keys from X Developer Portal](https://developer.x.com/en/portal/products/free)

## Commands

### Post a tweet
```bash
x post "Your tweet text here"
```

**Example:**
```bash
x post "Building in public is fun!"
```

### Quote tweet
```bash
x quote <tweet_url> "Your commentary"
```

**Example:**
```bash
x quote https://x.com/someone/status/1234567890 "This is a great insight!"
```

**With line breaks:**
```bash
x quote https://x.com/someone/status/1234567890 "First paragraph here.

Second paragraph here."
```

### Reply to a tweet
```bash
x reply <tweet_url> "Your reply text"
```

**Example:**
```bash
x reply https://x.com/someone/status/1234567890 "Thanks for sharing this!"
```

## Tips

- Max length is **280 characters** per tweet
- Use actual line breaks (press Enter in the shell) for multi-paragraph content
- You can use tweet IDs or full URLs
- Include quotes of other tweets to increase engagement

