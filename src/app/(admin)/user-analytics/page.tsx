'use client';

import { AlertCircle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetChartsQuery } from '@/store/api/dashboardApi';
import { useGetUserStatsQuery } from '@/store/api/usersApi';

export default function UserAnalyticsPage() {
  const { data: charts, isLoading: chartsLoading } = useGetChartsQuery();
  const { data: stats } = useGetUserStatsQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-600 mt-2">User growth and activity (subset of Dashboard charts)</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.total?.toLocaleString() ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            <Users className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.active?.toLocaleString() ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle>
            <Users className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.suspended?.toLocaleString() ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Completion</CardTitle>
            <TrendingUp className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E1B047]">{stats ? `${stats.avg_completion_pct}%` : '—'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Daily Registrations (last 7 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts?.daily_users ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" /><YAxis />
                <Tooltip /><Legend />
                <Line type="monotone" dataKey="users" stroke="#195440" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly Growth (cumulative)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts?.monthly_users ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /><YAxis />
                <Tooltip /><Legend />
                <Bar dataKey="users" fill="#195440" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="py-4 flex items-start gap-2 text-sm text-yellow-900">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Retention rate, age demographics, hourly activity, guest-to-registered conversion</strong> require
            additional schema instrumentation. Currently showing the user-focused subset from the Dashboard endpoint.
            {chartsLoading && ' Loading…'}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
