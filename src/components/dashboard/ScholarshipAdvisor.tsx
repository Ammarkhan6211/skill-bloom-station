import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockScholarships, Scholarship } from '@/data/mockData';
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ScholarshipAdvisor = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
  const { toast } = useToast();

  const toggleBookmark = (id: string) => {
    setScholarships(scholarships.map(scholarship => 
      scholarship.id === id 
        ? { ...scholarship, isBookmarked: !scholarship.isBookmarked }
        : scholarship
    ));
    
    const scholarship = scholarships.find(s => s.id === id);
    toast({
      title: scholarship?.isBookmarked ? "Bookmark removed" : "Scholarship bookmarked!",
      description: scholarship?.isBookmarked 
        ? "Removed from your saved scholarships" 
        : "Added to your saved scholarships",
    });
  };

  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', text: 'Expired', color: 'destructive' };
    if (diffDays <= 7) return { status: 'urgent', text: `${diffDays} days left`, color: 'destructive' };
    if (diffDays <= 30) return { status: 'soon', text: `${diffDays} days left`, color: 'default' };
    return { status: 'plenty', text: `${diffDays} days left`, color: 'secondary' };
  };

  const bookmarkedScholarships = scholarships.filter(s => s.isBookmarked);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Scholarship Advisor</h2>
        <p className="text-muted-foreground">Find scholarships that match your profile</p>
      </div>

      {/* Bookmarked Scholarships */}
      {bookmarkedScholarships.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkCheck className="h-5 w-5 text-accent" />
              Saved Scholarships
            </CardTitle>
            <CardDescription>Your bookmarked scholarship opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedScholarships.map((scholarship) => {
                const deadline = getDeadlineStatus(scholarship.deadline);
                return (
                  <div key={scholarship.id} className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{scholarship.title}</h4>
                        <p className="text-xs text-muted-foreground">{scholarship.provider}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={deadline.color as any} className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {deadline.text}
                          </Badge>
                          <span className="text-sm font-medium text-accent">{scholarship.amount}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(scholarship.id)}
                      >
                        <BookmarkCheck className="h-4 w-4 text-accent" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Scholarships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scholarships.map((scholarship) => {
          const deadline = getDeadlineStatus(scholarship.deadline);
          
          return (
            <Card key={scholarship.id} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                      <CardDescription>{scholarship.provider}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(scholarship.id)}
                  >
                    {scholarship.isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-accent" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-lg">{scholarship.amount}</span>
                  </div>
                  <Badge variant={deadline.color as any}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {deadline.text}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {scholarship.description}
                </p>

                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Eligibility Criteria:
                  </h5>
                  <div className="space-y-1">
                    {scholarship.eligibility.map((criteria, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        <span className="text-sm">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-gradient-primary hover:bg-primary-dark transition-smooth"
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Card */}
      <Card className="shadow-card bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Scholarship Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Application Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start applications early</li>
                <li>• Keep all documents ready</li>
                <li>• Write compelling essays</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Required Documents:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Academic transcripts</li>
                <li>• Income certificates</li>
                <li>• Recommendation letters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};