# Timer App

A responsive React application that allows users to create, manage, and run multiple timers simultaneously. The application features a clean UI, persistent storage, and interactive notifications.

## Features

- **Multiple Simultaneous Timers**: Run multiple countdown timers at the same time
- **Persistent Storage**: Timers are saved in localStorage and persist across page refreshes
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Interactive Notifications**: Snack bar notifications with sound alerts when timers complete
- **Form Validation**: Comprehensive validation with user feedback

## Tech Stack

- **Frontend Framework**: React (with Vite for development)
- **Styling**: Tailwind CSS
- **State Management**: ReduxToolkit
- **Testing**: Vitest for unit and component testing


## Project Structure

```
/timer
│── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── EmptyState.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── PageContainer.tsx
│   │   ├── timer/
│   │   │   ├── TimerBackground.tsx
│   │   │   ├── TimerControls.tsx
│   │   │   ├── TimerItem.test.tsx
│   │   │   ├── TimerItem.tsx
│   │   │   ├── TimerList.tsx
│   │   │   ├── TimerManager.tsx
│   │   │   ├── TimerModal.test.tsx
│   │   │   ├── TimerModal.tsx
│   │   │   ├── TimerProgress.tsx
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useToast.ts
│   │   ├── useTimer.ts
│   ├── store/
│   │   ├── useTimerStore.ts
│   ├── types/
│   │   ├── timer.ts
│   ├── utils/
│   │   ├── audio.test.ts
│   │   ├── audio.ts
│   │   ├── time.ts
│   │   ├── validation.test.ts
│   │   ├── validation.ts
│   ├── App.tsx
│   ├── Home.tsx
│── package.json
│── tsconfig.json
│── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YesudasZ/Timer.git
   cd timer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal)

### Running Tests

To run all tests:
```bash
npm run test
# or
yarn test
```

To run tests in watch mode:
```bash
npm run test:watch
# or
yarn test:watch
```

## Completed Tasks

### UI Implementation
- Matched the UI according to the provided screenshots
- Ensured responsive design for both desktop and mobile views

### Functionality Improvements
- Implemented simultaneous timer functionality
- Fixed snack bar behavior and console errors
- Configured audio to play until snack bar dismissal
- Added localStorage persistence for timers

### Code Quality Enhancements
- Extracted common Button component for reuse across the application
- Consolidated Add/Edit modal code into a single component
- Improved validation with user feedback via snack bars
- Ensured responsive snack bar placement (top-right for desktop, bottom for mobile)

### Testing
- Added comprehensive unit tests for validation logic
- Implemented component tests for TimerItem and Button components
- Ensured all existing tests pass with modifications

## Future Improvements

- Add dark/light theme toggle
- Implement timer categories or tags
- Add timer presets for quick selection
- Enable cloud synchronization for timers across devices
- Add accessibility improvements (ARIA attributes, keyboard navigation)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes using conventional commit messages: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.