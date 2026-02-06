# 🐾 PawCoach - Dog Training Mobile App

A comprehensive React Native dog training app built with Expo and Firebase. PawCoach helps dog owners create structured training routines with 15+ commands, track progress, manage schedules, and unlock achievements.

## ✨ Features

### 🔐 Authentication
- Secure user registration and login with Firebase Authentication
- Automatic session persistence
- Protected routes with auth checking

### 🐕 Dog Management
- Add unlimited dogs with photo uploads
- Store breed, age, and training history
- Track individual dog progress
- Switch between dogs seamlessly

### 📚 Training Programs
- **15+ professional training commands** across 3 difficulty levels:
  - **Basic**: Sit, Down, Stay, Come, Heel
  - **Manners**: Leave It, Drop It, Wait, Quiet, Off
  - **Advanced**: Shake, Roll Over, Spin, Play Dead, Fetch
- Detailed step-by-step instructions
- Pro tips and common mistakes for each command
- Estimated training time for every program

### ⏱️ Training Sessions
- Interactive session timer
- Pause/resume functionality
- Automatic progress saving
- Session completion tracking

### 📊 Progress Tracking
- Overall mastery percentage by dog
- Command-level progress (not started → learning → mastered)
- Consecutive training streaks with flame emoji 🔥
- Personal best streak tracking
- Total sessions completed counter

### 🗓️ Schedule Management
- Create recurring training schedules
- Set specific times for training reminders
- Enable/disable schedules as needed
- Multi-day scheduling support
- Delete old schedules

### 🏆 Achievements System
- 8 achievement types including:
  - First Training Session
  - Week Warrior (7-day streak)
  - Month Master (30-day streak)
  - Command Expert (5+ commands mastered)
  - Perfect Week (daily training)
  - And more!

### 🎨 Beautiful UI
- Warm, pet-friendly color palette
  - Orange primary (#FF8C42)
  - Teal secondary (#4ECDC4)
  - Golden accents (#FFD166)
- Clean, intuitive bottom tab navigation
- Responsive design for all screen sizes
- Smooth animations and transitions

## 🏗️ Architecture

### Tech Stack
- **React Native** with **Expo** (managed workflow)
- **TypeScript** for type safety
- **Firebase**:
  - Authentication (email/password)
  - Firestore (real-time database)
  - Storage (dog photo uploads)
  - Cloud Messaging (push notifications)
- **Expo Router** for file-based navigation
- **React Hooks** for state management

### Project Structure
```
pawcoach/
├── app/                          # Expo Router screens
│   ├── (auth)/                  # Authentication screens
│   ├── (tabs)/                  # Main tab screens
│   ├── dogs/                    # Dog management
│   ├── training/                # Training programs
│   └── schedule/                # Schedule management
├── components/                  # Reusable components
│   ├── ui/                      # Base UI components
│   └── custom/                  # Custom feature components
├── lib/                         # Firebase utilities
├── hooks/                       # Custom React hooks
├── context/                     # Context providers
├── constants/                   # Constants & config
├── types/                       # TypeScript types
└── data/                        # Static training data
```

### Data Models

#### Users Collection
```firestore
users/{userId}
├── email: string
├── displayName: string
├── createdAt: Timestamp
└── activeDogId: string | null
```

#### Dogs Collection
```firestore
users/{userId}/dogs/{dogId}
├── name: string
├── breed: string
├── age: number (months)
├── photoUrl: string | null
├── createdAt: Timestamp
├── totalSessionsCompleted: number
├── currentStreak: number
├── longestStreak: number
└── lastTrainingDate: Timestamp | null
```

#### Progress Collection
```firestore
users/{userId}/dogs/{dogId}/progress/{commandId}
├── commandId: string
├── level: 'not_started' | 'learning' | 'practicing' | 'mastered'
├── sessionsCompleted: number
├── lastPracticed: Timestamp | null
└── notes: string
```

#### Schedules Collection
```firestore
users/{userId}/schedules/{scheduleId}
├── dogId: string
├── title: string
├── days: string[] (e.g., ['mon', 'wed', 'fri'])
├── time: string (e.g., '09:00')
├── enabled: boolean
├── notificationId: string | null
└── programId: string | null
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 8+
- Expo CLI (`npm install -g expo-cli`)
- Firebase account with a Firestore project

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd pawcoach
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase config
   - Update `firebase.config.ts` with your credentials (or use environment variables):

```typescript
// firebase.config.ts or .env
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

4. **Start the app**
```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## 📱 App Flow

### First Time User
1. Sign up with email and password
2. Add their first dog (name, breed, age, optional photo)
3. See home dashboard
4. Browse training programs
5. Start a training session
6. View progress

### Existing User
1. Log in with credentials
2. Dashboard shows active dog stats
3. Browse and start training programs
4. Track progress over time
5. Create training schedules
6. Manage multiple dogs

## 🎯 Key Features Walkthrough

### Training a Command
1. Go to **Training** tab
2. Filter by difficulty or browse all
3. Tap a command to see full details
4. Press "Start Training Session"
5. Use timer to track session
6. Complete session when done
7. Progress auto-saves to Firestore

### Viewing Progress
1. Go to **Progress** tab
2. See your dog's current streak
3. View overall mastery percentage
4. Check individual command levels
5. Unlock achievements as you train

### Creating Schedules
1. Go to **Schedule** tab
2. Tap the + button
3. Set title (e.g., "Morning Training")
4. Select days of the week
5. Set time
6. Schedule is saved and can send notifications

## 🔒 Security
- Firebase Authentication for secure user data
- Firestore security rules (implement as needed)
- Passwords never stored locally
- Automatic session timeout on logout
- Photo uploads validated server-side

## 🎨 Customization

### Colors
Edit `constants/colors.ts` to customize the color scheme:
```typescript
export const COLORS = {
  primary: '#FF8C42',      // Orange
  secondary: '#4ECDC4',    // Teal
  accent: '#FFD166',       // Golden
  // ... more colors
};
```

### Training Commands
Add or modify training commands in `data/trainingPrograms.ts`:
```typescript
{
  id: 'custom_command',
  name: 'Custom Command',
  category: 'basic',
  difficulty: 2,
  steps: [/* ... */],
  tips: [/* ... */],
  commonMistakes: [/* ... */],
}
```

### Achievements
Customize achievements in `constants/achievements.ts`:
```typescript
{
  id: 'custom_achievement',
  name: 'Custom Achievement',
  icon: '🏆',
  condition: 'streakCount >= 20',
}
```

## 📲 Deployment

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

### Web
```bash
npm run web
```

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify API keys in `firebase.config.ts`
- Check Firestore security rules allow read/write
- Ensure Firebase project has all required services enabled

### Photo Upload Failed
- Check Storage bucket permissions
- Verify user has `authenticated` role in Firebase
- Check image file format (JPG/PNG recommended)

### Notifications Not Working
- Enable push notifications in Firestore Console
- Grant app notification permissions on device
- Check `expo-notifications` setup in `app.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the React Native framework
- [Firebase](https://firebase.google.com) for backend services
- Dog training experts for program content inspiration
- The React Native community for amazing libraries

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for dog lovers everywhere. Happy training! 🐾
