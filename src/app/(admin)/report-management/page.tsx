'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Trash2, Flag, Loader2, Users,
  CheckCircle, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  useListReportsQuery,
  useGetReportStatsQuery,
  useResolveReportMutation,
  type ReportRow,
} from '@/store/api/reportsApi';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function ReportManagementPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState<'all' | 'custom' | 'predefined'>('all');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetReportStatsQuery();
  const { data: list, isFetching } = useListReportsQuery({
    search, reason: reasonFilter, page, limit: 25,
  });

  const [resolve, { isLoading: resolving }] = useResolveReportMutation();

  const [showView, setShowView] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [selected, setSelected] = useState<ReportRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const confirmResolve = async () => {
    if (!selected) return;
    setError(null);
    try {
      await resolve({ id: selected.id, reason }).unwrap();
      setShowResolve(false);
      setSelected(null);
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
        <h1 className="text-3xl font-bold text-gray-900">Report Management</h1>
        <p className="text-gray-600 mt-2">Review and resolve user-to-user reports</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats?.total} icon={Flag} color="text-gray-900" />
        <StatCard label="Last 7d" value={stats?.last_7d} icon={Flag} color="text-[#E1B047]" />
        <StatCard label="Custom Reason" value={stats?.custom} icon={AlertCircle} color="text-orange-600" />
        <StatCard label="Predefined" value={stats?.predefined} icon={CheckCircle} color="text-blue-600" />
        <StatCard label="Distinct Reported" value={stats?.distinct_reported_users} icon={Users} color="text-red-600" />
      </div>

      <div className="flex items-start gap-2 max-w-4xl bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-900">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Status / Severity / Admin Notes / Action Taken</strong> need schema additions on the <code className="bg-yellow-100 px-1 rounded">report_user</code> table.
          Resolving a report deletes the row.
        </span>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reports</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by reason, reporter, or reported user..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={reasonFilter} onValueChange={(v) => { setReasonFilter(v as typeof reasonFilter); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Reason Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="predefined">Predefined</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No reports found</TableCell></TableRow>
                ) : rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={r.reporter?.full_name || r.reporter?.email || '?'} size="sm" />
                        <div className="text-sm">
                          <div>{r.reporter?.full_name || '—'}</div>
                          <div className="text-xs text-gray-500">{r.reporter?.email || ''}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={r.reported_user?.full_name || r.reported_user?.email || '?'} size="sm" />
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            {r.reported_user?.full_name || '—'}
                            {r.reported_user?.is_blocked && <Badge variant="destructive" className="text-xs">Suspended</Badge>}
                          </div>
                          <div className="text-xs text-gray-500">{r.reported_user?.email || ''}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs">
                      <span className="line-clamp-2">{r.effective_reason || '—'}</span>
                    </TableCell>
                    <TableCell>
                      {r.is_custom
                        ? <Badge variant="outline" className="border-orange-500 text-orange-700 text-xs">Custom</Badge>
                        : <Badge variant="outline" className="text-xs">Predefined</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(r.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelected(r); setShowView(true); }}>
                          <Eye className="w-4 h-4 mr-1" />View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelected(r); setReason(''); setError(null); setShowResolve(true); }}
                          className="border-green-600 text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />Resolve
                        </Button>
                      </div>
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

      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Report Detail</DialogTitle>
            <DialogDescription>
              {selected && `Reported on ${formatDate(selected.created_at)}`}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="px-6 space-y-4">
              <Section title="Reporter">
                <UserCard u={selected.reporter} />
              </Section>
              <Separator />
              <Section title="Reported User">
                <UserCard u={selected.reported_user} />
              </Section>
              <Separator />
              <Section title="Reason">
                <div className="text-sm bg-gray-50 p-3 rounded-lg">
                  {selected.effective_reason || '—'}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {selected.is_custom ? 'Custom reason' : 'Predefined reason from catalogue'}
                </div>
              </Section>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
            {selected && (
              <Button onClick={() => { setShowView(false); setReason(''); setError(null); setShowResolve(true); }} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />Resolve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResolve} onOpenChange={setShowResolve}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Mark this report as resolved? The record will be deleted from the log.
              The reported user&apos;s account is unaffected — to take action on the user, go to User Management.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="r-reason">Resolution note *</Label>
            <Textarea
              id="r-reason"
              placeholder="e.g. Reviewed — no violation found, or User suspended via User Management"
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
            <Button variant="outline" onClick={() => setShowResolve(false)}>Cancel</Button>
            <Button onClick={confirmResolve} disabled={resolving || !reason.trim()} className="bg-green-600 hover:bg-green-700">
              <Trash2 className="w-4 h-4 mr-2" />
              {resolving ? 'Resolving...' : 'Resolve & Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      {children}
    </div>
  );
}

function UserCard({ u }: { u: ReportRow['reporter'] }) {
  if (!u) return <div className="text-sm text-gray-500">Account deleted</div>;
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
      <UserAvatar name={u.full_name || u.email} size="sm" />
      <div className="text-sm flex-1">
        <div className="font-medium flex items-center gap-2">
          {u.full_name || '—'}
          {u.is_blocked && <Badge variant="destructive" className="text-xs">Suspended</Badge>}
        </div>
        <div className="text-xs text-gray-500">{u.email}</div>
      </div>
      <Badge variant="outline" className="text-xs">{u.user_type}</Badge>
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
        <div className={`text-3xl font-bold ${color}`}>{value?.toLocaleString() ?? '—'}</div>
      </CardContent>
    </Card>
  );
}
