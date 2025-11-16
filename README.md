# Image Archive Analysis Platform

A production-ready, AI-powered image rating and archival platform built with React, TypeScript, and GenLayer blockchain integration. Features professional UI/UX with advanced analysis, comparison tools, and real-time statistics.

## Features

### Core Functionality
- **Image Upload System** - Drag-and-drop interface with file validation and preview
- **AI-Powered Analysis** - Automatic rating (0-10 stars), rarity classification, color analysis, style tagging, and emotion detection
- **Gallery View** - Responsive grid layout with image cards showing thumbnails, ratings, and dominant colors
- **Advanced Search & Filters** - Filter by rarity, rating, style tags, and keywords with real-time results
- **Detailed Image View** - Full analysis breakdown with copyable color swatches and AI rationale
- **Image Comparison Tool** - Side-by-side comparison with AI verdict on differences
- **Statistics Dashboard** - Collection insights including rarity distribution and top style tags

### Technical Highlights
- Modern, professional dark theme with Inter font
- Smooth animations using Framer Motion
- Optimistic UI updates with React Query
- Toast notifications for user feedback
- Loading skeletons and empty states
- Fully responsive design (mobile to desktop)
- Accessibility features (ARIA labels, keyboard navigation)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand (theme) + React Query (data fetching)
- **Animations**: Framer Motion
- **UI Components**: Custom-built professional components
- **Icons**: Lucide React
- **Blockchain**: GenLayer Testnet (JSON-RPC integration)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Access to GenLayer Testnet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-archive-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_CONTRACT_ADDRESS=0x7eC108051F37e463359DdC3fD3998F0FdeB150b7
VITE_GENLAYER_RPC=https://studio.genlayer.com
VITE_NETWORK=testnet
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

## Contract Integration

The platform integrates with a GenLayer smart contract that provides:

- `add_image_and_rate(image_base64, title, uploader, timestamp)` - Upload and analyze image
- `list_recent(n_str)` - Retrieve recent images
- `get_record_by_id(image_id)` - Get specific image record
- `count_images()` - Get total image count
- `search(rarity, min_rating_str, keyword)` - Search with filters
- `filter_by_style_tag(tag)` - Filter by style tag
- `filter_by_dominant_color(hex_color)` - Filter by color
- `compare_images(image_id_a, image_id_b)` - Compare two images

All contract responses are JSON strings that are automatically parsed.

## Project Structure

```
src/
├── components/
│   ├── comparison/         # Image comparison modal
│   ├── detail/            # Image detail view modal
│   ├── filters/           # Search and filter panel
│   ├── gallery/           # Gallery grid and image cards
│   ├── layout/            # Header and navigation
│   ├── shared/            # Reusable UI components
│   ├── stats/             # Statistics dashboard
│   └── upload/            # Upload zone with drag-and-drop
├── hooks/
│   └── useContract.ts     # GenLayer contract integration hooks
├── lib/
│   ├── genlayer.ts        # JSON-RPC client for GenLayer
│   └── utils.ts           # Utility functions
├── store/
│   └── themeStore.ts      # Zustand theme state
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles and animations
```

## Usage Guide

### Uploading Images
1. Click "Upload" in the navigation
2. Drag and drop an image or click to browse
3. Enter a title and optional name
4. Click "Upload & Analyze" to submit
5. AI analysis will process and return results

### Browsing Gallery
1. View all images in the gallery grid
2. Hover over cards to see style tags and rarity
3. Click any image to view full details
4. Use filters to narrow down results by rarity, rating, or keywords

### Comparing Images
1. Open an image in detail view
2. Click "Compare with Another Image"
3. Select a second image from the list
4. View side-by-side comparison with AI verdict

### Viewing Statistics
1. Click "Stats" in the navigation
2. See total images, average rating, and unique count
3. Review rarity distribution chart
4. Explore top style tags

## Design System

### Colors
- **Primary**: Cyan to Blue gradient (`from-cyan-500 to-blue-600`)
- **Secondary**: Emerald to Teal gradient (`from-emerald-500 to-teal-600`)
- **Accent**: Amber to Orange (for ratings)
- **Background**: Dark theme (`bg-gray-950`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Line Height**: 150% for body, 120% for headings

### Animations
- Smooth transitions (200-300ms)
- Hover effects with scale and shadow
- Loading skeletons with shimmer effect
- Modal enter/exit animations
- Card hover animations (lift and scale)

## Performance Optimizations

- Code splitting with dynamic imports
- Image lazy loading (base64 encoded)
- Debounced search inputs (500ms)
- React Query caching (30s stale time)
- Optimistic UI updates
- Virtual scrolling considerations for large lists

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in appropriate directories
2. Use existing shared components for consistency
3. Follow TypeScript typing conventions
4. Add loading and error states
5. Test responsive behavior
6. Update types if needed

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Add environment variables in dashboard
3. Deploy automatically on push

### Other Platforms
1. Run `npm run build`
2. Deploy `dist/` directory to static hosting
3. Ensure environment variables are set

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
