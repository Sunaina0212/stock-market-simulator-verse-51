
import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { AuthState, LoginCredentials, RegisterCredentials, User } from "../types";
import { authService } from "../services/authService";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
type AuthAction = 
  | { type: "LOGIN_START" | "REGISTER_START" | "LOGOUT_START" | "AUTH_RESET" }
  | { type: "LOGIN_SUCCESS" | "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" | "REGISTER_FAILURE" | "LOGOUT_FAILURE"; payload: string }
  | { type: "LOGOUT_SUCCESS" };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
    case "LOGOUT_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        loading: false, 
        error: null 
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
    case "LOGOUT_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT_SUCCESS":
      return { ...initialState, loading: false };
    case "AUTH_RESET":
      return { ...initialState, loading: false };
    default:
      return state;
  }
};

// Create context
type AuthContextType = AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } else {
          dispatch({ type: "AUTH_RESET" });
        }
      } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: "Failed to load user" });
      }
    };
    
    loadUser();
  }, []);
  
  // Login handler
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await authService.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ 
        type: "LOGIN_FAILURE", 
        payload: error instanceof Error ? error.message : "Login failed" 
      });
    }
  }, []);
  
  // Register handler
  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: "REGISTER_START" });
    try {
      const user = await authService.register(credentials);
      dispatch({ type: "REGISTER_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ 
        type: "REGISTER_FAILURE", 
        payload: error instanceof Error ? error.message : "Registration failed" 
      });
    }
  }, []);
  
  // Logout handler
  const logout = useCallback(async (): Promise<void> => {
    dispatch({ type: "LOGOUT_START" });
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (error) {
      dispatch({ 
        type: "LOGOUT_FAILURE", 
        payload: error instanceof Error ? error.message : "Logout failed" 
      });
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
