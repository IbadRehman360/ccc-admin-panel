'use client';

import { useState } from 'react';
import {
  CheckCircle, XCircle, Eye, Megaphone, Building2, Users,
  Search, Filter, ExternalLink, Loader2, Clock, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGetAdApprovalStatsQuery,
  useListPendingAdsQuery,
  useUpdateAdStatusMutation,
  type AdStatus,
  type PendingAd,
} from '@/store/api/approvalsApi';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const statusColor = (s: AdStatus) => {
  switch (s) {
    case 'PENDING': return 'bg-yellow-500';
    case 'ACCEPTED': return 'bg-green-600';
    case 'REJECTED': return 'bg-red-600';
    case 'EXPIRED': return 'bg-gray-500';
  }
};

export default function PendingApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600 mt-2">Review and act on ads, business claims, and community approvals</p>
      </div>

      <Tabs defaultValue="ads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ads">
            <Megaphone className="w-4 h-4 mr-2" />
            Ad Approvals
          </TabsTrigger>
          <TabsTrigger value="claims">
            <Building2 className="w-4 h-4 mr-2" />
            Business Claims
          </TabsTrigger>
          <TabsTrigger value="communities">
            <Users className="w-4 h-4 mr-2" />
            Community Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ads">
          <AdApprovalsTab />
        </TabsContent>

        <TabsContent value="claims">
          <NotImplementedTab
            title="Business Claims"
            reason="Requires a new business_claim table in the database (claimant info, submitted documents, status). Not yet migrated."
          />
        </TabsContent>

        <TabsContent value="communities">
          <NotImplementedTab
            title="Community Approvals"
            reason="Requires a status field on the community table (PENDING/APPROVED/REJECTED). Not yet migrated."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotImplementedTab({ title, reason }: { title: string; reason: string }) {
  return (
    <Card>
      <CardContent className="py-16 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{title} — Coming Soon</h3>
        <p className="text-sm text-gray-500 max-w-md">{reason}</p>
      </CardContent>
    </Card>
  );
}

function AdApprovalsTab() {
  const [filterStatus, setFilterStatus] = useState<AdStatus | 'all'>('PENDING');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data: stats } = useGetAdApprovalStatsQuery();
  const { data: list, isFetching } = useListPendingAdsQuery({
    status: filterStatus,
    search,
    page: 1,
    limit: 50,
  });

  const [updateStatus, { isLoading: updating }] = useUpdateAdStatusMutation();

  const [showView, setShowView] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selected, setSelected] = useState<PendingAd | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const extractError = (err: unknown) => {
    const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const openView = (ad: PendingAd) => {
    setSelected(ad);
    setError(null);
    setShowView(true);
  };

  const openApprove = (ad: PendingAd) => {
    setSelected(ad);
    setError(null);
    setShowApprove(true);
  };

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

  const openReject = (ad: PendingAd) => {
    setSelected(ad);
    setRejectReason('');
    setError(null);
    setShowReject(true);
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

  const rows = list?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Pending" value={stats?.pending} color="text-yellow-600" icon={Clock} />
        <StatCard label="Approved" value={stats?.accepted} color="text-green-700" icon={CheckCircle} />
        <StatCard label="Rejected" value={stats?.rejected} color="text-red-700" icon={XCircle} />
        <StatCard label="Expired" value={stats?.expired} color="text-gray-600" icon={Clock} />
        <StatCard label="Total" value={stats?.total} color="text-gray-900" icon={Megaphone} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submitSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by ad name, contact, or advertiser email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as AdStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
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
          <CardTitle>Ads</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Advertiser</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No ads in this status.
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
                      {ad.schedule.days > 0
                        ? <span>{ad.schedule.days} day{ad.schedule.days > 1 ? 's' : ''}</span>
                        : <span className="text-gray-400">No dates</span>}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColor(ad.status)}>{ad.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {ad.is_paid
                        ? <Badge variant="outline" className="border-green-600 text-green-700">Paid</Badge>
                        : <Badge variant="outline" className="border-gray-400 text-gray-500">Unpaid</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(ad.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openView(ad)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {ad.status === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openApprove(ad)}
                              className="border-green-600 text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openReject(ad)}
                              className="border-red-600 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
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

      {/* View Dialog */}
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>Ad submitted on {selected ? formatDate(selected.created_at) : '—'}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 px-6 pb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.name} className="w-full max-h-72 object-contain rounded border" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Status" value={<Badge className={statusColor(selected.status)}>{selected.status}</Badge>} />
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
                <Field label="Advertiser Email" value={selected.advertiser.email || '—'} />
                <Field label="Scheduled Days" value={String(selected.schedule.days)} />
                <Field label="Engagements" value={String(selected.engagement_count)} />
                <Field label="Schedule Start" value={formatDate(selected.schedule.start)} />
                <Field label="Schedule End" value={formatDate(selected.schedule.end)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApprove} onOpenChange={setShowApprove}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Ad</DialogTitle>
            <DialogDescription>
              Approve <strong>{selected?.name}</strong>? The advertiser will be notified and can proceed with payment.
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

      {/* Reject Dialog */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Ad</DialogTitle>
            <DialogDescription>
              Reject <strong>{selected?.name}</strong>? Add an optional reason — it&apos;ll be sent to the advertiser.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="reject-reason">Reason (optional)</Label>
            <Textarea
              id="reject-reason"
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
    </div>
  );
}

function StatCard({
  label, value, color, icon: Icon,
}: {
  label: string;
  value: number | undefined;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
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
