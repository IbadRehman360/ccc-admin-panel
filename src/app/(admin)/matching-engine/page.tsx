'use client';

import { useEffect, useState } from 'react';
import {
  Search, Eye, Users, TrendingUp, CheckCircle, Sliders,
  Loader2, Save, RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  useListMatchingUsersQuery,
  useGetMatchingStatsQuery,
  useGetUserPreferencesQuery,
  useGetPreferenceWeightsQuery,
  useUpdatePreferenceWeightsMutation,
  type MatchingUserRow,
} from '@/store/api/matchingApi';

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

export default function MatchingEnginePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Matching Engine</h1>
        <p className="text-gray-600 mt-2">Tune weights and inspect user preferences</p>
      </div>

      <MatchingStatsRow />

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />Users & Preferences
          </TabsTrigger>
          <TabsTrigger value="weights">
            <Sliders className="w-4 h-4 mr-2" />Preference Weights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="weights"><WeightsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function MatchingStatsRow() {
  const { data: stats } = useGetMatchingStatsQuery();
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard label="Total Accounts" value={stats?.total} icon={Users} color="text-gray-900" />
      <StatCard label="With Preferences" value={stats?.total_with_prefs} icon={CheckCircle} color="text-green-600" />
      <StatCard label="Without Preferences" value={stats?.total_without_prefs} icon={Users} color="text-gray-500" />
      <StatCard label="Users Onboarded" value={stats?.users_with_prefs} icon={Users} color="text-blue-600" />
      <StatCard label="Businesses Onboarded" value={stats?.businesses_with_prefs} icon={TrendingUp} color="text-[#E1B047]" />
    </div>
  );
}

function UsersTab() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [accountType, setAccountType] = useState<'all' | 'USER' | 'BUSINESS'>('all');
  const [prefsFilter, setPrefsFilter] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(1);

  const { data: list, isFetching } = useListMatchingUsersQuery({
    search, account_type: accountType, preferences_set: prefsFilter, page, limit: 25,
  });

  const [showPrefs, setShowPrefs] = useState(false);
  const [selected, setSelected] = useState<MatchingUserRow | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const rows = list?.data ?? [];
  const totalPages = list?.pagination.total_pages ?? 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users & Their Preferences</CardTitle>
        {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      </CardHeader>
      <CardContent>
        <form onSubmit={submitSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={accountType} onValueChange={(v) => { setAccountType(v as typeof accountType); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="USER">Users</SelectItem>
              <SelectItem value="BUSINESS">Businesses</SelectItem>
            </SelectContent>
          </Select>
          <Select value={prefsFilter} onValueChange={(v) => { setPrefsFilter(v as typeof prefsFilter); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Preferences" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Preferences Set</SelectItem>
              <SelectItem value="false">Not Set</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-[#195440] hover:bg-[#195440]/90">Search</Button>
        </form>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Preferences</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No users found</TableCell></TableRow>
              ) : rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={u.name} size="sm" />
                      <div className="text-sm">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.account_type === 'Business' ? 'default' : 'outline'} className={u.account_type === 'Business' ? 'bg-[#195440]' : ''}>
                      {u.account_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#195440]" style={{ width: `${u.profile_completion}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600">{u.profile_completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.preferences_set
                      ? <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />{u.preferences_count} set</Badge>
                      : <Badge variant="secondary">Not set</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{u.location || '—'}</TableCell>
                  <TableCell className="text-sm text-gray-600">{formatDate(u.joined_date)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => { setSelected(u); setShowPrefs(true); }}>
                      <Eye className="w-4 h-4 mr-1" />View
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

        <Dialog open={showPrefs} onOpenChange={setShowPrefs}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selected?.name}</DialogTitle>
              <DialogDescription>
                {selected && `${selected.email} · ${selected.account_type}`}
              </DialogDescription>
            </DialogHeader>
            {selected && <PreferencesView userId={selected.id} />}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPrefs(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function PreferencesView({ userId }: { userId: string }) {
  const { data, isLoading } = useGetUserPreferencesQuery(userId);
  if (isLoading || !data) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="overflow-y-auto max-h-[calc(85vh-180px)] pb-6 px-4 sm:px-6 space-y-4 pt-4">
      <div className="flex items-center gap-2">
        {data.is_preference_completed
          ? <Badge className="bg-green-600">Onboarded</Badge>
          : <Badge variant="secondary">Pending Onboarding</Badge>}
        <span className="text-sm text-gray-500">·</span>
        <span className="text-sm text-gray-600">{data.preferences.length} answer{data.preferences.length !== 1 && 's'}</span>
      </div>

      <Separator />

      {data.preferences.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No preference answers submitted yet.</div>
      ) : data.preferences.map((p) => (
        <div key={p.question_number} className="border rounded-lg p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">Question {p.question_number}</div>
          <div className="flex flex-wrap gap-2">
            {p.selected_options.map((opt, i) => (
              <Badge key={i} variant="outline" className="text-xs">{opt}</Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeightsTab() {
  const { data: weights, isLoading, refetch } = useGetPreferenceWeightsQuery();
  const [update, { isLoading: saving }] = useUpdatePreferenceWeightsMutation();

  const [draft, setDraft] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (weights) {
      const initial: Record<string, number> = {};
      for (const w of weights) initial[w.question_id] = w.weight;
      setDraft(initial);
    }
  }, [weights]);

  if (isLoading || !weights) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  const dirty = weights.some((w) => Math.abs((draft[w.question_id] ?? 0) - w.weight) > 0.0001);
  const total = Object.values(draft).reduce((s, v) => s + (Number(v) || 0), 0);

  const handleSave = async () => {
    setError(null);
    try {
      await update({
        weights: weights.map((w) => ({
          question_id: w.question_id,
          weight: draft[w.question_id] ?? w.weight,
        })),
      }).unwrap();
      setSavedAt(new Date().toLocaleTimeString());
      refetch();
    } catch (e) {
      setError(extractError(e));
    }
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    for (const w of weights) initial[w.question_id] = w.weight;
    setDraft(initial);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matching v2 Preference Weights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Each question contributes its weight to the final match score. Updating weights reloads the
          scorer immediately. Current total: <strong>{total.toFixed(2)}</strong>
        </p>

        <div className="space-y-3">
          {weights.map((w) => {
            const value = draft[w.question_id] ?? w.weight;
            const pct = total > 0 ? (value / total) * 100 : 0;
            return (
              <div key={w.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{w.question_id}</Badge>
                      <span className="font-medium">{w.label}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Updated {new Date(w.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">% of total</div>
                    <div className="font-bold text-[#195440]">{pct.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={value}
                    onChange={(e) => setDraft({ ...draft, [w.question_id]: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`w-${w.id}`} className="sr-only">Weight</Label>
                    <Input
                      id={`w-${w.id}`}
                      type="number"
                      min={0}
                      step={0.1}
                      value={value}
                      onChange={(e) => setDraft({ ...draft, [w.question_id]: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {savedAt && !dirty && (
          <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            Saved at {savedAt}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleReset} disabled={!dirty || saving}>
            <RotateCcw className="w-4 h-4 mr-2" />Reset
          </Button>
          <Button onClick={handleSave} disabled={!dirty || saving} className="bg-[#195440] hover:bg-[#195440]/90">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Weights'}
          </Button>
        </div>
      </CardContent>
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
        <div className={`text-3xl font-bold ${color}`}>{value?.toLocaleString() ?? '—'}</div>
      </CardContent>
    </Card>
  );
}
