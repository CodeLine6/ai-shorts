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
- **🎶 Background Music Selection**: Choose from a variety of background music tracks to enhance your videos.
- **🛡️ Admin Dashboard**: Comprehensive dashboard for managing users, videos, referrals, and revenue.
- **🤝 Referral System**: Earn rewards by referring new users to the platform.

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Modern component library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Convex** - Real-time database and backend-as-a-service
- **Supabase** - Authentication and file storage
- **NextAuth.js** - Authentication framework

### AI & Media Processing
- **Google Gemini AI** - Script generation
- **OpenAI API** - Additional AI capabilities
- **A4F** - Additional AI capabilities
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
  - Convex (can be self-hosted or cloud-based)
  - A4F
  - Netlify Trigger Secret

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
   # Convex Database (Choose one: self-hosted or cloud-based)
   # For self-hosted:
   CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210
   CONVEX_SELF_HOSTED_ADMIN_KEY=your_convex_self_hosted_admin_key
   NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
   # For cloud-based:
   # NEXT_PUBLIC_CONVEX_URL=your_convex_cloud_url
   # CONVEX_DEPLOYMENT=your_convex_deployment

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000 # Or your production URL

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_STORAGE_URL=your_supabase_storage_url
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # AI APIs
   GEMINI_API_KEY=your_gemini_api_key
   ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
   GLADIA_API_KEY=your_gladia_api_key
   A4F_API_KEY=your_a4f_api_key

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

   # Netlify
   NETLIFY_TRIGGER_SECRET=your_netlify_trigger_secret
   ```

4. **Install Netlify CLI**
   ```bash
   npm install netlify-cli -g
   ```

5. **Set up Convex database**
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
├── docs/                      # Project documentation
├── netlify/                   # Netlify functions and configuration
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
- `GET /api/check-referral-code` - Check referral code validity
- `GET /api/check-username-unique` - Check if username is unique
- `POST /api/update-profile/[username]` - Update user profile
- `POST /api/update-profile/verify-email` - Verify email for profile updates
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication routes

## 🛡️ Admin Features

The admin dashboard provides powerful tools for platform management:

- **User Management**: View, edit, and manage user accounts.
- **Video Oversight**: Monitor generated videos and their status.
- **Referral Tracking**: Track referral codes and their performance.
- **Revenue Monitoring**: Keep an eye on credit purchases and overall revenue.

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

### Deploy to Netlify

1.  **Install Netlify CLI** (if not already installed):
    ```bash
    npm install netlify-cli -g
    ```
2.  **Login to Netlify**:
    ```bash
    netlify login
    ```
3.  **Configure Netlify**:
    ```bash
    netlify init
    ```
    Follow the prompts to link your project to a new or existing Netlify site. Ensure the build command is `npm run build` and the publish directory is `out` (or `.next` if not using `next export`).
4.  **Deploy**:
    ```bash
    netlify deploy --prod
    ```
    This will deploy your site to production.

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
