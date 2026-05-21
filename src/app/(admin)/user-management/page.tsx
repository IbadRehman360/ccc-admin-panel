'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Ban, Trash2, CheckCircle, MoreVertical, TrendingUp, Mail, MapPin, Activity, Shield, FileText, UserCheck, Users, Download, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/layout/UserAvatar';
import Link from 'next/link';

const usersData = [
  { id: 'USR001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567', location: 'New York, NY', profileStatus: 'Complete', completion: 100, status: 'Active', joinedDate: '2026-01-15', lastActive: '2 hours ago', lastActiveDate: '2026-02-19 10:30 AM', bio: 'Tech enthusiast and entrepreneur. Love connecting with like-minded people.', interests: ['Technology', 'Business', 'Networking'], communityMemberships: 12, eventsAttended: 8, postsCreated: 45, businessOwned: 'Tech Solutions Inc', totalLogins: 234, averageSessionTime: '45 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2026-01-15', fileUrl: '#', size: '2.4 MB' }, { name: 'Government ID', type: 'ID Verification', status: 'Verified', uploadDate: '2026-01-15', fileUrl: '#', size: '1.8 MB' }, { name: 'Proof of Address', type: 'Address Verification', status: 'Verified', uploadDate: '2026-01-15', fileUrl: '#', size: '1.2 MB' }], verificationStatus: 'Verified', idVerified: true, addressVerified: true },
  { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 (555) 234-5678', location: 'Los Angeles, CA', profileStatus: 'Complete', completion: 95, status: 'Active', joinedDate: '2026-01-20', lastActive: '1 day ago', lastActiveDate: '2026-02-18 03:15 PM', bio: 'Marketing professional passionate about community building.', interests: ['Marketing', 'Social Media', 'Community'], communityMemberships: 8, eventsAttended: 15, postsCreated: 67, businessOwned: null, totalLogins: 189, averageSessionTime: '32 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2026-01-20', fileUrl: '#', size: '3.1 MB' }, { name: 'Government ID', type: 'ID Verification', status: 'Verified', uploadDate: '2026-01-20', fileUrl: '#', size: '2.0 MB' }, { name: 'Proof of Address', type: 'Address Verification', status: 'Pending Review', uploadDate: '2026-01-21', fileUrl: '#', size: '1.5 MB' }], verificationStatus: 'Partially Verified', idVerified: true, addressVerified: false },
  { id: 'USR003', name: 'Mike Johnson', email: 'mike.j@example.com', phone: '+1 (555) 345-6789', location: 'Chicago, IL', profileStatus: 'Incomplete', completion: 65, status: 'Active', joinedDate: '2026-02-01', lastActive: '3 hours ago', lastActiveDate: '2026-02-19 09:00 AM', bio: 'Sports enthusiast looking to connect with local fitness groups.', interests: ['Sports', 'Fitness', 'Health'], communityMemberships: 5, eventsAttended: 3, postsCreated: 12, businessOwned: null, totalLogins: 56, averageSessionTime: '28 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2026-02-01', fileUrl: '#', size: '1.9 MB' }, { name: 'Government ID', type: 'ID Verification', status: 'Pending Review', uploadDate: '2026-02-02', fileUrl: '#', size: '2.3 MB' }], verificationStatus: 'Pending Verification', idVerified: false, addressVerified: false },
  { id: 'USR004', name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '+1 (555) 456-7890', location: 'Houston, TX', profileStatus: 'Complete', completion: 100, status: 'Suspended', joinedDate: '2025-12-10', lastActive: '1 week ago', lastActiveDate: '2026-02-12 11:45 AM', bio: 'Food blogger and restaurant reviewer.', interests: ['Food', 'Travel', 'Photography'], communityMemberships: 15, eventsAttended: 22, postsCreated: 134, businessOwned: "Sarah's Kitchen", totalLogins: 456, averageSessionTime: '52 mins', suspensionReason: 'Multiple reports of spam content', suspendedDate: '2026-02-12', suspendedBy: 'Admin (John Admin)', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2025-12-10', fileUrl: '#', size: '2.7 MB' }, { name: 'Government ID', type: 'ID Verification', status: 'Verified', uploadDate: '2025-12-10', fileUrl: '#', size: '1.9 MB' }], verificationStatus: 'Verified', idVerified: true, addressVerified: true },
  { id: 'USR005', name: 'David Brown', email: 'david.brown@example.com', phone: '+1 (555) 567-8901', location: 'Phoenix, AZ', profileStatus: 'Incomplete', completion: 45, status: 'Active', joinedDate: '2026-02-10', lastActive: '5 hours ago', lastActiveDate: '2026-02-19 07:00 AM', bio: null, interests: ['Music', 'Arts'], communityMemberships: 2, eventsAttended: 1, postsCreated: 3, businessOwned: null, totalLogins: 23, averageSessionTime: '15 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Pending Review', uploadDate: '2026-02-10', fileUrl: '#', size: '1.5 MB' }], verificationStatus: 'Unverified', idVerified: false, addressVerified: false },
  { id: 'USR006', name: 'Emily Rodriguez', email: 'emily.r@example.com', phone: '+1 (555) 678-9012', location: 'Philadelphia, PA', profileStatus: 'Complete', completion: 100, status: 'Active', joinedDate: '2025-11-05', lastActive: '30 mins ago', lastActiveDate: '2026-02-19 11:30 AM', bio: 'Small business owner and community advocate.', interests: ['Business', 'Entrepreneurship', 'Networking'], communityMemberships: 18, eventsAttended: 35, postsCreated: 89, businessOwned: 'Beauty Salon Elite', totalLogins: 567, averageSessionTime: '48 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2025-11-05', fileUrl: '#', size: '2.2 MB' }, { name: 'Government ID', type: 'ID Verification', status: 'Verified', uploadDate: '2025-11-05', fileUrl: '#', size: '2.1 MB' }], verificationStatus: 'Verified', idVerified: true, addressVerified: true },
  { id: 'USR007', name: 'Robert Taylor', email: 'robert.t@example.com', phone: '+1 (555) 789-0123', location: 'San Antonio, TX', profileStatus: 'Complete', completion: 88, status: 'Active', joinedDate: '2026-01-03', lastActive: '2 days ago', lastActiveDate: '2026-02-17 09:20 AM', bio: 'Real estate professional helping families find their dream homes.', interests: ['Real Estate', 'Business', 'Finance'], communityMemberships: 9, eventsAttended: 12, postsCreated: 34, businessOwned: 'Taylor Realty', totalLogins: 145, averageSessionTime: '38 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2026-01-03', fileUrl: '#', size: '2.5 MB' }], verificationStatus: 'Verified', idVerified: true, addressVerified: true },
  { id: 'USR008', name: 'Lisa Anderson', email: 'lisa.a@example.com', phone: '+1 (555) 890-1234', location: 'San Diego, CA', profileStatus: 'Incomplete', completion: 52, status: 'Active', joinedDate: '2026-02-15', lastActive: '6 hours ago', lastActiveDate: '2026-02-19 06:00 AM', bio: 'Yoga instructor and wellness coach.', interests: ['Health', 'Wellness', 'Yoga'], communityMemberships: 4, eventsAttended: 6, postsCreated: 18, businessOwned: null, totalLogins: 34, averageSessionTime: '22 mins', documents: [{ name: 'Profile Photo', type: 'Image', status: 'Verified', uploadDate: '2026-02-15', fileUrl: '#', size: '1.8 MB' }], verificationStatus: 'Pending Verification', idVerified: false, addressVerified: false },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'suspend' | 'delete' | 'activate' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [profileTab, setProfileTab] = useState('details');

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    const matchesCompletion = completionFilter === 'all' || (completionFilter === 'complete' && user.completion === 100) || (completionFilter === 'incomplete' && user.completion < 100);
    return matchesSearch && matchesStatus && matchesCompletion;
  });

  const handleAction = (user: any, action: 'suspend' | 'delete' | 'activate') => {
    setSelectedUser(user); setDialogAction(action); setShowActionDialog(true);
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user); setShowProfileDialog(true);
  };

  const confirmAction = () => {
    setShowActionDialog(false); setActionReason('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge className="bg-green-600">Active</Badge>;
      case 'Suspended': return <Badge variant="destructive">Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'bg-[#195440]';
    if (completion >= 50) return 'bg-[#E1B047]';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all user accounts</p>
        </div>
        <Link href="/user-analytics">
          <Button className="bg-[#195440] hover:bg-[#195440]/90">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle><Users className="w-5 h-5 text-gray-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-gray-900">12,458</div><p className="text-sm text-gray-600 mt-1">All registered accounts</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle><UserCheck className="w-5 h-5 text-green-600" /></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">10,234</div><p className="text-sm text-gray-600 mt-1">Currently active</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle><Ban className="w-5 h-5 text-red-600" /></CardHeader><CardContent><div className="text-3xl font-bold text-red-600">124</div><p className="text-sm text-gray-600 mt-1">Access restricted</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Profile Completion</CardTitle><Activity className="w-5 h-5 text-[#E1B047]" /></CardHeader><CardContent><div className="text-3xl font-bold text-[#E1B047]">78%</div><p className="text-sm text-gray-600 mt-1">Average completion</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>User Accounts</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="deleted">Deleted</SelectItem></SelectContent>
            </Select>
            <Select value={completionFilter} onValueChange={setCompletionFilter}>
              <SelectTrigger className="w-[180px]"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Profile" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Profiles</SelectItem><SelectItem value="complete">Complete</SelectItem><SelectItem value="incomplete">Incomplete</SelectItem></SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead>
                  <TableHead>Profile Status</TableHead><TableHead>Completion</TableHead><TableHead>Account Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-[#195440]">{user.id}</TableCell>
                    <TableCell><div className="flex items-center gap-2"><UserAvatar name={user.name} size="sm" /><span className="font-medium">{user.name}</span></div></TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600"><div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{user.location}</div></TableCell>
                    <TableCell><Badge variant={user.profileStatus === 'Complete' ? 'default' : 'secondary'} className={user.profileStatus === 'Complete' ? 'bg-[#195440]' : ''}>{user.profileStatus}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${getCompletionColor(user.completion)}`} style={{ width: `${user.completion}%` }}></div></div>
                        <span className="text-sm text-gray-600 min-w-[35px]">{user.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8"><MoreVertical className="w-4 h-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(user)}><Eye className="w-4 h-4 mr-2" />View Full Profile</DropdownMenuItem>
                          {user.status === 'Active' ? (
                            <DropdownMenuItem onClick={() => handleAction(user, 'suspend')}><Ban className="w-4 h-4 mr-2" />Suspend Account</DropdownMenuItem>
                          ) : user.status === 'Suspended' ? (
                            <DropdownMenuItem onClick={() => handleAction(user, 'activate')}><CheckCircle className="w-4 h-4 mr-2" />Activate Account</DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem onClick={() => handleAction(user, 'delete')} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>User Profile - {selectedUser?.name}</DialogTitle>
            <DialogDescription>Complete user information and account details</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] pb-6">
            {selectedUser && (
              <Tabs value={profileTab} onValueChange={setProfileTab} className="pt-4">
                <div className="px-4 sm:px-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Profile Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="details" className="space-y-4 mt-4 px-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label className="text-gray-600">User ID</Label><p className="font-medium text-[#195440] mt-1">{selectedUser.id}</p></div>
                    <div><Label className="text-gray-600">Account Status</Label><div className="mt-1">{getStatusBadge(selectedUser.status)}</div></div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-base mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label className="text-gray-600">Full Name</Label><div className="flex items-center gap-2 mt-1"><UserAvatar name={selectedUser.name} size="sm" /><p className="font-medium">{selectedUser.name}</p></div></div>
                      <div><Label className="text-gray-600">Email Address</Label><div className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4 text-gray-400 flex-shrink-0" /><p className="truncate text-sm">{selectedUser.email}</p></div></div>
                      <div><Label className="text-gray-600">Phone Number</Label><p className="mt-1">{selectedUser.phone}</p></div>
                      <div><Label className="text-gray-600">Location</Label><div className="flex items-center gap-2 mt-1"><MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" /><p className="text-sm">{selectedUser.location}</p></div></div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-base mb-3">Profile Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Profile Completion</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${getCompletionColor(selectedUser.completion)}`} style={{ width: `${selectedUser.completion}%` }}></div></div>
                          <span className="font-medium text-base min-w-[45px]">{selectedUser.completion}%</span>
                        </div>
                      </div>
                      <div><Label className="text-gray-600">Profile Status</Label><div className="mt-2"><Badge variant={selectedUser.profileStatus === 'Complete' ? 'default' : 'secondary'} className={selectedUser.profileStatus === 'Complete' ? 'bg-[#195440]' : ''}>{selectedUser.profileStatus}</Badge></div></div>
                    </div>
                    {selectedUser.bio && <div className="mt-4"><Label className="text-gray-600">Bio</Label><p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg leading-relaxed">{selectedUser.bio}</p></div>}
                    <div className="mt-4"><Label className="text-gray-600">Interests</Label><div className="flex flex-wrap gap-2 mt-2">{selectedUser.interests.map((interest: string, idx: number) => (<Badge key={idx} variant="outline" className="text-xs">{interest}</Badge>))}</div></div>
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="space-y-4 mt-4 px-4 sm:px-6">
                  <div>
                    <h3 className="font-semibold text-base mb-3">Verification Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div><Label className="text-gray-600">Overall Status</Label><div className="mt-1"><Badge variant={selectedUser.verificationStatus === 'Verified' ? 'default' : 'secondary'} className={selectedUser.verificationStatus === 'Verified' ? 'bg-[#195440]' : ''}>{selectedUser.verificationStatus}</Badge></div></div>
                      <div><Label className="text-gray-600">ID Verification</Label><div className="mt-1">{selectedUser.idVerified ? <Badge className="bg-green-600">Verified</Badge> : <Badge variant="secondary">Not Verified</Badge>}</div></div>
                      <div><Label className="text-gray-600">Address Verification</Label><div className="mt-1">{selectedUser.addressVerified ? <Badge className="bg-green-600">Verified</Badge> : <Badge variant="secondary">Not Verified</Badge>}</div></div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-base mb-3">Uploaded Documents</h3>
                    {selectedUser.documents && selectedUser.documents.length > 0 ? (
                      <div className="space-y-3">
                        {selectedUser.documents.map((doc: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                {doc.type === 'Image' ? <ImageIcon className="w-5 h-5 text-[#195440] flex-shrink-0 mt-0.5" /> : <FileText className="w-5 h-5 text-[#195440] flex-shrink-0 mt-0.5" />}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2"><p className="font-medium text-sm">{doc.name}</p><Badge variant="outline" className="text-xs">{doc.type}</Badge></div>
                                  <div className="flex flex-wrap items-center gap-3 mt-1"><p className="text-xs text-gray-500">{doc.uploadDate}</p><p className="text-xs text-gray-500">{doc.size}</p></div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:ml-auto">
                                <Badge variant={doc.status === 'Verified' ? 'default' : doc.status === 'Pending Review' ? 'secondary' : 'destructive'} className={doc.status === 'Verified' ? 'bg-[#195440]' : ''}>{doc.status}</Badge>
                                <div className="flex gap-1">
                                  <Button variant="outline" size="sm" className="h-8 px-2"><Eye className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">View</span></Button>
                                  <Button variant="outline" size="sm" className="h-8 px-2"><Download className="w-3 h-3" /></Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed"><FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" /><p className="text-gray-600 font-medium text-sm">No Documents Uploaded</p></div>
                    )}
                  </div>
                  {selectedUser.documents && selectedUser.documents.length > 0 && (
                    <>
                      <Separator />
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2 text-sm"><Shield className="w-4 h-4" />Document Verification Notes</h4>
                        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                          <li>All documents are encrypted and stored securely</li>
                          <li>Documents are reviewed within 24-48 hours of submission</li>
                          <li>Verified documents cannot be deleted for audit purposes</li>
                        </ul>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}
            {selectedUser?.status === 'Suspended' && (
              <div className="mt-4 mx-4 sm:mx-6 bg-red-50 border border-red-200 rounded-lg p-3">
                <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2 text-sm"><Ban className="w-4 h-4" />Account Suspension Details</h3>
                <div className="space-y-1 text-xs">
                  <div><span className="text-red-700 font-medium">Reason: </span><span className="text-red-800">{(selectedUser as any).suspensionReason}</span></div>
                  <div><span className="text-red-700 font-medium">Suspended On: </span><span className="text-red-800">{(selectedUser as any).suspendedDate}</span></div>
                  <div><span className="text-red-700 font-medium">Suspended By: </span><span className="text-red-800">{(selectedUser as any).suspendedBy}</span></div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfileDialog(false)} className="w-full sm:w-auto">Close</Button>
            {selectedUser?.status === 'Active' && (<Button variant="destructive" onClick={() => { setShowProfileDialog(false); handleAction(selectedUser, 'suspend'); }} className="w-full sm:w-auto"><Ban className="w-4 h-4 mr-2" />Suspend Account</Button>)}
            {selectedUser?.status === 'Suspended' && (<Button className="bg-[#195440] hover:bg-[#195440]/90 w-full sm:w-auto" onClick={() => { setShowProfileDialog(false); handleAction(selectedUser, 'activate'); }}><CheckCircle className="w-4 h-4 mr-2" />Activate Account</Button>)}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'suspend' && 'Suspend User Account'}
              {dialogAction === 'activate' && 'Activate User Account'}
              {dialogAction === 'delete' && 'Delete User Account'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'suspend' && `You are about to suspend ${selectedUser?.name}'s account.`}
              {dialogAction === 'activate' && `You are about to activate ${selectedUser?.name}'s account.`}
              {dialogAction === 'delete' && `You are about to delete ${selectedUser?.name}'s account. This action will be logged.`}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            {(dialogAction === 'suspend' || dialogAction === 'delete') && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reason for {dialogAction === 'suspend' ? 'Suspension' : 'Deletion'} *</Label>
                  <Textarea id="reason" placeholder={`Enter detailed reason...`} value={actionReason} onChange={(e) => setActionReason(e.target.value)} rows={4} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">This will be logged in the audit trail</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>Cancel</Button>
            <Button variant={dialogAction === 'delete' ? 'destructive' : 'default'} className={dialogAction === 'activate' ? 'bg-[#195440] hover:bg-[#195440]/90' : ''} onClick={confirmAction} disabled={(dialogAction === 'suspend' || dialogAction === 'delete') && !actionReason.trim()}>
              {dialogAction === 'suspend' && <><Ban className="w-4 h-4 mr-2" />Confirm Suspension</>}
              {dialogAction === 'activate' && <><CheckCircle className="w-4 h-4 mr-2" />Confirm Activation</>}
              {dialogAction === 'delete' && <><Trash2 className="w-4 h-4 mr-2" />Confirm Deletion</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
