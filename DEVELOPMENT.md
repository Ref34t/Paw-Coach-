# 🛠️ PawCoach Development Guide

## Project Overview

PawCoach is a full-featured dog training companion app built with React Native, Expo, and Firebase. This guide helps you navigate and extend the project.

## 📁 Directory Structure

```
pawcoach/
├── app/                              # Expo Router - all screens here
│   ├── _layout.tsx                  # Root layout with auth checking
│   ├── +not-found.tsx               # 404 page
│   ├── (auth)/                      # Auth group (login/register)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                      # Tab group (5 main tabs)
│   │   ├── _layout.tsx              # Tab navigator
│   │   ├── home.tsx                 # Dashboard
│   │   ├── training.tsx             # Browse programs
│   │   ├── progress.tsx             # Track progress
│   │   ├── schedule.tsx             # Manage schedules
│   │   └── profile.tsx              # User & dog profiles
│   ├── dogs/                        # Dog management routes
│   │   ├── add.tsx                  # Add new dog
│   │   └── [dogId].tsx              # Dog detail
│   ├── training/                    # Training routes
│   │   ├── [programId].tsx          # Program detail
│   │   └── session.tsx              # Active session
│   └── schedule/
│       └── add.tsx                  # Add schedule
│
├── components/                      # Reusable React components
│   ├── ui/                          # Base UI components
│   │   ├── Button.tsx               # Reusable button
│   │   ├── Card.tsx                 # Card wrapper
│   │   ├── ProgressBar.tsx          # Progress indicator
│   │   ├── Badge.tsx                # Status badges
│   │   └── Avatar.tsx               # User avatars (future)
│   ├── StreakCounter.tsx            # Streak display
│   ├── AchievementBadge.tsx         # Achievement cards
│   ├── TrainingCard.tsx             # Training program card (future)
│   └── SessionTimer.tsx             # Timer component (future)
│
├── lib/                             # Library functions
│   ├── firebase.ts                  # Firebase initialization
│   ├── auth.ts                      # Auth helpers
│   ├── firestore.ts                 # Database CRUD
│   ├── storage.ts                   # Photo upload
│   └── notifications.ts             # Push notifications
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts                   # Auth context hook
│   ├── useDogs.ts                   # Dogs context hook
│   ├── useProgress.ts               # Progress tracking
│   └── useSchedule.ts               # Schedule management
│
├── context/                         # React Context
│   ├── AuthContext.tsx              # Auth provider
│   └── DogContext.tsx               # Active dog provider
│
├── constants/                       # Configuration
│   ├── colors.ts                    # Color palette
│   └── achievements.ts              # Achievement definitions
│
├── types/                           # TypeScript definitions
│   └── index.ts                     # All types
│
├── data/                            # Static data
│   └── trainingPrograms.ts          # 15 training commands
│
├── assets/                          # Images, icons
├── App.tsx                          # App entry point
├── app.json                         # Expo config
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── firebase.config.ts               # Firebase credentials
└── .env.example                     # Environment template
```

## 🔄 Data Flow

### Authentication Flow
```
LoginScreen → loginUser() → Firebase Auth → AuthContext → Protected Routes
```

### Dog Management Flow
```
AddDogScreen → addDog() → Firestore → DogContext → useDogs() → UI Components
```

### Training Flow
```
TrainingScreen → Browse Programs → ProgramDetail → SessionScreen → updateProgress()
```

### Progress Tracking Flow
```
SessionComplete → updateCommandProgress() → Firestore → useProgress() → ProgressScreen
```

## 🚀 Common Tasks

### Adding a New Training Command

1. Edit `data/trainingPrograms.ts`:
```typescript
{
  id: 'new_command',
  name: 'New Command',
  description: 'Learn this new command',
  category: 'basic',
  difficulty: 1,
  estimatedMinutes: 10,
  steps: [
    'Step 1: ...',
    'Step 2: ...',
  ],
  tips: [
    'Tip 1',
  ],
  commonMistakes: [
    'Mistake 1',
  ],
}
```

### Adding a New Achievement

1. Edit `constants/achievements.ts`:
```typescript
new_achievement: {
  id: 'new_achievement',
  name: 'New Achievement',
  description: 'Unlock this achievement',
  icon: '🏆',
  condition: 'custom_condition',
}
```

### Changing Colors

Edit `constants/colors.ts`:
```typescript
export const COLORS = {
  primary: '#FF8C42',      // Change this
  secondary: '#4ECDC4',
  // ...
};
```

### Adding a New Screen

1. Create file in `app/` or `app/(tabs)/` (depending on grouping)
2. Add navigation in parent `_layout.tsx`
3. Use hooks and contexts for state management

### Adding Firebase Helpers

1. Create function in appropriate `lib/` file
2. Add TypeScript types in `types/index.ts`
3. Create custom hook in `hooks/` if needed
4. Use hook in components

## 🔑 Key Concepts

### Expo Router
- File-based routing like Next.js
- `(groups)` create route groups without affecting URL
- `[param]` creates dynamic routes
- `_layout.tsx` controls navigation structure

### Contexts
- `AuthContext`: Manages user authentication state
- `DogContext`: Manages active dog and dog list

### Hooks
- `useAuth()`: Get current user and auth state
- `useDogs()`: Get dogs list and active dog
- `useProgress()`: Get command progress data
- `useSchedule()`: Manage training schedules

### Firebase
- **Auth**: Email/password authentication
- **Firestore**: Cloud database with collections
- **Storage**: Photo uploads for dogs
- **Notifications**: Push notifications (setup required)

## 🧪 Testing

No automated tests yet, but manual testing checklist:

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Add dog with photo
- [ ] Browse training programs
- [ ] Complete training session
- [ ] View progress updates
- [ ] Create training schedule
- [ ] View achievements
- [ ] Switch between dogs
- [ ] Delete dog
- [ ] Logout

## 🔒 Security Considerations

1. **Firebase Config**: Keep `firebase.config.ts` secret, use environment variables in production
2. **Authentication**: Firebase handles password security
3. **Database Rules**: Implement Firestore security rules:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

4. **Storage Rules**: Validate file uploads
5. **API Keys**: Use public API keys (not backend keys)

## 📦 Dependencies

Key packages:
- `react-native`: Mobile framework
- `expo`: Managed React Native platform
- `expo-router`: Navigation
- `firebase`: Backend services
- `@react-navigation/`: Navigation components
- `expo-image-picker`: Photo selection
- `expo-notifications`: Push notifications

## 🚢 Deployment

### Development
```bash
npm start
# Scan QR code with Expo Go app
```

### Production (Android)
```bash
eas build --platform android --auto-submit
eas submit --platform android
```

### Production (iOS)
```bash
eas build --platform ios --auto-submit
eas submit --platform ios
```

### Web
```bash
npm run web
```

## 📝 Code Style

- **TypeScript**: Fully typed, no `any`
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Exports**: Named exports preferred
- **Comments**: JSDoc for complex functions

## 🐛 Debugging

1. **React Native Debugger**:
```bash
npm install -g react-native-debugger
```

2. **Expo DevTools**: Included in Expo Go app

3. **Firebase Console**: Monitor real-time data and rules

4. **Console Logs**: Use `console.log()` (visible in terminal)

## 🤔 FAQ

**Q: How do I change the app name?**
A: Edit `app.json`:
```json
{
  "expo": {
    "name": "New Name",
    "slug": "new-slug"
  }
}
```

**Q: How do I add more tabs?**
A: Add new file in `app/(tabs)/` and update `app/(tabs)/_layout.tsx`

**Q: How do I persist local data?**
A: Use `AsyncStorage` from `@react-native-async-storage/async-storage`

**Q: How do I handle errors in API calls?**
A: All async functions have try/catch blocks. Add error boundaries for UI.

## 📚 Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Expo Router Docs](https://expo.github.io/router/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 👥 Contributing

1. Create a feature branch
2. Follow the code style
3. Test manually
4. Submit a PR with description

---

Happy coding! 🚀
