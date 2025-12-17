import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  Star, 
  Clock, 
  Users, 
  ExternalLink,
  BookOpen,
  Play,
  DollarSign,
  Send
} from 'lucide-react';
import { courses } from '@/data/mockData';
import { Course } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const categories = ['All', 'Cloud Computing', 'Leadership', 'Data Science', 'Security', 'Web Development', 'Project Management'];
const providers = ['All', 'Internal', 'Udemy', 'Coursera', 'LinkedIn Learning'];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesProvider = selectedProvider === 'All' || course.provider === selectedProvider;
    return matchesSearch && matchesCategory && matchesProvider;
  });

  const internalCourses = filteredCourses.filter(c => !c.isExternal);
  const externalCourses = filteredCourses.filter(c => c.isExternal);

  const handleApplyClick = (course: Course) => {
    setSelectedCourse(course);
    setIsApplyDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground mt-1">Discover learning opportunities to grow your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 px-4 rounded-lg border border-input bg-background text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="h-11 px-4 rounded-lg border border-input bg-background text-sm"
          >
            {providers.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Courses ({filteredCourses.length})</TabsTrigger>
          <TabsTrigger value="internal">Internal ({internalCourses.length})</TabsTrigger>
          <TabsTrigger value="external">External ({externalCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-0">
          <CourseGrid courses={filteredCourses} onSelect={setSelectedCourse} onApply={handleApplyClick} />
        </TabsContent>
        <TabsContent value="internal" className="space-y-0">
          <CourseGrid courses={internalCourses} onSelect={setSelectedCourse} onApply={handleApplyClick} />
        </TabsContent>
        <TabsContent value="external" className="space-y-0">
          <CourseGrid courses={externalCourses} onSelect={setSelectedCourse} onApply={handleApplyClick} />
        </TabsContent>
      </Tabs>

      {/* Course Detail Modal */}
      {selectedCourse && !isApplyDialogOpen && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
          onApply={() => setIsApplyDialogOpen(true)}
        />
      )}

      {/* Apply for Course Dialog */}
      {selectedCourse && isApplyDialogOpen && (
        <ApplyForCourseDialog
          course={selectedCourse}
          onClose={() => {
            setIsApplyDialogOpen(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
};

interface CourseGridProps {
  courses: Course[];
  onSelect: (c: Course) => void;
  onApply: (c: Course) => void;
}

const CourseGrid = ({ courses, onSelect, onApply }: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="text-muted-foreground">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="overflow-hidden hover-lift cursor-pointer group"
          onClick={() => onSelect(course)}
        >
          <div className="relative">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <Button variant="secondary" size="sm">
                <Play className="h-4 w-4 mr-2" />
                View Course
              </Button>
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant={course.isExternal ? "outline" : "secondary"} className="backdrop-blur-sm bg-background/80">
                {course.provider}
              </Badge>
            </div>
            {course.reimbursementEligible && (
              <div className="absolute top-3 right-3">
                <Badge variant="success" className="backdrop-blur-sm">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Reimbursable
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge variant="muted">{course.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-warning mr-1 fill-warning" />
                {course.rating}
              </div>
            </div>
            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.enrolledCount.toLocaleString()}
                </span>
              </div>
              <Badge variant={
                course.level === 'Beginner' ? 'success' : 
                course.level === 'Intermediate' ? 'warning' : 
                'secondary'
              }>
                {course.level}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
  onApply: () => void;
}

const CourseDetailModal = ({ course, onClose, onApply }: CourseDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-auto animate-slide-up">
        <div className="relative">
          <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-4 right-4"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{course.provider}</Badge>
            <Badge variant="muted">{course.category}</Badge>
            <Badge variant={
              course.level === 'Beginner' ? 'success' : 
              course.level === 'Intermediate' ? 'warning' : 
              'secondary'
            }>
              {course.level}
            </Badge>
          </div>

          <h2 className="text-2xl font-bold">{course.title}</h2>
          <p className="text-muted-foreground">{course.description}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning fill-warning" />
              <span>{course.rating} rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{course.enrolledCount.toLocaleString()} enrolled</span>
            </div>
          </div>

          {course.isExternal && course.price && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Course Price</p>
                  <p className="text-2xl font-bold">${course.price}</p>
                </div>
                {course.reimbursementEligible && (
                  <Badge variant="success" className="text-sm px-3 py-1">
                    Reimbursement Eligible
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {course.isExternal ? (
              <>
                <Button variant="gradient" className="flex-1" onClick={onApply}>
                  <Send className="h-4 w-4 mr-2" />
                  Apply for Course
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on {course.provider}
                </Button>
              </>
            ) : (
              <Button variant="gradient" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start Course
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ApplyForCourseDialogProps {
  course: Course;
  onClose: () => void;
}

const ApplyForCourseDialog = ({ course, onClose }: ApplyForCourseDialogProps) => {
  const { user, profileId } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [managerProfile, setManagerProfile] = useState<any>(null);
  const [emailTemplate, setEmailTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    reason: '',
    courseUrl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch current user's profile
      if (profileId) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, manager:profiles!profiles_manager_id_fkey(id, name, email)')
          .eq('id', profileId)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
          if (profileData.manager) {
            setManagerProfile(profileData.manager);
          }
        }
      }

      // Fetch email template
      const { data: templateData } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', 'Course Approval Request')
        .maybeSingle();

      if (templateData) {
        setEmailTemplate(templateData);
      }
    };

    fetchData();
  }, [profileId]);

  const replacePlaceholders = (text: string) => {
    return text
      .replace(/\{\{employee_name\}\}/g, profile?.name || '')
      .replace(/\{\{course_name\}\}/g, course.title)
      .replace(/\{\{course_provider\}\}/g, course.provider)
      .replace(/\{\{estimated_cost\}\}/g, course.price?.toString() || 'N/A')
      .replace(/\{\{reason\}\}/g, formData.reason);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create course request in database
      const { error } = await supabase
        .from('course_requests')
        .insert({
          requester_id: profileId!,
          manager_id: profile?.manager_id || null,
          course_name: course.title,
          course_provider: course.provider,
          course_url: formData.courseUrl || null,
          estimated_cost: course.price || null,
          reason: formData.reason || null,
          status: 'pending'
        });

      if (error) throw error;

      // Open mailto with template
      if (managerProfile?.email) {
        const subject = emailTemplate?.subject 
          ? encodeURIComponent(replacePlaceholders(emailTemplate.subject))
          : encodeURIComponent(`Course Approval Request: ${course.title}`);
        
        const body = emailTemplate?.body
          ? encodeURIComponent(replacePlaceholders(emailTemplate.body))
          : encodeURIComponent(`Dear ${managerProfile.name},\n\nI would like to request approval for the course "${course.title}" by ${course.provider}.\n\nEstimated Cost: $${course.price || 'N/A'}\n\nReason: ${formData.reason}\n\nThank you.`);
        
        let mailtoUrl = `mailto:${managerProfile.email}?subject=${subject}&body=${body}`;
        
        if (emailTemplate?.cc) {
          mailtoUrl += `&cc=${encodeURIComponent(emailTemplate.cc)}`;
        }
        if (emailTemplate?.bcc) {
          mailtoUrl += `&bcc=${encodeURIComponent(emailTemplate.bcc)}`;
        }

        window.open(mailtoUrl, '_blank');
      }

      toast({
        title: 'Request Submitted',
        description: 'Your course approval request has been submitted to your manager.'
      });

      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit request',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-muted">
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-muted-foreground">{course.provider} • ${course.price || 'Free'}</p>
          </div>

          {managerProfile ? (
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm text-muted-foreground">Approval request will be sent to:</p>
              <p className="font-medium">{managerProfile.name}</p>
              <p className="text-sm text-muted-foreground">{managerProfile.email}</p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning">No manager assigned. Please contact admin.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Course URL (optional)</Label>
            <Input
              value={formData.courseUrl}
              onChange={(e) => setFormData({ ...formData, courseUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Reason for taking this course</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Explain how this course will help your career development..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="gradient" 
              className="flex-1" 
              disabled={loading || !managerProfile}
            >
              {loading ? 'Submitting...' : 'Submit & Send Email'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Courses;
