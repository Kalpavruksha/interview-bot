# Tab Synchronization in AI Interview Assistant

This document explains how the Interviewee and Interviewer tabs stay synchronized in the AI Interview Assistant application.

## Architecture Overview

The application uses a shared Redux store with persistence to synchronize data between the two tabs:

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Interviewee    │    │   Redux Store    │    │  Interviewer     │
│    Tab          │◄──►│   (Persisted)    │◄──►│    Tab           │
│                 │    │                  │    │                  │
│ • Resume Upload │    │ • Current        │    │ • Candidate List │
│ • Interview     │    │   Candidate      │    │ • Candidate      │
│   Questions     │    │ • All Candidates │    │   Details        │
│ • Answers       │    │ • Interview      │    │ • Scores         │
│ • Timer         │    │   Status         │    │                  │
└─────────────────┘    │ • Questions      │    └──────────────────┘
                       │ • Answers        │
                       └──────────────────┘
```

## Data Flow

### 1. Interviewee Tab Workflow

1. **Resume Upload**:
   - Candidate uploads resume
   - Information is extracted and stored in `currentCandidate`
   - State is persisted to localStorage

2. **Interview Process**:
   - Questions are generated and stored in `questions`
   - As candidate answers questions, answers are added to `currentCandidate.answers`
   - Timer information is stored in `currentCandidate.timers`
   - All state changes are immediately persisted

3. **Interview Completion**:
   - When interview is completed, the candidate is moved from `currentCandidate` to `allCandidates`
   - This automatically updates the Interviewer tab

### 2. Interviewer Tab Workflow

1. **Candidate List**:
   - Displays all candidates from `allCandidates`
   - Automatically updates when new candidates are added

2. **Candidate Details**:
   - Shows detailed information for selected candidate
   - Updates in real-time as interview progresses

## Redux State Structure

The shared state structure in the Redux store:

```javascript
{
  interview: {
    // Current candidate with progress tracking
    currentCandidate: {
      id: null,
      name: "",
      email: "",
      phone: "",
      interviewStep: 0,   // question number
      timers: {}, // { q1: 20, q2: 60, ... }
      answers: [] // { questionId: 1, text: "My answer", score: 8 }
    },
    // All candidates for dashboard
    allCandidates: [],
    // Interview flow state
    currentQuestion: null,
    currentQuestionIndex: 0,
    interviewStatus: 'not-started', // not-started, in-progress, paused, completed
    showWelcomeBack: false,
    questions: [], // Interview questions
  }
}
```

## Persistence Mechanism

The application uses Redux Persist to automatically save and restore state:

1. **Automatic Persistence**:
   - All state changes are automatically saved to localStorage
   - State is restored when the application is reopened

2. **Cross-Tab Synchronization**:
   - When one tab updates the store, the changes are immediately available to the other tab
   - No manual synchronization is required

## Welcome Back Feature

The application implements a "Welcome Back" modal for unfinished interviews:

1. **Detection**:
   - When the application loads, it checks if there's an in-progress interview
   - If found, the Welcome Back modal is displayed

2. **Resume Functionality**:
   - Candidate can resume exactly where they left off
   - All answers, timers, and progress are restored

## Real-Time Updates

The synchronization works in real-time:

1. **No Refresh Required**:
   - Switching between tabs immediately shows the latest data
   - No page refresh needed to see updates

2. **Consistent State**:
   - Both tabs always show the same data
   - No conflicts or inconsistencies

## Implementation Details

### Redux Actions

Key actions that affect both tabs:

- `SET_CURRENT_CANDIDATE` - Updates current candidate information
- `ADD_ANSWER` - Adds a new answer to the current candidate
- `UPDATE_TIMER` - Updates timer information
- `ADD_CANDIDATE` - Moves completed candidate to allCandidates
- `SET_INTERVIEW_STATUS` - Updates interview status

### Component Updates

Both tabs use React Redux hooks to subscribe to store changes:

```javascript
const { allCandidates, currentCandidate } = useSelector(state => state.interview)
```

This ensures that components automatically re-render when relevant state changes.

## Benefits of This Approach

1. **Seamless Experience**:
   - Users can switch between tabs without losing data
   - Real-time updates provide immediate feedback

2. **Data Consistency**:
   - Single source of truth prevents data conflicts
   - All components see the same data

3. **Persistence**:
   - Data survives page refreshes and browser restarts
   - Users never lose their progress

4. **Simplicity**:
   - No complex synchronization logic needed
   - Redux handles all the heavy lifting

## Testing Synchronization

To verify synchronization works correctly:

1. Start an interview in the Interviewee tab
2. Switch to the Interviewer tab - should show the candidate in progress
3. Complete the interview
4. Switch back to Interviewer tab - should show the completed candidate
5. Refresh the page - all data should be restored

## Troubleshooting

If synchronization isn't working:

1. **Check Redux DevTools**:
   - Verify actions are being dispatched correctly
   - Check that state is updating as expected

2. **Verify Persistence**:
   - Check localStorage for persisted state
   - Ensure Redux Persist is configured correctly

3. **Component Re-renders**:
   - Verify components are subscribing to the correct state
   - Check that useSelector is returning expected data