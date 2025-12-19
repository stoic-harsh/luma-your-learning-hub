import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Award, 
  Calendar, 
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';
import { certifications } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Certifications = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCerts = certifications.filter((cert) =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCerts = filteredCerts.filter(c => c.status === 'Active');
  const inProgressCerts = filteredCerts.filter(c => c.status === 'In Progress');
  const expiredCerts = filteredCerts.filter(c => c.status === 'Expired');
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Certifications</h1>
          <p className="text-muted-foreground mt-1">Track and manage your professional certifications</p>
        </div>
        <Button variant="gradient">
          <Award className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCerts.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressCerts.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiredCerts.length}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search certifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Certification Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({filteredCerts.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCerts.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressCerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-0">
          <CertificationGrid certifications={filteredCerts} />
        </TabsContent>
        <TabsContent value="active" className="space-y-0">
          <CertificationGrid certifications={activeCerts} />
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-0">
          <CertificationGrid certifications={inProgressCerts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CertificationGrid = ({ certifications: certs }: { certifications: typeof import('@/data/mockData').certifications }) => {
  if (certs.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No certifications found</h3>
        <p className="text-muted-foreground">Start earning certifications to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {certs.map((cert) => (
        <Card key={cert.id} className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {cert.badgeUrl ? (
                <img src={cert.badgeUrl} alt={cert.name} className="h-16 w-16 object-contain" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Badge 
                  variant={
                    cert.status === 'Active' ? 'success' : 
                    cert.status === 'In Progress' ? 'warning' : 
                    cert.status === 'Expired' ? 'destructive' :
                    'muted'
                  }
                  className="mb-2"
                >
                  {cert.status}
                </Badge>
                <h3 className="font-semibold line-clamp-2">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.provider}</p>
              </div>
            </div>

            {(cert.dateEarned || cert.expiryDate) && (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                {cert.dateEarned && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Earned
                    </span>
                    <span>{new Date(cert.dateEarned).toLocaleDateString()}</span>
                  </div>
                )}
                {cert.expiryDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Expires
                    </span>
                    <span className={cn(
                      new Date(cert.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && "text-warning"
                    )}>
                      {new Date(cert.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {cert.status === 'Active' && (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </>
              )}
              {cert.status === 'In Progress' && (
                <Button variant="gradient" size="sm" className="w-full">
                  DEADLINE
                </Button>
              )}
              {cert.status === 'Expired' && (
                <Button variant="outline" size="sm" className="w-full">
                  Renew Certification
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Certifications;
