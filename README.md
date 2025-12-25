# x-cli

Post to an X account using [Zo Computer](https://zo.computer)

## Getting X API keys

A free X developer account has limits, but is useful for simply posting or reading your account data.

You need to set up your X (Twitter) API credentials. Follow these detailed steps:

- Go to the [X Developer Portal](https://developer.twitter.com/en/portal/dashboard), sign in with your X account
- Sign in with your X (Twitter) account, sign up for the Free tier
- Create a new project (or use the default project created for you)
- Under the project settings, go to "User authentication settings"
    - For "App permissions", select "Read and Write"
    - Select "Type of app", select "Web App" or "Native App" (either is fine)
    - Enter URL for callback (anything is fine)
    - Enter URL for website (anything is fine)
    - Click "Save"
- Get your API keys
    - Under "Consumer Keys", generate your keys
        - Set `X_API_KEY` and `X_API_KEY_SECRET` in your environment
    - Under "Access Token and Secret", generate your keys
        - Set `X_ACCESS_TOKEN` and `X_ACCESS_TOKEN_SECRET` in your environment

## Installation

### On Zo Computer

1. Clone the repo to your Integrations directory:
```bash
mkdir -p ~/Integrations
cd ~/Integrations
git clone https://github.com/zocomputer/x.git
```

2. Create a global symlink:
```bash
cd ~/Integrations/zocms
bun build --compile ./x.ts --outfile /usr/local/bin/x
```

3. Copy the prompt tool to your Prompts directory:
```bash
cp ~/Integrations/x/x.prompt.md ~/Prompts/
```

## Updating

```bash
cd ~/Integrations/x
git pull
bun build --compile ./x.ts --outfile /usr/local/bin/x
```

## Setup

```bash
bun install
cp .env.example .env
# Edit .env with your keys
```

## Usage

```bash
bun x.ts post "Hello from the CLI!"
```

## Required Keys

Get from [X Developer Portal](https://developer.x.com/en/portal/products/free):

```
X_API_KEY=...
X_API_SECRET=...
X_ACCESS_TOKEN=...
X_ACCESS_SECRET=...
```

## Getting Your API Keys

1. Go to [X Developer Portal](https://developer.x.com/en/portal/products/free)
2. Subscribe to the **Free** tier
3. Create a Project & App
4. In App Settings → User authentication settings:
   - Enable OAuth 1.0a
   - Set App permissions to **Read and Write**
5. Go to Keys and Tokens tab:
   - Copy Consumer Keys (API Key + Secret)
   - Generate Access Token and Secret

## Free Tier Limits

- 500 posts/month
- 100 reads/month

