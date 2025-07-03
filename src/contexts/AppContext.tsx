import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, OptimizationMode, OptimizationOptions, User, OptimizationSession, ErrorInfo, CacheEntry } from '@/types';

// Initial state
const initialState: AppState = {
  user: null,
  currentSession: null,
  cache: new Map(),
  errors: [],
  loading: false,
  connected: true
};

// Action types
type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<User['preferences']> }
  | { type: 'START_SESSION'; payload: OptimizationSession }
  | { type: 'END_SESSION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'ADD_ERROR'; payload: ErrorInfo }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'CACHE_SET'; payload: { key: string; data: any; ttl?: number } }
  | { type: 'CACHE_GET'; payload: string }
  | { type: 'CACHE_CLEAR' }
  | { type: 'INCREMENT_USAGE'; payload: { successful: boolean; improvement?: number } };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_USER_PREFERENCES':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        }
      };
    
    case 'START_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'END_SESSION':
      return { ...state, currentSession: null };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    
    case 'ADD_ERROR':
      return { 
        ...state, 
        errors: [...state.errors.slice(-9), action.payload] // Keep last 10 errors
      };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    
    case 'CACHE_SET': {
      const newCache = new Map(state.cache);
      const entry: CacheEntry<any> = {
        key: action.payload.key,
        data: action.payload.data,
        timestamp: new Date(),
        ttl: action.payload.ttl || 300000, // 5 minutes default
        hits: 0
      };
      newCache.set(action.payload.key, entry);
      return { ...state, cache: newCache };
    }
    
    case 'CACHE_CLEAR':
      return { ...state, cache: new Map() };
    
    case 'INCREMENT_USAGE':
      if (!state.user) return state;
      const usage = state.user.usage;
      return {
        ...state,
        user: {
          ...state.user,
          usage: {
            ...usage,
            totalOptimizations: usage.totalOptimizations + 1,
            successfulOptimizations: action.payload.successful 
              ? usage.successfulOptimizations + 1 
              : usage.successfulOptimizations,
            averageImprovement: action.payload.improvement 
              ? (usage.averageImprovement + action.payload.improvement) / 2
              : usage.averageImprovement,
            lastUsed: new Date()
          }
        }
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUser: (user: User) => void;
    updatePreferences: (preferences: Partial<User['preferences']>) => void;
    startSession: () => void;
    endSession: () => void;
    setLoading: (loading: boolean) => void;
    addError: (error: Omit<ErrorInfo, 'timestamp'>) => void;
    clearErrors: () => void;
    cacheSet: (key: string, data: any, ttl?: number) => void;
    cacheGet: (key: string) => any | null;
    cacheClear: () => void;
    incrementUsage: (successful: boolean, improvement?: number) => void;
  };
} | null>(null);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('promptOptimizer_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
      }
    } else {
      // Create default user
      const defaultUser: User = {
        id: Date.now().toString(),
        preferences: {
          defaultMode: 'normal',
          defaultTechniques: {
            useChainOfThought: true,
            useTreeOfThoughts: false,
            useSelfConsistency: false,
            useReAct: false,
            usePersona: true,
            useConstraints: true,
            optimizeForTokens: false,
            useContextPrompting: true,
            useFewShot: false,
            useEmotionalPrompting: false,
            useRolePlay: false
          },
          language: 'en',
          theme: 'auto',
          autoSave: true,
          notifications: true
        },
        usage: {
          totalOptimizations: 0,
          successfulOptimizations: 0,
          averageImprovement: 0,
          favoriteMode: 'normal',
          lastUsed: new Date()
        }
      };
      dispatch({ type: 'SET_USER', payload: defaultUser });
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('promptOptimizer_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  // Cache cleanup
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const newCache = new Map(state.cache);
      let cleaned = false;
      
      for (const [key, entry] of newCache.entries()) {
        if (now - entry.timestamp.getTime() > entry.ttl) {
          newCache.delete(key);
          cleaned = true;
        }
      }
      
      if (cleaned) {
        dispatch({ type: 'CACHE_CLEAR' });
        // Reset with cleaned cache
        for (const [key, entry] of newCache.entries()) {
          dispatch({ 
            type: 'CACHE_SET', 
            payload: { key, data: entry.data, ttl: entry.ttl } 
          });
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanup);
  }, [state.cache]);

  const actions = {
    setUser: (user: User) => dispatch({ type: 'SET_USER', payload: user }),
    
    updatePreferences: (preferences: Partial<User['preferences']>) => 
      dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences }),
    
    startSession: () => {
      const session: OptimizationSession = {
        id: Date.now().toString(),
        startTime: new Date(),
        prompts: [],
        results: [],
        totalImprovement: 0
      };
      dispatch({ type: 'START_SESSION', payload: session });
    },
    
    endSession: () => dispatch({ type: 'END_SESSION' }),
    
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    
    addError: (error: Omit<ErrorInfo, 'timestamp'>) => 
      dispatch({ 
        type: 'ADD_ERROR', 
        payload: { ...error, timestamp: new Date() } 
      }),
    
    clearErrors: () => dispatch({ type: 'CLEAR_ERRORS' }),
    
    cacheSet: (key: string, data: any, ttl?: number) => 
      dispatch({ type: 'CACHE_SET', payload: { key, data, ttl } }),
    
    cacheGet: (key: string): any | null => {
      const entry = state.cache.get(key);
      if (!entry) return null;
      
      const now = Date.now();
      if (now - entry.timestamp.getTime() > entry.ttl) {
        return null;
      }
      
      // Increment hit count
      entry.hits++;
      return entry.data;
    },
    
    cacheClear: () => dispatch({ type: 'CACHE_CLEAR' }),
    
    incrementUsage: (successful: boolean, improvement?: number) => 
      dispatch({ type: 'INCREMENT_USAGE', payload: { successful, improvement } })
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;