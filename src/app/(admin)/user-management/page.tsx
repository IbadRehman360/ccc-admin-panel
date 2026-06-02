'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Ban, Trash2, CheckCircle, MoreVertical,
  TrendingUp, Mail, MapPin, Activity, Users, UserCheck, FileText,
  Image as ImageIcon, Download, Loader2,
} from 'lucide-react';
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
import {
  useListUsersQuery,
  useGetUserStatsQuery,
  useGetUserDetailQuery,
  useGetUserDocumentsQuery,
  useSetUserStatusMutation,
  useDeleteUserMutation,
  type UserRow,
} from '@/store/api/usersApi';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const getStatusBadge = (status: 'Active' | 'Suspended') => {
  if (status === 'Active') return <Badge className="bg-green-600">Active</Badge>;
  return <Badge variant="destructive">Suspended</Badge>;
};

const getCompletionColor = (c: number) => {
  if (c >= 80) return 'bg-[#195440]';
  if (c >= 50) return 'bg-[#E1B047]';
  return 'bg-orange-500';
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function UserManagementPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'complete' | 'incomplete'>('all');

  const { data: stats } = useGetUserStatsQuery();
  const { data: list, isFetching } = useListUsersQuery({
    search,
    status: statusFilter,
    completion: completionFilter,
    page: 1,
    limit: 50,
  });

  const [setStatus, { isLoading: updating }] = useSetUserStatusMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [action, setAction] = useState<'suspend' | 'activate' | 'delete' | null>(null);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const openProfile = (u: UserRow) => {
    setSelected(u);
    setShowProfile(true);
  };

  const openAction = (u: UserRow, a: 'suspend' | 'activate' | 'delete') => {
    setSelected(u);
    setAction(a);
    setReason('');
    setError(null);
    setShowAction(true);
  };

  const confirmAction = async () => {
    if (!selected || !action) return;
    setError(null);
    try {
      if (action === 'suspend') {
        await setStatus({ id: selected.id, is_blocked: true, reason }).unwrap();
      } else if (action === 'activate') {
        await setStatus({ id: selected.id, is_blocked: false }).unwrap();
      } else if (action === 'delete') {
        await deleteUser({ id: selected.id, reason }).unwrap();
      }
      setShowAction(false);
      setSelected(null);
      setAction(null);
      setReason('');
    } catch (e) {
      setError(extractError(e));
    }
  };

  const rows = list?.data ?? [];

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.total ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">All registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            <UserCheck className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.active ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle>
            <Ban className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.suspended ?? '—'}</div>
            <p className="text-sm text-gray-600 mt-1">Access restricted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Profile Completion</CardTitle>
            <Activity className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E1B047]">{stats ? `${stats.avg_completion_pct}%` : '—'}</div>
            <p className="text-sm text-gray-600 mt-1">% with completed profile</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Accounts</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'active' | 'suspended')}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={completionFilter} onValueChange={(v) => setCompletionFilter(v as 'all' | 'complete' | 'incomplete')}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Profiles</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No users found</TableCell></TableRow>
                ) : rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={u.name || u.email} size="sm" />
                        <span className="font-medium">{u.name || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{u.email}</TableCell>
                    <TableCell className="text-gray-600">
                      {u.location ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {u.location}
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.profile_status === 'Complete' ? 'default' : 'secondary'}
                        className={u.profile_status === 'Complete' ? 'bg-[#195440]' : ''}
                      >
                        {u.profile_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${getCompletionColor(u.completion)}`} style={{ width: `${u.completion}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-600 min-w-[35px]">{u.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(u.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(u.joined_date)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfile(u)}>
                            <Eye className="w-4 h-4 mr-2" />View Profile
                          </DropdownMenuItem>
                          {u.status === 'Active' ? (
                            <DropdownMenuItem onClick={() => openAction(u, 'suspend')}>
                              <Ban className="w-4 h-4 mr-2" />Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openAction(u, 'activate')}>
                              <CheckCircle className="w-4 h-4 mr-2" />Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openAction(u, 'delete')} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {list && (
            <p className="text-sm text-gray-500 mt-3">
              Showing {rows.length} of {list.pagination.total} users
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>User Profile {selected?.name ? `— ${selected.name}` : ''}</DialogTitle>
            <DialogDescription>Complete user information and activity</DialogDescription>
          </DialogHeader>
          {selected && <UserProfileBody userId={selected.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)} className="w-full sm:w-auto">Close</Button>
            {selected?.status === 'Active' && (
              <Button variant="destructive" onClick={() => { setShowProfile(false); openAction(selected, 'suspend'); }} className="w-full sm:w-auto">
                <Ban className="w-4 h-4 mr-2" />Suspend
              </Button>
            )}
            {selected?.status === 'Suspended' && (
              <Button className="bg-[#195440] hover:bg-[#195440]/90 w-full sm:w-auto" onClick={() => { setShowProfile(false); openAction(selected, 'activate'); }}>
                <CheckCircle className="w-4 h-4 mr-2" />Activate
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={showAction} onOpenChange={setShowAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'suspend' && 'Suspend User'}
              {action === 'activate' && 'Activate User'}
              {action === 'delete' && 'Delete User'}
            </DialogTitle>
            <DialogDescription>
              {action === 'suspend' && `Suspend ${selected?.name || selected?.email}? All their sessions will be revoked.`}
              {action === 'activate' && `Re-activate ${selected?.name || selected?.email}?`}
              {action === 'delete' && `Permanently delete ${selected?.name || selected?.email}? Cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          {(action === 'suspend' || action === 'delete') && (
            <div className="px-6 space-y-2">
              <Label htmlFor="reason">
                Reason {action === 'delete' ? '*' : '(optional)'}
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter detailed reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">Logged in the audit trail</p>
            </div>
          )}
          {error && (
            <div className="mx-6 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAction(false)}>Cancel</Button>
            <Button
              variant={action === 'delete' ? 'destructive' : 'default'}
              className={action === 'activate' ? 'bg-[#195440] hover:bg-[#195440]/90' : ''}
              onClick={confirmAction}
              disabled={(action === 'delete' && !reason.trim()) || updating || deleting}
            >
              {action === 'suspend' && <><Ban className="w-4 h-4 mr-2" />{updating ? 'Suspending...' : 'Confirm Suspension'}</>}
              {action === 'activate' && <><CheckCircle className="w-4 h-4 mr-2" />{updating ? 'Activating...' : 'Confirm Activation'}</>}
              {action === 'delete' && <><Trash2 className="w-4 h-4 mr-2" />{deleting ? 'Deleting...' : 'Confirm Deletion'}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserProfileBody({ userId }: { userId: string }) {
  const { data: detail, isLoading } = useGetUserDetailQuery(userId);
  const { data: documents = [], isLoading: docsLoading } = useGetUserDocumentsQuery(userId);
  const [tab, setTab] = useState('details');

  if (isLoading || !detail) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(85vh-180px)] pb-6">
      <Tabs value={tab} onValueChange={setTab} className="pt-4">
        <div className="px-4 sm:px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Profile Details</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="space-y-4 mt-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="User ID" value={<code className="text-xs text-[#195440]">{detail.id}</code>} />
            <Field label="Status" value={getStatusBadge(detail.status)} />
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={detail.name || '—'} />
              <Field label="Email" value={<span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{detail.email}</span>} />
              <Field label="Phone" value={detail.phone || '—'} />
              <Field label="Location" value={detail.location || '—'} />
              <Field label="Country" value={detail.country || '—'} />
              <Field label="Gender" value={detail.gender || '—'} />
              <Field label="Profession" value={detail.profession || '—'} />
              <Field label="Account Type" value={detail.account_type} />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Profile Completion</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${getCompletionColor(detail.completion)}`} style={{ width: `${detail.completion}%` }}></div>
              </div>
              <span className="font-medium text-base min-w-[45px]">{detail.completion}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <FlagRow label="Email Verified" v={detail.is_email_verified} />
              <FlagRow label="Phone Verified" v={detail.is_phone_verified} />
              <FlagRow label="Profile Completed" v={detail.is_profile_completed} />
              <FlagRow label="Preferences Set" v={detail.is_preference_completed} />
            </div>
            {detail.bio && (
              <div className="mt-4">
                <Label className="text-gray-600">Bio</Label>
                <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg leading-relaxed">{detail.bio}</p>
              </div>
            )}
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <Stat label="Logins" value={detail.total_logins} />
              <Stat label="Communities" value={detail.community_memberships} />
              <Stat label="Events" value={detail.events_attended} />
              <Stat label="Posts" value={detail.posts_created} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Verification Status" value={
              detail.is_document_verified
                ? <Badge className="bg-green-600">Verified</Badge>
                : <Badge variant="secondary">Unverified</Badge>
            } />
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Uploaded Documents</h3>
            {docsLoading ? (
              <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
            ) : documents.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium text-sm">No documents uploaded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const isImage = doc.type === 'PROFILE_PICTURE' || doc.type === 'BUSINESS_LOGO';
                  return (
                    <div key={doc.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {isImage ? <ImageIcon className="w-5 h-5 text-[#195440] flex-shrink-0 mt-0.5" /> : <FileText className="w-5 h-5 text-[#195440] flex-shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-sm">{doc.name}</p>
                              <Badge variant="outline" className="text-xs">{doc.type.replace(/_/g, ' ')}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(doc.upload_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-auto">
                          <a href={doc.file_url} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Eye className="w-3 h-3 sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </a>
                          <a href={doc.file_url} download>
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Download className="w-3 h-3" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <Label className="text-gray-600">{label}</Label>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function FlagRow({ label, v }: { label: string; v: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {v ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
      )}
      <span className={v ? 'text-gray-900' : 'text-gray-500'}>{label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
