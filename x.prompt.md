---
title: Post to X
description: Post to X (Twitter)
tags:
  - x
  - twitter
  - social
tool: true
---

Use this prompt to post tweets to X (Twitter).

## Workflow

Use the X CLI to post tweets. Assume the `x` CLI is already installed, follow the instructions in the repo README if not already installed.

### Post a tweet
`x post "Your tweet text here"`

### Quote tweet
Quote another tweet with your commentary:
`x quote <tweet_id|url> "Your commentary here"`

### Reply to a tweet
Reply to an existing tweet:
`x reply <tweet_id|url> "Your reply here"`

## Examples

```bash
# Basic tweet
x post "Hello from the CLI!"

# Quote tweet using tweet ID
x quote 1234567890 "This is so true!"

# Quote tweet using URL
x quote https://x.com/user/status/1234567890 "Great thread"

# Reply to a tweet
x reply 1234567890 "Thanks for sharing!"
```

Repo for the X CLI and this prompt: https://github.com/zocomputer/x
