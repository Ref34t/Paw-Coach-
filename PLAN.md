# PawCoach - Dog Training Mobile App

## Tech Stack
- **React Native** with **Expo** (managed workflow, no Android SDK needed)
- **TypeScript**
- **Expo Router** (file-based navigation)
- **Firebase**: Auth, Firestore, Storage, Cloud Messaging
- **expo-notifications**, **expo-image-picker**, **AsyncStorage**

## Project Structure
```
pawcoach/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout with auth check
│   ├── index.tsx                 # Landing/splash redirect
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── home.tsx              # Dashboard
│   │   ├── training.tsx          # Training programs list
│   │   ├── progress.tsx          # Progress overview
│   │   ├── schedule.tsx          # Schedule & reminders
│   │   └── profile.tsx           # User & dog profiles
│   ├── training/
│   │   ├── [programId].tsx       # Program detail
│   │   └── session.tsx           # Active training session
│   ├── dogs/
│   │   ├── add.tsx               # Add new dog
│   │   └── [dogId].tsx           # Dog profile detail
│   └── +not-found.tsx
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   ├── DogSelector.tsx           # Switch between dogs
│   ├── TrainingCard.tsx          # Training program card
│   ├── StreakCounter.tsx         # Daily streak display
│   ├── AchievementBadge.tsx     # Achievement display
│   └── SessionTimer.tsx          # Training session timer
├── lib/
│   ├── firebase.ts               # Firebase config & init
│   ├── auth.ts                   # Auth helpers
│   ├── firestore.ts              # Firestore CRUD operations
│   ├── storage.ts                # Firebase Storage helpers
│   └── notifications.ts          # Push notification setup
├── data/
│   └── trainingPrograms.ts       # Built-in training content
├── hooks/
│   ├── useAuth.ts                # Auth state hook
│   ├── useDogs.ts                # Dogs data hook
│   ├── useProgress.ts            # Progress data hook
│   └── useSchedule.ts            # Schedule data hook
├── types/
│   └── index.ts                  # TypeScript type definitions
├── constants/
│   ├── colors.ts                 # Color palette
│   └── achievements.ts           # Achievement definitions
├── context/
│   ├── AuthContext.tsx            # Auth provider
│   └── DogContext.tsx             # Active dog provider
├── assets/                       # Images, icons
├── app.json                      # Expo config
├── firebase.config.ts            # Firebase project config
└── package.json
```

## Data Models (Firestore)

### Collection: `users/{userId}`
```ts
{
  email: string;
  displayName: string;
  createdAt: Timestamp;
  activeDogId: string | null;
}
```

### Collection: `users/{userId}/dogs/{dogId}`
```ts
{
  name: string;
  breed: string;
  age: number;          // in months
  photoUrl: string | null;
  createdAt: Timestamp;
  totalSessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: Timestamp | null;
}
```

### Collection: `users/{userId}/dogs/{dogId}/progress/{commandId}`
```ts
{
  commandId: string;     // e.g., "sit", "stay"
  level: 'not_started' | 'learning' | 'practicing' | 'mastered';
  sessionsCompleted: number;
  lastPracticed: Timestamp | null;
  notes: string;
}
```

### Collection: `users/{userId}/schedules/{scheduleId}`
```ts
{
  dogId: string;
  title: string;
  days: string[];        // ['mon', 'wed', 'fri']
  time: string;          // '09:00'
  enabled: boolean;
  notificationId: string | null;
  programId: string | null;
}
```

### Collection: `users/{userId}/achievements/{achievementId}`
```ts
{
  achievementId: string;
  unlockedAt: Timestamp;
  dogId: string;
}
```

## Built-in Training Programs (Local Data)

Categories with commands:
- **Basic Obedience**: Sit, Down, Stay, Come, Heel
- **Manners**: Leave It, Drop It, Wait, Quiet, Off
- **Advanced**: Shake, Roll Over, Spin, Play Dead, Fetch

Each command has:
- name, description, difficulty (1-3), estimatedMinutes
- steps[] - numbered instructions
- tips[] - pro tips
- commonMistakes[] - what to avoid

## Screens & Navigation

**Bottom Tabs:**
1. **Home** - Dashboard: active dog summary, streak, quick-start training, recent activity
2. **Training** - Browse programs by category, difficulty filter, search
3. **Progress** - Per-dog progress chart, command mastery grid, achievements
4. **Schedule** - Calendar view, upcoming sessions, add/edit reminders
5. **Profile** - Dog profiles (add/edit/switch), user settings, sign out

## Color Palette
- Primary: `#FF8C42` (warm orange)
- Secondary: `#4ECDC4` (teal)
- Accent: `#FFD166` (golden yellow)
- Background: `#FFF8F0` (warm white)
- Text: `#2D3436` (dark gray)
- Success: `#6BCB77` (green)
- Card: `#FFFFFF`

## Implementation Phases

### Phase 1: Project Setup & Auth (files: 8)
1. Initialize Expo project with TypeScript template
2. Install all dependencies
3. Configure Firebase (firebase.config.ts, lib/firebase.ts)
4. Set up Expo Router layout structure
5. Build auth screens (login, register)
6. Create AuthContext and useAuth hook
7. Add auth flow (redirect unauthenticated users)

### Phase 2: Dog Profiles (files: 6)
1. Define TypeScript types (types/index.ts)
2. Create Firestore helpers (lib/firestore.ts)
3. Build DogContext and useDogs hook
4. Create add-dog screen with image picker
5. Build dog profile detail screen
6. Add DogSelector component to switch dogs

### Phase 3: Training Programs (files: 7)
1. Create training data (data/trainingPrograms.ts)
2. Build training list screen with category filters
3. Build program detail screen
4. Create active training session screen with timer
5. Save session completion to Firestore progress
6. Build TrainingCard and SessionTimer components

### Phase 4: Progress Tracking (files: 5)
1. Create useProgress hook
2. Build progress overview screen (mastery grid)
3. Implement streak calculation logic
4. Define achievements (constants/achievements.ts)
5. Build achievement badges and unlock logic

### Phase 5: Scheduling & Reminders (files: 4)
1. Set up expo-notifications (lib/notifications.ts)
2. Create useSchedule hook
3. Build schedule screen with add/edit forms
4. Implement local push notification scheduling

### Phase 6: Polish & UI (files: 5)
1. Build reusable UI components (Button, Card, ProgressBar, Badge, Avatar)
2. Apply color palette and consistent styling
3. Add loading states and error handling
4. Home dashboard with summary data
5. Final testing and cleanup

## Verification
1. `npx expo start` - app launches without errors
2. Register/login flow works
3. Can add a dog with photo
4. Can browse training programs and start a session
5. Progress updates after completing a session
6. Can set a training schedule with reminder
7. Streak counter works correctly
8. Achievements unlock on milestones
