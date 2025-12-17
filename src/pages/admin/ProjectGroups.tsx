import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Users, Pencil, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectGroup {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  members?: { id: string; profile_id: string; profile?: { name: string; employee_id: string } }[];
}

interface Profile {
  id: string;
  name: string;
  employee_id: string;
}

const ProjectGroups = () => {
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [selectedProfileId, setSelectedProfileId] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchProfiles();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('project_groups')
      .select(`
        *,
        members:project_group_members(
          id,
          profile_id,
          profile:profiles(name, employee_id)
        )
      `)
      .order('name');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setGroups(data || []);
    }
    setLoading(false);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id, name, employee_id').order('name');
    setProfiles(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGroup) {
      const { error } = await supabase
        .from('project_groups')
        .update({ name: formData.name, description: formData.description || null })
        .eq('id', editingGroup.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Group updated successfully' });
        fetchGroups();
        closeDialog();
      }
    } else {
      const { error } = await supabase
        .from('project_groups')
        .insert({ name: formData.name, description: formData.description || null });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Group created successfully' });
        fetchGroups();
        closeDialog();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    const { error } = await supabase.from('project_groups').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Group deleted successfully' });
      fetchGroups();
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !selectedProfileId) return;

    const { error } = await supabase
      .from('project_group_members')
      .insert({ group_id: selectedGroup.id, profile_id: selectedProfileId });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Member added successfully' });
      fetchGroups();
      setSelectedProfileId('');
      setIsMemberDialogOpen(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const { error } = await supabase.from('project_group_members').delete().eq('id', memberId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Member removed' });
      fetchGroups();
    }
  };

  const openEditDialog = (group: ProjectGroup) => {
    setEditingGroup(group);
    setFormData({ name: group.name, description: group.description || '' });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingGroup(null);
    setFormData({ name: '', description: '' });
  };

  const openMemberDialog = (group: ProjectGroup) => {
    setSelectedGroup(group);
    setIsMemberDialogOpen(true);
  };

  const getMemberIds = (group: ProjectGroup) => {
    return group.members?.map(m => m.profile_id) || [];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Groups</h1>
          <p className="text-muted-foreground mt-1">Organize employees into project teams</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => closeDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGroup ? 'Edit Group' : 'Create Group'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Group Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Project Alpha"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" className="flex-1">
                  {editingGroup ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member to {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Employee</Label>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-input bg-background"
                required
              >
                <option value="">Select an employee</option>
                {profiles
                  .filter(p => !getMemberIds(selectedGroup || { members: [] } as ProjectGroup).includes(p.id))
                  .map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} ({profile.employee_id})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsMemberDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="flex-1">
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Groups Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No project groups found. Create one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(group)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(group.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {group.members?.length || 0} members
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => openMemberDialog(group)} className="ml-auto">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.members?.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      {member.profile?.name || 'Unknown'}
                      <span className="ml-1 opacity-60">×</span>
                    </Badge>
                  ))}
                  {(!group.members || group.members.length === 0) && (
                    <span className="text-sm text-muted-foreground">No members yet</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGroups;
