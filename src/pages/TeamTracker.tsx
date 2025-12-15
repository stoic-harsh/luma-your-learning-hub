import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Users, 
  BookOpen, 
  Award, 
  Clock,
  Check,
  X,
  ChevronRight,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { teamMembers, courseRequests, currentUser } from '@/data/mockData';
import { CourseRequest } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const TeamTracker = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState(courseRequests);

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const approvedRequests = requests.filter(r => r.status === 'Approved' || r.status === 'Completed');

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'Approved' as const, approvedAt: new Date().toISOString() } : r
    ));
    toast({
      title: "Request Approved",
      description: "The course request has been approved successfully.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'Rejected' as const } : r
    ));
    toast({
      title: "Request Rejected",
      description: "The course request has been rejected.",
      variant: "destructive",
    });
  };

  if (currentUser.role === 'employee') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">This page is only available for managers and admins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Team Tracker</h1>
        <p className="text-muted-foreground mt-1">Monitor your team's learning progress and manage requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {teamMembers.reduce((sum, m) => sum + m.completedCourses, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Courses Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {teamMembers.reduce((sum, m) => sum + m.activeCertifications, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Active Certifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="requests">
            Course Requests
            {pendingRequests.length > 0 && (
              <Badge variant="warning" className="ml-2">{pendingRequests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="team">Team Overview</TabsTrigger>
        </TabsList>

        {/* Course Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onApprove={() => handleApprove(request.id)}
                    onReject={() => handleReject(request.id)}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request History</CardTitle>
            </CardHeader>
            <CardContent>
              {approvedRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No approved requests yet</p>
              ) : (
                <div className="space-y-4">
                  {approvedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Overview Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover-lift cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-muted">
                      <p className="text-lg font-bold">{member.completedCourses}</p>
                      <p className="text-xs text-muted-foreground">Courses</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <p className="text-lg font-bold">{member.activeCertifications}</p>
                      <p className="text-xs text-muted-foreground">Certs</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <p className={cn("text-lg font-bold", member.pendingRequests > 0 && "text-warning")}>
                        {member.pendingRequests}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RequestCard = ({ 
  request, 
  onApprove, 
  onReject 
}: { 
  request: CourseRequest; 
  onApprove?: () => void; 
  onReject?: () => void;
}) => {
  const isPending = request.status === 'Pending';

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border",
      isPending && "border-warning/30 bg-warning/5"
    )}>
      <img
        src={request.course.thumbnail}
        alt={request.course.title}
        className="w-full sm:w-32 h-24 object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-medium">{request.course.title}</h4>
            <p className="text-sm text-muted-foreground">
              Requested by <strong>{request.employeeName}</strong>
            </p>
          </div>
          <Badge variant={
            request.status === 'Pending' ? 'warning' :
            request.status === 'Approved' ? 'success' :
            request.status === 'Rejected' ? 'destructive' :
            request.status === 'Completed' ? 'success' :
            'muted'
          }>
            {request.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
          <span>{request.course.provider}</span>
          <span>{request.course.duration}</span>
          {request.course.price && (
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {request.course.price}
            </span>
          )}
        </div>
        {isPending && onApprove && onReject && (
          <div className="flex gap-2">
            <Button variant="success" size="sm" onClick={onApprove}>
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button variant="outline" size="sm" onClick={onReject}>
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
        {request.status === 'Completed' && (
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Proof
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeamTracker;
