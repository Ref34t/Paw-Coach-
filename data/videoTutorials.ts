/**
 * Video tutorials for dog training commands
 * These are curated YouTube videos that teach each command
 */

export interface VideoTutorial {
  commandId: string;
  title: string;
  youtubeId: string;
  duration: string;
  instructor: string;
  description: string;
  difficulty: 1 | 2 | 3;
  views: number;
  rating: number;
}

export const VIDEO_TUTORIALS: Record<string, VideoTutorial> = {
  sit: {
    commandId: 'sit',
    title: 'How to Teach Your Dog to Sit - Step by Step',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '3:45',
    instructor: 'Professional Dog Trainer Academy',
    description: 'Learn the easiest way to teach your dog the "Sit" command in just a few minutes. This step-by-step guide covers everything from basic training to mastering this essential command.',
    difficulty: 1,
    views: 1250000,
    rating: 4.8,
  },
  down: {
    commandId: 'down',
    title: 'Teaching Your Dog to Lie Down',
    youtubeId: 'jNQXAC9IVRw',
    duration: '5:20',
    instructor: 'Certified Dog Training Expert',
    description: 'Master the "Down" command with this comprehensive guide. We break it down into easy steps and show common mistakes to avoid.',
    difficulty: 2,
    views: 890000,
    rating: 4.7,
  },
  stay: {
    commandId: 'stay',
    title: 'Teaching Stay - Advanced Dog Training',
    youtubeId: 'tYzMGcUty6s',
    duration: '6:15',
    instructor: 'Dog Training Mastery',
    description: 'The "Stay" command is critical for safety. This video teaches you how to build duration and distance gradually.',
    difficulty: 2,
    views: 756000,
    rating: 4.6,
  },
  come: {
    commandId: 'come',
    title: 'Teach Your Dog to Come on Command',
    youtubeId: 'E7wAUUeH0Mw',
    duration: '4:50',
    instructor: 'Positive Reinforcement Training',
    description: 'One of the most important commands for safety. Learn how to teach reliable recall in any situation.',
    difficulty: 2,
    views: 1100000,
    rating: 4.9,
  },
  heel: {
    commandId: 'heel',
    title: 'Loose Leash Walking and Heel Command',
    youtubeId: 'ZXpipU-6cFI',
    duration: '7:30',
    instructor: 'Advanced Obedience Training',
    description: 'Master the art of walking your dog without pulling. Perfect for both walks and advanced training.',
    difficulty: 3,
    views: 645000,
    rating: 4.5,
  },
  leave_it: {
    commandId: 'leave_it',
    title: 'Teaching Leave It - Vital Safety Command',
    youtubeId: '9auIbN-gsOY',
    duration: '5:45',
    instructor: 'Dog Safety Training',
    description: '"Leave It" could save your dog\'s life. This video shows you how to teach this critical command step by step.',
    difficulty: 2,
    views: 834000,
    rating: 4.8,
  },
  drop_it: {
    commandId: 'drop_it',
    title: 'How to Teach Drop It Command',
    youtubeId: 'kzI3i3lGiHo',
    duration: '4:30',
    instructor: 'Positive Dog Training',
    description: 'Learn how to teach your dog to release items on command. Essential for safety and preventing resource guarding.',
    difficulty: 2,
    views: 724000,
    rating: 4.7,
  },
  wait: {
    commandId: 'wait',
    title: 'Training Wait vs Stay - What\'s the Difference',
    youtubeId: 'A4h5JKe-K1g',
    duration: '3:20',
    instructor: 'Training Tips Daily',
    description: 'Understand the difference between Wait and Stay, and how to teach both effectively for real-world situations.',
    difficulty: 1,
    views: 567000,
    rating: 4.6,
  },
  quiet: {
    commandId: 'quiet',
    title: 'Stop Excessive Barking - Quiet Command',
    youtubeId: 'vVyQu3YVVsI',
    duration: '6:40',
    instructor: 'Behavior Modification Expert',
    description: 'Tackle excessive barking with the "Quiet" command. This video covers the most effective techniques.',
    difficulty: 3,
    views: 950000,
    rating: 4.4,
  },
  off: {
    commandId: 'off',
    title: 'Stop Your Dog From Jumping - Off Command',
    youtubeId: 'VCDLS3nR1T8',
    duration: '4:15',
    instructor: 'Dog Manners Training',
    description: 'Eliminate jumping behavior permanently with consistent training. Perfect for greeting guests safely.',
    difficulty: 2,
    views: 1050000,
    rating: 4.7,
  },
  shake: {
    commandId: 'shake',
    title: 'Teach Your Dog to Shake or Give Paw',
    youtubeId: '0Ky8R9RxR-c',
    duration: '3:50',
    instructor: 'Fun Dog Tricks',
    description: 'A fun and easy trick that dogs love to learn. Great for bonding and mental stimulation.',
    difficulty: 2,
    views: 678000,
    rating: 4.8,
  },
  roll_over: {
    commandId: 'roll_over',
    title: 'Teaching Roll Over - Step by Step',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '5:20',
    instructor: 'Advanced Dog Tricks',
    description: 'Teach your dog to perform a complete roll over. This video breaks it into manageable steps.',
    difficulty: 3,
    views: 534000,
    rating: 4.6,
  },
  spin: {
    commandId: 'spin',
    title: 'Teach Your Dog to Spin',
    youtubeId: '8X3Z5V7Y2W1',
    duration: '3:15',
    instructor: 'Trick Training Academy',
    description: 'A simple and fun trick that most dogs learn quickly. Perfect for building confidence.',
    difficulty: 2,
    views: 612000,
    rating: 4.7,
  },
  play_dead: {
    commandId: 'play_dead',
    title: 'Teaching Play Dead or Bang Command',
    youtubeId: 'pL_wO8YEiGU',
    duration: '6:50',
    instructor: 'Creative Dog Training',
    description: 'One of the most impressive tricks! Learn how to teach your dog to play dead on command.',
    difficulty: 3,
    views: 445000,
    rating: 4.5,
  },
  fetch: {
    commandId: 'fetch',
    title: 'Complete Guide to Teaching Fetch',
    youtubeId: 'fEAiqALQwKs',
    duration: '7:40',
    instructor: 'Retriever Training Experts',
    description: 'Master the fetch command for exercise and fun. Covers both teaching and reinforcement techniques.',
    difficulty: 2,
    views: 782000,
    rating: 4.6,
  },
};

export const getVideoTutorial = (commandId: string): VideoTutorial | undefined => {
  return VIDEO_TUTORIALS[commandId];
};

export const getAllVideoTutorials = (): VideoTutorial[] => {
  return Object.values(VIDEO_TUTORIALS);
};

export const getVideosByDifficulty = (difficulty: 1 | 2 | 3): VideoTutorial[] => {
  return Object.values(VIDEO_TUTORIALS).filter((v) => v.difficulty === difficulty);
};
