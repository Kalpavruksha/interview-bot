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

// We don't need the custom IndexedDB middleware or loadInitialState function
// Redux Persist handles all the persistence automatically