'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, CheckCircle, XCircle, Building2, MapPin, Mail, Phone,
  FileText, ExternalLink, Calendar, Users, Ban, Trash2, Shield, Loader2,
  MoreVertical, Image as ImageIcon, Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  useListBusinessesQuery,
  useGetBusinessStatsQuery,
  useGetBusinessDetailQuery,
  useGetBusinessDocumentsQuery,
  useVerifyBusinessMutation,
  useSetBusinessStatusMutation,
  useDeleteBusinessMutation,
  type BusinessRow,
  type BusinessType,
} from '@/store/api/businessesApi';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const statusBadge = (s: 'Active' | 'Pending' | 'Suspended') => {
  if (s === 'Active') return <Badge className="bg-green-600">Active</Badge>;
  if (s === 'Pending') return <Badge className="bg-yellow-500">Pending</Badge>;
  return <Badge variant="destructive">Suspended</Badge>;
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function BusinessManagementPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<BusinessType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'verification'>('date');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetBusinessStatsQuery();
  const { data: list, isFetching } = useListBusinessesQuery({
    search,
    type: typeFilter,
    status: statusFilter,
    verified: verifiedFilter,
    sort_by: sortBy,
    page,
    limit: 25,
  });

  const [verify, { isLoading: verifying }] = useVerifyBusinessMutation();
  const [setStatus, { isLoading: updating }] = useSetBusinessStatusMutation();
  const [deleteBiz, { isLoading: deleting }] = useDeleteBusinessMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [action, setAction] = useState<'verify' | 'unverify' | 'suspend' | 'activate' | 'delete' | null>(null);
  const [selected, setSelected] = useState<BusinessRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openProfile = (b: BusinessRow) => {
    setSelected(b);
    setShowProfile(true);
  };

  const openAction = (b: BusinessRow, a: typeof action) => {
    setSelected(b);
    setAction(a);
    setReason('');
    setError(null);
    setShowAction(true);
  };

  const confirmAction = async () => {
    if (!selected || !action) return;
    setError(null);
    try {
      if (action === 'verify') {
        await verify({ id: selected.id, approved: true, notes: reason }).unwrap();
      } else if (action === 'unverify') {
        await verify({ id: selected.id, approved: false }).unwrap();
      } else if (action === 'suspend') {
        await setStatus({ id: selected.id, is_blocked: true, reason }).unwrap();
      } else if (action === 'activate') {
        await setStatus({ id: selected.id, is_blocked: false }).unwrap();
      } else if (action === 'delete') {
        await deleteBiz({ id: selected.id, reason }).unwrap();
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
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
        <p className="text-gray-600 mt-2">Verify, suspend, and moderate businesses</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <Building2 className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.total ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Verified</CardTitle>
            <Shield className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.verified ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unverified</CardTitle>
            <Shield className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.unverified ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Claim</CardTitle>
            <Calendar className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats?.pending ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle>
            <Ban className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.suspended ?? '—'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Businesses</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search business, owner, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as BusinessType | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DIVERSE">Diverse-Owned</SelectItem>
                <SelectItem value="CORPORATION">Corporation</SelectItem>
                <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as typeof statusFilter); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v as typeof verifiedFilter); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Verified" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="verification">Verified first</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Go</Button>
            </div>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No businesses found</TableCell></TableRow>
                ) : rows.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={b.name} size="sm" />
                        <span className="font-medium">{b.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{b.owner || '—'}</div>
                        <div className="text-xs text-gray-500">{b.owner_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {b.type_display
                        ? <Badge variant="outline">{b.type_display}</Badge>
                        : <span className="text-gray-400 text-sm">—</span>}
                    </TableCell>
                    <TableCell>
                      {b.location ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[180px]">{b.location}</span>
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      {b.verified
                        ? <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>
                        : <Badge variant="secondary">Unverified</Badge>}
                    </TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(b.joined_date)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfile(b)}>
                            <Eye className="w-4 h-4 mr-2" />View Profile
                          </DropdownMenuItem>
                          {b.verified ? (
                            <DropdownMenuItem onClick={() => openAction(b, 'unverify')}>
                              <XCircle className="w-4 h-4 mr-2" />Mark Unverified
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openAction(b, 'verify')}>
                              <CheckCircle className="w-4 h-4 mr-2" />Verify
                            </DropdownMenuItem>
                          )}
                          {b.status === 'Suspended' ? (
                            <DropdownMenuItem onClick={() => openAction(b, 'activate')}>
                              <CheckCircle className="w-4 h-4 mr-2" />Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openAction(b, 'suspend')}>
                              <Ban className="w-4 h-4 mr-2" />Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openAction(b, 'delete')} className="text-red-600">
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
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Page {list.pagination.page} of {totalPages} — {list.pagination.total.toLocaleString()} total
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selected?.name || '—'}</DialogTitle>
            <DialogDescription>Owner: {selected?.owner || selected?.owner_email}</DialogDescription>
          </DialogHeader>
          {selected && <BusinessProfileBody businessId={selected.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)} className="w-full sm:w-auto">Close</Button>
            {selected && !selected.verified && (
              <Button onClick={() => { setShowProfile(false); openAction(selected, 'verify'); }} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <CheckCircle className="w-4 h-4 mr-2" />Verify
              </Button>
            )}
            {selected?.status === 'Active' && (
              <Button variant="destructive" onClick={() => { setShowProfile(false); openAction(selected, 'suspend'); }} className="w-full sm:w-auto">
                <Ban className="w-4 h-4 mr-2" />Suspend
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
              {action === 'verify' && 'Verify Business'}
              {action === 'unverify' && 'Unverify Business'}
              {action === 'suspend' && 'Suspend Business'}
              {action === 'activate' && 'Activate Business'}
              {action === 'delete' && 'Delete Business'}
            </DialogTitle>
            <DialogDescription>
              {action === 'verify' && `Mark "${selected?.name}" as verified.`}
              {action === 'unverify' && `Remove verification from "${selected?.name}".`}
              {action === 'suspend' && `Suspend "${selected?.name}"? All sessions will be revoked.`}
              {action === 'activate' && `Re-activate "${selected?.name}"?`}
              {action === 'delete' && `Permanently delete "${selected?.name}"? Cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          {(action === 'verify' || action === 'suspend' || action === 'delete') && (
            <div className="px-6 space-y-2">
              <Label htmlFor="b-reason">
                {action === 'verify' ? 'Verification notes (optional)' : `Reason ${action === 'delete' ? '*' : '(optional)'}`}
              </Label>
              <Textarea
                id="b-reason"
                placeholder="..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
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
              variant={action === 'delete' || action === 'suspend' ? 'destructive' : 'default'}
              className={action === 'verify' || action === 'activate' ? 'bg-[#195440] hover:bg-[#195440]/90' : ''}
              onClick={confirmAction}
              disabled={(action === 'delete' && !reason.trim()) || verifying || updating || deleting}
            >
              {(verifying || updating || deleting) ? 'Working...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BusinessProfileBody({ businessId }: { businessId: string }) {
  const { data: detail, isLoading } = useGetBusinessDetailQuery(businessId);
  const { data: documents = [], isLoading: docsLoading } = useGetBusinessDocumentsQuery(businessId);
  const [tab, setTab] = useState('details');

  if (isLoading || !detail) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="overflow-y-auto max-h-[calc(85vh-180px)] pb-6">
      <Tabs value={tab} onValueChange={setTab} className="pt-4">
        <div className="px-4 sm:px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="space-y-4 mt-4 px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Name" value={detail.name} />
            <Field label="Type" value={detail.type_display || '—'} />
            <Field label="Industry" value={detail.industry || '—'} />
            <Field label="EIN" value={detail.ein_number || '—'} />
            <Field label="Verified" value={detail.verified ? <Badge className="bg-green-600">Yes</Badge> : <Badge variant="secondary">No</Badge>} />
            <Field label="Status" value={statusBadge(detail.status)} />
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Owner</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={detail.owner || '—'} />
              <Field label="Email" value={<span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{detail.owner_email}</span>} />
              <Field label="Phone" value={detail.owner_phone ? <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{detail.owner_phone}</span> : '—'} />
              <Field label="Account Type" value={detail.account_type} />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Location & Web</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address" value={detail.address || '—'} />
              <Field label="City / State" value={[detail.city, detail.state].filter(Boolean).join(', ') || '—'} />
              <Field label="Zip Code" value={detail.zip_code || '—'} />
              <Field
                label="Website"
                value={
                  detail.website ? (
                    <a href={detail.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      {detail.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : '—'
                }
              />
            </div>
          </div>
          {(detail.description || detail.mission) && (
            <>
              <Separator />
              <div>
                {detail.description && (
                  <div className="mb-4">
                    <Label className="text-gray-600">About</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">{detail.description}</p>
                  </div>
                )}
                {detail.mission && (
                  <div>
                    <Label className="text-gray-600">Mission</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">{detail.mission}</p>
                  </div>
                )}
              </div>
            </>
          )}
          {detail.social_links.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-base mb-3">Social Links</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.social_links.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer">
                      <Badge variant="outline" className="hover:bg-gray-50">
                        {s.name} <ExternalLink className="w-3 h-3 ml-1" />
                      </Badge>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Activity</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Followers" value={detail.followers} />
              <Stat label="Joined" value={formatDate(detail.joined_date)} />
              <Stat label="Last Active" value={formatDate(detail.last_active_date)} />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-3">Profile Flags</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <FlagRow label="Email Verified" v={detail.is_email_verified} />
              <FlagRow label="Phone Verified" v={detail.is_phone_verified} />
              <FlagRow label="Information Completed" v={!!detail.is_information_completed} />
              <FlagRow label="Visibility & Certificates" v={!!detail.is_visibility_and_certificates_completed} />
              <FlagRow label="Commitments" v={!!detail.is_commitments_completed} />
              <FlagRow label="ESG Data" v={!!detail.is_esg_data_completed} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-4 px-4 sm:px-6">
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
                const isImage = doc.type === 'BUSINESS_LOGO' || doc.type === 'PROFILE_PICTURE';
                return (
                  <div key={doc.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {isImage ? <ImageIcon className="w-5 h-5 text-[#195440]" /> : <FileText className="w-5 h-5 text-[#195440]" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{doc.name}</p>
                          <div className="flex gap-2 mt-1 items-center">
                            <Badge variant="outline" className="text-xs">{doc.type.replace(/_/g, ' ')}</Badge>
                            <span className="text-xs text-gray-500">{formatDate(doc.upload_date)}</span>
                          </div>
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
                          <Button variant="outline" size="sm" className="h-8 px-2"><Download className="w-3 h-3" /></Button>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
      {v ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
      <span className={v ? 'text-gray-900' : 'text-gray-500'}>{label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
