# 💰 Coach Finance App

> Your Personal Finance Coach - Track, Budget, and Achieve Your Financial Goals

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://vipultallekar.in)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://vercel.com)

## 🌟 Features

### 🔐 Authentication & Security
- **Google Sign-In**: One-click authentication with your Google account
- **Email/Password**: Traditional authentication method
- **Cloud Sync**: Access your data from any device
- **Secure Storage**: All data encrypted and protected

### 💸 Money Management
- **Transaction Tracking**: Log income and expenses
- **Smart Categories**: Organize spending by category
- **Budget Management**: Set and track budgets
- **Expense Analysis**: Visualize spending patterns

### 📊 Financial Insights
- **Interactive Charts**: Beautiful visualizations of your finances
- **Spending Trends**: Track how your spending changes over time
- **Category Breakdown**: See where your money goes
- **Monthly Reports**: Comprehensive financial summaries

### 🎯 Goal Setting
- **Financial Goals**: Set and track savings goals
- **Progress Tracking**: Visual progress indicators
- **Milestone Celebrations**: Celebrate achievements
- **Smart Recommendations**: Smart goal suggestions

### 📚 Learning Center
- **Financial Tips**: Expert advice on money management
- **Educational Content**: Learn about personal finance
- **Best Practices**: Proven strategies for saving

### 🎨 Beautiful UI/UX
- **Modern Design**: Gradient backgrounds and smooth animations
- **Dark Mode**: Full dark mode support
- **Responsive**: Works perfectly on all devices
- **Accessible**: WCAG compliant

## 🚀 Live Demo

**Visit the app**: [https://vipultallekar.in](https://vipultallekar.in)

## 📸 Screenshots

### Login Page
Beautiful authentication page with Google Sign-In and email/password options.

### Dashboard
Quick overview of your financial health with actionable insights.

### Money Tracker
Easily add and categorize transactions with a clean interface.

### Insights
Visual analytics to understand your spending patterns.

### Goals
Set and track your financial goals with progress indicators.

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend & Services
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Static hosting

### Deployment
- **Vercel** - Frontend hosting
- **Firebase** - Backend services

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/coach-finance-app.git
cd coach-finance-app
```

2. **Install dependencies**
```bash
cd webapp
npm install
```

3. **Configure Firebase**
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication (Google & Email/Password)
- Enable Cloud Firestore
- Copy your Firebase config to `src/lib/firebase.ts`

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication providers:
   - Google Sign-In
   - Email/Password
3. Create a Firestore database
4. Update security rules (see `firestore.rules`)
5. Add your Firebase config to `src/lib/firebase.ts`

### Environment Variables

Create `.env.local`:
```env
VITE_BACKEND_URL=your_backend_url
```

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started quickly
- **[Authentication Guide](AUTHENTICATION_GUIDE.md)** - Developer documentation
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Feature overview
- **[Authentication Flow](AUTHENTICATION_FLOW.md)** - Visual diagrams

## 🗂️ Project Structure

```
Coach/
├── webapp/                  # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities & configs
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Dependencies
├── backend/                # Backend services (optional)
├── firebase.json           # Firebase configuration
├── firestore.rules         # Security rules
└── README.md              # This file
```

## 🔐 Security

- **Authentication**: Secure OAuth 2.0 and password hashing
- **Data Isolation**: Users can only access their own data
- **Firestore Rules**: Strict security rules enforced
- **HTTPS**: All communication encrypted
- **No Data Sharing**: Your data is private

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Firebase Hosting (Optional)

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vipul Talekar**
- Email: vipultalekar607@gmail.com
- GitHub: [@vipultalekar](https://github.com/vipultalekar)

## 🙏 Acknowledgments

- Firebase for backend services
- Vercel for hosting
- Radix UI for accessible components
- Tailwind CSS for styling utilities
- Recharts for data visualization

## 📈 Roadmap

### Upcoming Features
- [ ] Email verification
- [ ] Password reset flow
- [ ] Profile pictures
- [ ] Social sharing
- [ ] Push notifications
- [ ] Offline mode
- [ ] Data export (CSV/PDF)
- [ ] Two-factor authentication
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Investment tracking
- [ ] Multi-currency support
- [ ] Family sharing
- [ ] Financial advisor chat

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea? Open an issue with the `enhancement` label!

## 📞 Support

Need help? Contact us:
- Email: vipultalekar607@gmail.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/coach-finance-app/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by Vipul Talekar**

**Live at**: [https://vipultallekar.in](https://vipultallekar.in)
