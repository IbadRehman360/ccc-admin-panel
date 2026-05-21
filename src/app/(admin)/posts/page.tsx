'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Trash2, Flag, AlertTriangle, Ban, MessageSquare, Image as ImageIcon, Video, FileText, TrendingUp, User, Calendar, BarChart3, Users, ShieldAlert, CheckCircle, XCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/layout/UserAvatar';

const postsData = [
  {
    id: 'POST001',
    content: 'Excited to share our latest breakthrough in telemedicine technology! Our new platform enables real-time diagnostics with 99% accuracy. Read more about how we\'re revolutionizing healthcare access.',
    fullContent: 'Excited to share our latest breakthrough in telemedicine technology! Our new platform enables real-time diagnostics with 99% accuracy. After 2 years of development and testing with over 500 healthcare facilities, we\'re proud to announce the launch of our AI-powered diagnostic assistant. This technology will help bridge the gap in healthcare access, especially in rural and underserved communities. Read more about how we\'re revolutionizing healthcare access and making quality medical care available to everyone, everywhere.',
    author: 'Dr. Sarah Johnson',
    authorId: 'USR001',
    authorEmail: 'sarah.j@example.com',
    communityId: 'COM001',
    communityName: 'Healthcare Professionals Network',
    type: 'Text & Image',
    hasImage: true,
    hasVideo: false,
    image: 'https://images.unsplash.com/photo-1621184078903-6bfe9482d935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHBvc3QlMjBjb250ZW50fGVufDF8fHx8MTc3MTUzNjEzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reports: 0,
    status: 'Active',
    createdDate: '2026-02-18T14:30:00',
    reportedBy: [],
    reportReasons: [],
    moderationHistory: []
  },
  {
    id: 'POST002',
    content: 'CLICK HERE NOW!!! Make $10,000 in 24 hours with this ONE SIMPLE TRICK! Limited time offer! No experience needed! Work from home! 💰💰💰',
    fullContent: 'CLICK HERE NOW!!! Make $10,000 in 24 hours with this ONE SIMPLE TRICK! Limited time offer! No experience needed! Work from home! 💰💰💰 This is a guaranteed money-making system that requires ZERO investment! Just follow this link and start earning immediately! Don\'t miss out on this incredible opportunity!',
    author: 'Spam Account',
    authorId: 'USR156',
    authorEmail: 'spam@suspicious.com',
    communityId: 'COM002',
    communityName: 'Tech Entrepreneurs Hub',
    type: 'Text',
    hasImage: false,
    hasVideo: false,
    reports: 45,
    status: 'Reported',
    createdDate: '2026-02-18T10:15:00',
    reportedBy: [
      { userId: 'USR002', userName: 'Mike Chen', reason: 'Spam', date: '2026-02-18T10:20:00' },
      { userId: 'USR091', userName: 'Lisa Wang', reason: 'Scam/Fraud', date: '2026-02-18T10:25:00' },
      { userId: 'USR092', userName: 'John Martinez', reason: 'Spam', date: '2026-02-18T10:30:00' }
    ],
    reportReasons: ['Spam (28)', 'Scam/Fraud (15)', 'Misleading Information (2)'],
    moderationHistory: []
  },
  {
    id: 'POST003',
    content: 'Join us for the Education Leadership Summit next month! Registration is now open. This year we\'re focusing on innovative teaching methods and inclusive classroom strategies.',
    fullContent: 'Join us for the Education Leadership Summit next month! Registration is now open. This year we\'re focusing on innovative teaching methods and inclusive classroom strategies. We have amazing keynote speakers lined up including award-winning educators, policy makers, and EdTech innovators. Early bird pricing ends March 1st. Don\'t miss this opportunity to network with fellow education leaders and gain actionable insights for your institution.',
    author: 'Jennifer Martinez',
    authorId: 'USR003',
    authorEmail: 'j.martinez@example.com',
    communityId: 'COM003',
    communityName: 'Education Leaders Forum',
    type: 'Text & Image',
    hasImage: true,
    hasVideo: false,
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjbGFzc3Jvb20lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzE1MzYxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reports: 0,
    status: 'Active',
    createdDate: '2026-02-17T16:45:00',
    reportedBy: [],
    reportReasons: [],
    moderationHistory: []
  },
  {
    id: 'POST004',
    content: 'This is absolutely disgusting! These people should be banned! I can\'t believe this community allows such trash. You\'re all idiots if you support this!',
    fullContent: 'This is absolutely disgusting! These people should be banned! I can\'t believe this community allows such trash. You\'re all idiots if you support this! This platform is a joke and everyone here is pathetic. I\'m reporting everyone involved. You should all be ashamed of yourselves!',
    author: 'Angry User',
    authorId: 'USR178',
    authorEmail: 'angry@user.com',
    communityId: 'COM004',
    communityName: 'Fitness & Wellness Community',
    type: 'Text',
    hasImage: false,
    hasVideo: false,
    reports: 23,
    status: 'Reported',
    createdDate: '2026-02-17T12:30:00',
    reportedBy: [
      { userId: 'USR004', userName: 'James Wilson', reason: 'Harassment/Bullying', date: '2026-02-17T12:35:00' },
      { userId: 'USR101', userName: 'Trainer Sarah', reason: 'Hate Speech', date: '2026-02-17T12:40:00' },
      { userId: 'USR102', userName: 'Coach Mike', reason: 'Harassment/Bullying', date: '2026-02-17T12:45:00' }
    ],
    reportReasons: ['Harassment/Bullying (15)', 'Hate Speech (5)', 'Offensive Language (3)'],
    moderationHistory: []
  },
  {
    id: 'POST005',
    content: 'Just discovered this amazing new restaurant downtown! The chef\'s special pasta is absolutely incredible. Here are some photos from tonight\'s dinner.',
    fullContent: 'Just discovered this amazing new restaurant downtown! The chef\'s special pasta is absolutely incredible. Here are some photos from tonight\'s dinner. The atmosphere is cozy and romantic, perfect for date night. Service was impeccable and the wine pairing was spot on. Highly recommend making a reservation - they get booked up quickly on weekends. The dessert menu is also worth saving room for!',
    author: 'Emma Davis',
    authorId: 'USR006',
    authorEmail: 'e.davis@example.com',
    communityId: 'COM006',
    communityName: 'Local Foodies Network',
    type: 'Text & Image',
    hasImage: true,
    hasVideo: false,
    image: 'https://images.unsplash.com/photo-1669743267803-03f1de4b89ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MTQ3NTcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reports: 0,
    status: 'Active',
    createdDate: '2026-02-17T20:15:00',
    reportedBy: [],
    reportReasons: [],
    moderationHistory: []
  },
  {
    id: 'POST006',
    content: 'Check out these sick gains bro! 💪 If you want to look like this, DM me for my exclusive supplement stack. Use code GAINS20 for 20% off!',
    fullContent: 'Check out these sick gains bro! 💪 If you want to look like this, DM me for my exclusive supplement stack. Use code GAINS20 for 20% off! I\'m not affiliated with any company, this is just stuff that worked for me. Results may vary but you\'ll definitely see improvements. Hit me up for the full program and meal plan. Limited spots available!',
    author: 'Gym Promoter',
    authorId: 'USR189',
    authorEmail: 'promoter@gym.com',
    communityId: 'COM004',
    communityName: 'Fitness & Wellness Community',
    type: 'Text & Image',
    hasImage: true,
    hasVideo: false,
    image: 'https://images.unsplash.com/photo-1758520705189-a6b56a7ae832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbW90aXZhdGlvbiUyMHdvcmtvdXR8ZW58MXx8fHwxNzcxNDkzOTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reports: 12,
    status: 'Reported',
    createdDate: '2026-02-16T15:20:00',
    reportedBy: [
      { userId: 'USR004', userName: 'James Wilson', reason: 'Spam', date: '2026-02-16T15:30:00' },
      { userId: 'USR101', userName: 'Trainer Sarah', reason: 'Unauthorized Promotion', date: '2026-02-16T15:45:00' }
    ],
    reportReasons: ['Spam (7)', 'Unauthorized Promotion (5)'],
    moderationHistory: [
      { action: 'Warned', by: 'Admin Team', date: '2026-02-16T16:00:00', reason: 'Community guidelines violation - unauthorized promotion' }
    ]
  },
  {
    id: 'POST007',
    content: 'Captured this stunning sunset during my hike yesterday. Nature photography at its finest! The colors were absolutely breathtaking.',
    fullContent: 'Captured this stunning sunset during my hike yesterday. Nature photography at its finest! The colors were absolutely breathtaking. This was taken at Eagle Peak trail, about 6 miles in. The lighting conditions were perfect - golden hour magic. Used my new lens for this shot and I\'m so pleased with the results. If you\'re into landscape photography, this location is a must-visit. Best time is late afternoon for these dramatic colors.',
    author: 'David Lee',
    authorId: 'USR007',
    authorEmail: 'd.lee@example.com',
    communityId: 'COM007',
    communityName: 'Photography Masters',
    type: 'Text & Image',
    hasImage: true,
    hasVideo: false,
    image: 'https://images.unsplash.com/photo-1743699537171-750edd44bd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxNDc4OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reports: 0,
    status: 'Active',
    createdDate: '2026-02-16T19:30:00',
    reportedBy: [],
    reportReasons: [],
    moderationHistory: []
  },
  {
    id: 'POST008',
    content: 'BUY CRYPTO NOW!!! Bitcoin going to $1 MILLION! This is your last chance! Follow my trading signals and get rich quick! 🚀🚀🚀💎',
    fullContent: 'BUY CRYPTO NOW!!! Bitcoin going to $1 MILLION! This is your last chance! Follow my trading signals and get rich quick! 🚀🚀🚀💎 I\'ve made $500K in the last month using this system. Stop being poor and start following my exclusive Discord channel. Limited spots for VIP members. Don\'t be a loser who misses out on this bull run! Act now before it\'s too late!!!',
    author: 'Crypto Scammer',
    authorId: 'USR195',
    authorEmail: 'scam@crypto.com',
    communityId: 'COM005',
    communityName: 'Crypto Trading Group',
    type: 'Text',
    hasImage: false,
    hasVideo: false,
    reports: 67,
    status: 'Suspended',
    createdDate: '2026-02-15T08:45:00',
    reportedBy: [
      { userId: 'USR005', userName: 'Alex Thompson', reason: 'Scam/Fraud', date: '2026-02-15T09:00:00' },
      { userId: 'USR210', userName: 'Crypto Dave', reason: 'Financial Scam', date: '2026-02-15T09:15:00' },
      { userId: 'USR211', userName: 'Trader Mike', reason: 'Scam/Fraud', date: '2026-02-15T09:30:00' }
    ],
    reportReasons: ['Scam/Fraud (45)', 'Financial Scam (18)', 'Spam (4)'],
    moderationHistory: [
      { action: 'Warned', by: 'Admin Team', date: '2026-02-15T09:45:00', reason: 'Suspected scam content' },
      { action: 'Post Deleted', by: 'Super Admin', date: '2026-02-15T10:00:00', reason: 'Confirmed financial scam' },
      { action: 'User Suspended', by: 'Super Admin', date: '2026-02-15T10:05:00', reason: 'Multiple scam posts - 30 day posting suspension' }
    ]
  },
  {
    id: 'POST009',
    content: 'Proud to present our new business strategy framework at today\'s conference. Thank you to everyone who attended and engaged with the presentation!',
    fullContent: 'Proud to present our new business strategy framework at today\'s conference. Thank you to everyone who attended and engaged with the presentation! The feedback was incredibly valuable and we\'re excited to iterate on these ideas. Special thanks to the organizing committee for putting together such a well-run event. Looking forward to implementing these strategies with my team and sharing our results in Q3. If anyone wants to discuss further, feel free to reach out!',
    author: 'Mike Chen',
    authorId: 'USR002',
    authorEmail: 'm.chen@example.com',
    communityId: 'COM002',
    communityName: 'Tech Entrepreneurs Hub',
    type: 'Text & Image',
    hasImage: true,
    hasVideo: false,
    image: 'https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzcxNTI3NTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reports: 0,
    status: 'Active',
    createdDate: '2026-02-15T17:00:00',
    reportedBy: [],
    reportReasons: [],
    moderationHistory: []
  },
  {
    id: 'POST010',
    content: 'You people are all sheep! Wake up and see the truth! This is a conspiracy and you\'re all too blind to see it!',
    fullContent: 'You people are all sheep! Wake up and see the truth! This is a conspiracy and you\'re all too blind to see it! The mainstream narrative is all lies. Do your own research instead of believing everything you\'re told. I can\'t believe how naive everyone here is. Open your eyes and question everything! The truth is out there but you have to be willing to look for it. Stop being controlled!',
    author: 'Conspiracy User',
    authorId: 'USR201',
    authorEmail: 'conspiracy@truth.com',
    communityId: 'COM001',
    communityName: 'Healthcare Professionals Network',
    type: 'Text',
    hasImage: false,
    hasVideo: false,
    reports: 34,
    status: 'Reported',
    createdDate: '2026-02-14T11:20:00',
    reportedBy: [
      { userId: 'USR001', userName: 'Dr. Sarah Johnson', reason: 'Misinformation', date: '2026-02-14T11:30:00' },
      { userId: 'USR012', userName: 'Dr. Michael Chen', reason: 'Misinformation', date: '2026-02-14T11:45:00' }
    ],
    reportReasons: ['Misinformation (28)', 'Conspiracy Theory (4)', 'Offensive Language (2)'],
    moderationHistory: [
      { action: 'Warned', by: 'Admin', date: '2026-02-14T12:00:00', reason: 'Spreading misinformation in healthcare community' }
    ]
  }
];

export default function PostsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('7');
  const [suspendReason, setSuspendReason] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-[#195440]">Active</Badge>;
      case 'Reported':
        return <Badge className="bg-orange-600">Reported</Badge>;
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'Deleted':
        return <Badge variant="secondary">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    setShowDetailsDialog(true);
  };

  const handleDeletePost = (post: any) => {
    setSelectedPost(post);
    setShowDeleteDialog(true);
  };

  const handleSuspendUser = (post: any) => {
    setSelectedPost(post);
    setShowSuspendDialog(true);
  };

  const handleViewReports = (post: any) => {
    setSelectedPost(post);
    setShowReportDialog(true);
  };

  const confirmDelete = () => {
    // Log moderation action
    console.log('Post Deleted:', {
      postId: selectedPost.id,
      author: selectedPost.author,
      reason: deleteReason,
      timestamp: new Date().toISOString(),
      moderator: 'Current Admin'
    });
    setShowDeleteDialog(false);
    setDeleteReason('');
  };

  const confirmSuspend = () => {
    // Log moderation action
    console.log('User Suspended:', {
      postId: selectedPost.id,
      userId: selectedPost.authorId,
      userName: selectedPost.author,
      duration: suspendDuration + ' days',
      reason: suspendReason,
      timestamp: new Date().toISOString(),
      moderator: 'Current Admin'
    });
    setShowSuspendDialog(false);
    setSuspendDuration('7');
    setSuspendReason('');
  };

  // Filter and sort posts
  const filteredPosts = postsData
    .filter(post => {
      const matchesSearch = 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.communityName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'reported' && post.status === 'Reported') ||
        post.status === statusFilter;
      
      const matchesType = typeFilter === 'all' || post.type.includes(typeFilter);
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortBy === 'reports') return b.reports - a.reports;
      return 0;
    });

  // Stats
  const totalPosts = postsData.length;
  const activePosts = postsData.filter(p => p.status === 'Active').length;
  const reportedPosts = postsData.filter(p => p.status === 'Reported').length;
  const suspendedPosts = postsData.filter(p => p.status === 'Suspended').length;
  const totalReports = postsData.reduce((sum, p) => sum + p.reports, 0);

  // Most reported posts
  const mostReportedPosts = [...postsData]
    .filter(p => p.reports > 0)
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Posts & Content Moderation</h1>
        <p className="text-gray-600 mt-1">Monitor and moderate user-generated content across all communities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{totalPosts}</div>
            <p className="text-sm text-gray-600 mt-1">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{activePosts}</div>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{reportedPosts}</div>
            <p className="text-sm text-gray-600 mt-1">Reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{suspendedPosts}</div>
            <p className="text-sm text-gray-600 mt-1">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Most Reported Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostReportedPosts.map((post: any, idx: number) => (
              <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-lg font-bold text-gray-400">#{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{post.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <UserAvatar name={post.author} size="sm" />
                      <p className="text-xs text-gray-600">{post.author}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-600">{post.communityName}</p>
                    </div>
                    {post.reportReasons && post.reportReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.reportReasons.slice(0, 2).map((reason: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">{reason}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                  <Badge variant="destructive" className="text-lg">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {post.reports}
                  </Badge>
                  {getStatusBadge(post.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by keywords, author, or community..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <FileText className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Text">Text Only</SelectItem>
                <SelectItem value="Image">With Image</SelectItem>
                <SelectItem value="Video">With Video</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Creation Date</SelectItem>
                <SelectItem value="reports">Most Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Posts ({filteredPosts.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post Content</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="truncate font-medium">{post.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {post.hasImage && <ImageIcon className="w-3 h-3 text-gray-400" />}
                        {post.hasVideo && <Video className="w-3 h-3 text-gray-400" />}
                        <span className="text-xs text-gray-500">{post.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={post.author} size="sm" />
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.authorId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{post.communityName}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(post.createdDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.reports > 0 ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-red-600">{post.reports}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPost(post)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {post.reports > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReports(post)}
                        >
                          <Flag className="w-4 h-4 text-orange-600" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(post)}
                      >
                        <Ban className="w-4 h-4 text-orange-600" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Post Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>View complete post content and information</DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-6 px-6">
              {/* Post Image */}
              {selectedPost.hasImage && (
                <div className="w-full rounded-lg overflow-hidden border">
                  <img 
                    src={selectedPost.image} 
                    alt="Post content"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Post Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Post ID</Label>
                  <p className="font-medium text-[#195440]">{selectedPost.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPost.status)}</div>
                </div>
                <div>
                  <Label className="text-gray-600">Author</Label>
                  <p className="font-medium">{selectedPost.author}</p>
                  <p className="text-sm text-gray-600">{selectedPost.authorEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Author ID</Label>
                  <p className="font-medium">{selectedPost.authorId}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Community</Label>
                  <p className="font-medium">{selectedPost.communityName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Post Type</Label>
                  <Badge variant="outline" className="mt-1">{selectedPost.type}</Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Created Date</Label>
                  <p className="font-medium">{formatDate(selectedPost.createdDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Reports</Label>
                  <p className="font-medium text-red-600">{selectedPost.reports}</p>
                </div>
              </div>

              <Separator />

              {/* Full Content */}
              <div>
                <Label className="text-gray-600">Full Post Content</Label>
                <p className="mt-2 text-sm bg-gray-50 p-4 rounded-lg leading-relaxed">
                  {selectedPost.fullContent}
                </p>
              </div>

              <Separator />

              {/* Engagement Stats */}
              <div>
                <Label className="text-gray-600">Engagement Metrics</Label>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                    <div className="text-xl font-bold text-blue-600">{selectedPost.views}</div>
                    <div className="text-xs text-gray-600 mt-1">Views</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-xl font-bold text-green-600">{selectedPost.likes}</div>
                    <div className="text-xs text-gray-600 mt-1">Likes</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                    <div className="text-xl font-bold text-purple-600">{selectedPost.comments}</div>
                    <div className="text-xs text-gray-600 mt-1">Comments</div>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 text-center">
                    <div className="text-xl font-bold text-pink-600">{selectedPost.shares}</div>
                    <div className="text-xs text-gray-600 mt-1">Shares</div>
                  </div>
                </div>
              </div>

              {/* Report Reasons */}
              {selectedPost.reportReasons.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-gray-600">Report Reasons</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPost.reportReasons.map((reason: string, idx: number) => (
                        <Badge key={idx} variant="destructive">{reason}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Moderation History */}
              {selectedPost.moderationHistory.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-gray-600">Moderation History</Label>
                    <div className="space-y-2 mt-2">
                      {selectedPost.moderationHistory.map((action: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                          <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{action.action}</p>
                              <span className="text-xs text-gray-500">{formatDate(action.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{action.reason}</p>
                            <p className="text-xs text-gray-500 mt-1">By: {action.by}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reports Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="w-[95vw] max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Post Reports</DialogTitle>
            <DialogDescription>View all users who reported this post</DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-red-900">Total Reports: {selectedPost.reports}</h3>
                    <p className="text-sm text-red-800 mt-1">Post ID: {selectedPost.id}</p>
                  </div>
                  <Flag className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="space-y-2">
                {selectedPost.reportedBy && selectedPost.reportedBy.map((report: any) => (
                  <div key={report.userId} className="flex items-start justify-between p-4 border rounded-lg bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {report.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{report.userName}</p>
                        <p className="text-sm text-gray-600">User ID: {report.userId}</p>
                        <Badge variant="destructive" className="mt-2">{report.reason}</Badge>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {formatDate(report.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Post
            </DialogTitle>
            <DialogDescription>
              This action will permanently remove the post from the platform.
            </DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium">Post: {selectedPost.content}</p>
                <p className="text-xs text-gray-600 mt-1">Author: {selectedPost.author}</p>
              </div>

              <div>
                <Label>Reason for Deletion</Label>
                <Textarea
                  placeholder="Enter the reason for deleting this post..."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={!deleteReason}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Suspend Posting Privileges
            </DialogTitle>
            <DialogDescription>
              Temporarily restrict the user's ability to create new posts.
            </DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium">User: {selectedPost.author}</p>
                <p className="text-xs text-gray-600 mt-1">Email: {selectedPost.authorEmail}</p>
                <p className="text-xs text-gray-600">User ID: {selectedPost.authorId}</p>
              </div>

              <div>
                <Label>Suspension Duration</Label>
                <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reason for Suspension</Label>
                <Textarea
                  placeholder="Enter the reason for suspending this user's posting privileges..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmSuspend}
              disabled={!suspendReason}
            >
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
