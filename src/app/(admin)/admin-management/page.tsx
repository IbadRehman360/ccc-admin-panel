'use client';

import { useState } from 'react';
import { Shield, UserPlus, Edit, Trash2, Search, Filter, Mail, Calendar, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserAvatar } from '@/components/layout/UserAvatar';

const adminData = [
  {
    id: 1,
    name: 'John Anderson',
    email: 'john.anderson@admin.com',
    role: 'Super Admin',
    status: 'Active',
    createdDate: '2025-01-15',
    permissions: ['Full Access']
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@admin.com',
    role: 'Admin',
    status: 'Active',
    createdDate: '2025-03-20',
    permissions: ['User Management', 'Business Management', 'Reports']
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'm.chen@admin.com',
    role: 'Admin',
    status: 'Active',
    createdDate: '2025-05-10',
    permissions: ['Content Management', 'Community Management']
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.r@admin.com',
    role: 'Admin',
    status: 'Inactive',
    createdDate: '2025-07-22',
    permissions: ['Ad Management', 'Job Management']
  },
  {
    id: 5,
    name: 'David Thompson',
    email: 'd.thompson@admin.com',
    role: 'Admin',
    status: 'Active',
    createdDate: '2025-09-05',
    permissions: ['Report Management', 'Notification Management']
  },
];

export default function AdminManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [editAdmin, setEditAdmin] = useState({
    name: '',
    email: '',
    role: 'Admin',
    permissions: [] as string[]
  });
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'Admin',
    password: '',
    permissions: [] as string[]
  });

  const handleCreateAdmin = () => {
    console.log('Creating admin:', newAdmin);
    setShowCreateDialog(false);
    setNewAdmin({ name: '', email: '', role: 'Admin', password: '', permissions: [] });
  };

  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setEditAdmin({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: [...admin.permissions]
    });
    setShowEditDialog(true);
  };

  const handleUpdateAdmin = () => {
    console.log('Updating admin:', selectedAdmin.id, editAdmin);
    setShowEditDialog(false);
    setSelectedAdmin(null);
  };

  const handleRevokeAccess = (admin: any) => {
    setSelectedAdmin(admin);
    setShowRevokeDialog(true);
  };

  const confirmRevokeAccess = () => {
    console.log('Revoking access for:', selectedAdmin);
    setShowRevokeDialog(false);
    setSelectedAdmin(null);
  };

  const handleDeleteAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAdmin = () => {
    console.log('Deleting admin:', selectedAdmin);
    setShowDeleteDialog(false);
    setSelectedAdmin(null);
  };

  const filteredAdmins = adminData.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || admin.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-2">Manage admin users and their permissions</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#195440] hover:bg-[#195440]/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Admins</CardTitle>
            <Shield className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <p className="text-sm text-gray-600 mt-1">1 Super Admin, 4 Admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Admins</CardTitle>
            <Shield className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">4</div>
            <p className="text-sm text-gray-600 mt-1">Currently Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Admins</CardTitle>
            <Shield className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1</div>
            <p className="text-sm text-gray-600 mt-1">Suspended or Inactive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Logins</CardTitle>
            <Calendar className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-sm text-gray-600 mt-1">Logged in today</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={admin.name} size="sm" />
                        <span className="font-medium">{admin.name}</span>
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
                        className={admin.role === 'Super Admin' ? 'bg-[#195440]' : 'bg-[#E1B047]'}
                      >
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.status === 'Active' ? 'default' : 'secondary'}
                        className={admin.status === 'Active' ? 'bg-green-600' : ''}
                      >
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.slice(0, 2).map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {admin.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{admin.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {admin.role !== 'Super Admin' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAccess(admin)}
                              className="border-orange-500 text-orange-600 hover:bg-orange-50"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="w-[95vw] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>
              Add a new administrator to the system with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="admin-name">Full Name</Label>
              <Input
                id="admin-name"
                placeholder="Enter full name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter secure password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="admin-role">Role</Label>
              <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}>
                <SelectTrigger id="admin-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['User Management', 'Business Management', 'Content Management', 'Report Management', 'Ad Management', 'Job Management'].map((perm) => (
                  <div key={perm} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={perm}
                      className="rounded border-gray-300"
                      checked={newAdmin.permissions.includes(perm)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAdmin({ ...newAdmin, permissions: [...newAdmin.permissions, perm] });
                        } else {
                          setNewAdmin({ ...newAdmin, permissions: newAdmin.permissions.filter(p => p !== perm) });
                        }
                      }}
                    />
                    <Label htmlFor={perm} className="text-sm font-normal cursor-pointer">
                      {perm}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin} className="bg-[#195440] hover:bg-[#195440]/90">
              Create Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-[95vw] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update admin details and permissions for {selectedAdmin?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={editAdmin.name}
                onChange={(e) => setEditAdmin({ ...editAdmin, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="admin@example.com"
                value={editAdmin.email}
                onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editAdmin.role} onValueChange={(value) => setEditAdmin({ ...editAdmin, role: value })}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['User Management', 'Business Management', 'Content Management', 'Report Management', 'Ad Management', 'Job Management'].map((perm) => (
                  <div key={perm} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${perm}`}
                      className="rounded border-gray-300"
                      checked={editAdmin.permissions.includes(perm)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditAdmin({ ...editAdmin, permissions: [...editAdmin.permissions, perm] });
                        } else {
                          setEditAdmin({ ...editAdmin, permissions: editAdmin.permissions.filter(p => p !== perm) });
                        }
                      }}
                    />
                    <Label htmlFor={`edit-${perm}`} className="text-sm font-normal cursor-pointer">
                      {perm}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} className="bg-[#195440] hover:bg-[#195440]/90">
              Update Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Access Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Admin Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke admin access for {selectedAdmin?.name}? They will be marked as inactive but their account will remain in the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRevokeAccess}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedAdmin?.name}? This action cannot be undone and will remove all their data from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAdmin}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
