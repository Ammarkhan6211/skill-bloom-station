import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student } from '@/data/mockData';

interface AuthContextType {
  student: Student | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (studentData: Omit<Student, 'id' | 'progress' | 'xp' | 'level' | 'badges'>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, verify against backend
    if (email && password) {
      const mockStudent: Student = {
        id: '1',
        name: 'John Doe',
        age: 20,
        studentContact: '+91 9876543210',
        alternateContact: '+91 9876543211',
        email: email,
        interests: ['Web Development', 'Data Science'],
        marks: 85,
        progress: {
          coursesCompleted: 75,
          quizScore: 80,
          skillsUnlocked: 60,
          gamesCompleted: 40
        },
        xp: 1250,
        level: 3,
        badges: ['First Course', 'Quiz Master']
      };
      setStudent(mockStudent);
      return true;
    }
    return false;
  };

  const register = async (studentData: Omit<Student, 'id' | 'progress' | 'xp' | 'level' | 'badges'>): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      progress: {
        coursesCompleted: 0,
        quizScore: 0,
        skillsUnlocked: 0,
        gamesCompleted: 0
      },
      xp: 0,
      level: 1,
      badges: []
    };
    
    setStudent(newStudent);
    return true;
  };

  const logout = () => {
    setStudent(null);
  };

  const value = {
    student,
    login,
    register,
    logout,
    isAuthenticated: !!student
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};