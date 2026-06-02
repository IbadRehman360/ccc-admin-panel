'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Trash2, Briefcase, MapPin, Loader2,
  MoreVertical, Users, CheckCircle, XCircle, Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  useListJobsQuery,
  useGetJobStatsQuery,
  useGetJobDetailQuery,
  useGetJobApplicationsQuery,
  useSetJobStatusMutation,
  useDeleteJobMutation,
  type JobRow,
  type JobStatus,
  type JobType,
} from '@/store/api/jobsApi';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

const statusBadge = (s: JobStatus) => {
  if (s === 'ACTIVE') return <Badge className="bg-green-600">Active</Badge>;
  if (s === 'CLOSED') return <Badge variant="secondary">Closed</Badge>;
  return <Badge variant="outline">Past</Badge>;
};

const typeBadge = (t: JobType) => {
  const label = t.replace(/_/g, ' ').toLowerCase();
  return <Badge variant="outline" className="text-xs capitalize">{label}</Badge>;
};

export default function JobManagementPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'applications' | 'title'>('date');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetJobStatsQuery();
  const { data: list, isFetching } = useListJobsQuery({
    search, status: statusFilter, type: typeFilter, sort_by: sortBy, page, limit: 25,
  });

  const [setStatus, { isLoading: updating }] = useSetJobStatusMutation();
  const [deleteJob, { isLoading: deleting }] = useDeleteJobMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [action, setAction] = useState<{ kind: 'status'; status: JobStatus } | { kind: 'delete' } | null>(null);
  const [selected, setSelected] = useState<JobRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openAction = (j: JobRow, a: typeof action) => {
    setSelected(j); setAction(a); setReason(''); setError(null); setShowAction(true);
  };

  const confirmAction = async () => {
    if (!selected || !action) return;
    setError(null);
    try {
      if (action.kind === 'status') {
        await setStatus({ id: selected.id, status: action.status, reason }).unwrap();
      } else {
        await deleteJob({ id: selected.id, reason }).unwrap();
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
        <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
        <p className="text-gray-600 mt-2">Monitor and moderate job postings</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Jobs" value={stats?.total} icon={Briefcase} color="text-gray-900" />
        <StatCard label="Active" value={stats?.active} icon={CheckCircle} color="text-green-600" />
        <StatCard label="Closed" value={stats?.closed} icon={XCircle} color="text-gray-600" />
        <StatCard label="Past" value={stats?.past} icon={Clock} color="text-gray-500" />
        <StatCard label="Total Applications" value={stats?.total_applications} icon={Users} color="text-[#E1B047]" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Postings</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search title, position, business..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as JobStatus | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="PAST">Past</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as JobType | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="TEMPORARY">Temporary</SelectItem>
                <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                <SelectItem value="INTERSHIP">Internship</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Business / Poster</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No jobs found</TableCell></TableRow>
                ) : rows.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{j.title}</div>
                        <div className="text-xs text-gray-500">{j.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{j.posted_by?.business_name || j.posted_by?.full_name || '—'}</div>
                        <div className="text-xs text-gray-500">{j.posted_by?.email || ''}</div>
                      </div>
                    </TableCell>
                    <TableCell>{typeBadge(j.job_type)}</TableCell>
                    <TableCell>
                      {j.location ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[160px]">{j.location}</span>
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-sm">{j.applications_count}</TableCell>
                    <TableCell>{statusBadge(j.job_status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(j.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelected(j); setShowProfile(true); }}>
                            <Eye className="w-4 h-4 mr-2" />View Job
                          </DropdownMenuItem>
                          {j.job_status === 'ACTIVE' ? (
                            <DropdownMenuItem onClick={() => openAction(j, { kind: 'status', status: 'CLOSED' })}>
                              <XCircle className="w-4 h-4 mr-2" />Close Job
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openAction(j, { kind: 'status', status: 'ACTIVE' })}>
                              <CheckCircle className="w-4 h-4 mr-2" />Reopen
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openAction(j, { kind: 'delete' })} className="text-red-600">
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
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected && `${selected.position} · ${selected.job_type.replace(/_/g, ' ').toLowerCase()} · ${selected.posted_by?.business_name || selected.posted_by?.email}`}
            </DialogDescription>
          </DialogHeader>
          {selected && <JobBody jobId={selected.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)} className="w-full sm:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAction} onOpenChange={setShowAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.kind === 'status' && `Set status to ${action.status}`}
              {action?.kind === 'delete' && 'Delete Job'}
            </DialogTitle>
            <DialogDescription>
              {action?.kind === 'status' && `Change "${selected?.title}" status to ${action.status}?`}
              {action?.kind === 'delete' && `Soft-delete "${selected?.title}"? It will be hidden from users.`}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="j-reason">Reason {action?.kind === 'delete' ? '*' : '(optional)'}</Label>
            <Textarea
              id="j-reason"
              placeholder="Why?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          {error && (
            <div className="mx-6 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAction(false)}>Cancel</Button>
            <Button
              variant={action?.kind === 'delete' ? 'destructive' : 'default'}
              onClick={confirmAction}
              disabled={(action?.kind === 'delete' && !reason.trim()) || updating || deleting}
            >
              {action?.kind === 'delete' && <><Trash2 className="w-4 h-4 mr-2" />{deleting ? 'Deleting...' : 'Delete'}</>}
              {action?.kind === 'status' && <>{updating ? 'Saving...' : `Set ${action.status}`}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JobBody({ jobId }: { jobId: string }) {
  const { data: detail, isLoading } = useGetJobDetailQuery(jobId);
  const { data: apps = { data: [], pagination: { total: 0, page: 1, limit: 50, total_pages: 1 } }, isLoading: appsLoading } = useGetJobApplicationsQuery({ id: jobId, page: 1, limit: 50 });
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
            <TabsTrigger value="applications">Applications ({apps.pagination.total})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="space-y-4 mt-4 px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status" value={statusBadge(detail.job_status)} />
            <Field label="Type" value={typeBadge(detail.job_type)} />
            <Field label="Position" value={detail.position} />
            <Field label="Specialization" value={detail.specialization || '—'} />
            <Field label="Experience" value={detail.experience || '—'} />
            <Field label="Location" value={detail.location || '—'} />
            <Field label="ESG / DEI" value={`${detail.is_esg ? 'ESG' : ''}${detail.is_esg && detail.is_dei ? ' · ' : ''}${detail.is_dei ? 'DEI' : ''}${!detail.is_esg && !detail.is_dei ? '—' : ''}`} />
            <Field label="Posted" value={formatDate(detail.created_at)} />
          </div>

          <Separator />

          <div>
            <Label className="text-gray-600">Description</Label>
            <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">{detail.description || '—'}</p>
          </div>

          <div>
            <Label className="text-gray-600">Qualification</Label>
            <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">{detail.qualification || '—'}</p>
          </div>

          <div>
            <Label className="text-gray-600">Requirements</Label>
            <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">{detail.requirements || '—'}</p>
          </div>

          {detail.facilities && (
            <div>
              <Label className="text-gray-600">Facilities</Label>
              <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">{detail.facilities}</p>
            </div>
          )}

          {detail.posted_by && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-2">Posted By</h3>
                <div className="text-sm">
                  <div>{detail.posted_by.business_name || detail.posted_by.full_name || '—'}</div>
                  <div className="text-xs text-gray-500">{detail.posted_by.email}</div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-3 mt-4 px-4 sm:px-6">
          {appsLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : apps.data.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No applications yet</div>
          ) : apps.data.map((a) => (
            <div key={a.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-sm">
                  <div className="font-medium">{a.full_name || a.applicant?.full_name || '—'}</div>
                  <div className="text-xs text-gray-500">{a.email_address || a.applicant?.email || '—'}</div>
                  {a.phone_number && <div className="text-xs text-gray-500 mt-1">{a.phone_number}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={a.application_status === 'HIRED' ? 'default' : 'outline'}
                    className={
                      a.application_status === 'HIRED' ? 'bg-green-600'
                      : a.application_status === 'REJECTED' ? 'border-red-600 text-red-700'
                      : 'border-yellow-500 text-yellow-700'
                    }
                  >
                    {a.application_status}
                  </Badge>
                  {a.resume_file && (
                    <a href={a.resume_file} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">Resume</Button>
                    </a>
                  )}
                  {a.cover_letter_file && (
                    <a href={a.cover_letter_file} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">Cover</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value?: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
        <Icon className={`w-5 h-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value ?? '—'}</div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <Label className="text-gray-600 text-xs">{label}</Label>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
