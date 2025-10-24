# Brackets - AI-Powered Study Management Platform

A modern, intelligent study management application that helps students organize their coursework, upload study materials, and get AI-powered assistance.

![Brackets](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green)
![Gemini](https://img.shields.io/badge/Gemini-AI-orange)

## Features

### 📚 Study Organization
- **Brackets**: Organize your study periods (semesters, terms, quarters)
- **Units**: Break down each bracket into manageable topics or chapters
- **Content Upload**: Upload PDFs and images as study materials to each unit
- **Events & Calendar**: Track exams, assignments, and important dates

### 🤖 AI-Powered Assistant
- **Context-Aware AI**: Powered by Google Gemini, understands your brackets, units, and content
- **Image Analysis**: Upload and analyze study material images
- **Personalized Help**: Get study plans, summaries, and assistance based on your actual coursework
- **Smart References**: AI can specifically reference your uploaded content and study structure

### 🔐 Secure & Real-time
- **Authentication**: Secure email/password authentication via Supabase
- **Real-time Sync**: Changes sync instantly across devices
- **Row-Level Security**: Your data is protected and isolated
- **File Storage**: Secure cloud storage for your study materials

### 🎨 Modern UI/UX
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Smooth Animations**: Powered by Framer Motion
- **PWA Support**: Install as an app on any device
- **Offline-Ready**: Service worker for offline functionality

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time, Storage, Auth)
- **AI**: Google Gemini 1.5 Flash
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Routing**: React Router 7

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd brackets
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

4. **Set up Supabase database and storage**

   Follow the detailed instructions in [SETUP.md](./SETUP.md) to:
   - Create database tables
   - Set up Row Level Security policies
   - Create storage bucket for file uploads
   - Configure storage policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## Complete Setup Guide

For detailed setup instructions including database schema, RLS policies, and storage configuration, see **[SETUP.md](./SETUP.md)**.

## Usage

### 1. Create an Account
Sign up with your email and password.

### 2. Create a Bracket
Add a bracket for your study period (e.g., "Fall 2025", "Semester 1").

### 3. Add Units
Click on a bracket to add units/topics (e.g., "Mathematics", "Physics").

### 4. Upload Content
Click "Upload Content" on any unit to upload PDFs or images of your study materials.

### 5. Use the AI Assistant
Navigate to the AI Assistant tab and:
- Ask questions about your studies
- Request study plans based on your brackets
- Upload images for analysis
- Get help with specific units or topics

## Example AI Prompts

- "What brackets do I have?"
- "Give me a study plan for my current semester"
- "Create a revision schedule for my exams next week"
- "Summarize the content I uploaded for Unit 1"
- Upload an image: "Explain this diagram"

## Project Structure

```
brackets/
├── src/
│   ├── components/          # Reusable components
│   │   ├── AppLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── Navigation.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Brackets.jsx
│   │   ├── Units.jsx
│   │   ├── Events.jsx
│   │   ├── Ai_Assistant.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   └── Signin.jsx
│   ├── context/            # Global state management
│   │   └── UserContext.jsx
│   ├── services/           # External services
│   │   └── geminiService.js
│   └── assets/             # Static assets
├── public/                 # Public assets
│   ├── service-worker.js
│   └── manifest.json
├── schema.sql              # Database schema reference
├── content_schema.sql      # Content table schema
├── SETUP.md               # Detailed setup guide
└── README.md              # This file
```

## Database Schema

The application uses 5 main tables:

1. **profile** - User profiles
2. **bracket** - Study periods
3. **unit** - Topics within brackets
4. **event** - Calendar events (exams, assignments)
5. **content** - Uploaded files (PDFs, images)

See [schema.sql](./schema.sql) and [content_schema.sql](./content_schema.sql) for details.

## Security

- **Row Level Security**: All tables have RLS enabled
- **Secure Storage**: Files are stored securely in Supabase Storage
- **Authentication**: Secure email/password authentication
- **Environment Variables**: Sensitive keys stored in `.env` (never committed)

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

The app is ready to deploy to:
- **Vercel** (recommended)
- **Netlify**
- **Any static hosting service**

Remember to:
1. Add environment variables to your hosting platform
2. Use production Supabase credentials
3. Build the app: `npm run build`

## Contributing

This is a personal study management project. Feel free to fork and customize for your needs!

## License

This project is for educational purposes.

## Support

For setup issues, see [SETUP.md](./SETUP.md) troubleshooting section.

## Acknowledgments

- **Supabase** for the amazing backend platform
- **Google** for Gemini AI
- **React** and **Vite** teams
- **Tailwind CSS** for the styling framework

---

**Built with ❤️ for students who want to study smarter, not harder.**
