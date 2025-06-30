# 🚀 AI Career Coach

> Your AI-powered companion for career success, built with cutting-edge technology and modern web development practices.

[![Built with Bolt.new](https://img.shields.io/badge/Built%20with-Bolt.new-blue?style=for-the-badge)](https://bolt.new)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

## ✨ Features

### 🎯 **Personalized Career Guidance**
- AI-powered career assessment and goal setting
- Tailored advice based on experience level and industry
- Step-by-step roadmaps for career advancement
- Real-time progress tracking

### 📄 **Intelligent Resume Analysis**
- Advanced PDF text extraction and analysis
- ATS optimization recommendations
- Skill gap identification
- Industry-specific feedback
- Comprehensive scoring system

### 🎤 **AI Video Interview Practice**
- Live video conversations with Tavus AI
- Role-specific interview scenarios
- Real-time feedback and performance scoring
- Practice for 8+ different job roles
- Mock interview session recording

### 📊 **Smart Dashboard**
- Real-time activity tracking
- Progress visualization
- Personalized insights and recommendations
- Achievement system
- Recent activity timeline

### 🔐 **Secure User Management**
- Email/password authentication via Supabase
- Row-level security (RLS) for data protection
- User profile management
- Secure data storage

## 🛠️ Technology Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Vite 5.4.2** - Lightning-fast build tool
- **React Router 6.8.1** - Client-side routing
- **Lucide React** - Beautiful icon library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Data protection
- **Edge Functions** - Serverless API endpoints

### **AI & External Services**
- **Gemini 1.5 Flash** - Advanced AI for career advice and resume analysis
- **Tavus AI** - Video conversation platform for mock interviews
- **PDF.js** - Client-side PDF text extraction
- **Pica API** - AI service integration

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Environment variables (see setup below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-career-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   PICA_SECRET_KEY=your_pica_secret_key
   PICA_GEMINI_CONNECTION_KEY=your_gemini_connection_key
   TAVUS_API_KEY=your_tavus_api_key
   TAVUS_PERSONA_ID=your_tavus_persona_id
   TAVUS_REPLICA_ID=your_tavus_replica_id
   ```

4. **Set up Supabase database**
   Run the migrations in your Supabase dashboard:
   ```sql
   -- Run the migration files in supabase/migrations/
   -- This will create the necessary tables and RLS policies
   ```

5. **Deploy Edge Functions**
   ```bash
   # Deploy the Supabase Edge Functions
   supabase functions deploy analyze-career-goals
   supabase functions deploy analyze-resume
   supabase functions deploy tavus-create-conversation
   supabase functions deploy tavus-end-conversation
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
ai-career-coach/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx   # Main navigation component
│   │   ├── ProtectedRoute.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── LoadingSpinner.tsx
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── DashboardPage.tsx # User dashboard
│   │   ├── CareerGoalsPage.tsx
│   │   ├── CareerAdvicePage.tsx
│   │   ├── ResumeUploadPage.tsx
│   │   ├── MockInterviewPage.tsx
│   │   └── auth/           # Authentication pages
│   ├── services/           # API and business logic
│   │   ├── careerAdviceService.ts
│   │   ├── resumeAnalysisService.ts
│   │   ├── tavusService.ts
│   │   ├── dashboardService.ts
│   │   └── pdfExtractor.ts
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   └── index.css           # Global styles and animations
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── analyze-career-goals/
│   │   ├── analyze-resume/
│   │   ├── tavus-create-conversation/
│   │   └── tavus-end-conversation/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── package.json
```

## 🎨 Design Philosophy

### **Apple-Level Aesthetics**
- Clean, sophisticated visual presentation
- Meticulous attention to detail
- Intuitive user experience
- Consistent design language

### **Modern UI/UX**
- Glassmorphism effects with backdrop blur
- Smooth animations and micro-interactions
- Responsive design for all devices
- Dark/light theme support
- Accessibility-first approach

### **Performance Optimized**
- Code splitting and lazy loading
- Optimized bundle sizes
- Fast loading times
- Smooth 60fps animations

## 🔧 Key Features Deep Dive

### **Career Goals Assessment**
- Multi-step form with validation
- Experience level categorization
- Challenge identification
- AI-powered personalized advice generation
- Progress tracking and goal management

### **Resume Analysis Engine**
- PDF text extraction using PDF.js
- AI-powered content analysis
- ATS optimization scoring
- Category-based feedback (Technical, Experience, Education, etc.)
- Actionable improvement recommendations

### **Mock Interview System**
- Integration with Tavus AI for live video conversations
- Role-specific interview scenarios
- Real-time conversation management
- Session recording and playback
- Performance analytics

### **Dashboard Analytics**
- Real-time activity tracking
- Progress visualization with animated charts
- Personalized insights and recommendations
- Achievement system with badges
- Recent activity timeline

## 🔐 Security & Privacy

- **Row Level Security (RLS)** - Users can only access their own data
- **Secure Authentication** - Email/password with Supabase Auth
- **Data Encryption** - All data encrypted in transit and at rest
- **Privacy First** - No data sharing with third parties
- **GDPR Compliant** - User data protection and rights

## 🚀 Deployment

### **Frontend Deployment (Netlify)**
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with build command: `npm run build`
4. Set publish directory: `dist`

### **Backend Deployment (Supabase)**
1. Create a Supabase project
2. Run database migrations
3. Deploy Edge Functions
4. Configure environment variables

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Follow accessibility guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bolt.new** - For the amazing AI-powered development platform
- **Supabase** - For the robust backend infrastructure
- **Tavus** - For the innovative AI video conversation technology
- **Google Gemini** - For the powerful AI language model
- **Tailwind CSS** - For the beautiful utility-first CSS framework

## 📞 Support

If you have any questions or need help:

- 📧 Email: sogobanwo@gmail.com

---

<div align="center">
  <p>Built with ❤️ using <a href="https://bolt.new">Bolt.new</a></p>
  <p>Empowering careers through AI technology</p>
</div>