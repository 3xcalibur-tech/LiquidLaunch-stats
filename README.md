# Liquid Launch Wallet Statistics

A beautiful, Twitter-inspired wallet analytics dashboard for the Liquid Launch platform. This React application allows users to analyze Ethereum wallet trading statistics with a sleek, dark-themed interface and export capabilities.

## ✨ Features

- **🔍 Wallet Analysis**: Enter any Ethereum wallet address to view comprehensive trading statistics
- **📊 Key Metrics Display**: 
  - Total volume and fees (calculated at 1%)
  - Total trades count
  - Buy/Sell order breakdown
  - Trading period (first and last trade dates)
- **💾 Image Export**: Save wallet statistics as high-quality PNG images
- **🎨 Twitter-Inspired Design**: Clean, professional dark theme with modern UI components
- **📱 Responsive**: Works seamlessly on desktop and mobile devices
- **⚡ Fast Performance**: Built with React and optimized for speed

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/3xcalibur-tech/LiquidLaunch-stats
   cd LiquidLaunch-stats
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Export**: html2canvas
- **Build Tool**: Vite
- **Linting**: ESLint

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "html2canvas": "^1.4.1",
  "lucide-react": "^0.344.0"
}
```

## 🎯 Usage

### Basic Usage

1. **Enter Wallet Address**: Input any valid Ethereum wallet address (0x...)
2. **Click Analyze**: The app will fetch and display trading statistics
3. **View Results**: See comprehensive metrics in beautiful cards
4. **Export Image**: Click "Save Image" to download the statistics as PNG

### API Integration

The app connects to the Liquid Launch API:
```
GET https://donkey-api.liquidlaunch.app/api/wallet/{address}
```

**Response Format:**
```json
{
  "address": "0xABC...",
  "total_volume": "824.309202265870747275",
  "total_trades": 142,
  "buy_count": 85,
  "sell_count": 57,
  "first_trade": 1749666804,
  "last_trade": 1750444284,
  "portfolio": [...]
}
```

## 🎨 Customization

### Styling

The app uses Tailwind CSS for styling. Key design elements:

- **Colors**: Dark theme with blue accents
- **Typography**: Modern font hierarchy with proper contrast
- **Components**: Card-based layout with rounded corners
- **Spacing**: Consistent padding and margins

### Modifying the Theme

1. **Update colors** in `tailwind.config.js`:
   ```js
   theme: {
     extend: {
       colors: {
         primary: '#your-color',
         secondary: '#your-color'
       }
     }
   }
   ```

2. **Change component styles** in `src/App.tsx`:
   ```tsx
   // Example: Change card background
   className="bg-gray-800" // Current
   className="bg-your-color" // Custom
   ```

### Adding New Metrics

To add new wallet statistics:

1. **Update the interface**:
   ```tsx
   interface WalletStats {
     // ... existing fields
     new_metric: number;
   }
   ```

2. **Add new card component**:
   ```tsx
   <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50">
     <div className="flex items-center space-x-2 mb-3">
       <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
         <YourIcon className="w-3.5 h-3.5 text-purple-400" />
       </div>
       <span className="text-xs text-gray-400 font-semibold">YOUR METRIC</span>
     </div>
     <p className="text-2xl font-bold text-white">{stats.new_metric}</p>
   </div>
   ```

### API Configuration

To use a different API endpoint:

1. **Update the fetch URL** in `fetchWalletStats()`:
   ```tsx
   const response = await fetch(`https://your-api.com/wallet/${address}`);
   ```

2. **Modify data processing** if needed:
   ```tsx
   const data = await response.json();
   // Transform data if necessary
   setStats(data);
   ```

## 🖼️ Image Export

The image export feature uses `html2canvas` to capture the statistics card:

### How it works:
1. Temporarily hides the "Save" button
2. Captures the card DOM element as canvas
3. Converts to PNG and triggers download
4. Restores the button visibility

### Customizing Export:
```tsx
const canvas = await html2canvas(element, {
  backgroundColor: '#000000',
  scale: 2, // Higher resolution
  useCORS: true,
  width: element.offsetWidth,
  height: element.offsetHeight,
});
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: Single column layout
- **Tablet**: 2-column grid for metrics
- **Desktop**: Full layout with optimal spacing

Key responsive classes:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
```

## 🔧 Development



### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

The project includes:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Consistent formatting** with Prettier-compatible rules

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to Netlify or connect your Git repository.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Add TypeScript types for new features
- Test thoroughly before submitting
- Update documentation for new features

## 📄 License

This project is not licensed. Feel free to use it as you want.

## 🆘 Support

- **Telegram**: @smorchkov_m
- **X**: https://x.com/3xcalibur_dev
- **Email**: mikhail@smorchkov.online

## 🙏 Acknowledgments

- **Liquid Launch** for providing the wallet analytics API
- **Tailwind CSS** for the beautiful styling system
- **Lucide React** for the clean, modern icons
- **React community** for the amazing ecosystem

---

**Made with ❤️ for the Liquid Launch community** 