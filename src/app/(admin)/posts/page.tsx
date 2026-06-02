'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Trash2, MessageSquare, Heart, FileText,
  Image as ImageIcon, MoreVertical, Loader2,
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
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  useListPostsQuery,
  useGetPostStatsQuery,
  useGetPostDetailQuery,
  useDeletePostMutation,
  type PostRow,
} from '@/store/api/postsApi';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function PostsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'text' | 'image'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetPostStatsQuery();
  const { data: list, isFetching } = useListPostsQuery({
    search, media: mediaFilter, sort_by: sortBy, page, limit: 25,
  });

  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<PostRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openProfile = (p: PostRow) => { setSelected(p); setShowProfile(true); };
  const openDelete = (p: PostRow) => {
    setSelected(p); setReason(''); setError(null); setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setError(null);
    try {
      await deletePost({ id: selected.id, reason }).unwrap();
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
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <p className="text-gray-600 mt-2">Moderate community posts</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard label="Total" value={stats?.total} icon={FileText} color="text-gray-900" />
        <StatCard label="With Image" value={stats?.with_image} icon={ImageIcon} color="text-blue-600" />
        <StatCard label="Text Only" value={stats?.text_only} icon={FileText} color="text-gray-700" />
        <StatCard label="Last 7d" value={stats?.recent_7d} icon={FileText} color="text-green-600" />
        <StatCard label="Total Likes" value={stats?.total_likes} icon={Heart} color="text-red-500" />
        <StatCard label="Total Comments" value={stats?.total_comments} icon={MessageSquare} color="text-[#E1B047]" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Posts</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search posts, author, community..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={mediaFilter} onValueChange={(v) => { setMediaFilter(v as typeof mediaFilter); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Media" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Media</SelectItem>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="image">With Image</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No posts found</TableCell></TableRow>
                ) : rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {p.picture
                          /* eslint-disable-next-line @next/next/no-img-element */
                          ? <img src={p.picture} alt="" className="w-10 h-10 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          : <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                        }
                        <span className="text-sm text-gray-700 truncate max-w-[240px]">
                          {p.description ? p.description.substring(0, 100) + (p.description.length > 100 ? '…' : '') : <em className="text-gray-400">No description</em>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={p.author?.full_name || p.author?.email || '?'} size="sm" />
                        <div className="text-sm">
                          <div>{p.author?.full_name || '—'}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[160px]">{p.author?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.community?.name || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {p.media_type === 'Image'
                          ? <><ImageIcon className="w-3 h-3 mr-1" />Image</>
                          : <><FileText className="w-3 h-3 mr-1" />Text</>}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{p.total_likes}</TableCell>
                    <TableCell className="text-sm">{p.total_comments}</TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(p.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfile(p)}>
                            <Eye className="w-4 h-4 mr-2" />View Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(p)} className="text-red-600">
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
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Post Detail</DialogTitle>
            <DialogDescription>
              {selected && `By ${selected.author?.full_name || selected.author?.email || '—'} in ${selected.community?.name || '—'}`}
            </DialogDescription>
          </DialogHeader>
          {selected && <PostBody postId={selected.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)} className="w-full sm:w-auto">Close</Button>
            {selected && (
              <Button variant="destructive" onClick={() => { setShowProfile(false); openDelete(selected); }} className="w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />Delete Post
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Permanently delete this post? Cascades to all likes and comments.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="p-reason">Reason *</Label>
            <Textarea
              id="p-reason"
              placeholder="Why is this post being removed?"
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

function PostBody({ postId }: { postId: string }) {
  const { data: detail, isLoading } = useGetPostDetailQuery(postId);
  if (isLoading || !detail) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="overflow-y-auto max-h-[calc(85vh-180px)] pb-6 px-4 sm:px-6 space-y-4 pt-4">
      {detail.picture && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={detail.picture} alt="" className="w-full max-h-72 object-contain rounded-lg border" />
      )}

      <div>
        <Label className="text-gray-600">Content</Label>
        <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">
          {detail.description || <em className="text-gray-400">No description</em>}
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-3 gap-3 text-center">
        <StatBox icon={Heart} label="Likes" value={detail.total_likes} />
        <StatBox icon={MessageSquare} label="Comments" value={detail.total_comments} />
        <StatBox icon={detail.media_type === 'Image' ? ImageIcon : FileText} label="Media" value={detail.media_type} />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Author" value={detail.author?.full_name || '—'} />
        <Field label="Email" value={detail.author?.email || '—'} />
        <Field label="User Type" value={detail.author?.user_type || '—'} />
        <Field label="Community" value={detail.community?.name || '—'} />
        <Field label="Posted" value={formatDate(detail.created_at)} />
        <Field label="Last Updated" value={formatDate(detail.updated_at)} />
      </div>
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

function StatBox({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <Icon className="w-4 h-4 text-[#195440] mx-auto mb-1" />
      <div className="text-xl font-bold text-gray-900">{value}</div>
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
