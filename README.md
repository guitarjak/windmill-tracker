# Baby Tracker PWA ✨

A beautiful, dreamy Progressive Web App designed for tired parents at 3am. Track baby feeding and diaper changes with soft, cute aesthetics and super simple one-handed operation.

## ✨ Features

### 🌙 Designed for 3am
- **Soft pastel colors** - Easy on tired eyes
- **Twinkling star background** - Calming nighttime atmosphere
- **Large touch targets** - No precision needed with sleepy hands
- **One-handed operation** - Perfect for nursing moms
- **Time-aware greeting** - Changes throughout the day

### 🍼 Smart Single-Tap Tracking
- Select feeding amount (60ml, 90ml, 120ml, 150ml, 180ml, or custom)
- Select diaper type (pee, poop, or both)
- **ONE save button** sends everything in a single webhook
- Can track just feeding, just diaper, or both together

### 💫 Beautiful Baby-Themed UI
- Rounded, pillow-soft design
- Gentle glow effects on selected items
- Smooth animations throughout
- Custom "Fredoka" font for that nursery feel
- Automatically adapts to dark/light mode

### 📱 Progressive Web App
- Install on iPhone/Android like a native app
- Works offline (caches static files)
- Full screen mode (no browser UI)
- Optimized for iPhone 15 Pro Max

## 🎯 Perfect For

- Sleep-deprived parents tracking baby activities
- Quick logging during nighttime feeding
- One-handed operation while holding baby
- Sending data to Notion, Google Sheets, Airtable, or custom backend

## 🚀 Quick Start

### 1. Configure Your Webhook

Edit `js/app.js` (line 7):

```javascript
const WEBHOOK_URL = 'https://your-webhook-url.com/api/baby-tracker'
```

### 2. Deploy to GitHub Pages

```bash
cd /Users/guitar/Desktop/windmill-tracking-app

# Initialize git
git init
git add .
git commit -m "✨ Initial baby tracker PWA"

# Add your GitHub repo
git remote add origin https://github.com/yourusername/baby-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → Settings → Pages
2. Source: `main` branch, `/ (root)` folder
3. Save and wait ~2 minutes
4. Access at: `https://yourusername.github.io/baby-tracker/`

### 4. Install on Phone

**iOS:**
1. Open URL in Safari
2. Tap Share button (bottom middle)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open URL in Chrome
2. Tap menu (⋮)
3. Tap "Add to Home screen"
4. Tap "Add"

## 📊 Webhook Data Format

The app sends **ONE webhook** per save with this JSON structure:

### Example: Feeding Only
```json
{
  "timestamp": "2025-12-11T18:30:00.000Z",
  "feeding": {
    "amount": 120,
    "unit": "ml"
  }
}
```

### Example: Diaper Only
```json
{
  "timestamp": "2025-12-11T18:30:00.000Z",
  "diaper": {
    "type": "pee"
  }
}
```

### Example: Both Together
```json
{
  "timestamp": "2025-12-11T18:30:00.000Z",
  "feeding": {
    "amount": 90,
    "unit": "ml"
  },
  "diaper": {
    "type": "both"
  }
}
```

**Diaper types:** `"pee"`, `"poop"`, or `"both"`

## 🔧 Webhook Setup Options

### Option 1: Make.com (Easiest)
1. Create free account at [make.com](https://make.com)
2. Create new scenario with "Webhooks" → "Custom Webhook"
3. Copy webhook URL
4. Add modules to send data to Google Sheets, Notion, etc.

### Option 2: Zapier
1. Create new Zap
2. Trigger: "Webhooks by Zapier" → "Catch Hook"
3. Copy webhook URL
4. Add actions (Google Sheets, Airtable, etc.)

### Option 3: Google Apps Script
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet()
  const data = JSON.parse(e.postData.contents)

  const row = [
    data.timestamp,
    data.feeding ? data.feeding.amount : '',
    data.diaper ? data.diaper.type : ''
  ]

  sheet.appendRow(row)
  return ContentService.createTextOutput(JSON.stringify({success: true}))
}
```

### Option 4: Custom Backend (Node.js Example)
```javascript
const express = require('express')
const app = express()

app.use(express.json())

app.post('/api/baby-tracker', (req, res) => {
  const { timestamp, feeding, diaper } = req.body

  console.log('Received:', req.body)
  // Save to database here

  res.json({ success: true })
})

app.listen(3000)
```

Don't forget to enable CORS if using a custom backend!

## 🎨 Customization

### Change Color Theme

Edit `css/styles.css` (lines 23-27):

```css
--color-primary: #FFB3D9;      /* Soft pink */
--color-secondary: #A8D5FF;    /* Powder blue */
--color-accent: #FFD4A3;       /* Peachy */
--color-success: #B8E6D5;      /* Mint green */
```

### Add More Preset Amounts

Edit `index.html` around line 56, add more buttons:

```html
<button class="amount-btn" data-amount="210" type="button">
  <span class="amount-value">210</span>
  <span class="amount-unit">ml</span>
</button>
```

### Change Greeting Text

Edit `js/app.js` (lines 50-62) to customize greetings:

```javascript
greetingText.textContent = 'Hey there, Super Mom!'
```

## 📱 iPhone 15 Pro Max Optimizations

- **Safe area insets** for Dynamic Island
- **430x932 viewport** optimized layout
- **Bottom-heavy design** for thumb reach
- **Large 80-90px buttons** for easy tapping
- **Portrait orientation** locked
- **One-handed friendly** all controls in reach

## 🐛 Troubleshooting

### PWA won't install
- ✓ Check you're using HTTPS (GitHub Pages auto-enables)
- ✓ Clear browser cache
- ✓ Make sure all files are accessible
- ✓ Check manifest.json has correct paths

### Webhook not working
- ✓ Open browser DevTools (F12) → Console for errors
- ✓ Verify webhook URL is correct (check for typos)
- ✓ Test webhook URL with Postman/Insomnia first
- ✓ Check CORS settings on backend
- ✓ Ensure webhook accepts `Content-Type: application/json`

### Buttons not glowing when selected
- ✓ Check browser console for JavaScript errors
- ✓ Try hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on PC)
- ✓ Clear service worker cache in DevTools

### Custom amount not working
- ✓ Enter number between 1-500
- ✓ Press checkmark or Enter key to confirm
- ✓ Make sure keyboard is set to numeric input

## 🧪 Local Testing

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

**Note:** Some PWA features require HTTPS, so full testing is best on GitHub Pages.

## 📂 File Structure

```
windmill-tracking-app/
├── index.html              # Main app (single-page design)
├── manifest.json           # PWA config
├── sw.js                   # Service worker
├── css/
│   └── styles.css         # Soft nursery theme (680+ lines)
├── js/
│   └── app.js             # Single webhook logic
├── icons/
│   ├── icon-192x192.png   # PWA icon
│   └── icon-512x512.png   # PWA icon
├── generate_icons.py       # Icon generator script
└── README.md              # This file
```

## 🎯 User Flow

1. **Open app** → See time-appropriate greeting (Good morning/night)
2. **Select feeding** → Tap milk amount (or custom)
3. **Select diaper** → Tap pee/poop/both
4. **See summary** → Shows "🍼 120ml + 💧 Pee"
5. **Tap "Save Entry"** → ONE webhook sent
6. **See success toast** → "Saved successfully! ✨"
7. **Form resets** → Ready for next entry

## 💡 Design Decisions

### Why Single Webhook?
- Reduces backend complexity (one endpoint)
- Captures complete "feeding session" in one record
- Fewer network requests = faster for tired parents
- Easier to sync with databases (one row = one session)

### Why No History Display?
- Keeps UI focused and simple
- Reduces cognitive load at 3am
- Backend/dashboard is better for viewing history
- Saves mobile data and battery

### Why Soft Pastel Theme?
- Easy on tired eyes (especially at night)
- Calming colors reduce stress
- Baby-appropriate aesthetic
- Avoids harsh blues that disrupt sleep

### Why Large Buttons?
- iPhone 15 Pro Max = big screen, one-handed use
- No precision needed with sleepy coordination
- Reduces accidental taps
- Faster interaction = less time away from baby

## 🌟 Credits

- **Fonts:** [Fredoka](https://fonts.google.com/specimen/Fredoka) & [Nunito](https://fonts.google.com/specimen/Nunito) by Google Fonts
- **Design:** Inspired by dreamy nurseries and soft lullabies
- **Built with:** Pure HTML/CSS/JavaScript (no frameworks!)

## 📄 License

Free to use and modify for personal use. Made with 💗 for tired parents everywhere.

## 💬 Support

Questions? Issues?
- Check browser console for errors
- Verify webhook URL is correct
- Test with sample curl command first
- Review this README thoroughly

---

**Made for tired mamas at 3am who deserve beautiful, easy-to-use tools. You're doing great! 💗**
