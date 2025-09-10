import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  MessageCircle, 
  Send, 
  Calendar as CalendarIcon, 
  User, 
  Star,
  Clock,
  Video,
  Phone,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Mentor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: string;
  avatar: string;
  price: string;
  availability: string;
}

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Career Guidance',
    rating: 4.9,
    experience: '10+ years',
    avatar: '👩‍🏫',
    price: '₹1,500/session',
    availability: 'Available today'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    specialization: 'Academic Planning',
    rating: 4.8,
    experience: '8+ years',
    avatar: '👨‍💼',
    price: '₹1,200/session',
    availability: 'Available tomorrow'
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    specialization: 'Study Strategies',
    rating: 4.9,
    experience: '12+ years',
    avatar: '👩‍💻',
    price: '₹1,800/session',
    availability: 'Available today'
  }
];

export const PersonalCounseling = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI counseling assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<'chat' | 'mentors'>('chat');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(newMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string) => {
    const responses = [
      "That's a great question! Based on your interests in " + userMessage.toLowerCase() + ", I'd recommend exploring some online courses first.",
      "I understand your concern. Many students face similar challenges. Have you considered breaking down your goals into smaller, manageable steps?",
      "It sounds like you're on the right track! For career guidance, you might want to book a session with one of our mentors.",
      "That's an interesting perspective. Let me suggest some resources that might help you with this topic.",
      "I can help you with that! Would you like me to provide some specific strategies or connect you with a mentor?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleBookMentor = (mentorId: string) => {
    // In a real app, this would open a booking flow
    alert('Booking functionality would be implemented here!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Personal Counseling</h2>
        <p className="text-muted-foreground">Get guidance and support for your academic journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          onClick={() => setActiveTab('chat')}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          AI Assistant
        </Button>
        <Button 
          variant={activeTab === 'mentors' ? 'default' : 'outline'}
          onClick={() => setActiveTab('mentors')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Book Mentor
        </Button>
      </div>

      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-card h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Counseling Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about career planning, study strategies, or academic concerns
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Help Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  'Career guidance',
                  'Study strategies',
                  'Exam preparation',
                  'Time management',
                  'Goal setting',
                  'Stress management'
                ].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setNewMessage(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Career Planning</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Study Strategies</p>
                      <p className="text-xs text-muted-foreground">3 days ago, 4:15 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mentors List */}
          <div className="lg:col-span-2 space-y-4">
            {mockMentors.map((mentor) => (
              <Card key={mentor.id} className="shadow-card hover:shadow-elevated transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{mentor.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{mentor.name}</h3>
                          <p className="text-muted-foreground">{mentor.specialization}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-xp-gold fill-current" />
                              <span className="text-sm font-medium">{mentor.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{mentor.experience}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{mentor.price}</div>
                          <Badge variant="secondary" className="mt-1">
                            {mentor.availability}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => handleBookMentor(mentor.id)}
                          className="bg-gradient-primary hover:bg-primary-dark transition-smooth"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Book Video Call
                        </Button>
                        <Button variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Voice Call
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Calendar */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'].map((time) => (
                    <Button key={time} variant="outline" size="sm">
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};