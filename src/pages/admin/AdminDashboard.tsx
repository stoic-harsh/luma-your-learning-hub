import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, Mail, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    groups: 0,
    templates: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [employeesRes, groupsRes, templatesRes, requestsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('project_groups').select('id', { count: 'exact', head: true }),
        supabase.from('email_templates').select('id', { count: 'exact', head: true }),
        supabase.from('course_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        employees: employeesRes.count || 0,
        groups: groupsRes.count || 0,
        templates: templatesRes.count || 0,
        pendingRequests: requestsRes.count || 0
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Employees', value: stats.employees, icon: Users, color: 'text-secondary' },
    { title: 'Project Groups', value: stats.groups, icon: FolderKanban, color: 'text-accent' },
    { title: 'Email Templates', value: stats.templates, icon: Mail, color: 'text-success' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: FileText, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage employees, groups, and settings</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
