'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, UserMinus, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const dailyUserData = [
  { date: '02/11', newUsers: 245, activeUsers: 8234, inactiveUsers: 2012 },
  { date: '02/12', newUsers: 312, activeUsers: 8456, inactiveUsers: 2034 },
  { date: '02/13', newUsers: 289, activeUsers: 8712, inactiveUsers: 2045 },
  { date: '02/14', newUsers: 401, activeUsers: 9023, inactiveUsers: 2078 },
  { date: '02/15', newUsers: 378, activeUsers: 9334, inactiveUsers: 2089 },
  { date: '02/16', newUsers: 456, activeUsers: 9712, inactiveUsers: 2101 },
  { date: '02/17', newUsers: 423, activeUsers: 10089, inactiveUsers: 2156 },
  { date: '02/18', newUsers: 467, activeUsers: 10234, inactiveUsers: 2224 },
];

const monthlyGrowthData = [
  { month: 'Sep 2025', users: 6234, growth: 5.2 },
  { month: 'Oct 2025', users: 7123, growth: 14.3 },
  { month: 'Nov 2025', users: 8456, growth: 18.7 },
  { month: 'Dec 2025', users: 9234, growth: 9.2 },
  { month: 'Jan 2026', users: 10456, growth: 13.2 },
  { month: 'Feb 2026', users: 12458, growth: 19.1 },
];

const userDemographicsData = [
  { category: 'Age 18-24', count: 2891, fill: '#195440' },
  { category: 'Age 25-34', count: 4234, fill: '#2d7a5f' },
  { category: 'Age 35-44', count: 3123, fill: '#4a9d7f' },
  { category: 'Age 45-54', count: 1678, fill: '#E1B047' },
  { category: 'Age 55+', count: 532, fill: '#8b7332' },
];

const userActivityData = [
  { hour: '12 AM', active: 234 },
  { hour: '3 AM', active: 156 },
  { hour: '6 AM', active: 445 },
  { hour: '9 AM', active: 1234 },
  { hour: '12 PM', active: 2345 },
  { hour: '3 PM', active: 2678 },
  { hour: '6 PM', active: 3456 },
  { hour: '9 PM', active: 2234 },
];

const retentionData = [
  { week: 'Week 1', retained: 95 },
  { week: 'Week 2', retained: 78 },
  { week: 'Week 3', retained: 65 },
  { week: 'Week 4', retained: 58 },
  { week: 'Week 5', retained: 52 },
  { week: 'Week 6', retained: 48 },
];

export default function UserAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed insights into user behavior and growth patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12,458</div>
            <p className="text-sm text-[#E1B047] mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Users (7d)</CardTitle>
            <UserPlus className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2,971</div>
            <p className="text-sm text-[#E1B047] mt-1">+18.2% from previous week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            <Activity className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">10,234</div>
            <p className="text-sm text-gray-600 mt-1">82.1% of total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Churn Rate</CardTitle>
            <UserMinus className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2.3%</div>
            <p className="text-sm text-green-600 mt-1">-0.8% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="growth" className="w-full">
        <TabsList>
          <TabsTrigger value="growth">Growth & Trends</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        {/* Growth & Trends Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Daily User Growth (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyUserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#195440" fill="#195440" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#195440" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Active vs Inactive Users */}
          <Card>
            <CardHeader>
              <CardTitle>Active vs Inactive Users Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyUserData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activeUsers" stroke="#195440" strokeWidth={2} />
                  <Line type="monotone" dataKey="inactiveUsers" stroke="#dc3545" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDemographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="count"
                    >
                      {userDemographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Demographics Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Demographic Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDemographicsData.map((demo, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{demo.category}</span>
                        <span className="text-sm text-gray-600">{demo.count.toLocaleString()} users</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(demo.count / 12458) * 100}%`,
                            backgroundColor: demo.fill
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Patterns Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Active Users Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="active" stroke="#E1B047" fill="#E1B047" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Peak Activity Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">6 PM - 9 PM</div>
                <p className="text-sm text-gray-600 mt-1">3,456 avg users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">24.5 min</div>
                <p className="text-sm text-[#E1B047] mt-1">+2.3 min increase</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Daily Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">8,234</div>
                <p className="text-sm text-gray-600 mt-1">66.1% of total</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>6-Week User Retention Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="retained" stroke="#195440" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Week 1 Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <p className="text-sm text-green-600 mt-1">Excellent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Week 4 Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">58%</div>
                <p className="text-sm text-[#E1B047] mt-1">Above average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Week 6 Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">48%</div>
                <p className="text-sm text-gray-600 mt-1">Good retention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">66%</div>
                <p className="text-sm text-[#E1B047] mt-1">+5% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
