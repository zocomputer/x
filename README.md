# X CLI - Post to X (Twitter)

Simple command-line tool for posting tweets, quote tweets, replies, and deleting tweets on X.

## Getting Started

### 1. Get X API Keys

You need X Developer API credentials. Follow these steps:

- Go to [X Developer Portal](https://developer.x.com/en/portal/dashboard)
- Sign in with your X account
- Create a new project (or use the default)
- Create a new app under your project
- Go to your app's "Keys and Tokens" tab:
  - Generate API Key and Secret (Consumer Keys)
  - Generate Access Token and Secret (User Context)

### 2. Add Keys to Zo Settings

Go to [Settings > Developers](/settings#developers) and add these as secrets:
- `X_API_KEY` (API Key from step 1)
- `X_API_KEY_SECRET` (API Key Secret from step 1)
- `X_ACCESS_TOKEN` (Access Token from step 1)
- `X_ACCESS_TOKEN_SECRET` (Access Token Secret from step 1)

### 3. Use the CLI

```bash
# Post a tweet
x post "Hello from X!"

# Quote tweet
x quote https://x.com/someone/status/1234567890 "Great point!"

# Reply to a tweet
x reply https://x.com/someone/status/1234567890 "Thanks!"
```

## Usage Examples

### Simple tweet
```bash
x post "I'm learning Zo Computer!"
```

### Quote tweet (single line)
```bash
x quote https://x.com/zocomputer/status/123 "This is so cool"
```

### Quote tweet with multiple paragraphs
```bash
x quote https://x.com/zocomputer/status/123 "Great insight!

This really resonates with me.

Looking forward to more."
```

### Reply
```bash
x reply https://x.com/zocomputer/status/123 "Thanks for sharing"
```

### Delete a tweet
```bash
x delete https://x.com/i/status/123
```

## Max Length

All tweets are limited to **280 characters**. The CLI will tell you if your text is too long.

## Line Breaks

Use actual line breaks in your shell for multi-paragraph content:
```bash
x quote https://x.com/zocomputer/status/123 "Paragraph one.

Paragraph two."
```

Don't use `\n` - the shell will handle actual newlines.

## Help

```bash
x help
```

## Installation

The X CLI comes pre-installed on your Zo Computer. To verify it's working:

```bash
x help
```

### If you need to reinstall or update

1. Navigate to your Integrations folder:
```bash
cd /home/workspace/Integrations
```

2. Clone the repository (if not already present):
```bash
git clone https://github.com/zocomputer/x.git
cd x
```

3. Install dependencies:
```bash
bun install
```

4. The CLI is now ready to use. Run any of the commands above (e.g., `x post "Hello"`).

### Using the CLI from anywhere

Once installed, you can run `x` commands from any directory. The CLI will use your environment variables from [Settings > Developers](/settings#developers).

## Troubleshooting

- **Missing environment variables**: Make sure you've added all 4 keys to [Settings > Developers](/settings#developers)
- **Character limit error**: Count your characters or shorten your message
- **API errors**: Check your keys are correct in the Developer settings



