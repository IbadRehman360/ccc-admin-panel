'use client';

import { useMemo, useState } from 'react';
import {
  Search, Eye, CheckCircle, XCircle, Megaphone, Clock,
  Calendar, Loader2, ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetAdApprovalStatsQuery,
  useListPendingAdsQuery,
  useUpdateAdStatusMutation,
  type PendingAd,
  type AdStatus,
} from '@/store/api/approvalsApi';

type TabKey = 'pending' | 'active' | 'upcoming' | 'rejected';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

// Active = ACCEPTED + start <= today <= end
// Upcoming = ACCEPTED + start > today
const splitAccepted = (ads: PendingAd[]) => {
  const now = Date.now();
  const active: PendingAd[] = [];
  const upcoming: PendingAd[] = [];
  for (const ad of ads) {
    const start = ad.schedule.start ? new Date(ad.schedule.start).getTime() : 0;
    const end = ad.schedule.end ? new Date(ad.schedule.end).getTime() : Infinity;
    if (start > now) upcoming.push(ad);
    else if (now >= start && now <= end) active.push(ad);
    else upcoming.push(ad);
  }
  return { active, upcoming };
};

export default function AdManagementPage() {
  const { data: stats } = useGetAdApprovalStatsQuery();
  const [tab, setTab] = useState<TabKey>('pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ad Management</h1>
        <p className="text-gray-600 mt-2">Approve, monitor, and moderate advertisements</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Pending" value={stats?.pending} icon={Clock} color="text-yellow-600" />
        <StatCard label="Approved" value={stats?.accepted} icon={CheckCircle} color="text-green-700" />
        <StatCard label="Rejected" value={stats?.rejected} icon={XCircle} color="text-red-700" />
        <StatCard label="Expired" value={stats?.expired} icon={Clock} color="text-gray-600" />
        <StatCard label="Total" value={stats?.total} icon={Megaphone} color="text-gray-900" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="pending">
            <Clock className="w-4 h-4 mr-2" />For Approval
          </TabsTrigger>
          <TabsTrigger value="active">
            <CheckCircle className="w-4 h-4 mr-2" />Active
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="w-4 h-4 mr-2" />Upcoming
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="w-4 h-4 mr-2" />Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending"><AdList tabKey="pending" status="PENDING" /></TabsContent>
        <TabsContent value="active"><AdList tabKey="active" status="ACCEPTED" /></TabsContent>
        <TabsContent value="upcoming"><AdList tabKey="upcoming" status="ACCEPTED" /></TabsContent>
        <TabsContent value="rejected"><AdList tabKey="rejected" status="REJECTED" /></TabsContent>
      </Tabs>
    </div>
  );
}

function AdList({ tabKey, status }: { tabKey: TabKey; status: AdStatus }) {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: list, isFetching } = useListPendingAdsQuery({
    status, search, page, limit: 50,
  });

  const [updateStatus, { isLoading: updating }] = useUpdateAdStatusMutation();

  const [showView, setShowView] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selected, setSelected] = useState<PendingAd | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const rows = useMemo(() => {
    const all = list?.data ?? [];
    if (tabKey === 'active' || tabKey === 'upcoming') {
      const { active, upcoming } = splitAccepted(all);
      return tabKey === 'active' ? active : upcoming;
    }
    return all;
  }, [list, tabKey]);

  const totalPages = list?.pagination.total_pages ?? 1;

  const confirmApprove = async () => {
    if (!selected) return;
    setError(null);
    try {
      await updateStatus({ id: selected.id, status: 'ACCEPTED' }).unwrap();
      setShowApprove(false);
      setSelected(null);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const confirmReject = async () => {
    if (!selected) return;
    setError(null);
    try {
      await updateStatus({
        id: selected.id,
        status: 'REJECTED',
        reason: rejectReason || undefined,
      }).unwrap();
      setShowReject(false);
      setSelected(null);
      setRejectReason('');
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {tabKey === 'pending' && 'Pending Approval'}
          {tabKey === 'active' && 'Active Ads'}
          {tabKey === 'upcoming' && 'Upcoming Ads'}
          {tabKey === 'rejected' && 'Rejected Ads'}
          <span className="ml-2 text-sm text-gray-500">({rows.length})</span>
        </CardTitle>
        {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      </CardHeader>
      <CardContent>
        <form onSubmit={submitSearch} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ad name, contact, advertiser..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
        </form>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Advertiser</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Engagements</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No ads in this tab.
                  </TableCell>
                </TableRow>
              ) : rows.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ad.image} alt={ad.name} className="w-10 h-10 object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="font-medium">{ad.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{ad.advertiser.full_name || '—'}</div>
                      <div className="text-xs text-gray-500">{ad.advertiser.email || '—'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ad.schedule.start && ad.schedule.end ? (
                      <>
                        <div>{formatDate(ad.schedule.start)}</div>
                        <div className="text-xs text-gray-500">→ {formatDate(ad.schedule.end)}</div>
                      </>
                    ) : (
                      <span className="text-gray-400">No dates</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {ad.is_paid
                      ? <Badge variant="outline" className="border-green-600 text-green-700">Paid</Badge>
                      : <Badge variant="outline" className="border-gray-400 text-gray-500">Unpaid</Badge>}
                  </TableCell>
                  <TableCell className="text-sm">{ad.engagement_count}</TableCell>
                  <TableCell className="text-sm text-gray-600">{formatDate(ad.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelected(ad); setShowView(true); }}>
                        <Eye className="w-4 h-4 mr-1" />View
                      </Button>
                      {tabKey === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelected(ad); setError(null); setShowApprove(true); }}
                            className="border-green-600 text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelected(ad); setRejectReason(''); setError(null); setShowReject(true); }}
                            className="border-red-600 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />Reject
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

        {list && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Page {list.pagination.page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              Submitted {selected ? formatDate(selected.created_at) : '—'} · Status: {selected?.status}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="px-6 pb-2 space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.name} className="w-full max-h-72 object-contain rounded border" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Status" value={<Badge>{selected.status}</Badge>} />
                <Field label="Paid" value={selected.is_paid ? 'Yes' : 'No'} />
                <Field label="Contact" value={selected.contact} />
                <Field
                  label="Landing URL"
                  value={
                    <a href={selected.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      {selected.url} <ExternalLink className="w-3 h-3" />
                    </a>
                  }
                />
                <Field label="Advertiser" value={selected.advertiser.full_name || '—'} />
                <Field label="Email" value={selected.advertiser.email || '—'} />
                <Field label="Days Scheduled" value={String(selected.schedule.days)} />
                <Field label="Engagements" value={String(selected.engagement_count)} />
                <Field label="Start" value={formatDate(selected.schedule.start)} />
                <Field label="End" value={formatDate(selected.schedule.end)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showApprove} onOpenChange={setShowApprove}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Ad</DialogTitle>
            <DialogDescription>
              Approve <strong>{selected?.name}</strong>? The advertiser will be notified.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mx-6 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprove(false)}>Cancel</Button>
            <Button onClick={confirmApprove} disabled={updating} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              {updating ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Ad</DialogTitle>
            <DialogDescription>
              Reject <strong>{selected?.name}</strong>? Optional reason will be sent to the advertiser.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="amgmt-reject-reason">Reason (optional)</Label>
            <Textarea
              id="amgmt-reject-reason"
              placeholder="e.g. Image quality too low, content violates community guidelines..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          {error && (
            <div className="mx-6 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={updating}>
              <XCircle className="w-4 h-4 mr-2" />
              {updating ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
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
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
