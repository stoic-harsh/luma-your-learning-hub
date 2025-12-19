import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Map,
  Play,
  CheckCircle
} from 'lucide-react';
import { learningProgress, certifications, courseRequests, currentUser } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { RoadmapTrackModal, getTrackById } from '@/components/RoadmapTrackModal';

const pharmaRoadmapTracks = [
  {
    id: 'iqvia-dataset',
    title: 'IQVIA Dataset',
    description: 'Master pharmaceutical data analysis with IQVIA datasets',
    duration: '40 hours',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering Fundamentals',
    description: 'Build scalable data pipelines and ETL processes',
    duration: '50 hours',
  },
  {
    id: 'dqm-qc',
    title: 'DQM / QC Framework',
    description: 'Implement data quality management and QC processes',
    duration: '35 hours',
  },
];

const Dashboard = () => {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const completedCourses = learningProgress.filter(p => p.status === 'Completed').length;
  const inProgressCourses = learningProgress.filter(p => p.status === 'In Progress').length;
  const activeCerts = certifications.filter(c => c.status === 'Active').length;
  const pendingRequests = courseRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Continue your learning journey</p>
        </div>
        {currentUser.role === 'manager' && pendingRequests > 0 && (
          <Link to="/team">
            <Badge variant="warning" className="px-4 py-2 text-sm cursor-pointer hover:opacity-90">
              {pendingRequests} pending approval{pendingRequests > 1 ? 's' : ''}
            </Badge>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses In Progress</p>
                <p className="text-3xl font-bold mt-1">{inProgressCourses}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
                <p className="text-3xl font-bold mt-1">{completedCourses}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certifications Completed</p>
                <p className="text-3xl font-bold mt-1">{activeCerts}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Hours</p>
                <p className="text-3xl font-bold mt-1">47</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Continue Learning</CardTitle>
              <Link to="/courses">
                <Button variant="ghost" size="sm">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningProgress
                .filter(p => p.status === 'In Progress')
                .map((item) => (
                  <div
                    key={item.courseId}
                    className="flex gap-4 p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors group cursor-pointer"
                  >
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium truncate group-hover:text-secondary transition-colors">
                            {item.course.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{item.course.duration}</p>
                        </div>
                        <Button variant="secondary" size="icon-sm" className="flex-shrink-0">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={item.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-muted-foreground">{item.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Recent Certifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">My Certifications</CardTitle>
              <Link to="/certifications">
                <Button variant="ghost" size="sm">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {certifications.slice(0, 4).map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border"
                  >
                    {cert.badgeUrl ? (
                      <img src={cert.badgeUrl} alt={cert.name} className="h-12 w-12 object-contain" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Award className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{cert.name}</h4>
                      <p className="text-xs text-muted-foreground">{cert.provider}</p>
                      <Badge 
                        variant={cert.status === 'Active' ? 'success' : cert.status === 'In Progress' ? 'warning' : 'muted'}
                        className="mt-1"
                      >
                        {cert.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pharma Personalized Roadmap */}
        <div className="space-y-6">
          <Card className="border-secondary/30 bg-gradient-to-b from-secondary/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
                  <Map className="h-4 w-4 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Pharma Personalized Roadmap</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start a track to become an expert in pharma data.
              </p>
              {pharmaRoadmapTracks.map((track) => (
                <div
                  key={track.id}
                  className="p-4 rounded-lg bg-card border border-border hover:border-secondary/50 transition-colors group"
                >
                  <h4 className="font-medium text-sm mb-1 group-hover:text-secondary transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {track.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">{track.duration}</span>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => setSelectedTrackId(track.id)}
                    >
                      Start Track
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full gradient-accent-bg flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Learning Streak</p>
                  <p className="text-2xl font-bold">7 days</p>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Roadmap Track Modal */}
      <RoadmapTrackModal
        isOpen={!!selectedTrackId}
        onClose={() => setSelectedTrackId(null)}
        track={selectedTrackId ? getTrackById(selectedTrackId) : null}
      />
    </div>
  );
};

export default Dashboard;
