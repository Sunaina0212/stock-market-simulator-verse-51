
import { LoginCredentials, RegisterCredentials, User } from "../types";

// Mock user database
const mockUsers: Record<string, User> = {
  "user1@example.com": {
    id: "user1",
    name: "Demo User",
    email: "user1@example.com",
    balance: 100000, // $100,000 starting balance
  }
};

// Mock passwords (in real app, use hashed passwords)
const mockPasswords: Record<string, string> = {
  "user1@example.com": "password123"
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate network request
    await delay(800);
    
    const { email, password } = credentials;
    const user = mockUsers[email];
    
    if (!user || mockPasswords[email] !== password) {
      throw new Error("Invalid email or password");
    }
    
    // Store auth token in localStorage (in a real app, use secure HTTP-only cookies)
    localStorage.setItem("auth_token", JSON.stringify({ userId: user.id }));
    
    return user;
  },
  
  register: async (credentials: RegisterCredentials): Promise<User> => {
    await delay(800);
    
    const { name, email, password } = credentials;
    
    if (mockUsers[email]) {
      throw new Error("User with this email already exists");
    }
    
    const newUser: User = {
      id: `user${Object.keys(mockUsers).length + 1}`,
      name,
      email,
      balance: 100000, // $100,000 starting balance
    };
    
    // Save new user
    mockUsers[email] = newUser;
    mockPasswords[email] = password;
    
    // Store auth token
    localStorage.setItem("auth_token", JSON.stringify({ userId: newUser.id }));
    
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem("auth_token");
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    await delay(500);
    
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) return null;
    
    try {
      const { userId } = JSON.parse(authToken);
      const user = Object.values(mockUsers).find(user => user.id === userId);
      return user || null;
    } catch (error) {
      localStorage.removeItem("auth_token");
      return null;
    }
  }
};
