'use client';

import { useEffect, useState } from 'react';
import {
  Search, Filter, MapPin, Users, Loader2, CheckCircle,
  ExternalLink, Building2, Globe, Plus, Trash2, Pencil,
  MoreVertical, Send, Map as MapIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  useGetGeoStatsQuery,
  useGetTopLocationsQuery,
  useListGeoUsersQuery,
  useListZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
  useGetUsersInZoneQuery,
  useBroadcastToZoneMutation,
  type GeofenceZone,
  type ZoneStatus,
  type ZoneInput,
} from '@/store/api/geofencingApi';
import { extractError, formatDate } from '@/lib/format';

const mapUrl = (lat: string | number, lng: string | number) =>
  `https://www.google.com/maps?q=${encodeURIComponent(String(lat))},${encodeURIComponent(String(lng))}`;

const metersToMiles = (m: number) => (m / 1609.344).toFixed(1);

export default function GeofencingPage() {
  const { data: stats } = useGetGeoStatsQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Geofencing</h1>
        <p className="text-gray-600 mt-2">Browse user locations, define zones, broadcast to users inside them</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Accounts" value={stats?.total} icon={Users} color="text-gray-900" />
        <StatCard label="With Location" value={stats?.with_location} icon={MapPin} color="text-green-600" />
        <StatCard label="Without Location" value={stats?.without_location} icon={MapPin} color="text-gray-500" />
        <StatCard label="Users w/ Loc" value={stats?.users_with_location} icon={Users} color="text-blue-600" />
        <StatCard label="Biz w/ Loc" value={stats?.businesses_with_location} icon={Building2} color="text-[#E1B047]" />
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Users by Location</TabsTrigger>
          <TabsTrigger value="zones"><MapIcon className="w-4 h-4 mr-2" />Zones</TabsTrigger>
        </TabsList>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="zones"><ZonesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function UsersTab() {
  const { data: topLocations = [] } = useGetTopLocationsQuery(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [accountType, setAccountType] = useState<'all' | 'USER' | 'BUSINESS'>('all');
  const [hasLocation, setHasLocation] = useState<'all' | 'true' | 'false'>('true');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: list, isFetching } = useListGeoUsersQuery({
    search, account_type: accountType, has_location: hasLocation,
    state: stateFilter || undefined, page, limit: 25,
  });

  const rows = list?.data ?? [];
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader><CardTitle>Top States</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {topLocations.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet.</p>
          ) : topLocations.map((loc) => {
            const max = Math.max(...topLocations.map((l) => l.count));
            const pct = max > 0 ? (loc.count / max) * 100 : 0;
            return (
              <button
                key={loc.state}
                type="button"
                onClick={() => { setStateFilter(loc.state); setPage(1); }}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{loc.state}</span>
                  <span className="text-gray-500">{loc.count.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#195440]" style={{ width: `${pct}%` }}></div>
                </div>
              </button>
            );
          })}
          {stateFilter && (
            <Button variant="ghost" size="sm" onClick={() => { setStateFilter(''); setPage(1); }} className="w-full mt-2 text-xs">
              Clear state filter ({stateFilter})
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users / Businesses</CardTitle>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search name, email, city..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-10" />
            </div>
            <Select value={accountType} onValueChange={(v) => { setAccountType(v as typeof accountType); setPage(1); }}>
              <SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
                <SelectItem value="BUSINESS">Businesses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hasLocation} onValueChange={(v) => { setHasLocation(v as typeof hasLocation); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">With Location</SelectItem>
                <SelectItem value="false">Without Location</SelectItem>
              </SelectContent>
            </Select>
          </form>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City / State</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>FCM</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No accounts found</TableCell></TableRow>
                ) : rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.account_type === 'Business' ? 'default' : 'outline'} className={u.account_type === 'Business' ? 'bg-[#195440]' : ''}>
                        {u.account_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {u.city || u.state ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {[u.city, u.state].filter(Boolean).join(', ')}
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {u.has_location ? (
                        <a href={mapUrl(u.latitude!, u.longitude!)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                          {Number(u.latitude).toFixed(3)}, {Number(u.longitude).toFixed(3)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span className="text-gray-400">—</span>}
                    </TableCell>
                    <TableCell>
                      {u.has_fcm_token ? <CheckCircle className="w-4 h-4 text-green-600" /> : <span className="text-xs text-gray-400">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(u.last_active)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {list && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Page {list.pagination.page} of {totalPages} — {list.pagination.total.toLocaleString()} total</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ZonesTab() {
  const [statusFilter, setStatusFilter] = useState<ZoneStatus | 'all'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: list, isFetching } = useListZonesQuery({
    search, status: statusFilter, page, limit: 25,
  });

  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<GeofenceZone | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [usersZoneId, setUsersZoneId] = useState<string | null>(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastZoneId, setBroadcastZoneId] = useState<string | null>(null);

  const [deleteZone] = useDeleteZoneMutation();

  const rows = list?.data ?? [];
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Geofence Zones</CardTitle>
        <Button onClick={() => { setEditing(null); setShowEditor(true); }} className="bg-[#195440] hover:bg-[#195440]/90">
          <Plus className="w-4 h-4 mr-2" />New Zone
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by name or description..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as ZoneStatus | 'all'); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
        </form>

        {isFetching && <div className="text-center py-4"><Loader2 className="w-4 h-4 animate-spin inline" /></div>}

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Shape</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No zones defined yet. Click <strong>New Zone</strong> to add one.</TableCell></TableRow>
              ) : rows.map((z) => (
                <TableRow key={z.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{z.name}</div>
                    {z.description && <div className="text-xs text-gray-500 line-clamp-1">{z.description}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {z.shape}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {z.shape === 'CIRCLE' && z.center_lat != null && z.center_lng != null ? (
                      <>
                        <a href={mapUrl(z.center_lat, z.center_lng)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {z.center_lat.toFixed(3)}, {z.center_lng.toFixed(3)}
                        </a>
                        <div className="text-gray-500">radius {metersToMiles(z.radius_meters!)} mi</div>
                      </>
                    ) : (
                      <span className="text-gray-500">{Array.isArray(z.polygon_coords) ? z.polygon_coords.length : 0} vertices</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {z.status === 'ACTIVE'
                      ? <Badge className="bg-green-600">Active</Badge>
                      : <Badge variant="secondary">Inactive</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{formatDate(z.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-md text-sm hover:bg-gray-100 h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setUsersZoneId(z.id); setShowUsers(true); }}>
                          <Users className="w-4 h-4 mr-2" />View Users in Zone
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setBroadcastZoneId(z.id); setShowBroadcast(true); }}>
                          <Send className="w-4 h-4 mr-2" />Broadcast Notification
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditing(z); setShowEditor(true); }}>
                          <Pencil className="w-4 h-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={async () => {
                            if (confirm(`Delete zone "${z.name}"?`)) {
                              try { await deleteZone(z.id).unwrap(); } catch { /* noop */ }
                            }
                          }}
                        >
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

        {list && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Page {list.pagination.page} of {totalPages} — {list.pagination.total.toLocaleString()} total</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </CardContent>

      <ZoneEditor open={showEditor} onClose={() => setShowEditor(false)} zone={editing} />
      <UsersInZoneDialog open={showUsers} onClose={() => setShowUsers(false)} zoneId={usersZoneId} />
      <BroadcastDialog open={showBroadcast} onClose={() => setShowBroadcast(false)} zoneId={broadcastZoneId} />
    </Card>
  );
}

function ZoneEditor({ open, onClose, zone }: { open: boolean; onClose: () => void; zone: GeofenceZone | null }) {
  const [create, { isLoading: creating }] = useCreateZoneMutation();
  const [update, { isLoading: updating }] = useUpdateZoneMutation();
  const saving = creating || updating;

  const [form, setForm] = useState<ZoneInput>({
    name: '',
    description: '',
    shape: 'CIRCLE',
    status: 'ACTIVE',
    center_lat: undefined,
    center_lng: undefined,
    radius_meters: 5000,
  });
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens or the zone being edited changes
  useEffect(() => {
    if (!open) return;
    if (zone) {
      setForm({
        name: zone.name,
        description: zone.description || '',
        status: zone.status,
        shape: zone.shape,
        center_lat: zone.center_lat ?? undefined,
        center_lng: zone.center_lng ?? undefined,
        radius_meters: zone.radius_meters ?? 5000,
        polygon_coords: zone.polygon_coords ?? undefined,
      });
    } else {
      setForm({
        name: '', description: '', shape: 'CIRCLE', status: 'ACTIVE',
        center_lat: undefined, center_lng: undefined, radius_meters: 5000,
      });
    }
    setError(null);
  }, [zone, open]);

  const handleSave = async () => {
    setError(null);
    try {
      if (zone) {
        const { shape, ...patch } = form;
        await update({ id: zone.id, body: patch }).unwrap();
      } else {
        await create(form).unwrap();
      }
      onClose();
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{zone ? 'Edit Zone' : 'New Zone'}</DialogTitle>
          <DialogDescription>
            Define a circle by center + radius. Tip: open <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-blue-600 underline">Google Maps</a>, right-click a spot → copy lat,lng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-6">
          <div>
            <Label htmlFor="zname">Name *</Label>
            <Input id="zname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown LA" />
          </div>
          <div>
            <Label htmlFor="zdesc">Description</Label>
            <Textarea id="zdesc" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What this zone covers" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="zstatus">Status</Label>
              <Select value={form.status || 'ACTIVE'} onValueChange={(v) => setForm({ ...form, status: v as ZoneStatus })}>
                <SelectTrigger id="zstatus"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zshape">Shape</Label>
              <Select value={form.shape} onValueChange={(v) => setForm({ ...form, shape: v as 'CIRCLE' | 'POLYGON' })} disabled={!!zone}>
                <SelectTrigger id="zshape"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CIRCLE">Circle (center + radius)</SelectItem>
                  <SelectItem value="POLYGON" disabled>Polygon (coming soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.shape === 'CIRCLE' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="lat">Center Latitude *</Label>
                  <Input id="lat" type="number" step="any" value={form.center_lat ?? ''} onChange={(e) => setForm({ ...form, center_lat: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="34.0522" />
                </div>
                <div>
                  <Label htmlFor="lng">Center Longitude *</Label>
                  <Input id="lng" type="number" step="any" value={form.center_lng ?? ''} onChange={(e) => setForm({ ...form, center_lng: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="-118.2437" />
                </div>
              </div>
              <div>
                <Label htmlFor="rad">Radius (meters) *</Label>
                <Input id="rad" type="number" min={50} max={500000} value={form.radius_meters ?? ''} onChange={(e) => setForm({ ...form, radius_meters: e.target.value === '' ? undefined : Number(e.target.value) })} />
                <p className="text-xs text-gray-500 mt-1">
                  {form.radius_meters ? `${metersToMiles(form.radius_meters)} miles` : '—'}
                </p>
              </div>
              {form.center_lat != null && form.center_lng != null && (
                <a
                  href={mapUrl(form.center_lat, form.center_lng)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Preview center on Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </>
          )}
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
            disabled={
              saving ||
              !form.name.trim() ||
              (form.shape === 'CIRCLE' &&
                (form.center_lat == null || form.center_lng == null || !form.radius_meters))
            }
            className="bg-[#195440] hover:bg-[#195440]/90"
          >
            {saving ? 'Saving...' : zone ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UsersInZoneDialog({ open, onClose, zoneId }: { open: boolean; onClose: () => void; zoneId: string | null }) {
  const { data, isLoading } = useGetUsersInZoneQuery(
    { id: zoneId!, page: 1, limit: 100 },
    { skip: !zoneId || !open },
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Users currently in this zone</DialogTitle>
          <DialogDescription>
            Computed from each user&apos;s last-known location. Total: {data?.pagination.total ?? '—'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          {isLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : !data || data.data.length === 0 ? (
            <div className="py-6 text-center text-gray-500">No users in this zone right now.</div>
          ) : (
            <div className="space-y-2">
              {data.data.map((u) => (
                <div key={u.id} className="border rounded-lg p-3 flex items-center justify-between gap-3 bg-gray-50">
                  <div className="text-sm">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{u.user_type}</Badge>
                    {u.has_fcm_token && <CheckCircle className="w-4 h-4 text-green-600" />}
                    <a href={mapUrl(u.latitude, u.longitude)} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                      {u.latitude.toFixed(3)}, {u.longitude.toFixed(3)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BroadcastDialog({ open, onClose, zoneId }: { open: boolean; onClose: () => void; zoneId: string | null }) {
  const [send, { isLoading }] = useBroadcastToZoneMutation();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ recipients_total: number; sent: number; failed: number } | null>(null);

  const handleSend = async () => {
    if (!zoneId) return;
    setError(null);
    setResult(null);
    try {
      const r = await send({ id: zoneId, body: { title, message } }).unwrap();
      setResult(r);
    } catch (e) {
      setError(extractError(e));
    }
  };

  const handleClose = () => {
    setTitle(''); setMessage(''); setError(null); setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Broadcast to users in zone</DialogTitle>
          <DialogDescription>
            Push notification + DB log delivered to every user currently inside this zone.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="px-6">
            <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              ✓ Sent {result.sent} / {result.recipients_total} (failed: {result.failed})
            </div>
          </div>
        ) : (
          <div className="px-6 space-y-3">
            <div>
              <Label htmlFor="btitle">Title *</Label>
              <Input id="btitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Event in your area" />
            </div>
            <div>
              <Label htmlFor="bmsg">Message *</Label>
              <Textarea id="bmsg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What's happening" rows={3} />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Close</Button>
          {!result && (
            <Button onClick={handleSend} disabled={isLoading || !title.trim() || !message.trim()} className="bg-[#195440] hover:bg-[#195440]/90">
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
