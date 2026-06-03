'use client';

import { useState } from 'react';
import {
  Bell, Send, Trash2, Loader2, Filter, Search, Shield, CheckCircle,
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
import {
  useListNotificationsQuery,
  useGetNotificationStatsQuery,
  useSendBroadcastMutation,
  useDeleteNotificationMutation,
  type NotificationLog,
  type ScreenName,
  type SendBroadcastBody,
} from '@/store/api/notificationsApi';

const SCREEN_NAMES: ScreenName[] = [
  'PROFILE', 'NEWS', 'COMMUNITY_NOTIFICATION', 'COMMUNITY_POST',
  'EVENT_INVITE', 'JOB', 'JOB_APPLIED', 'JOB_APPLICATION',
  'USER_REQUESTS', 'USER_INVITES', 'GEO_FENCING', 'ADVERTISEMENT',
  'TRANSACTION_DEBIT', 'TRANSACTION_CREDIT',
];

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function NotificationsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [screenFilter, setScreenFilter] = useState<ScreenName | 'all'>('all');
  const [adminFilter, setAdminFilter] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetNotificationStatsQuery();
  const { data: list, isFetching } = useListNotificationsQuery({
    search, screen_name: screenFilter, is_admin: adminFilter, page, limit: 25,
  });

  const [deleteNotif, { isLoading: deleting }] = useDeleteNotificationMutation();

  const [showSend, setShowSend] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<NotificationLog | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteNotif(selected.id).unwrap();
      setShowDelete(false);
      setSelected(null);
    } catch {
      // shown by toast in real apps; ignored here
    }
  };

  const rows = list?.data ?? [];
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">View notification log and broadcast announcements</p>
        </div>
        <Button onClick={() => setShowSend(true)} className="bg-[#195440] hover:bg-[#195440]/90">
          <Send className="w-4 h-4 mr-2" />
          Send Broadcast
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats?.total} icon={Bell} color="text-gray-900" />
        <StatCard label="Today" value={stats?.today} icon={Bell} color="text-blue-600" />
        <StatCard label="Last 7d" value={stats?.last_7d} icon={Bell} color="text-[#E1B047]" />
        <StatCard label="By Admin" value={stats?.by_admin} icon={Shield} color="text-[#195440]" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notification Log</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search title or message..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={screenFilter} onValueChange={(v) => { setScreenFilter(v as ScreenName | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Screen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Screens</SelectItem>
                {SCREEN_NAMES.map((s) => (
                  <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={adminFilter} onValueChange={(v) => { setAdminFilter(v as typeof adminFilter); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="true">Admin Broadcast</SelectItem>
                <SelectItem value="false">System / App</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Screen</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No notifications found</TableCell></TableRow>
                ) : rows.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium text-sm">{n.title || '—'}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">
                      <span className="line-clamp-2">{n.message || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{n.recipient?.full_name || '—'}</div>
                        <div className="text-xs text-gray-500">{n.recipient?.email || '—'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {n.screen_name
                        ? <Badge variant="outline" className="text-xs">{n.screen_name.replace(/_/g, ' ')}</Badge>
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {n.is_admin
                        ? <Badge className="bg-[#195440]"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
                        : <Badge variant="secondary">System</Badge>}
                    </TableCell>
                    <TableCell>
                      {n.is_read
                        ? <CheckCircle className="w-4 h-4 text-green-600" />
                        : <span className="text-xs text-gray-400">—</span>}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{formatDateTime(n.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelected(n); setShowDelete(true); }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

      <SendBroadcastDialog open={showSend} onClose={() => setShowSend(false)} />

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notification Log</DialogTitle>
            <DialogDescription>
              Delete this notification record? The recipient already received it — this only removes the log.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SendBroadcastDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [send, { isLoading }] = useSendBroadcastMutation();
  const [form, setForm] = useState<SendBroadcastBody>({
    title: '',
    message: '',
    recipients: 'all',
    screen_name: 'PROFILE',
  });
  const [specificIds, setSpecificIds] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ recipients_total: number; sent: number; failed: number } | null>(null);

  const reset = () => {
    setForm({ title: '', message: '', recipients: 'all', screen_name: 'PROFILE' });
    setSpecificIds('');
    setError(null);
    setResult(null);
  };

  const handleSend = async () => {
    setError(null);
    setResult(null);
    try {
      const body: SendBroadcastBody = {
        ...form,
        ...(form.recipients === 'specific' && {
          specific_user_ids: specificIds.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean),
        }),
      };
      const r = await send(body).unwrap();
      setResult(r);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Notification Broadcast</DialogTitle>
          <DialogDescription>
            Push notification + DB log. Devices with FCM tokens receive it; everyone gets a log entry.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="px-6 space-y-3">
            <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              ✓ Sent {result.sent} / {result.recipients_total} (failed: {result.failed})
            </div>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">Send Another</Button>
          </div>
        ) : (
          <div className="px-6 space-y-3">
            <div>
              <Label htmlFor="bcast-title">Title *</Label>
              <Input
                id="bcast-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. New Feature Available"
              />
            </div>
            <div>
              <Label htmlFor="bcast-message">Message *</Label>
              <Textarea
                id="bcast-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="e.g. Check out our new event recommendations..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="bcast-recipients">Recipients *</Label>
              <Select
                value={form.recipients}
                onValueChange={(v) => setForm({ ...form, recipients: v as SendBroadcastBody['recipients'] })}
              >
                <SelectTrigger id="bcast-recipients"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts (Users + Businesses)</SelectItem>
                  <SelectItem value="users">All Users</SelectItem>
                  <SelectItem value="businesses">All Businesses</SelectItem>
                  <SelectItem value="specific">Specific User IDs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.recipients === 'specific' && (
              <div>
                <Label htmlFor="bcast-ids">User IDs (comma or whitespace separated)</Label>
                <Textarea
                  id="bcast-ids"
                  value={specificIds}
                  onChange={(e) => setSpecificIds(e.target.value)}
                  placeholder="01a6ef94-..., 7aa00668-..."
                  rows={2}
                />
              </div>
            )}
            <div>
              <Label htmlFor="bcast-screen">Deep-link Screen</Label>
              <Select
                value={form.screen_name}
                onValueChange={(v) => setForm({ ...form, screen_name: v as ScreenName })}
              >
                <SelectTrigger id="bcast-screen"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SCREEN_NAMES.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Close</Button>
          {!result && (
            <Button
              onClick={handleSend}
              disabled={isLoading || !form.title.trim() || !form.message.trim()}
              className="bg-[#195440] hover:bg-[#195440]/90"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Broadcast'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
