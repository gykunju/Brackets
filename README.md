# Brackets: Community-Powered Learning Platform 🎓

A Progressive Web App (PWA) that empowers learners through community-driven education, AI-powered personalization, and real-time collaboration.

## 🌟 Key Features

### 1. **Real-Time Notifications**
- In-app push-style notifications for quiz results, new content, and peer messages
- Powered by Supabase real-time subscriptions
- Browser notifications support

### 2. **Village Learning Circles** 👥
- Small collaborative learning groups
- Peer-to-peer teaching with a reward system
- Real-time chat and discussion
- Teaching points leaderboard to gamify helping others

### 3. **AI-Powered Personalization** 🤖
- Gemini AI integration for adaptive learning recommendations
- Instant quiz feedback with explanations
- Personalized content suggestions based on performance
- Smart study tips tailored to each learner

### 4. **Comprehensive Dashboards**
- **Learning Dashboard**: Track progress, view AI recommendations, browse modules
- **Parent/Guardian Dashboard**: Monitor learner progress and activities
- **Sponsor Board**: Community contributions from local businesses and diaspora

### 5. **Learning Modules**
- Curriculum (Core subjects)
- Financial Literacy
- Digital Skills
- Agriculture
- Progress tracking with completion percentages

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + JavaScript
- **Styling**: TailwindCSS 4
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **AI**: Google Gemini API
- **PWA**: Service Worker + Web Manifest
- **Routing**: React Router v7

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Brackets
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up Supabase database**
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy and execute the SQL from `SUPABASE_SETUP.md`
- Enable realtime for `notifications` and `circle_messages` tables

5. **Run the development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
npm run preview
```

## 📱 PWA Installation

The app can be installed on mobile devices and desktops:
1. Visit the deployed URL
2. Look for "Install" or "Add to Home Screen" prompt
3. Follow the browser-specific installation steps

## 🗂️ Project Structure

```
Brackets/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Service worker for offline support
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── LearningDashboard.jsx    # Main learning interface
│   │   ├── VillageCircles.jsx       # Peer learning circles
│   │   ├── ParentDashboard.jsx      # Parent/guardian view
│   │   ├── SponsorBoard.jsx         # Community sponsors
│   │   ├── NotificationBell.jsx     # Notification UI
│   │   └── Navigation.jsx           # Bottom navigation
│   ├── contexts/
│   │   ├── AuthContext.jsx          # Authentication state
│   │   └── NotificationContext.jsx  # Notification management
│   ├── services/
│   │   ├── authService.js           # Authentication logic
│   │   ├── learningService.js       # Learning & progress
│   │   ├── villageCircleService.js  # Circle management
│   │   └── notificationService.js   # Notification system
│   ├── config/
│   │   ├── supabase.js              # Supabase client
│   │   └── gemini.js                # Gemini AI client
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Brackets.jsx
│   │   ├── Courses.jsx
│   │   ├── Events.jsx
│   │   └── Ai_Assistant.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── SUPABASE_SETUP.md          # Database setup guide
├── package.json
└── README.md
```

## 🎯 Core Functionality

### Authentication
- Sign up / Sign in with email and password
- User profiles with roles (learner, teacher, parent, admin)
- Session management with Supabase Auth

### Learning Management
- Browse modules by category
- Track progress (0-100%)
- Take quizzes with AI-powered feedback
- View personalized recommendations

### Village Circles
- Create and join learning circles
- Real-time chat with circle members
- Mark messages as "teaching" to earn points
- Vote helpful messages to award points
- Leaderboard showing top teachers

### Notifications
- Quiz result notifications
- New content alerts
- Peer messages
- Circle invitations
- Achievement unlocks
- Teaching point awards

### AI Features
- Adaptive learning recommendations based on performance
- Instant quiz feedback with explanations
- Content personalization
- Study tips tailored to learning style

## 🔐 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Users can only access their own data
- Secure API key management through environment variables
- Authentication required for all protected routes

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app works on any static hosting platform:
- Netlify
- GitHub Pages
- Firebase Hosting
- Cloudflare Pages

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **Google Gemini** for AI capabilities
- **TailwindCSS** for beautiful styling
- **React Icons** for comprehensive icon library

## 📞 Support

For support, email support@brackets.edu or join our community circle!

---

Built with ❤️ for community-powered learning+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
