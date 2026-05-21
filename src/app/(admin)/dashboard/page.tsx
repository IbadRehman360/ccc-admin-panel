'use client';

import { Users, Building2, CheckCircle, Briefcase, Megaphone, Flag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import Link from 'next/link';

const statsCards = [
  { title: 'Total Users', value: '12,458', subtitle: '10,234 Active / 2,224 Inactive', icon: Users, color: '#195440', change: '+12.5%', link: '/user-management' },
  { title: 'Total Businesses', value: '3,892', subtitle: '3,104 Verified / 788 Unverified', icon: Building2, color: '#2d7a5f', change: '+8.2%', link: '/business-management' },
  { title: 'Pending Approvals', value: '247', subtitle: '89 Claims, 78 Ads, 80 Communities', icon: CheckCircle, color: '#E1B047', change: '-3.1%', link: '/pending-approvals' },
  { title: 'Active Jobs', value: '1,834', subtitle: '12,456 Applications', icon: Briefcase, color: '#195440', change: '+15.8%', link: '/job-management' },
  { title: 'Active Ads', value: '456', subtitle: '2.3M Impressions', icon: Megaphone, color: '#2d7a5f', change: '+22.4%', link: '/ad-management' },
  { title: 'Reports Count', value: '89', subtitle: '34 Pending Review', icon: Flag, color: '#dc3545', change: '+5.6%', link: '/report-management' },
];

const dailyUsersData = [
  { date: 'Mon', users: 245 }, { date: 'Tue', users: 312 }, { date: 'Wed', users: 289 },
  { date: 'Thu', users: 401 }, { date: 'Fri', users: 378 }, { date: 'Sat', users: 456 }, { date: 'Sun', users: 423 },
];

const monthlyUsersData = [
  { month: 'Jan', users: 8234 }, { month: 'Feb', users: 9123 }, { month: 'Mar', users: 10456 },
  { month: 'Apr', users: 11234 }, { month: 'May', users: 12458 },
];

const businessCategoryData = [
  { category: 'Diverse-Owned', count: 1245, fill: '#195440' },
  { category: 'Corporation', count: 892, fill: '#2d7a5f' },
  { category: 'Healthcare', count: 734, fill: '#4a9d7f' },
  { category: 'Education', count: 621, fill: '#E1B047' },
  { category: 'Other', count: 400, fill: '#8b7332' },
];

const adsPerformanceData = [
  { month: 'Jan', impressions: 234000, clicks: 12340 }, { month: 'Feb', impressions: 345000, clicks: 18900 },
  { month: 'Mar', impressions: 456000, clicks: 23400 }, { month: 'Apr', impressions: 567000, clicks: 29800 },
  { month: 'May', impressions: 678000, clicks: 34500 },
];

const jobsData = [
  { month: 'Jan', postings: 234, applications: 3456 }, { month: 'Feb', postings: 289, applications: 4123 },
  { month: 'Mar', postings: 345, applications: 5234 }, { month: 'Apr', postings: 412, applications: 6789 },
  { month: 'May', postings: 456, applications: 7834 },
];

export default function DashboardPage() {
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
            <p className="text-gray-200">Here's what's happening with your platform today.</p>
          </div>
          <img src="/assets/ccc-icon.png" alt="CCC Icon" className="w-40 h-40 object-contain" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
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
                  <div className={`text-sm ${stat.change.startsWith('+') ? 'text-[#E1B047]' : 'text-red-600'}`}>
                    {stat.change} from last month
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
              <LineChart data={dailyUsersData}>
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
              <BarChart data={monthlyUsersData}>
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
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
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
              <BarChart data={adsPerformanceData}>
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
            <LineChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" /><YAxis />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="postings" stroke="#195440" strokeWidth={2} />
              <Line type="monotone" dataKey="applications" stroke="#E1B047" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
