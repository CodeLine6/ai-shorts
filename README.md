# AI Shorts Generator 🎬

An intelligent video creation platform that automatically generates engaging short-form videos using AI-powered script generation, voice synthesis, and dynamic visual styles.

## ✨ Features

- **🤖 AI Script Generation**: Powered by Google Gemini AI for creative and engaging content
- **🎨 Multiple Video Styles**: Choose from 7 unique visual styles:
  - 3D Animation
  - Traditional Animation
  - Cinematic
  - Cyberpunk
  - GTA-style
  - Realistic
  - Watercolor
- **🎤 AI Voice Synthesis**: Integrated with ElevenLabs for natural-sounding narration
- **📝 Smart Captions**: Automatic caption generation with precise timing
- **🎥 Video Rendering**: High-quality video output using Remotion and Google Cloud Run
- **💳 Credit System**: Flexible credit-based usage model
- **🔐 User Authentication**: Secure user management with verification
- **💰 Payment Integration**: PayPal integration for credit purchases
- **📊 Dashboard**: Intuitive interface for managing videos and account

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Modern component library
- **React Hook Form** - Form management

### Backend & Database
- **Convex** - Real-time database and backend-as-a-service
- **Supabase** - Authentication and file storage
- **NextAuth.js** - Authentication framework

### AI & Media Processing
- **Google Gemini AI** - Script generation
- **OpenAI API** - Additional AI capabilities
- **ElevenLabs** - Text-to-speech synthesis
- **Remotion** - Programmatic video creation
- **Google Cloud Run** - Video rendering infrastructure

### Additional Services
- **Inngest** - Background job processing
- **Resend** - Transactional emails
- **PayPal API** - Payment processing
- **Gladia API** - Audio processing

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- API keys for the following services:
  - Google Gemini AI
  - ElevenLabs
  - Supabase
  - PayPal
  - Resend
  - Convex

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeLine6/ai-shorts.git
   cd ai-shorts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Convex Database
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOYMENT=your_convex_deployment

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

   # AI APIs
   GEMINI_API_KEY=your_gemini_api_key
   ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
   GLADIA_API_KEY=your_gladia_api_key

   # Email Service
   NEXT_PUBLIC_RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_EMAIL_FROM=your_email_address
   NEXT_PUBLIC_APP_NAME="AI Shorts"

   # Payment
   PAYPAL_CLIENT_ID=your_paypal_client_id

   # Google Cloud (for video rendering)
   REMOTION_GCP_PRIVATE_KEY=your_gcp_private_key
   REMOTION_GCP_CLIENT_EMAIL=your_gcp_client_email
   REMOTION_GCP_PROJECT_ID=your_gcp_project_id
   GCP_SERVICE_URL=your_cloud_run_url
   GCP_SERVE_URL=your_serve_url
   ```

4. **Set up Convex database**
   ```bash
   npx convex dev
   ```

5. **Build Remotion CSS**
   ```bash
   npm run remotion:build-css
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Usage

### Creating Your First Video

1. **Sign up** for an account and verify your email
2. **Navigate** to the "Create New Video" section
3. **Choose your topic** or let AI generate ideas
4. **Select video style** from available options
5. **Pick a voice** for narration
6. **Customize captions** style
7. **Generate video** and wait for processing
8. **Download** your completed video

### Credit System

- Each video generation consumes credits
- Purchase credits through PayPal integration
- Monitor usage in your dashboard

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (main)/            # Main application
│   │   │   └── dashboard/     # User dashboard
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   ├── config/                # Configuration files
│   ├── lib/                   # Utility libraries
│   └── schemas/               # Zod validation schemas
├── convex/                    # Convex database schema
├── remotion/                  # Video generation templates
└── public/                    # Static assets
```

## 🔌 API Routes

### Core Endpoints

- `POST /api/generate-scripts` - Generate AI scripts
- `POST /api/generate-video-data` - Create video data
- `GET /api/get-voice-options` - Fetch available voices
- `POST /api/test-tts` - Test text-to-speech
- `POST /api/remotion-webhook` - Handle render webhooks

### Authentication

- `POST /api/sign-up` - User registration
- `POST /api/forget-password` - Password reset
- `POST /api/verify-code` - Email verification

## 🌐 Deployment

### Prerequisites for Production

1. **Set up Google Cloud Platform**
   - Enable Cloud Run API
   - Create service account with necessary permissions
   - Set up Cloud Storage bucket

2. **Configure Remotion Cloud**
   - Deploy Remotion bundle to Cloud Run
   - Set up webhook endpoints

3. **Environment Setup**
   - Update all environment variables for production
   - Configure domain and NEXTAUTH_URL

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Deploy to Other Platforms

The application can be deployed to any Node.js hosting platform that supports Next.js applications.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is private and proprietary. All rights reserved.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/CodeLine6/ai-shorts)
- **Issues**: [GitHub Issues](https://github.com/CodeLine6/ai-shorts/issues)

## 📞 Support

For support, email support@aishorts.com or join our Discord server.

---

Built with ❤️ using Next.js, Convex, and the power of AI
