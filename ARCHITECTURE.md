# Brackets - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React PWA)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │  Contexts    │      │
│  │              │  │              │  │              │      │
│  │ - Home       │  │ - Dashboard  │  │ - Auth       │      │
│  │ - Dashboard  │  │ - Circles    │  │ - Notify     │      │
│  │ - Circles    │  │ - Parent     │  └──────────────┘      │
│  │ - AI Tutor   │  │ - Sponsor    │                        │
│  └──────────────┘  └──────────────┘                        │
│         │                  │                │               │
│         └──────────────────┴────────────────┘               │
│                        │                                    │
│              ┌─────────▼─────────┐                         │
│              │   Services Layer   │                         │
│              │                    │                         │
│              │ - authService      │                         │
│              │ - learningService  │                         │
│              │ - circleService    │                         │
│              │ - notifyService    │                         │
│              └─────────┬──────────┘                         │
│                        │                                    │
│              ┌─────────▼─────────┐                         │
│              │   Config Layer     │                         │
│              │                    │                         │
│              │ - Supabase Client  │                         │
│              │ - Gemini Client    │                         │
│              └─────────┬──────────┘                         │
└────────────────────────┼──────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│    SUPABASE      │         │   GEMINI AI      │
│                  │         │                  │
│ - PostgreSQL DB  │         │ - Recommendations│
│ - Authentication │         │ - Quiz Feedback  │
│ - Realtime       │         │ - Content Gen    │
│ - Storage        │         └──────────────────┘
└──────────────────┘
```

---

## 🔄 Data Flow Patterns

### 1. User Authentication Flow
```
User Input → AuthService → Supabase Auth → JWT Token → AuthContext
                                              ↓
                                         Update UI
```

### 2. Real-time Notification Flow
```
Trigger Event → Supabase Insert → Realtime Channel → NotificationContext
                                                            ↓
                                                    Update Badge Count
                                                            ↓
                                                    Render Notification
```

### 3. AI Recommendation Flow
```
User Progress → LearningService → Aggregate Data → Gemini API
                                                        ↓
                                                  Generate Recs
                                                        ↓
                                                   Return JSON
                                                        ↓
                                               Display in Dashboard
```

### 4. Village Circle Chat Flow
```
User Types → Message Input → CircleService → Supabase Insert
                                                    ↓
                                            Realtime Broadcast
                                                    ↓
                                            All Circle Members
                                                    ↓
                                            Update Chat UI
```

---

## 📊 Database Schema Relationships

```
users (auth)
    │
    ├─→ user_progress ──→ learning_modules
    ├─→ quiz_submissions ──→ learning_modules
    ├─→ notifications
    ├─→ circle_members ──→ village_circles
    │       │
    │       └─→ circle_messages ──→ village_circles
    └─→ user_activities
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  - Input Validation                     │
│  - XSS Prevention                       │
│  - CSRF Protection                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         API Layer (Supabase)            │
│  - JWT Authentication                   │
│  - API Key Validation                   │
│  - Rate Limiting                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database Layer                  │
│  - Row Level Security (RLS)             │
│  - Policies per Table                   │
│  - User-scoped Queries                  │
└─────────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
App
├─ AuthProvider
│  └─ NotificationProvider
│     ├─ NotificationBell (Global)
│     └─ Routes
│        ├─ Home
│        ├─ Brackets
│        ├─ Events
│        ├─ AI_Assistant
│        ├─ LearningDashboard
│        │  ├─ StatsCard
│        │  ├─ AIRecommendationPanel
│        │  ├─ ModuleCard
│        │  └─ CategoryFilter
│        ├─ VillageCircles
│        │  ├─ VillageCircleCard
│        │  └─ CircleChat
│        │     ├─ Leaderboard
│        │     ├─ MessageList
│        │     └─ MessageInput
│        ├─ ParentDashboard
│        │  ├─ LearnerCard
│        │  └─ LearnerDetail
│        │     ├─ StatsSection
│        │     ├─ ProgressSection
│        │     └─ ActivitySection
│        └─ SponsorBoard
│           ├─ SponsorCard
│           └─ ContributionForm
└─ Navigation
```

---

## 🚀 Request/Response Cycle

### Example: Send Chat Message

```
1. User types message in VillageCircles component
   ↓
2. Component calls sendCircleMessage() from service
   ↓
3. Service formats data and calls Supabase client
   ↓
4. Supabase validates JWT token
   ↓
5. Database checks RLS policies
   ↓
6. Message inserted into circle_messages table
   ↓
7. Realtime engine broadcasts to all subscribers
   ↓
8. All circle members' clients receive update
   ↓
9. NotificationContext updates state
   ↓
10. React re-renders message list
```

---

## 🎨 State Management

```
┌──────────────────────────────────────┐
│         Global State                 │
│  (Context API)                       │
│                                      │
│  ┌────────────────┐                 │
│  │  AuthContext   │                 │
│  │  - user        │                 │
│  │  - profile     │                 │
│  │  - loading     │                 │
│  └────────────────┘                 │
│                                      │
│  ┌────────────────┐                 │
│  │NotifyContext   │                 │
│  │- notifications │                 │
│  │- unreadCount   │                 │
│  │- markAsRead    │                 │
│  └────────────────┘                 │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│        Component State               │
│  (useState, useEffect)               │
│                                      │
│  - Loading states                    │
│  - Form inputs                       │
│  - UI toggles                        │
│  - Local data                        │
└──────────────────────────────────────┘
```

---

## 🔄 Real-time Subscriptions

```
Component Mount
    ↓
Subscribe to Supabase Channel
    ↓
Listen for Changes
    │
    ├─→ INSERT event → Add new item to state
    ├─→ UPDATE event → Update existing item
    └─→ DELETE event → Remove item from state
    ↓
Component Unmount
    ↓
Unsubscribe & Cleanup
```

---

## 📱 PWA Architecture

```
Browser Request
    ↓
Service Worker Intercept
    ↓
Check Cache
    │
    ├─ Cache Hit → Return Cached Response
    │
    └─ Cache Miss → Fetch from Network
                        ↓
                   Cache Response
                        ↓
                   Return to Browser
```

---

## 🧩 Module Structure

```
src/
├── config/           # Configuration & clients
│   ├── supabase.js   # Database client
│   └── gemini.js     # AI client
│
├── contexts/         # Global state providers
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
│
├── services/         # Business logic
│   ├── authService.js
│   ├── learningService.js
│   ├── villageCircleService.js
│   └── notificationService.js
│
├── components/       # Reusable UI components
│   ├── LearningDashboard.jsx
│   ├── VillageCircles.jsx
│   ├── ParentDashboard.jsx
│   ├── SponsorBoard.jsx
│   ├── NotificationBell.jsx
│   └── Navigation.jsx
│
├── pages/           # Route components
│   ├── Home.jsx
│   ├── Brackets.jsx
│   ├── Courses.jsx
│   ├── Events.jsx
│   └── Ai_Assistant.jsx
│
└── App.jsx          # Root component
```

---

## 🔌 External Integrations

```
Brackets PWA
    ↓
┌───────────────────────────────────┐
│                                   │
│  ┌─────────────┐  ┌────────────┐ │
│  │  Supabase   │  │ Gemini AI  │ │
│  │             │  │            │ │
│  │ - Database  │  │ - Generate │ │
│  │ - Auth      │  │ - Analyze  │ │
│  │ - Realtime  │  │ - Feedback │ │
│  │ - Storage   │  └────────────┘ │
│  └─────────────┘                 │
│                                   │
│  ┌─────────────┐  ┌────────────┐ │
│  │   Vercel    │  │   Other    │ │
│  │  Insights   │  │  Services  │ │
│  └─────────────┘  └────────────┘ │
│                                   │
└───────────────────────────────────┘
```

---

## 🎯 Performance Optimizations

```
Code Splitting
    ↓
Lazy Load Components
    ↓
Bundle Optimization
    ↓
Tree Shaking
    ↓
Minification
    ↓
Compression (gzip)
    ↓
CDN Distribution
    ↓
Browser Caching
    ↓
Service Worker Caching
```

---

## 🔒 Authentication Flow

```
User Sign In
    ↓
Credentials → Supabase Auth
    ↓
JWT Token Generated
    ↓
Token Stored in Browser
    ↓
Auto-included in Requests
    ↓
Server Validates Token
    ↓
RLS Policies Applied
    ↓
User-specific Data Returned
```

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Real-time capabilities
- ✅ AI integration
- ✅ PWA features
- ✅ Mobile-first design
