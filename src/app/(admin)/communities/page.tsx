'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Ban, Trash2, Users, FileText, Calendar, TrendingUp, AlertTriangle, Flag, Shield, MoreVertical, CheckCircle } from 'lucide-react';
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
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const communitiesData = [
  { 
    id: 'COM001',
    name: 'Healthcare Professionals Network',
    image: 'https://images.unsplash.com/photo-1631507623095-c710d184498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ldHdvcmt8ZW58MXx8fHwxNzcxNTM1NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 5000,
    creator: 'Dr. Sarah Johnson', 
    creatorId: 'USR001',
    creatorEmail: 'sarah.j@example.com',
    privacy: 'Public', 
    members: 2340, 
    posts: 456,
    events: 12,
    activeMembers: 1850,
    reportedPosts: 3,
    status: 'Active',
    createdDate: '2025-06-15',
    lastActivity: '2 hours ago',
    description: 'A community for healthcare professionals to connect, share knowledge, and discuss industry trends.',
    category: 'Professional',
    rules: [
      'Be respectful and professional',
      'No spam or self-promotion without permission',
      'Protect patient privacy - no identifying information',
      'Stay on topic - healthcare and medicine'
    ],
    topMembers: [
      { name: 'Dr. Sarah Johnson', role: 'Creator', posts: 45 },
      { name: 'Dr. Michael Chen', role: 'Moderator', posts: 38 },
      { name: 'Nurse Emily Davis', role: 'Active Member', posts: 32 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Dr. Johnson', action: 'shared an article', time: '2 hours ago' },
      { type: 'Event', user: 'Admin', action: 'created an event', time: '5 hours ago' },
      { type: 'Member', user: 'Dr. Smith', action: 'joined the community', time: '1 day ago' }
    ],
    reportedContent: [
      { id: 1, type: 'Post', content: 'Inappropriate medical advice', reportedBy: 'Dr. Wilson', date: '2026-02-18', status: 'Pending' },
      { id: 2, type: 'Comment', content: 'Spam link', reportedBy: 'Nurse Davis', date: '2026-02-17', status: 'Pending' },
      { id: 3, type: 'Post', content: 'Off-topic content', reportedBy: 'Dr. Martinez', date: '2026-02-16', status: 'Resolved' }
    ],
    flags: [],
    growthRate: '+12%'
  },
  { 
    id: 'COM002',
    name: 'Tech Entrepreneurs Hub',
    image: 'https://images.unsplash.com/photo-1634936016780-65f6a77ebdd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwc3RhcnR1cCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzE1MzU1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 2000,
    creator: 'Mike Chen', 
    creatorId: 'USR002',
    creatorEmail: 'm.chen@example.com',
    privacy: 'Private', 
    members: 1234, 
    posts: 789,
    events: 8,
    activeMembers: 890,
    reportedPosts: 1,
    status: 'Active',
    createdDate: '2025-08-20',
    lastActivity: '1 hour ago',
    description: 'Private community for tech entrepreneurs to share experiences, seek advice, and network.',
    category: 'Business',
    rules: [
      'Members only - no sharing outside the group',
      'Constructive feedback only',
      'Respect intellectual property',
      'No pitch spam'
    ],
    topMembers: [
      { name: 'Mike Chen', role: 'Creator', posts: 67 },
      { name: 'Lisa Wang', role: 'Moderator', posts: 54 },
      { name: 'John Martinez', role: 'Active Member', posts: 48 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Mike Chen', action: 'started a discussion', time: '1 hour ago' },
      { type: 'Event', user: 'Lisa Wang', action: 'scheduled meetup', time: '3 hours ago' },
      { type: 'Member', user: 'Sarah Lee', action: 'joined the community', time: '6 hours ago' }
    ],
    reportedContent: [
      { id: 1, type: 'Post', content: 'Pyramid scheme promotion', reportedBy: 'Lisa Wang', date: '2026-02-18', status: 'Pending' }
    ],
    flags: [],
    growthRate: '+8%'
  },
  { 
    id: 'COM003',
    name: 'Education Leaders Forum',
    image: 'https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGJvb2tzfGVufDF8fHx8MTc3MTUxNTYyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 1500,
    creator: 'Jennifer Martinez', 
    creatorId: 'USR003',
    creatorEmail: 'j.martinez@example.com',
    privacy: 'Public', 
    members: 890, 
    posts: 234,
    events: 5,
    activeMembers: 650,
    reportedPosts: 0,
    status: 'Active',
    createdDate: '2025-09-10',
    lastActivity: '30 mins ago',
    description: 'Forum for education leaders to discuss policies, share best practices, and collaborate.',
    category: 'Education',
    rules: [
      'Professional discourse only',
      'Evidence-based discussions',
      'Respect diverse perspectives',
      'No political attacks'
    ],
    topMembers: [
      { name: 'Jennifer Martinez', role: 'Creator', posts: 34 },
      { name: 'Dr. Anderson', role: 'Moderator', posts: 28 },
      { name: 'Principal Davis', role: 'Active Member', posts: 22 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Dr. Anderson', action: 'posted an update', time: '30 mins ago' },
      { type: 'Comment', user: 'Principal Davis', action: 'commented', time: '2 hours ago' },
      { type: 'Member', user: 'Teacher Brown', action: 'joined the community', time: '4 hours ago' }
    ],
    reportedContent: [],
    flags: [],
    growthRate: '+5%'
  },
  { 
    id: 'COM004',
    name: 'Fitness & Wellness Community',
    image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBneW18ZW58MXx8fHwxNzcxNDcwODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 4000,
    creator: 'James Wilson', 
    creatorId: 'USR004',
    creatorEmail: 'j.wilson@example.com',
    privacy: 'Public', 
    members: 3456, 
    posts: 1234,
    events: 18,
    activeMembers: 2890,
    reportedPosts: 8,
    status: 'Reported',
    createdDate: '2025-05-05',
    lastActivity: '15 mins ago',
    description: 'Community for fitness enthusiasts and wellness advocates.',
    category: 'Health & Fitness',
    rules: [
      'No dangerous health advice',
      'Body positivity required',
      'No supplements spam',
      'Certified trainers only for programs'
    ],
    topMembers: [
      { name: 'James Wilson', role: 'Creator', posts: 89 },
      { name: 'Trainer Sarah', role: 'Moderator', posts: 76 },
      { name: 'Coach Mike', role: 'Active Member', posts: 65 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Trainer Sarah', action: 'shared workout tips', time: '15 mins ago' },
      { type: 'Report', user: 'Member', action: 'reported spam content', time: '1 hour ago' },
      { type: 'Member', user: 'Jane Smith', action: 'joined the community', time: '2 hours ago' }
    ],
    reportedContent: [
      { id: 1, type: 'Post', content: 'Dangerous diet advice', reportedBy: 'Nutritionist Kelly', date: '2026-02-19', status: 'Pending' },
      { id: 2, type: 'Post', content: 'Supplement spam', reportedBy: 'Admin', date: '2026-02-19', status: 'Pending' },
      { id: 3, type: 'Comment', content: 'Body shaming comment', reportedBy: 'User123', date: '2026-02-18', status: 'Pending' },
      { id: 4, type: 'Post', content: 'Fake credentials', reportedBy: 'Trainer Sarah', date: '2026-02-18', status: 'Under Review' },
      { id: 5, type: 'Comment', content: 'Offensive language', reportedBy: 'Member456', date: '2026-02-17', status: 'Resolved' }
    ],
    flags: ['Multiple Reports', 'Needs Review'],
    growthRate: '+15%'
  },
  { 
    id: 'COM005',
    name: 'Crypto Trading Group',
    image: 'https://images.unsplash.com/photo-1642413597408-183a09361cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGJpdGNvaW4lMjBuZXR3b3JrfGVufDF8fHx8MTc3MTUzNTUwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 1000,
    creator: 'Alex Thompson', 
    creatorId: 'USR005',
    creatorEmail: 'a.thompson@example.com',
    privacy: 'Private', 
    members: 567, 
    posts: 890,
    events: 3,
    activeMembers: 340,
    reportedPosts: 15,
    status: 'Disabled',
    createdDate: '2025-11-12',
    lastActivity: '3 days ago',
    description: 'Private group for cryptocurrency trading discussions and tips.',
    category: 'Finance',
    rules: [
      'Not financial advice disclaimer',
      'No pump and dump schemes',
      'Verify all information',
      'No harassment'
    ],
    topMembers: [
      { name: 'Alex Thompson', role: 'Creator', posts: 125 },
      { name: 'Crypto Dave', role: 'Moderator', posts: 98 },
      { name: 'Trader Mike', role: 'Active Member', posts: 87 }
    ],
    recentActivity: [
      { type: 'Disabled', user: 'Admin', action: 'disabled community', time: '3 days ago' },
      { type: 'Report', user: 'Multiple Users', action: 'reported scam posts', time: '3 days ago' },
      { type: 'Post', user: 'Alex Thompson', action: 'posted update', time: '3 days ago' }
    ],
    reportedContent: [
      { id: 1, type: 'Post', content: 'Pump and dump scheme', reportedBy: 'User789', date: '2026-02-16', status: 'Confirmed' },
      { id: 2, type: 'Post', content: 'Scam ICO promotion', reportedBy: 'User456', date: '2026-02-16', status: 'Confirmed' },
      { id: 3, type: 'Comment', content: 'Phishing link', reportedBy: 'User123', date: '2026-02-15', status: 'Confirmed' }
    ],
    flags: ['Suspicious Activity', 'Scam Reports', 'Requires Investigation'],
    disabledDate: '2026-02-16',
    disabledBy: 'Admin Team',
    disabledReason: 'Multiple reports of scam and fraudulent content',
    growthRate: '-5%'
  },
  { 
    id: 'COM006',
    name: 'Local Foodies Network',
    image: 'https://images.unsplash.com/photo-1762922425226-8cfe6987e7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMGRpbmluZ3xlbnwxfHx8fDE3NzE0OTM5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 5000,
    creator: 'Emma Davis', 
    creatorId: 'USR006',
    creatorEmail: 'e.davis@example.com',
    privacy: 'Public', 
    members: 4567, 
    posts: 2345,
    events: 25,
    activeMembers: 3780,
    reportedPosts: 2,
    status: 'Active',
    createdDate: '2025-04-20',
    lastActivity: '10 mins ago',
    description: 'Discover local restaurants, share food experiences, and connect with fellow food lovers.',
    category: 'Food & Dining',
    rules: [
      'Honest reviews only',
      'No business spam',
      'Respect dietary choices',
      'Credit photo sources'
    ],
    topMembers: [
      { name: 'Emma Davis', role: 'Creator', posts: 156 },
      { name: 'Chef Carlos', role: 'Moderator', posts: 134 },
      { name: 'Food Blogger Sam', role: 'Active Member', posts: 112 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Emma Davis', action: 'shared restaurant review', time: '10 mins ago' },
      { type: 'Event', user: 'Chef Carlos', action: 'created food tour event', time: '1 hour ago' },
      { type: 'Member', user: 'Mike Johnson', action: 'joined the community', time: '3 hours ago' }
    ],
    reportedContent: [
      { id: 1, type: 'Post', content: 'Fake review', reportedBy: 'Restaurant Owner', date: '2026-02-17', status: 'Under Review' },
      { id: 2, type: 'Comment', content: 'Offensive comment', reportedBy: 'Member789', date: '2026-02-15', status: 'Resolved' }
    ],
    flags: [],
    growthRate: '+20%'
  },
  { 
    id: 'COM007',
    name: 'Photography Masters',
    image: 'https://images.unsplash.com/photo-1770365299688-d5ed70b2ad2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYSUyMGxlbnN8ZW58MXx8fHwxNzcxNDcxMjE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 1000,
    creator: 'David Lee', 
    creatorId: 'USR007',
    creatorEmail: 'd.lee@example.com',
    privacy: 'Private', 
    members: 789, 
    posts: 456,
    events: 6,
    activeMembers: 620,
    reportedPosts: 0,
    status: 'Active',
    createdDate: '2025-10-03',
    lastActivity: '45 mins ago',
    description: 'Exclusive community for professional photographers to share techniques and collaborate.',
    category: 'Arts & Photography',
    rules: [
      'Original work only',
      'Constructive critique',
      'Respect copyright',
      'No gear elitism'
    ],
    topMembers: [
      { name: 'David Lee', role: 'Creator', posts: 78 },
      { name: 'Photo Pro Anna', role: 'Moderator', posts: 65 },
      { name: 'Lens Master Tom', role: 'Active Member', posts: 58 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Photo Pro Anna', action: 'shared portfolio', time: '45 mins ago' },
      { type: 'Comment', user: 'David Lee', action: 'provided feedback', time: '2 hours ago' },
      { type: 'Member', user: 'New Photographer', action: 'joined the community', time: '5 hours ago' }
    ],
    reportedContent: [],
    flags: [],
    growthRate: '+6%'
  },
  { 
    id: 'COM008',
    name: 'Pet Lovers United',
    image: 'https://images.unsplash.com/photo-1765603950481-3a5879ec2ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBkb2dzJTIwY2F0cyUyMGFuaW1hbHN8ZW58MXx8fHwxNzcxNTM1NTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: 3000,
    creator: 'Rachel Green', 
    creatorId: 'USR008',
    creatorEmail: 'r.green@example.com',
    privacy: 'Public', 
    members: 5678, 
    posts: 3456,
    events: 15,
    activeMembers: 4890,
    reportedPosts: 5,
    status: 'Reported',
    createdDate: '2025-03-15',
    lastActivity: '5 mins ago',
    description: 'Community for pet owners to share stories, ask advice, and celebrate their furry friends.',
    category: 'Pets & Animals',
    rules: [
      'Be kind to all animals',
      'No breeding/selling posts',
      'Vet advice for emergencies only',
      'Family-friendly content'
    ],
    topMembers: [
      { name: 'Rachel Green', role: 'Creator', posts: 234 },
      { name: 'Vet Dr. Sarah', role: 'Moderator', posts: 189 },
      { name: 'Dog Trainer Mike', role: 'Active Member', posts: 156 }
    ],
    recentActivity: [
      { type: 'Post', user: 'Rachel Green', action: 'shared pet photos', time: '5 mins ago' },
      { type: 'Report', user: 'Member', action: 'reported inappropriate content', time: '1 hour ago' },
      { type: 'Event', user: 'Vet Dr. Sarah', action: 'created Q&A event', time: '4 hours ago' }
    ],
    reportedContent: [
      { id: 1, type: 'Post', content: 'Animal abuse content', reportedBy: 'Multiple Users', date: '2026-02-19', status: 'Urgent' },
      { id: 2, type: 'Post', content: 'Illegal breeding promotion', reportedBy: 'Moderator', date: '2026-02-18', status: 'Pending' },
      { id: 3, type: 'Comment', content: 'Harmful pet advice', reportedBy: 'Vet Dr. Sarah', date: '2026-02-17', status: 'Under Review' }
    ],
    flags: ['Urgent Review', 'Policy Violation'],
    growthRate: '+18%'
  }
];

export default function CommunityManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'disable' | 'delete' | 'enable' | 'flag' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-[#195440]">Active</Badge>;
      case 'Reported':
        return <Badge className="bg-red-600">Reported</Badge>;
      case 'Disabled':
        return <Badge variant="secondary">Disabled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrivacyBadge = (privacy: string) => {
    return privacy === 'Public' ? (
      <Badge variant="outline" className="border-[#195440] text-[#195440]">Public</Badge>
    ) : (
      <Badge variant="outline">Private</Badge>
    );
  };

  const handleAction = (community: any, action: 'disable' | 'delete' | 'enable' | 'flag') => {
    setSelectedCommunity(community);
    setActionType(action);
    setShowActionDialog(true);
  };

  const handleViewDetails = (community: any) => {
    setSelectedCommunity(community);
    setShowDetailsDialog(true);
  };

  const confirmAction = () => {
    console.log(`${actionType} community:`, selectedCommunity.id, 'Reason:', actionReason);
    // Add action logging here
    setShowActionDialog(false);
    setActionReason('');
  };

  // Filter and sort communities
  const filteredCommunities = communitiesData
    .filter(community => {
      const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           community.creator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || community.status === statusFilter;
      const matchesPrivacy = privacyFilter === 'all' || community.privacy === privacyFilter;
      return matchesSearch && matchesStatus && matchesPrivacy;
    })
    .sort((a, b) => {
      if (sortBy === 'members') return b.members - a.members;
      if (sortBy === 'posts') return b.posts - a.posts;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });

  // Stats
  const totalCommunities = communitiesData.length;
  const activeCommunities = communitiesData.filter(c => c.status === 'Active').length;
  const reportedCommunities = communitiesData.filter(c => c.status === 'Reported').length;
  const disabledCommunities = communitiesData.filter(c => c.status === 'Disabled').length;
  const totalMembers = communitiesData.reduce((sum, c) => sum + c.members, 0);
  const totalReportedPosts = communitiesData.reduce((sum, c) => sum + c.reportedPosts, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Management</h1>
        <p className="text-gray-600 mt-1">Manage communities, moderate content, and maintain community standards</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{totalCommunities}</div>
            <p className="text-sm text-gray-600 mt-1">Total Communities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{activeCommunities}</div>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{reportedCommunities}</div>
            <p className="text-sm text-gray-600 mt-1">Reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{disabledCommunities}</div>
            <p className="text-sm text-gray-600 mt-1">Disabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E1B047]">{totalMembers.toLocaleString()}</div>
            <p className="text-sm text-gray-600 mt-1">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{totalReportedPosts}</div>
            <p className="text-sm text-gray-600 mt-1">Reported Posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search communities by name or creator..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Shield className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Privacy</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent Activity</SelectItem>
                <SelectItem value="members">Most Members</SelectItem>
                <SelectItem value="posts">Most Posts</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Communities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Communities ({filteredCommunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Community Name</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Privacy</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommunities.map((community) => (
                <TableRow key={community.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={community.image} 
                        alt={community.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium">{community.name}</p>
                        <p className="text-sm text-gray-500">{community.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={community.creator} size="sm" />
                      <div>
                        <p className="font-medium">{community.creator}</p>
                        <p className="text-xs text-gray-500">{community.createdDate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPrivacyBadge(community.privacy)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{community.members.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{community.posts}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(community.status)}</TableCell>
                  <TableCell>
                    {community.reportedPosts > 0 ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-600">{community.reportedPosts}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(community)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {community.reportedPosts > 0 && (
                          <DropdownMenuItem onClick={() => handleViewDetails(community)}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            View Reported Posts
                          </DropdownMenuItem>
                        )}
                        {community.status !== 'Disabled' && (
                          <DropdownMenuItem onClick={() => handleAction(community, 'disable')}>
                            <Ban className="w-4 h-4 mr-2" />
                            Disable Community
                          </DropdownMenuItem>
                        )}
                        {community.status === 'Disabled' && (
                          <DropdownMenuItem onClick={() => handleAction(community, 'enable')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Enable Community
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleAction(community, 'delete')}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Community
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Community Details - {selectedCommunity?.name}</DialogTitle>
            <DialogDescription>
              View essential community information
            </DialogDescription>
          </DialogHeader>

          {selectedCommunity && (
            <div className="space-y-6 mt-6 px-6 max-h-[60vh] overflow-y-auto">
              {/* Community Image */}
              <div>
                <Label className="text-gray-600 mb-2 block">Community Image</Label>
                <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                  <img 
                    src={selectedCommunity.image} 
                    alt={selectedCommunity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <Separator />

              {/* Community Name */}
              <div>
                <Label className="text-gray-600">Community Name</Label>
                <p className="font-medium text-lg text-[#195440] mt-1">{selectedCommunity.name}</p>
              </div>

              <Separator />

              {/* Member Limits */}
              <div>
                <Label className="text-gray-600">Member Limits</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-lg">{selectedCommunity.memberLimit} members</p>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Current: {selectedCommunity.members.toLocaleString()} / {selectedCommunity.memberLimit}
                </div>
              </div>

              <Separator />

              {/* Privacy */}
              <div>
                <Label className="text-gray-600">Privacy</Label>
                <div className="mt-1">{getPrivacyBadge(selectedCommunity.privacy)}</div>
              </div>

              <Separator />

              {/* Rules & Guidelines */}
              <div>
                <Label className="text-gray-600">Rules & Guidelines</Label>
                <div className="mt-2 space-y-2 bg-gray-50 p-4 rounded-lg border">
                  {selectedCommunity.rules.map((rule: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#195440] mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Reported Content */}
              <div>
                <Label className="text-gray-600">Reported Content</Label>
                {selectedCommunity.reportedContent && selectedCommunity.reportedContent.length > 0 ? (
                  <div className="mt-2 space-y-3">
                    {selectedCommunity.reportedContent.map((report: any) => (
                      <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">{report.type}</Badge>
                              <Badge 
                                variant={
                                  report.status === 'Pending' ? 'secondary' : 
                                  report.status === 'Urgent' ? 'destructive' :
                                  report.status === 'Resolved' ? 'default' : 
                                  'outline'
                                }
                                className={
                                  report.status === 'Resolved' ? 'bg-green-600' :
                                  report.status === 'Urgent' ? 'bg-red-600' :
                                  report.status === 'Under Review' ? 'bg-orange-600' : ''
                                }
                              >
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{report.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Reported by: {report.reportedBy}</span>
                              <span>•</span>
                              <span>{report.date}</span>
                            </div>
                          </div>
                          {report.status === 'Pending' && (
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border text-center">
                    No reported content
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedCommunity?.status !== 'Disabled' && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleAction(selectedCommunity, 'disable');
                }}
              >
                <Ban className="w-4 h-4 mr-2" />
                Disable Community
              </Button>
            )}
            {selectedCommunity?.status === 'Disabled' && (
              <Button
                className="bg-[#195440] hover:bg-[#195440]/90"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleAction(selectedCommunity, 'enable');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Enable Community
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'disable' && 'Disable Community'}
              {actionType === 'enable' && 'Enable Community'}
              {actionType === 'delete' && 'Delete Community'}
              {actionType === 'flag' && 'Flag Community for Review'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'disable' && 'Temporarily disable this community to halt activity without permanent deletion.'}
              {actionType === 'enable' && 'Re-enable this community to restore normal activity.'}
              {actionType === 'delete' && 'Permanently delete this community. This action cannot be undone.'}
              {actionType === 'flag' && 'Flag this community for follow-up investigation and monitoring.'}
            </DialogDescription>
          </DialogHeader>

          {selectedCommunity && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Community</p>
                <p className="font-medium text-lg">{selectedCommunity.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCommunity.members.toLocaleString()} members • {selectedCommunity.posts} posts
                </p>
              </div>

              <div>
                <Label>Reason for Action *</Label>
                <Textarea
                  placeholder={`Explain why you are ${actionType === 'enable' ? 'enabling' : actionType === 'flag' ? 'flagging' : actionType}ing this community...`}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {actionType === 'delete' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Warning: Permanent Action</p>
                      <p className="text-sm text-red-800 mt-1">
                        Deleting this community will permanently remove all posts, comments, events, 
                        and member associations. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {actionType === 'disable' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Disabling will hide the community from search, prevent new posts, and notify members. 
                    You can re-enable it later if needed.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <Shield className="w-3 h-3 inline mr-1" />
                  This action will be logged for audit purposes with timestamp and admin details.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={!actionReason.trim()}
              className={
                actionType === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : actionType === 'enable'
                  ? 'bg-[#195440] hover:bg-[#195440]/90'
                  : ''
              }
              variant={actionType === 'disable' || actionType === 'flag' ? 'secondary' : 'default'}
            >
              {actionType === 'disable' && (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Confirm Disable
                </>
              )}
              {actionType === 'enable' && (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Enable
                </>
              )}
              {actionType === 'delete' && (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Confirm Delete
                </>
              )}
              {actionType === 'flag' && (
                <>
                  <Flag className="w-4 h-4 mr-2" />
                  Confirm Flag
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
