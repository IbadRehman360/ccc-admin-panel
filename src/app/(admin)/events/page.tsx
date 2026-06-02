'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Calendar, MapPin, Users, Clock, MoreVertical,
  Trash2, XCircle, Loader2, Globe, Lock, ExternalLink,
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
  useListEventsQuery,
  useGetEventStatsQuery,
  useGetEventDetailQuery,
  useGetEventAttendeesQuery,
  useCancelEventMutation,
  useDeleteEventMutation,
  type EventRow,
  type EventStatus,
  type EventPrivacy,
} from '@/store/api/eventsApi';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const statusBadge = (s: EventStatus) => {
  switch (s) {
    case 'Upcoming': return <Badge className="bg-blue-600">Upcoming</Badge>;
    case 'Live': return <Badge className="bg-green-600">Live</Badge>;
    case 'Past': return <Badge variant="secondary">Past</Badge>;
    case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>;
  }
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function EventsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState<EventPrivacy | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'past' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'members' | 'name'>('date');
  const [page, setPage] = useState(1);

  const { data: stats } = useGetEventStatsQuery();
  const { data: list, isFetching } = useListEventsQuery({
    search, privacy: privacyFilter, status: statusFilter, sort_by: sortBy, page, limit: 25,
  });

  const [cancelEvent, { isLoading: cancelling }] = useCancelEventMutation();
  const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [action, setAction] = useState<'cancel' | 'delete' | null>(null);
  const [selected, setSelected] = useState<EventRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openProfile = (e: EventRow) => { setSelected(e); setShowProfile(true); };
  const openAction = (e: EventRow, a: 'cancel' | 'delete') => {
    setSelected(e); setAction(a); setReason(''); setError(null); setShowAction(true);
  };

  const confirmAction = async () => {
    if (!selected || !action) return;
    setError(null);
    try {
      if (action === 'cancel') {
        await cancelEvent({ id: selected.id, reason }).unwrap();
      } else {
        await deleteEvent({ id: selected.id, reason }).unwrap();
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
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-600 mt-2">Monitor and moderate community events</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats?.total} icon={Calendar} color="text-gray-900" />
        <StatCard label="Upcoming" value={stats?.upcoming} icon={Clock} color="text-blue-600" />
        <StatCard label="Live" value={stats?.live} icon={Calendar} color="text-green-600" />
        <StatCard label="Past" value={stats?.past} icon={Calendar} color="text-gray-600" />
        <StatCard label="Cancelled" value={stats?.cancelled} icon={XCircle} color="text-red-600" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Events</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events, location, organizer..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as typeof statusFilter); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={privacyFilter} onValueChange={(v) => { setPrivacyFilter(v as EventPrivacy | 'all'); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Privacy" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No events found</TableCell></TableRow>
                ) : rows.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {e.image
                          /* eslint-disable-next-line @next/next/no-img-element */
                          ? <img src={e.image} alt={e.name} className="w-10 h-10 rounded object-cover" onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                          : <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center"><Calendar className="w-4 h-4 text-gray-400" /></div>
                        }
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[200px]">{e.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {e.privacy === 'PUBLIC'
                              ? <span className="text-xs text-green-700 flex items-center gap-1"><Globe className="w-3 h-3" />Public</span>
                              : <span className="text-xs text-gray-600 flex items-center gap-1"><Lock className="w-3 h-3" />Private</span>}
                            {e.is_free
                              ? <Badge variant="outline" className="text-xs">Free</Badge>
                              : <Badge variant="outline" className="text-xs">${e.price}</Badge>}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{e.community?.name || '—'}</TableCell>
                    <TableCell>
                      <div className="text-sm">{e.organizer?.full_name || '—'}</div>
                      <div className="text-xs text-gray-500">{e.organizer?.email || ''}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{formatDate(e.event_date)}</div>
                      <div className="text-xs text-gray-500">{formatTime(e.event_time)}</div>
                    </TableCell>
                    <TableCell>
                      {e.location ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[140px]">{e.location}</span>
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {e.total_member_count}
                      {e.interested_member_count > 0 && (
                        <span className="text-xs text-gray-500"> ({e.interested_member_count} interested)</span>
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(e.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfile(e)}>
                            <Eye className="w-4 h-4 mr-2" />View Details
                          </DropdownMenuItem>
                          {e.status !== 'Cancelled' && (
                            <DropdownMenuItem onClick={() => openAction(e, 'cancel')}>
                              <XCircle className="w-4 h-4 mr-2" />Cancel Event
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openAction(e, 'delete')} className="text-red-600">
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
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {selected && (
                <>
                  {formatDate(selected.event_date)} at {formatTime(selected.event_time)}
                  {selected.community && ` · ${selected.community.name}`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selected && <EventBody eventId={selected.id} />}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)} className="w-full sm:w-auto">Close</Button>
            {selected && selected.status !== 'Cancelled' && (
              <Button onClick={() => { setShowProfile(false); openAction(selected, 'cancel'); }} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                <XCircle className="w-4 h-4 mr-2" />Cancel Event
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAction} onOpenChange={setShowAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === 'cancel' ? 'Cancel Event' : 'Delete Event'}</DialogTitle>
            <DialogDescription>
              {action === 'cancel'
                ? `Mark "${selected?.name}" as cancelled? (Sets is_deleted=true, reversible via DB.)`
                : `Permanently delete "${selected?.name}"? Cascades to all attendees, invites, favorites.`}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-2">
            <Label htmlFor="e-reason">Reason {action === 'delete' ? '*' : '(optional)'}</Label>
            <Textarea
              id="e-reason"
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
              variant={action === 'delete' ? 'destructive' : 'default'}
              className={action === 'cancel' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              onClick={confirmAction}
              disabled={(action === 'delete' && !reason.trim()) || cancelling || deleting}
            >
              {action === 'cancel' && <><XCircle className="w-4 h-4 mr-2" />{cancelling ? 'Cancelling...' : 'Cancel Event'}</>}
              {action === 'delete' && <><Trash2 className="w-4 h-4 mr-2" />{deleting ? 'Deleting...' : 'Delete Permanently'}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EventBody({ eventId }: { eventId: string }) {
  const { data: detail, isLoading } = useGetEventDetailQuery(eventId);
  const { data: attendees = { data: [], pagination: { total: 0, page: 1, limit: 50, total_pages: 1 } }, isLoading: attLoading } = useGetEventAttendeesQuery({ id: eventId, page: 1, limit: 50 });
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
            <TabsTrigger value="attendees">Attendees ({attendees.pagination.total})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="space-y-4 mt-4 px-4 sm:px-6">
          {detail.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={detail.image} alt={detail.name} className="w-full max-h-56 object-cover rounded-lg" />
          )}

          <div className="grid grid-cols-3 gap-3 text-center">
            <StatBox icon={Users} label="Going" value={detail.going_count} />
            <StatBox icon={Users} label="Maybe" value={detail.maybe_count} />
            <StatBox icon={Users} label="Favorites" value={detail.favorites_count} />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" value={formatDate(detail.event_date)} />
            <Field label="Time" value={formatTime(detail.event_time)} />
            <Field label="Privacy" value={detail.privacy} />
            <Field label="Price" value={detail.is_free ? 'Free' : `$${detail.price}`} />
            <Field label="Location" value={detail.location || '—'} />
            <Field label="ESG / DEI" value={`${detail.is_esg ? 'ESG' : ''}${detail.is_esg && detail.is_dei ? ' · ' : ''}${detail.is_dei ? 'DEI' : ''}${!detail.is_esg && !detail.is_dei ? '—' : ''}`} />
            {detail.event_url && (
              <Field
                label="Event URL"
                value={
                  <a href={detail.event_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                    Link <ExternalLink className="w-3 h-3" />
                  </a>
                }
              />
            )}
          </div>

          <Separator />

          <div>
            <Label className="text-gray-600">Description</Label>
            <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">{detail.description || '—'}</p>
          </div>

          {detail.organizer && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-2">Organizer</h3>
                <div className="text-sm">
                  <div>{detail.organizer.full_name || '—'}</div>
                  <div className="text-xs text-gray-500">{detail.organizer.email}</div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="attendees" className="space-y-3 mt-4 px-4 sm:px-6">
          {attLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : attendees.data.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No attendees yet</div>
          ) : attendees.data.map((a) => (
            <div key={a.id} className="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
              <div className="text-sm">
                <div className="font-medium">{a.user?.full_name || '—'}</div>
                <div className="text-xs text-gray-500">{a.user?.email}</div>
              </div>
              <Badge variant={a.status === 'GOING' ? 'default' : 'outline'} className={a.status === 'GOING' ? 'bg-green-600' : ''}>
                {a.status}
              </Badge>
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

function StatBox({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
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
