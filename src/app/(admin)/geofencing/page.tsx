'use client';

import { useState } from 'react';
import {
  Search, Filter, MapPin, Users, Loader2, CheckCircle,
  ExternalLink, AlertCircle, Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGetGeoStatsQuery,
  useGetTopLocationsQuery,
  useListGeoUsersQuery,
} from '@/store/api/geofencingApi';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const mapUrl = (lat: string, lng: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`;

export default function GeofencingPage() {
  const { data: stats } = useGetGeoStatsQuery();
  const { data: topLocations = [] } = useGetTopLocationsQuery(10);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [accountType, setAccountType] = useState<'all' | 'USER' | 'BUSINESS'>('all');
  const [hasLocation, setHasLocation] = useState<'all' | 'true' | 'false'>('true');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: list, isFetching } = useListGeoUsersQuery({
    search,
    account_type: accountType,
    has_location: hasLocation,
    state: stateFilter || undefined,
    page,
    limit: 25,
  });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const rows = list?.data ?? [];
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Geofencing</h1>
        <p className="text-gray-600 mt-2">Browse users and businesses with location data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Accounts" value={stats?.total} icon={Users} color="text-gray-900" />
        <StatCard label="With Location" value={stats?.with_location} icon={MapPin} color="text-green-600" />
        <StatCard label="Without Location" value={stats?.without_location} icon={MapPin} color="text-gray-500" />
        <StatCard label="Users w/ Loc" value={stats?.users_with_location} icon={Users} color="text-blue-600" />
        <StatCard label="Biz w/ Loc" value={stats?.businesses_with_location} icon={Building2} color="text-[#E1B047]" />
      </div>

      <div className="flex items-start gap-2 max-w-4xl bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-900">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Device type, permission state, geofence zones</strong> need schema additions. This page shows users with lat/lng set in their profile (mobile app collects this).
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topLocations.length === 0
              ? <p className="text-sm text-gray-500">No data yet.</p>
              : topLocations.map((loc) => {
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
            <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search name, email, city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
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
                          <a
                            href={mapUrl(u.latitude!, u.longitude!)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            {Number(u.latitude).toFixed(3)}, {Number(u.longitude).toFixed(3)}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.has_fcm_token
                          ? <CheckCircle className="w-4 h-4 text-green-600" />
                          : <span className="text-xs text-gray-400">—</span>}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(u.last_active)}</TableCell>
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
        <div className={`text-3xl font-bold ${color}`}>{value?.toLocaleString() ?? '—'}</div>
      </CardContent>
    </Card>
  );
}
