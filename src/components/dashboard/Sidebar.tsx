import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Building2,
  GraduationCap,
  Gamepad2,
  MessageCircle,
  Brain,
  Heart,
  LogOut,
  Trophy,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'companies', label: 'Company Connections', icon: Building2 },
  { id: 'scholarships', label: 'Scholarship Advisor', icon: GraduationCap },
  { id: 'learning', label: 'Gamified Learning', icon: Gamepad2 },
  { id: 'counseling', label: 'Personal Counseling', icon: MessageCircle },
  { id: 'quiz', label: 'Quiz & Tests', icon: Brain },
  { id: 'mental-health', label: 'Mental Health', icon: Heart },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { student, logout } = useAuth();

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">EduPlatform</h2>
            <p className="text-sm text-muted-foreground">Learning Hub</p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-accent rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{student?.name}</p>
            <div className="flex items-center gap-2">
              <Trophy className="h-3 w-3 text-xp-gold" />
              <span className="text-xs text-muted-foreground">Level {student?.level} • {student?.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 transition-smooth ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-primary' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
};