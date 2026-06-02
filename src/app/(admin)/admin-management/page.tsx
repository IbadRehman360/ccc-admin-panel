'use client';

import { useMemo, useState } from 'react';
import {
  Shield, UserPlus, Edit, Trash2, Search, Filter, Mail,
  Calendar, Lock, Unlock, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  useListAdminsQuery,
  useGetAdminStatsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useSetAdminStatusMutation,
  useDeleteAdminMutation,
  type AdminRow,
} from '@/store/api/adminsApi';
import { useAppSelector } from '@/store/hooks';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export default function AdminManagementPage() {
  const currentAdminId = useAppSelector((s) => s.auth.admin?.id);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: stats } = useGetAdminStatsQuery();
  const { data: list, isLoading, isFetching } = useListAdminsQuery({
    search,
    status: filterStatus,
    page: 1,
    limit: 50,
  });

  const [createAdmin, { isLoading: creating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: updating }] = useUpdateAdminMutation();
  const [setStatus, { isLoading: settingStatus }] = useSetAdminStatusMutation();
  const [deleteAdmin, { isLoading: deleting }] = useDeleteAdminMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<AdminRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newAdmin, setNewAdmin] = useState({ full_name: '', email: '', password: '' });
  const [editAdmin, setEditAdmin] = useState({ full_name: '', email: '' });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const extractError = (err: unknown) => {
    const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
  };

  const handleCreate = async () => {
    setError(null);
    try {
      await createAdmin(newAdmin).unwrap();
      setNewAdmin({ full_name: '', email: '', password: '' });
      setShowCreate(false);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const openEdit = (admin: AdminRow) => {
    setSelected(admin);
    setEditAdmin({
      full_name: admin.full_name ?? '',
      email: admin.email,
    });
    setError(null);
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setError(null);
    try {
      const body: { id: string; full_name?: string; email?: string } = {
        id: selected.id,
      };
      if (editAdmin.full_name && editAdmin.full_name !== (selected.full_name ?? '')) {
        body.full_name = editAdmin.full_name;
      }
      if (editAdmin.email && editAdmin.email !== selected.email) {
        body.email = editAdmin.email;
      }
      if (!body.full_name && !body.email) {
        setShowEdit(false);
        return;
      }
      await updateAdmin(body).unwrap();
      setShowEdit(false);
      setSelected(null);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const openStatus = (admin: AdminRow) => {
    setSelected(admin);
    setError(null);
    setShowStatus(true);
  };

  const confirmStatus = async () => {
    if (!selected) return;
    setError(null);
    try {
      await setStatus({ id: selected.id, is_blocked: !selected.is_blocked }).unwrap();
      setShowStatus(false);
      setSelected(null);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const openDelete = (admin: AdminRow) => {
    setSelected(admin);
    setError(null);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setError(null);
    try {
      await deleteAdmin(selected.id).unwrap();
      setShowDelete(false);
      setSelected(null);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const rows = useMemo(() => list?.data ?? [], [list]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-2">Manage admin users and their access</p>
        </div>
        <Button
          onClick={() => { setShowCreate(true); setError(null); }}
          className="bg-[#195440] hover:bg-[#195440]/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Admins</CardTitle>
            <Shield className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.total ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">All admin accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            <Shield className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.active ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">Currently Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive</CardTitle>
            <Shield className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.inactive ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">Deactivated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Logins</CardTitle>
            <Calendar className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.recent_logins ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">Logged in today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as 'all' | 'active' | 'inactive')}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Users</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No admins found</TableCell></TableRow>
                ) : rows.map((admin) => {
                  const isSelf = admin.id === currentAdminId;
                  return (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar name={admin.full_name || admin.email} size="sm" />
                          <span className="font-medium">
                            {admin.full_name || '—'}
                            {isSelf && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {admin.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={admin.status === 'Active' ? 'default' : 'secondary'}
                          className={admin.status === 'Active' ? 'bg-green-600' : ''}
                        >
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(admin.last_login)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(admin.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(admin)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          {!isSelf && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openStatus(admin)}
                                className={admin.is_blocked
                                  ? 'border-green-600 text-green-700 hover:bg-green-50'
                                  : 'border-orange-500 text-orange-600 hover:bg-orange-50'}
                              >
                                {admin.is_blocked ? <><Unlock className="w-4 h-4 mr-1" />Activate</> : <><Lock className="w-4 h-4 mr-1" />Revoke</>}
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => openDelete(admin)}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>Add a new admin account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="c-name">Full Name</Label>
              <Input
                id="c-name"
                placeholder="Enter full name"
                value={newAdmin.full_name}
                onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-email">Email Address</Label>
              <Input
                id="c-email"
                type="email"
                placeholder="admin@example.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-password">Password</Label>
              <Input
                id="c-password"
                type="password"
                placeholder="Min 6 characters"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !newAdmin.email || !newAdmin.password || !newAdmin.full_name}
              className="bg-[#195440] hover:bg-[#195440]/90"
            >
              {creating ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>Update name or email for {selected?.full_name || selected?.email}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="e-name">Full Name</Label>
              <Input
                id="e-name"
                value={editAdmin.full_name}
                onChange={(e) => setEditAdmin({ ...editAdmin, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="e-email">Email Address</Label>
              <Input
                id="e-email"
                type="email"
                value={editAdmin.email}
                onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updating} className="bg-[#195440] hover:bg-[#195440]/90">
              {updating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Toggle Dialog */}
      <Dialog open={showStatus} onOpenChange={setShowStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.is_blocked ? 'Activate Admin' : 'Revoke Admin Access'}</DialogTitle>
            <DialogDescription>
              {selected?.is_blocked
                ? `Re-activate ${selected?.full_name || selected?.email}? They will be able to log in again.`
                : `Revoke access for ${selected?.full_name || selected?.email}? All their sessions will be deleted and they will not be able to log in until reactivated.`}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 mx-6">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatus(false)}>Cancel</Button>
            <Button
              onClick={confirmStatus}
              disabled={settingStatus}
              className={selected?.is_blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {selected?.is_blocked
                ? <><Unlock className="w-4 h-4 mr-2" />{settingStatus ? 'Activating...' : 'Activate'}</>
                : <><Lock className="w-4 h-4 mr-2" />{settingStatus ? 'Revoking...' : 'Revoke Access'}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin User</DialogTitle>
            <DialogDescription>
              Permanently delete {selected?.full_name || selected?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 mx-6">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
