# Zora Coin Visualiser

A 3D visualizer for Zora coins built with Three.js. This project displays Zora coin images in an interactive 3D gallery that you can scroll through and drag to explore.

## Features

- Fetches live data from the Zora Coins SDK
- Interactive 3D gallery with drag and scroll controls
- Instanced mesh rendering for performance
- Texture atlas for efficient rendering
- Blur effects for distant objects

## Setup

1. Install dependencies using pnpm:

```bash
pnpm install
```

2. (Optional but recommended) Set up your Zora API key:

The app works without an API key but may be rate-limited. To avoid rate limiting:

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then add your Zora API key to `.env`:

```
VITE_ZORA_API_KEY=your_api_key_here
```

To get an API key:
- Visit [Zora](https://zora.co)
- Go to Developer Settings
- Create a new API key

**Note:** The app uses the Zora REST API directly (not the SDK) to avoid CORS issues in the browser.

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Tech Stack

- **Three.js** - 3D rendering
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zora Coins SDK** - Fetching Zora coin data
- **GSAP** - Animations
- **Lenis** - Smooth scrolling
- **TailwindCSS** - Styling

## How It Works

The visualizer:
1. Fetches 30 Zora coins using the Zora REST API
2. Creates a texture atlas from the coin images
3. Renders them as instanced meshes in 3D space
4. Allows drag and scroll interactions to explore

The app tries multiple list types in order:
- `new` - Newest coins (tried first)
- `topVolume24h` - Coins with highest trading volume
- `mostValuable` - Coins with highest market cap

If the API is unavailable, it falls back to local placeholder images.

## Documentation

- [Zora Coins SDK Documentation](https://docs.zora.co/coins/sdk)
- [Three.js Documentation](https://threejs.org/docs/)
