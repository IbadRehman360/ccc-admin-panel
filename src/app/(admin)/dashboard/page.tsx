'use client';

import {
  Users,
  Building2,
  CheckCircle,
  Briefcase,
  Megaphone,
  Flag,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import Link from 'next/link';
import { useGetStatsQuery, useGetChartsQuery } from '@/store/api/dashboardApi';

const PIE_COLORS = ['#195440', '#2d7a5f', '#4a9d7f', '#E1B047', '#8b7332'];

const formatNumber = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : n.toLocaleString();

const formatChange = (pct: number | null) => {
  if (pct === null || pct === undefined) return '— from last month';
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct}% from last month`;
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery();
  const { data: charts, isLoading: chartsLoading } = useGetChartsQuery();

  const statsCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.total_users.value.toLocaleString(),
          subtitle: `${stats.total_users.active.toLocaleString()} Active / ${stats.total_users.inactive.toLocaleString()} Inactive`,
          icon: Users,
          color: '#195440',
          change: formatChange(stats.total_users.change_pct),
          isPositive: (stats.total_users.change_pct ?? 0) >= 0,
          link: '/user-management',
        },
        {
          title: 'Total Businesses',
          value: stats.total_businesses.value.toLocaleString(),
          subtitle: `${stats.total_businesses.verified.toLocaleString()} Verified / ${stats.total_businesses.unverified.toLocaleString()} Unverified`,
          icon: Building2,
          color: '#2d7a5f',
          change: formatChange(stats.total_businesses.change_pct),
          isPositive: (stats.total_businesses.change_pct ?? 0) >= 0,
          link: '/business-management',
        },
        {
          title: 'Pending Approvals',
          value: stats.pending_approvals.value.toLocaleString(),
          subtitle: `${stats.pending_approvals.claims} Claims, ${stats.pending_approvals.ads} Ads, ${stats.pending_approvals.communities} Communities`,
          icon: CheckCircle,
          color: '#E1B047',
          change: formatChange(stats.pending_approvals.change_pct),
          isPositive: (stats.pending_approvals.change_pct ?? 0) >= 0,
          link: '/pending-approvals',
        },
        {
          title: 'Active Jobs',
          value: stats.active_jobs.value.toLocaleString(),
          subtitle: `${stats.active_jobs.applications.toLocaleString()} Applications`,
          icon: Briefcase,
          color: '#195440',
          change: formatChange(stats.active_jobs.change_pct),
          isPositive: (stats.active_jobs.change_pct ?? 0) >= 0,
          link: '/job-management',
        },
        {
          title: 'Active Ads',
          value: stats.active_ads.value.toLocaleString(),
          subtitle: `${formatNumber(stats.active_ads.impressions)} Impressions`,
          icon: Megaphone,
          color: '#2d7a5f',
          change: formatChange(stats.active_ads.change_pct),
          isPositive: (stats.active_ads.change_pct ?? 0) >= 0,
          link: '/ad-management',
        },
        {
          title: 'Reports Count',
          value: stats.reports.value.toLocaleString(),
          subtitle: `${stats.reports.pending} Pending Review`,
          icon: Flag,
          color: '#dc3545',
          change: formatChange(stats.reports.change_pct),
          isPositive: (stats.reports.change_pct ?? 0) >= 0,
          link: '/report-management',
        },
      ]
    : [];

  const businessCategoryData =
    charts?.business_categories.map((bc, i) => ({
      ...bc,
      fill: PIE_COLORS[i % PIE_COLORS.length],
    })) ?? [];

  return (
    <div className="space-y-6">
      <div
        className="relative rounded-2xl overflow-hidden p-8 text-white"
        style={{ backgroundImage: 'url(/assets/dashboard-hero.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1954408c]"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-gray-200">Here&apos;s what&apos;s happening with your platform today.</p>
          </div>
          <img src="/assets/ccc-icon.png" alt="CCC Icon" className="w-40 h-40 object-contain" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-40">
                <CardContent className="pt-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          : statsCards.map((stat, index) => (
              <Link key={index} href={stat.link}>
                <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-sm text-gray-600 mt-1">{stat.subtitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-sm ${stat.isPositive ? 'text-[#E1B047]' : 'text-red-600'}`}>
                        {stat.change}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Daily User Registrations</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Monthly User Growth</CardTitle></CardHeader>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Business Registrations by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={businessCategoryData}
                  cx="50%" cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="count"
                >
                  {businessCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ads Impressions & Clicks</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts?.ads_performance ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /><YAxis />
                <Tooltip /><Legend />
                <Bar dataKey="impressions" fill="#195440" />
                <Bar dataKey="clicks" fill="#E1B047" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Job Postings vs Applications</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts?.jobs_data ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" /><YAxis />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="postings" stroke="#195440" strokeWidth={2} />
              <Line type="monotone" dataKey="applications" stroke="#E1B047" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {chartsLoading && (
        <p className="text-center text-sm text-gray-500">Loading chart data...</p>
      )}
    </div>
  );
}
