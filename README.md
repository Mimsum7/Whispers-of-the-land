# 🌍 Whispers of the Land - African Folklore Digital Library

A beautiful, modern web application dedicated to preserving and sharing African folklore stories in their original languages alongside English translations. Built with React, TypeScript, and Supabase.

![Whispers of the Land](https://images.pexels.com/photos/6969141/pexels-photo-6969141.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 📚 Story Library
- **Bilingual Stories**: View stories in their original African languages with English translations
- **Rich Media Support**: Audio narrations and illustrations enhance the storytelling experience
- **Advanced Filtering**: Search and filter by country, language, theme, or keywords
- **Responsive Design**: Beautiful, accessible interface that works on all devices

### 🎯 Story Management
- **Community Submissions**: Anyone can contribute stories to preserve cultural heritage
- **Moderation System**: Admin panel for reviewing and approving submitted content
- **File Uploads**: Support for audio files (native and English narrations) and illustrations
- **Metadata Rich**: Comprehensive story information including contributor details and themes

### 🎨 Design Excellence
- **African-Inspired Design**: Custom color palette and patterns reflecting African aesthetics
- **Premium UI/UX**: Apple-level design attention to detail with smooth animations
- **Accessibility First**: WCAG compliant with proper contrast ratios and keyboard navigation
- **Performance Optimized**: Fast loading with optimized images and efficient data fetching

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework with custom African-inspired theme
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, consistent icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Row Level Security (RLS)** - Secure data access policies
- **Real-time subscriptions** - Live updates for admin panel
- **File Storage** - Secure storage for audio files and illustrations

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Common/          # Shared components (PatternBorder, etc.)
│   ├── Layout/          # Layout components (Header, Footer)
│   └── Story/           # Story-specific components
├── pages/               # Page components
│   ├── HomePage.tsx     # Main story library
│   ├── StoryPage.tsx    # Individual story view
│   ├── SubmitStoryPage.tsx # Story submission form
│   └── AdminPage.tsx    # Admin moderation panel
├── lib/                 # Utility libraries
│   └── supabase.ts      # Supabase client configuration
├── types/               # TypeScript type definitions
└── index.css           # Global styles and Tailwind imports
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/whispers-of-the-land.git
cd whispers-of-the-land
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
The project includes Supabase migrations in the `supabase/migrations/` directory:

- `20250629160923_red_bread.sql` - Initial database schema
- `20250629163422_summer_union.sql` - Security policies
- `20250629164607_pink_spire.sql` - Schema updates

Apply these migrations to your Supabase project.

### 5. Storage Buckets
Create the following storage buckets in your Supabase project:
- `audio` - For audio narrations
- `illustrations` - For story illustrations

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📊 Database Schema

### Stories Table
```sql
stories (
  id uuid PRIMARY KEY,
  title text NOT NULL,                    -- Native language title
  title_english text NOT NULL,            -- English title
  country text NOT NULL,                  -- African country
  language text NOT NULL,                 -- Native language
  theme text NOT NULL,                    -- Story theme/category
  native_text text NOT NULL,              -- Story in native language
  english_text text NOT NULL,             -- English translation
  contributor text NOT NULL,              -- Contributor name
  contributor_email text NOT NULL,        -- Contributor email
  native_audio_url text,                  -- Native audio file URL
  english_audio_url text,                 -- English audio file URL
  illustration_url text,                  -- Illustration image URL
  is_approved boolean DEFAULT false,      -- Moderation status
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### Security Policies
- **Public Access**: Anyone can read approved stories
- **Submissions**: Anyone can submit stories (pending approval)
- **Contributors**: Can view their own submissions
- **Admin**: Full access for moderation (implement proper admin auth)

## 🌍 Supported Countries & Languages

### Countries (54 African Nations)
Algeria, Angola, Benin, Botswana, Burkina Faso, Burundi, Cabo Verde, Cameroon, Central African Republic, Chad, Comoros, Congo (Brazzaville), Congo (Kinshasa), Côte d'Ivoire, Djibouti, Egypt, Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali, Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria, Rwanda, São Tomé and Príncipe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa, South Sudan, Sudan, Tanzania, Togo, Tunisia, Uganda, Zambia, Zimbabwe

### Languages
Shona, Ndebele, Swahili, Yoruba, Igbo, Hausa, Amharic, Zulu, Xhosa, Afrikaans, Twi, Fon

### Themes
Wisdom, Animals, Tricksters, Origin Myths, Love Stories, Heroic Tales, Morality, Nature

## 🎨 Design System

### Color Palette
- **Ochre**: Primary brand color inspired by African earth tones
- **Clay**: Secondary color for accents and highlights  
- **Forest**: Deep greens representing African landscapes
- **Cream**: Warm neutrals for backgrounds and text

### Typography
- **Headings**: Georgia serif font for traditional, storytelling feel
- **Body**: System fonts for optimal readability
- **Hierarchy**: Clear typographic scale with proper line heights

### Components
- **PatternBorder**: Decorative component with African-inspired patterns
- **AudioPlayer**: Custom audio player with download functionality
- **FilterPanel**: Advanced filtering interface
- **StoryCard**: Beautiful story preview cards

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
The project is optimized for Netlify deployment:
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🤝 Contributing

We welcome contributions to help preserve African folklore! Here's how you can help:

### Story Contributions
1. Visit the "Submit Story" page
2. Fill out the comprehensive form with story details
3. Optionally upload audio narrations and illustrations
4. Submit for review by our moderation team

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity (max 300 lines per file)
- Use semantic HTML and ARIA labels for accessibility
- Write descriptive commit messages
- Test on multiple devices and browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **African Storytellers**: The keepers of oral traditions whose stories we aim to preserve
- **Contributors**: Community members sharing their cultural heritage
- **Pexels**: Stock photography for illustrations
- **Supabase**: Backend infrastructure and database
- **Tailwind CSS**: Styling framework
- **Lucide**: Icon library

## 📞 Support

For questions, suggestions, or support:
- Create an issue on GitHub
- Contact the maintainers
- Join our community discussions

---

**Whispers of the Land** - Preserving African storytelling heritage for future generations 🌍✨

*Made with ❤️ for African storytelling heritage*

[![Powered by Bolt.new](https://img.shields.io/badge/Powered%20by-Bolt.new-blue)](https://bolt.new/)