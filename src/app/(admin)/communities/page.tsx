'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Trash2, Users, FileText, Calendar,
  MoreVertical, Lock, Globe, Loader2, MessageSquare, UserPlus,
  AlertCircle,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  useListCommunitiesQuery,
  useGetCommunityStatsQuery,
  useGetCommunityDetailQuery,
  useDeleteCommunityMutation,
  type CommunityRow,
  type CommunityPrivacy,
} from '@/store/api/communitiesApi';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function CommunitiesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState<CommunityPrivacy | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'members' | 'name'>('date');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetCommunityStatsQuery();
  const { data: list, isFetching } = useListCommunitiesQuery({
    search, privacy: privacyFilter, sort_by: sortBy, page, limit: 25,
  });

  const [deleteComm, { isLoading: deleting }] = useDeleteCommunityMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<CommunityRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openProfile = (c: CommunityRow) => {
    setSelected(c);
    setShowProfile(true);
  };

  const openDelete = (c: CommunityRow) => {
    setSelected(c);
    setReason('');
    setError(null);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setError(null);
    try {
      await deleteComm({ id: selected.id, reason }).unwrap();
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
        <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        <p className="text-gray-600 mt-2">Browse and moderate platform communities</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.total ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Public</CardTitle>
            <Globe className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.public ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Private</CardTitle>
            <Lock className="w-5 h-5 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{stats?.private ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Created (last 7d)</CardTitle>
            <Calendar className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E1B047]">{stats?.created_last_7d ?? '—'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Community List</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by community name or owner..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={privacyFilter} onValueChange={(v) => { setPrivacyFilter(v as CommunityPrivacy | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Privacy" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Privacy</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="members">Most Members</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Community</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Privacy</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No communities found</TableCell></TableRow>
                ) : rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {c.image
                          /* eslint-disable-next-line @next/next/no-img-element */
                          ? <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          : <div className="w-10 h-10 rounded-full bg-[#195440] text-white flex items-center justify-center text-sm font-medium">{c.name.charAt(0).toUpperCase()}</div>
                        }
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{c.creator.full_name || '—'}</div>
                        <div className="text-xs text-gray-500">{c.creator.email || '—'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.privacy === 'PUBLIC'
                        ? <Badge className="bg-green-600"><Globe className="w-3 h-3 mr-1" />Public</Badge>
                        : <Badge variant="secondary"><Lock className="w-3 h-3 mr-1" />Private</Badge>}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{c.member_count.toLocaleString()}</span>
                      <span className="text-xs text-gray-400"> / {c.member_limit.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-sm">{c.posts_count.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{c.events_count.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(c.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfile(c)}>
                            <Eye className="w-4 h-4 mr-2" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(c)} className="text-red-600">
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

          <div className="mt-4 flex items-start gap-2 max-w-2xl bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-900">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Suspend</strong> not available — community model has no status field. Add <code className="bg-yellow-100 px-1 rounded">community.status</code> to enable.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              Created by {selected?.creator.full_name || selected?.creator.email || '—'}
            </DialogDescription>
          </DialogHeader>
          {selected && <CommunityProfileBody id={selected.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)} className="w-full sm:w-auto">Close</Button>
            {selected && (
              <Button variant="destructive" onClick={() => { setShowProfile(false); openDelete(selected); }} className="w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Community</DialogTitle>
            <DialogDescription>
              Permanently delete <strong>{selected?.name}</strong>? This cascades to all posts, events, members, invites, and requests. Cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="c-reason">Reason *</Label>
            <Textarea
              id="c-reason"
              placeholder="Why is this community being deleted?"
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

function CommunityProfileBody({ id }: { id: string }) {
  const { data: detail, isLoading } = useGetCommunityDetailQuery(id);
  if (isLoading || !detail) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="overflow-y-auto max-h-[calc(85vh-180px)] pb-6 px-4 sm:px-6 space-y-4 pt-4">
      {detail.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={detail.image} alt={detail.name} className="w-full max-h-48 object-cover rounded-lg" />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Stat icon={Users} label="Members" value={`${detail.member_count} / ${detail.member_limit}`} />
        <Stat icon={MessageSquare} label="Posts" value={detail.posts_count} />
        <Stat icon={Calendar} label="Events" value={detail.events_count} />
        <Stat icon={UserPlus} label="Join Requests" value={detail.requests_count} />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Privacy" value={detail.privacy === 'PUBLIC' ? 'Public' : 'Private'} />
        <Field label="Preferences Set" value={detail.is_preferences_completed ? 'Yes' : 'No'} />
        <Field label="ESG Flag" value={detail.is_esg ? 'Yes' : 'No'} />
        <Field label="DEI Flag" value={detail.is_dei ? 'Yes' : 'No'} />
        <Field label="Created" value={formatDate(detail.created_at)} />
        <Field label="Last Updated" value={formatDate(detail.updated_at)} />
      </div>

      {detail.rules_and_guidelines && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Rules & Guidelines
            </h3>
            <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">{detail.rules_and_guidelines}</p>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <Icon className="w-4 h-4 text-[#195440] mx-auto mb-1" />
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
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
