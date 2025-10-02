# Redux-Persist Approach for State Persistence

## Overview

This document explains the implementation of state persistence using Redux-Persist with localStorage for the AI Interview Assistant application.

## Why Redux-Persist?

Redux-Persist is an excellent choice for this application because:

1. **Simplicity**: Requires minimal configuration
2. **Automatic**: Handles all persistence automatically
3. **Reliable**: Well-tested library with good community support
4. **Lightweight**: No additional database dependencies
5. **Sufficient**: Perfect for the data size and complexity of this application

## Implementation Details

### Store Configuration

The store has been configured with Redux-Persist to automatically save and restore the interview state:

```javascript
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import { combineReducers } from 'redux'
import interviewReducer from './reducers/interviewReducer'

// Redux Persist configuration
const persistConfig = {
  key: 'interview-app',
  storage,
  whitelist: ['interview'] // only persist the interview reducer
}

const rootReducer = combineReducers({
  interview: interviewReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export const persistor = persistStore(store)
```

### Data Being Persisted

The following data is automatically saved to localStorage:

1. **Candidate Profile**
   - Name
   - Email
   - Phone

2. **Interview State**
   - Current interview step
   - Interview status (not-started, in-progress, paused, completed)
   - Show welcome back modal flag

3. **Questions & Answers**
   - Interview questions
   - Candidate answers with scores
   - Timer values for each question

4. **Candidates List**
   - All completed candidates with their results

### How It Works

1. **Automatic Saving**: Redux-Persist automatically saves the state to localStorage whenever it changes
2. **Automatic Loading**: When the app starts, Redux-Persist automatically restores the state from localStorage
3. **No Manual Intervention**: No need to manually save or load data
4. **Transparent Operation**: Works seamlessly with existing Redux actions and reducers

### Benefits for This Application

1. **Resume Functionality**: Candidates can close the browser and resume their interview later
2. **Dashboard Persistence**: Interviewer data remains available after browser refresh
3. **Cross-Tab Synchronization**: State is shared between Interviewee and Interviewer tabs
4. **Zero Configuration**: Minimal setup with maximum functionality

### Limitations to Consider

1. **Storage Size**: localStorage is limited to ~5-10MB depending on browser
2. **No Querying**: Cannot query data like a database
3. **Synchronous**: Blocking operations during save/restore
4. **Security**: Data is not encrypted (same as IndexedDB approach)

## Testing the Implementation

To verify that Redux-Persist is working:

1. Start an interview and answer a few questions
2. Refresh the browser page
3. The interview should resume from where you left off
4. Check Application tab in DevTools to see data in localStorage

## Comparison with IndexedDB Approach

| Feature | Redux-Persist (localStorage) | IndexedDB |
|---------|------------------------------|-----------|
| Complexity | Very Simple | More Complex |
| Setup Time | Minutes | Hours |
| Storage Limit | ~5-10MB | Much Larger |
| Querying | No | Yes |
| Performance | Good | Better for large data |
| Browser Support | Universal | Modern Browsers |

For this application, Redux-Persist is the better choice because:
- The data size is small
- No complex querying is needed
- Simplicity is preferred
- Quick implementation is required