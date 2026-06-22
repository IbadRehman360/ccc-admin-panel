'use client';

import { useEffect, useState } from 'react';
import {
  Search, Filter, Eye, Trash2, Plus, MoreVertical, Loader2,
  Newspaper, Star, TrendingUp, Pencil, ExternalLink, Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  useListNewsQuery,
  useGetNewsStatsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  type NewsArticle,
  type NewsStatus,
  type NewsArticleInput,
} from '@/store/api/newsApi';
import { extractError, formatDate } from '@/lib/format';

const statusBadge = (s: NewsStatus) => {
  if (s === 'PUBLISHED') return <Badge className="bg-green-600">Published</Badge>;
  if (s === 'DRAFT') return <Badge variant="secondary">Draft</Badge>;
  return <Badge variant="outline">Archived</Badge>;
};

export default function NewsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<NewsStatus | 'all'>('all');
  const [trendingFilter, setTrendingFilter] = useState<'all' | 'true' | 'false'>('all');
  const [sortBy, setSortBy] = useState<'published' | 'created' | 'title'>('published');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetNewsStatsQuery();
  const { data: list, isFetching } = useListNewsQuery({
    search,
    status: statusFilter,
    is_trending: trendingFilter,
    sort_by: sortBy,
    page,
    limit: 25,
  });

  const [deleteNews, { isLoading: deleting }] = useDeleteNewsMutation();

  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [target, setTarget] = useState<NewsArticle | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openNew = () => {
    setEditing(null);
    setShowEditor(true);
  };

  const openEdit = (n: NewsArticle) => {
    setEditing(n);
    setShowEditor(true);
  };

  const openDelete = (n: NewsArticle) => {
    setTarget(n);
    setReason('');
    setError(null);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!target) return;
    setError(null);
    try {
      await deleteNews({ id: target.id, reason }).unwrap();
      setShowDelete(false);
      setTarget(null);
      setReason('');
    } catch (e) {
      setError(extractError(e));
    }
  };

  const rows = list?.data ?? [];
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600 mt-2">Curate articles that appear at the top of the mobile news feed</p>
        </div>
        <Button onClick={openNew} className="bg-[#195440] hover:bg-[#195440]/90">
          <Plus className="w-4 h-4 mr-2" />New Article
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard label="Total" value={stats?.total} icon={Newspaper} color="text-gray-900" />
        <StatCard label="Published" value={stats?.published} icon={Newspaper} color="text-green-600" />
        <StatCard label="Draft" value={stats?.draft} icon={Pencil} color="text-yellow-600" />
        <StatCard label="Archived" value={stats?.archived} icon={Newspaper} color="text-gray-500" />
        <StatCard label="Trending" value={stats?.trending} icon={TrendingUp} color="text-orange-600" />
        <StatCard label="Featured" value={stats?.featured} icon={Star} color="text-[#E1B047]" />
      </div>

      <div className="flex items-start gap-2 max-w-4xl bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-900">
        <Newspaper className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Published articles are <strong>merged on top</strong> of the third-party news feed at <code className="bg-blue-100 px-1 rounded">/external_api/get_news</code>.
          Mobile users see them first; rest comes from rapidapi. Drafts and Archived items are not shown to users.
        </span>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Articles</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search title, summary, source..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as NewsStatus | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={trendingFilter} onValueChange={(v) => { setTrendingFilter(v as typeof trendingFilter); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Trending" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Trending Only</SelectItem>
                <SelectItem value="false">Non-Trending</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published date</SelectItem>
                  <SelectItem value="created">Created date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Go</Button>
            </div>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No articles found</TableCell></TableRow>
                ) : rows.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {n.image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={n.image_url} alt="" className="w-14 h-14 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 max-w-xs">
                          <div className="font-medium text-sm line-clamp-1">{n.title}</div>
                          {n.summary && <div className="text-xs text-gray-500 line-clamp-2 mt-1">{n.summary}</div>}
                          <a href={n.content_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1">
                            <ExternalLink className="w-3 h-3" />Open
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{n.source || '—'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {n.is_trending && <Badge variant="outline" className="text-xs border-orange-500 text-orange-700"><TrendingUp className="w-3 h-3 mr-1" />Trending</Badge>}
                        {n.is_featured && <Badge variant="outline" className="text-xs border-[#E1B047] text-[#E1B047]"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
                        {!n.is_trending && !n.is_featured && <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(n.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div>{n.published_at ? formatDate(n.published_at) : '—'}</div>
                      <div className="text-xs text-gray-400">{n.read_time_minutes} min read</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(n)}>
                            <Pencil className="w-4 h-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(n.content_url, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" />Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(n)} className="text-red-600">
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

      <ArticleEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        article={editing}
      />

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Permanently delete <strong>{target?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="del-reason">Reason *</Label>
            <Textarea id="del-reason" placeholder="Why?" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
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
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArticleEditor({
  open, onClose, article,
}: {
  open: boolean;
  onClose: () => void;
  article: NewsArticle | null;
}) {
  const [create, { isLoading: creating }] = useCreateNewsMutation();
  const [update, { isLoading: updating }] = useUpdateNewsMutation();
  const saving = creating || updating;

  const [form, setForm] = useState<NewsArticleInput>({
    title: '',
    content_url: '',
    summary: '',
    content: '',
    image_url: '',
    source: '',
    is_trending: false,
    is_featured: false,
    read_time_minutes: 3,
    status: 'DRAFT',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        content_url: article.content_url,
        summary: article.summary || '',
        content: article.content || '',
        image_url: article.image_url || '',
        source: article.source || '',
        is_trending: article.is_trending,
        is_featured: article.is_featured,
        read_time_minutes: article.read_time_minutes,
        status: article.status,
      });
    } else {
      setForm({
        title: '',
        content_url: '',
        summary: '',
        content: '',
        image_url: '',
        source: '',
        is_trending: false,
        is_featured: false,
        read_time_minutes: 3,
        status: 'DRAFT',
      });
    }
    setError(null);
  }, [article, open]);

  const handleSave = async () => {
    setError(null);
    try {
      const cleaned: NewsArticleInput = {
        ...form,
        summary: form.summary || undefined,
        content: form.content || undefined,
        image_url: form.image_url || undefined,
        source: form.source || undefined,
      };
      if (article) {
        await update({ id: article.id, body: cleaned }).unwrap();
      } else {
        await create(cleaned).unwrap();
      }
      onClose();
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'New Article'}</DialogTitle>
          <DialogDescription>
            {article ? 'Update this article.' : 'Add a new article to the curated feed.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Diverse Business Owners Lead Healthcare Innovation"
            />
          </div>
          <div>
            <Label htmlFor="content_url">Content URL *</Label>
            <Input
              id="content_url"
              type="url"
              value={form.content_url}
              onChange={(e) => setForm({ ...form, content_url: e.target.value })}
              placeholder="https://example.com/full-article"
            />
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Short preview shown in the feed card"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="content">Full Article Body (HTML supported)</Label>
            <Textarea
              id="content"
              value={form.content || ''}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={'Optional. Used as the body when a mobile user opens the article.\n\nSupports basic HTML: <p>, <h2>, <ul>, <li>, <strong>, <em>, <a href>, <img src>, <br>.\n\nLeave blank to scrape the Content URL instead.'}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              When set, mobile shows this content directly (no scraping). When blank, mobile scrapes the Content URL above.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g. Forbes, NYT"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="read_time">Read time (min)</Label>
              <Input
                id="read_time"
                type="number"
                min={1}
                max={120}
                value={form.read_time_minutes}
                onChange={(e) => setForm({ ...form, read_time_minutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status || 'DRAFT'}
                onValueChange={(v) => setForm({ ...form, status: v as NewsStatus })}
              >
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 pt-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_trending || false}
                  onChange={(e) => setForm({ ...form, is_trending: e.target.checked })}
                />
                Trending
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured || false}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Featured
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.content_url.trim()}
            className="bg-[#195440] hover:bg-[#195440]/90"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : article ? 'Update' : 'Create'}
          </Button>
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
