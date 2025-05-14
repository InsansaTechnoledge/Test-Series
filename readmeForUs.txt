src/
├── assets/
│   ├── logos/
│   ├── images/
│   └── icons/
│
├── components/                  # Reusable UI components
│   ├── Navbar/
│   │   └── Navbar.jsx
│   ├── MovieCard/
│   │   └── MovieCard.jsx
│   └── Loader/
│       └── Loader.jsx
│
├── features/                    # Feature-specific logic
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── authSlice.js
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       └── SignupPage.jsx
│   │
│   ├── movies/
│   │   ├── components/
│   │   │   └── MovieList.jsx
│   │   ├── services/
│   │   │   └── movieService.js
│   │   ├── movieSlice.js
│   │   └── pages/
│   │       ├── BrowsePage.jsx
│   │       └── MovieDetailPage.jsx
│   │
│   └── profile/
│       ├── components/
│       │   └── ProfileForm.jsx
│       ├── services/
│       │   └── profileService.js
│       ├── profileSlice.js
│       └── pages/
│           └── ProfilePage.jsx
│
├── layouts/
│   └── MainLayout.jsx          # Header + Footer layout wrapper
│
├── routes/
│   ├── AppRoutes.jsx           # All routes defined here
│   └── ProtectedRoute.jsx      # Auth guard for protected routes
│
├── hooks/
│   ├── useAuth.js
│   └── useFetch.js
│
├── store/
│   ├── store.js
│   └── rootReducer.js
│
├── contexts/
│   └── ThemeContext.jsx
│
├── utils/
│   ├── formatDate.js
│   └── debounce.js
│
├── constants/
│   └── roles.js
│
├── App.jsx
├── main.jsx                   # ReactDOM.render or createRoot
└── index.css

