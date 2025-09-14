# Amman - Trusted Second-Hand Marketplace

A modern React web application for buying and selling quality second-hand items, built with Firebase integration and PWA capabilities.

## Features

### 🔐 Authentication
- Email/password authentication
- Google sign-in integration
- Secure user management with Firebase Auth

### 📱 Responsive Design
- Mobile-first approach with Material Design 3 inspiration
- Bottom navigation for mobile devices
- Sidebar navigation for desktop
- Smooth transitions and micro-interactions

### 🛍️ Item Management
- Create listings with multiple image uploads
- Category-based organization
- Item approval workflow
- User-specific item management

### 👑 Admin Dashboard
- Review pending listings
- Approve/reject items
- Admin-only access control

### 🎨 Modern UI/UX
- Green/white/gray color palette for trust
- Clean, professional design
- Loading states and error handling
- Toast notifications for user feedback

### 📱 PWA Ready
- Installable on mobile devices
- Offline capabilities with service worker
- App-like experience

## Setup Instructions

### 1. Firebase Configuration
Replace the Firebase configuration in `src/services/firebase.ts` with your project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 2. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Set up Firestore database with the following security rules:
4. Enable Firebase Storage for image uploads

### 3. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Items collection rules
    match /items/{itemId} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.sellerId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

### 4. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── common/        # Reusable UI components
│   ├── item/          # Item-related components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # Firebase services
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Technologies Used

- **React 18** with TypeScript
- **Firebase** (Auth, Firestore, Storage)
- **Zustand** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Date-fns** for date formatting

## License

MIT License - see LICENSE file for details