'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Trash2, MessageSquare, Ban, MoreVertical,
  Loader2, Paperclip, Clock, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  useListChatsQuery,
  useGetChatStatsQuery,
  useGetChatMessagesQuery,
  useDeleteChatMutation,
  type ChatRow,
  type ChatStatus,
} from '@/store/api/chatsApi';

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

const statusBadge = (s: ChatStatus | null) => {
  if (!s) return <Badge variant="outline">—</Badge>;
  if (s === 'ACCEPTED') return <Badge className="bg-green-600">Accepted</Badge>;
  if (s === 'PENDING') return <Badge className="bg-yellow-500">Pending</Badge>;
  return <Badge variant="destructive">Rejected</Badge>;
};

export default function ChatsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChatStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetChatStatsQuery();
  const { data: list, isFetching } = useListChatsQuery({
    search, status: statusFilter, page, limit: 25,
  });

  const [deleteChat, { isLoading: deleting }] = useDeleteChatMutation();

  const [showMessages, setShowMessages] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<ChatRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openMessages = (c: ChatRow) => { setSelected(c); setShowMessages(true); };
  const openDelete = (c: ChatRow) => {
    setSelected(c); setReason(''); setError(null); setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setError(null);
    try {
      await deleteChat({ id: selected.id, reason }).unwrap();
      setShowDelete(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Chats</h1>
        <p className="text-gray-600 mt-2">Monitor direct messages between users</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard label="Total Chats" value={stats?.total} icon={MessageSquare} color="text-gray-900" />
        <StatCard label="Pending" value={stats?.pending} icon={Clock} color="text-yellow-600" />
        <StatCard label="Accepted" value={stats?.accepted} icon={MessageSquare} color="text-green-600" />
        <StatCard label="Total Messages" value={stats?.total_messages} icon={MessageSquare} color="text-blue-600" />
        <StatCard label="Blocked Pairs" value={stats?.blocked_pairs} icon={Ban} color="text-red-600" />
        <StatCard label="Last 7d" value={stats?.recent_7d} icon={Clock} color="text-[#E1B047]" />
      </div>

      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-900">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Warn / Block</strong> actions need schema migration. Use User Management to suspend abusive users for now.
        </span>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chat Threads</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search participants by email or name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as ChatStatus | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participants</TableHead>
                  <TableHead>Initiated By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No chats found</TableCell></TableRow>
                ) : rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <UserAvatar name={c.user_one?.full_name || c.user_one?.email || '?'} size="sm" />
                          <UserAvatar name={c.user_two?.full_name || c.user_two?.email || '?'} size="sm" />
                        </div>
                        <div className="text-sm">
                          <div>{c.user_one?.full_name || c.user_one?.email || '—'}</div>
                          <div className="text-xs text-gray-500">↔ {c.user_two?.full_name || c.user_two?.email || '—'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.initiator?.full_name || c.initiator?.email || '—'}</TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                    <TableCell className="text-sm">{c.message_count}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {c.last_message ? formatDateTime(c.last_message.created_at) : formatDateTime(c.updated_at)}
                      {c.last_message?.message && (
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{c.last_message.message}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openMessages(c)}>
                            <Eye className="w-4 h-4 mr-2" />View Messages
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(c)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />Delete Chat
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

      <Dialog open={showMessages} onOpenChange={setShowMessages}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Chat Log</DialogTitle>
            <DialogDescription>
              {selected && `${selected.user_one?.full_name || selected.user_one?.email} ↔ ${selected.user_two?.full_name || selected.user_two?.email}`}
            </DialogDescription>
          </DialogHeader>
          {selected && <ChatLog chatId={selected.id} userOneId={selected.user_one?.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowMessages(false)} className="w-full sm:w-auto">Close</Button>
            {selected && (
              <Button variant="destructive" onClick={() => { setShowMessages(false); openDelete(selected); }} className="w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />Delete Chat
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Permanently delete this chat and all messages? Cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="ch-reason">Reason *</Label>
            <Textarea
              id="ch-reason"
              placeholder="Why is this chat being deleted?"
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
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting || !reason.trim()}>
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChatLog({ chatId, userOneId }: { chatId: number; userOneId: string | undefined }) {
  const { data, isLoading } = useGetChatMessagesQuery({ id: chatId, page: 1, limit: 200 });

  if (isLoading) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  const messages = data?.data ?? [];

  if (messages.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        No messages yet.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(85vh-200px)] px-4 sm:px-6 py-4 space-y-3 bg-gray-50">
      {messages.map((m) => {
        const isLeft = m.sender?.id === userOneId;
        return (
          <div key={m.id} className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isLeft ? 'bg-white border' : 'bg-[#195440] text-white'}`}>
              <div className={`text-xs mb-1 ${isLeft ? 'text-gray-500' : 'text-white/80'}`}>
                {m.sender?.full_name || m.sender?.email || 'Unknown'}
              </div>
              {m.message && <div className="text-sm whitespace-pre-wrap break-words">{m.message}</div>}
              {m.attachment && (
                <a
                  href={m.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 mt-1 text-xs underline ${isLeft ? 'text-blue-600' : 'text-white/90'}`}
                >
                  <Paperclip className="w-3 h-3" />Attachment
                </a>
              )}
              <div className={`text-[10px] mt-1 ${isLeft ? 'text-gray-400' : 'text-white/60'}`}>
                {formatDateTime(m.created_at)}
                {m.is_read && ' · Read'}
              </div>
            </div>
          </div>
        );
      })}
      {data && data.pagination.total > messages.length && (
        <p className="text-center text-xs text-gray-500 pt-2">
          Showing {messages.length} of {data.pagination.total} messages
        </p>
      )}
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
