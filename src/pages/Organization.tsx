import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Award, Eye, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type ProgressStatus = 'Pending Approval' | 'Not Started' | 'In Progress' | 'Completed';

interface CertificationRecord {
  id: string;
  employeeName: string;
  empCode: string;
  employeeRole: string;
  certificationName: string;
  teamManager: string;
  location: string;
  progress: ProgressStatus;
  requestDate: string;
  approvalDate: string | null;
  completionDate: string | null;
  department: string;
}

const dummyData: CertificationRecord[] = [
  {
    id: '1',
    employeeName: 'Rajesh Kumar',
    empCode: 'EMP001',
    employeeRole: 'Senior Analyst',
    certificationName: 'AWS Solutions Architect',
    teamManager: 'Priya Sharma',
    location: 'Gurgaon',
    progress: 'Completed',
    requestDate: '2024-08-15',
    approvalDate: '2024-08-18',
    completionDate: '2024-11-20',
    department: 'Data Engineering',
  },
  {
    id: '2',
    employeeName: 'Anita Patel',
    empCode: 'EMP002',
    employeeRole: 'Business Analyst',
    certificationName: 'Tableau Desktop Specialist',
    teamManager: 'Vikram Singh',
    location: 'Pune',
    progress: 'In Progress',
    requestDate: '2024-09-10',
    approvalDate: '2024-09-12',
    completionDate: null,
    department: 'Analytics',
  },
  {
    id: '3',
    employeeName: 'Michael Chen',
    empCode: 'EMP003',
    employeeRole: 'Data Engineer',
    certificationName: 'Databricks Certified Associate',
    teamManager: 'Priya Sharma',
    location: 'San Francisco',
    progress: 'Pending Approval',
    requestDate: '2024-12-01',
    approvalDate: null,
    completionDate: null,
    department: 'Data Engineering',
  },
  {
    id: '4',
    employeeName: 'Sarah Johnson',
    empCode: 'EMP004',
    employeeRole: 'Programmer Analyst',
    certificationName: 'Azure Data Engineer',
    teamManager: 'Vikram Singh',
    location: 'Boston',
    progress: 'Completed',
    requestDate: '2024-07-20',
    approvalDate: '2024-07-22',
    completionDate: '2024-10-15',
    department: 'Cloud Services',
  },
  {
    id: '5',
    employeeName: 'Amit Verma',
    empCode: 'EMP005',
    employeeRole: 'Senior Analyst',
    certificationName: 'IQVIA Certified Professional',
    teamManager: 'Priya Sharma',
    location: 'Gurgaon',
    progress: 'In Progress',
    requestDate: '2024-10-05',
    approvalDate: '2024-10-08',
    completionDate: null,
    department: 'Pharma Analytics',
  },
  {
    id: '6',
    employeeName: 'Emily Davis',
    empCode: 'EMP006',
    employeeRole: 'Intern',
    certificationName: 'Python for Data Science',
    teamManager: 'Vikram Singh',
    location: 'Princeton',
    progress: 'Not Started',
    requestDate: '2024-11-15',
    approvalDate: '2024-11-18',
    completionDate: null,
    department: 'Analytics',
  },
  {
    id: '7',
    employeeName: 'Neha Gupta',
    empCode: 'EMP007',
    employeeRole: 'Business Analyst',
    certificationName: 'Power BI Data Analyst',
    teamManager: 'Priya Sharma',
    location: 'Gurgaon',
    progress: 'Completed',
    requestDate: '2024-06-10',
    approvalDate: '2024-06-12',
    completionDate: '2024-09-25',
    department: 'Analytics',
  },
  {
    id: '8',
    employeeName: 'James Wilson',
    empCode: 'EMP008',
    employeeRole: 'Data Engineer',
    certificationName: 'Snowflake SnowPro Core',
    teamManager: 'Vikram Singh',
    location: 'Chicago',
    progress: 'In Progress',
    requestDate: '2024-10-20',
    approvalDate: '2024-10-23',
    completionDate: null,
    department: 'Data Engineering',
  },
  {
    id: '9',
    employeeName: 'Pooja Reddy',
    empCode: 'EMP009',
    employeeRole: 'Senior Analyst',
    certificationName: 'SAS Certified Specialist',
    teamManager: 'Priya Sharma',
    location: 'Pune',
    progress: 'Pending Approval',
    requestDate: '2024-12-05',
    approvalDate: null,
    completionDate: null,
    department: 'Pharma Analytics',
  },
  {
    id: '10',
    employeeName: 'David Brown',
    empCode: 'EMP010',
    employeeRole: 'Programmer Analyst',
    certificationName: 'Google Cloud Professional',
    teamManager: 'Vikram Singh',
    location: 'San Francisco',
    progress: 'Completed',
    requestDate: '2024-05-15',
    approvalDate: '2024-05-18',
    completionDate: '2024-08-30',
    department: 'Cloud Services',
  },
];

const COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--secondary))', 'hsl(var(--muted-foreground))'];

const getProgressBadgeVariant = (progress: ProgressStatus) => {
  switch (progress) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'warning';
    case 'Pending Approval':
      return 'secondary';
    case 'Not Started':
      return 'muted';
    default:
      return 'default';
  }
};

const CertificationTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<CertificationRecord | null>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return dummyData;
    const query = searchQuery.toLowerCase();
    return dummyData.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(query) ||
        record.empCode.toLowerCase().includes(query) ||
        record.certificationName.toLowerCase().includes(query) ||
        record.teamManager.toLowerCase().includes(query) ||
        record.location.toLowerCase().includes(query) ||
        record.department.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Chart data based on filtered results
  const locationChartData = useMemo(() => {
    const locationCounts: Record<string, number> = {};
    filteredData.forEach((record) => {
      if (record.progress === 'Completed') {
        locationCounts[record.location] = (locationCounts[record.location] || 0) + 1;
      }
    });
    return Object.entries(locationCounts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const progressChartData = useMemo(() => {
    const progressCounts: Record<ProgressStatus, number> = {
      'Completed': 0,
      'In Progress': 0,
      'Pending Approval': 0,
      'Not Started': 0,
    };
    filteredData.forEach((record) => {
      progressCounts[record.progress]++;
    });
    return Object.entries(progressCounts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const departmentChartData = useMemo(() => {
    const deptCounts: Record<string, number> = {};
    filteredData.forEach((record) => {
      deptCounts[record.department] = (deptCounts[record.department] || 0) + 1;
    });
    return Object.entries(deptCounts).map(([name, certifications]) => ({ name, certifications }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-secondary" />
          Certification Tracker
        </CardTitle>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, certification, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Table */}
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Approval Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No records found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div>
                        {record.employeeName}
                        <span className="text-muted-foreground text-xs ml-1">({record.empCode})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{record.employeeRole}</TableCell>
                    <TableCell className="text-sm">{record.certificationName}</TableCell>
                    <TableCell className="text-sm">{record.teamManager}</TableCell>
                    <TableCell className="text-sm">{record.location}</TableCell>
                    <TableCell>
                      <Badge variant={getProgressBadgeVariant(record.progress) as any}>
                        {record.progress}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{record.requestDate}</TableCell>
                    <TableCell className="text-sm">{record.approvalDate || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCert(record)}
                        disabled={record.progress !== 'Completed'}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Certifications by Location */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Progress Distribution */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progress Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {progressChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Certifications by Department */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="certifications" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      {/* Certification View Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              Certification Details
            </DialogTitle>
          </DialogHeader>
          {selectedCert && (
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
                  <Award className="h-12 w-12 text-success" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{selectedCert.certificationName}</h3>
                <p className="text-muted-foreground">Awarded to {selectedCert.employeeName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee Code</p>
                  <p className="font-medium">{selectedCert.empCode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedCert.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedCert.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed On</p>
                  <p className="font-medium">{selectedCert.completionDate}</p>
                </div>
              </div>
              <Button className="w-full" variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CertificationTracker;
