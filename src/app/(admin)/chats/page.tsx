'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Ban, AlertTriangle, MessageSquare, User, Clock, ShieldAlert, XCircle, CheckCircle, FileText, Calendar, TrendingUp, Download } from 'lucide-react';
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

const chatReportsData = [
  {
    id: 'RPT001',
    reporter: {
      id: 'USR045',
      name: 'Jennifer Martinez',
      email: 'j.martinez@example.com',
      avatar: 'JM'
    },
    reportedUser: {
      id: 'USR189',
      name: 'Spam Account',
      email: 'spam@suspicious.com',
      avatar: 'SA'
    },
    chatId: 'CHAT-2024-001',
    conversationId: 'CONV-567',
    reason: 'Spam messages',
    detailedReason: 'User is sending repeated promotional messages about cryptocurrency investments without permission. Messages are unsolicited and appear to be part of a scam.',
    severity: 'High',
    status: 'Pending',
    reportDate: '2026-02-18T14:30:00',
    chatMessages: [
      { id: 1, sender: 'USR189', senderName: 'Spam Account', message: 'Hey! Have you heard about this amazing crypto opportunity?', timestamp: '2026-02-18T10:00:00' },
      { id: 2, sender: 'USR045', senderName: 'Jennifer Martinez', message: 'No, I\'m not interested', timestamp: '2026-02-18T10:02:00' },
      { id: 3, sender: 'USR189', senderName: 'Spam Account', message: 'You can make $10,000 in just one week! Click this link now!', timestamp: '2026-02-18T10:03:00' },
      { id: 4, sender: 'USR189', senderName: 'Spam Account', message: 'Limited time offer! Don\'t miss out!!! 💰💰💰', timestamp: '2026-02-18T10:05:00' },
      { id: 5, sender: 'USR045', senderName: 'Jennifer Martinez', message: 'Please stop sending me these messages', timestamp: '2026-02-18T10:06:00' },
      { id: 6, sender: 'USR189', senderName: 'Spam Account', message: 'Just one more thing - my exclusive trading signals will change your life!', timestamp: '2026-02-18T10:08:00' }
    ],
    moderationHistory: []
  },
  {
    id: 'RPT002',
    reporter: {
      id: 'USR012',
      name: 'Dr. Michael Chen',
      email: 'm.chen@healthmail.com',
      avatar: 'MC'
    },
    reportedUser: {
      id: 'USR178',
      name: 'Angry User',
      email: 'angry@user.com',
      avatar: 'AU'
    },
    chatId: 'CHAT-2024-002',
    conversationId: 'CONV-892',
    reason: 'Harassment',
    detailedReason: 'User is sending aggressive and threatening messages. Using abusive language and making personal attacks.',
    severity: 'Critical',
    status: 'Under Review',
    reportDate: '2026-02-18T11:15:00',
    chatMessages: [
      { id: 1, sender: 'USR012', senderName: 'Dr. Michael Chen', message: 'I disagree with your opinion on this matter', timestamp: '2026-02-18T08:00:00' },
      { id: 2, sender: 'USR178', senderName: 'Angry User', message: 'You\'re an idiot! You don\'t know what you\'re talking about!', timestamp: '2026-02-18T08:05:00' },
      { id: 3, sender: 'USR012', senderName: 'Dr. Michael Chen', message: 'Please keep the conversation respectful', timestamp: '2026-02-18T08:07:00' },
      { id: 4, sender: 'USR178', senderName: 'Angry User', message: 'I\'ll say whatever I want! You deserve to be called out for your stupidity!', timestamp: '2026-02-18T08:10:00' },
      { id: 5, sender: 'USR178', senderName: 'Angry User', message: 'People like you shouldn\'t be allowed on this platform!', timestamp: '2026-02-18T08:12:00' }
    ],
    moderationHistory: []
  },
  {
    id: 'RPT003',
    reporter: {
      id: 'USR091',
      name: 'Lisa Wang',
      email: 'l.wang@startup.com',
      avatar: 'LW'
    },
    reportedUser: {
      id: 'USR156',
      name: 'Inappropriate User',
      email: 'inappropriate@email.com',
      avatar: 'IU'
    },
    chatId: 'CHAT-2024-003',
    conversationId: 'CONV-234',
    reason: 'Inappropriate content',
    detailedReason: 'User is sending sexually explicit messages and inappropriate images without consent.',
    severity: 'Critical',
    status: 'Pending',
    reportDate: '2026-02-17T16:45:00',
    chatMessages: [
      { id: 1, sender: 'USR156', senderName: 'Inappropriate User', message: 'Hey there... 😏', timestamp: '2026-02-17T15:00:00' },
      { id: 2, sender: 'USR091', senderName: 'Lisa Wang', message: 'Hello, can I help you with something?', timestamp: '2026-02-17T15:05:00' },
      { id: 3, sender: 'USR156', senderName: 'Inappropriate User', message: '[INAPPROPRIATE CONTENT - FLAGGED BY SYSTEM]', timestamp: '2026-02-17T15:07:00' },
      { id: 4, sender: 'USR091', senderName: 'Lisa Wang', message: 'This is completely inappropriate. Stop messaging me.', timestamp: '2026-02-17T15:08:00' },
      { id: 5, sender: 'USR156', senderName: 'Inappropriate User', message: '[INAPPROPRIATE CONTENT - FLAGGED BY SYSTEM]', timestamp: '2026-02-17T15:10:00' }
    ],
    moderationHistory: []
  },
  {
    id: 'RPT004',
    reporter: {
      id: 'USR034',
      name: 'Dr. Robert Wilson',
      email: 'r.wilson@clinic.com',
      avatar: 'RW'
    },
    reportedUser: {
      id: 'USR201',
      name: 'Conspiracy User',
      email: 'conspiracy@truth.com',
      avatar: 'CU'
    },
    chatId: 'CHAT-2024-004',
    conversationId: 'CONV-445',
    reason: 'Misinformation',
    detailedReason: 'User is spreading dangerous medical misinformation and conspiracy theories about vaccines.',
    severity: 'High',
    status: 'Resolved',
    reportDate: '2026-02-17T09:20:00',
    chatMessages: [
      { id: 1, sender: 'USR201', senderName: 'Conspiracy User', message: 'Don\'t trust what they tell you about vaccines!', timestamp: '2026-02-17T08:00:00' },
      { id: 2, sender: 'USR034', senderName: 'Dr. Robert Wilson', message: 'I\'m a medical professional. Vaccines are safe and effective.', timestamp: '2026-02-17T08:05:00' },
      { id: 3, sender: 'USR201', senderName: 'Conspiracy User', message: 'You\'re part of the conspiracy! Wake up and do your own research!', timestamp: '2026-02-17T08:07:00' },
      { id: 4, sender: 'USR201', senderName: 'Conspiracy User', message: 'The truth is being hidden from everyone!', timestamp: '2026-02-17T08:10:00' },
      { id: 5, sender: 'USR034', senderName: 'Dr. Robert Wilson', message: 'This is dangerous misinformation. I\'m reporting this conversation.', timestamp: '2026-02-17T08:12:00' }
    ],
    moderationHistory: [
      { action: 'Warned', by: 'Admin', date: '2026-02-17T10:00:00', reason: 'Spreading medical misinformation' },
      { action: 'Temporary Block (7 days)', by: 'Admin', date: '2026-02-17T10:05:00', reason: 'Continued violation after warning' }
    ]
  },
  {
    id: 'RPT005',
    reporter: {
      id: 'USR004',
      name: 'James Wilson',
      email: 'j.wilson@example.com',
      avatar: 'JW'
    },
    reportedUser: {
      id: 'USR223',
      name: 'Scammer Account',
      email: 'scammer@fake.com',
      avatar: 'SC'
    },
    chatId: 'CHAT-2024-005',
    conversationId: 'CONV-778',
    reason: 'Scam/Fraud',
    detailedReason: 'User is attempting to scam people by posing as a fitness instructor and requesting payment for fake services.',
    severity: 'Critical',
    status: 'Resolved',
    reportDate: '2026-02-16T14:20:00',
    chatMessages: [
      { id: 1, sender: 'USR223', senderName: 'Scammer Account', message: 'Hi! I\'m a certified personal trainer. Want to get in shape?', timestamp: '2026-02-16T12:00:00' },
      { id: 2, sender: 'USR004', senderName: 'James Wilson', message: 'Sure, what are your credentials?', timestamp: '2026-02-16T12:05:00' },
      { id: 3, sender: 'USR223', senderName: 'Scammer Account', message: 'I have 10 years experience! Just send me $500 via this link and I\'ll send you my program', timestamp: '2026-02-16T12:07:00' },
      { id: 4, sender: 'USR004', senderName: 'James Wilson', message: 'Can you provide references or certification proof?', timestamp: '2026-02-16T12:10:00' },
      { id: 5, sender: 'USR223', senderName: 'Scammer Account', message: 'No time for that! Limited offer ends today! Pay now or lose this opportunity!', timestamp: '2026-02-16T12:12:00' }
    ],
    moderationHistory: [
      { action: 'Warned', by: 'Super Admin', date: '2026-02-16T15:00:00', reason: 'Suspected scam activity' },
      { action: 'Permanent Ban', by: 'Super Admin', date: '2026-02-16T15:10:00', reason: 'Confirmed fraudulent activity - attempting to scam users' }
    ]
  },
  {
    id: 'RPT006',
    reporter: {
      id: 'USR097',
      name: 'Dr. Anderson',
      email: 'anderson@school.edu',
      avatar: 'DA'
    },
    reportedUser: {
      id: 'USR234',
      name: 'Bullying User',
      email: 'bully@email.com',
      avatar: 'BU'
    },
    chatId: 'CHAT-2024-006',
    conversationId: 'CONV-991',
    reason: 'Bullying',
    detailedReason: 'User is engaging in cyberbullying behavior, making personal attacks and threats.',
    severity: 'High',
    status: 'Pending',
    reportDate: '2026-02-16T11:30:00',
    chatMessages: [
      { id: 1, sender: 'USR234', senderName: 'Bullying User', message: 'I saw your post. You have no idea what you\'re talking about.', timestamp: '2026-02-16T09:00:00' },
      { id: 2, sender: 'USR097', senderName: 'Dr. Anderson', message: 'Everyone is entitled to their opinion.', timestamp: '2026-02-16T09:05:00' },
      { id: 3, sender: 'USR234', senderName: 'Bullying User', message: 'Your opinion is trash. You should quit your job.', timestamp: '2026-02-16T09:07:00' },
      { id: 4, sender: 'USR234', senderName: 'Bullying User', message: 'Everyone is laughing at you behind your back.', timestamp: '2026-02-16T09:10:00' },
      { id: 5, sender: 'USR097', senderName: 'Dr. Anderson', message: 'This conversation is over.', timestamp: '2026-02-16T09:12:00' },
      { id: 6, sender: 'USR234', senderName: 'Bullying User', message: 'I\'m going to make sure everyone knows how incompetent you are.', timestamp: '2026-02-16T09:15:00' }
    ],
    moderationHistory: []
  },
  {
    id: 'RPT007',
    reporter: {
      id: 'USR106',
      name: 'Chef Carlos',
      email: 'carlos@restaurant.com',
      avatar: 'CC'
    },
    reportedUser: {
      id: 'USR245',
      name: 'Offensive User',
      email: 'offensive@email.com',
      avatar: 'OU'
    },
    chatId: 'CHAT-2024-007',
    conversationId: 'CONV-123',
    reason: 'Hate speech',
    detailedReason: 'User is using racial slurs and discriminatory language.',
    severity: 'Critical',
    status: 'Under Review',
    reportDate: '2026-02-15T18:45:00',
    chatMessages: [
      { id: 1, sender: 'USR245', senderName: 'Offensive User', message: '[HATE SPEECH - REMOVED BY SYSTEM]', timestamp: '2026-02-15T17:00:00' },
      { id: 2, sender: 'USR106', senderName: 'Chef Carlos', message: 'That language is completely unacceptable!', timestamp: '2026-02-15T17:02:00' },
      { id: 3, sender: 'USR245', senderName: 'Offensive User', message: '[DISCRIMINATORY CONTENT - REMOVED BY SYSTEM]', timestamp: '2026-02-15T17:05:00' },
      { id: 4, sender: 'USR106', senderName: 'Chef Carlos', message: 'I\'m reporting you immediately.', timestamp: '2026-02-15T17:06:00' }
    ],
    moderationHistory: [
      { action: 'Temporary Block (14 days)', by: 'Super Admin', date: '2026-02-15T19:00:00', reason: 'Hate speech and discriminatory language' }
    ]
  },
  {
    id: 'RPT008',
    reporter: {
      id: 'USR111',
      name: 'Photo Pro Anna',
      email: 'anna@photography.com',
      avatar: 'PA'
    },
    reportedUser: {
      id: 'USR256',
      name: 'Stalker Account',
      email: 'stalker@creepy.com',
      avatar: 'ST'
    },
    chatId: 'CHAT-2024-008',
    conversationId: 'CONV-556',
    reason: 'Stalking/Unwanted contact',
    detailedReason: 'User continues to send messages despite being blocked multiple times. Creating new accounts to contact.',
    severity: 'High',
    status: 'Pending',
    reportDate: '2026-02-15T13:20:00',
    chatMessages: [
      { id: 1, sender: 'USR256', senderName: 'Stalker Account', message: 'I created a new account just to talk to you again', timestamp: '2026-02-15T12:00:00' },
      { id: 2, sender: 'USR111', senderName: 'Photo Pro Anna', message: 'I told you to stop contacting me!', timestamp: '2026-02-15T12:05:00' },
      { id: 3, sender: 'USR256', senderName: 'Stalker Account', message: 'But I really need to talk to you. Please give me a chance.', timestamp: '2026-02-15T12:07:00' },
      { id: 4, sender: 'USR111', senderName: 'Photo Pro Anna', message: 'This is harassment. Leave me alone.', timestamp: '2026-02-15T12:10:00' },
      { id: 5, sender: 'USR256', senderName: 'Stalker Account', message: 'I know where you work. Maybe I\'ll come by.', timestamp: '2026-02-15T12:15:00' }
    ],
    moderationHistory: []
  }
];

export default function ChatManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [warnMessage, setWarnMessage] = useState('');
  const [blockDuration, setBlockDuration] = useState('7');
  const [blockReason, setBlockReason] = useState('');

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'High':
        return <Badge className="bg-orange-600">High</Badge>;
      case 'Medium':
        return <Badge className="bg-[#E1B047]">Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-[#E1B047]">Pending</Badge>;
      case 'Under Review':
        return <Badge className="bg-blue-600">Under Review</Badge>;
      case 'Resolved':
        return <Badge className="bg-[#195440]">Resolved</Badge>;
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

  const handleReviewChat = (report: any) => {
    setSelectedReport(report);
    setShowLogsDialog(true);
  };

  const handleWarnUser = (report: any) => {
    setSelectedReport(report);
    setShowWarnDialog(true);
  };

  const handleBlockUser = (report: any) => {
    setSelectedReport(report);
    setShowBlockDialog(true);
  };

  const confirmWarn = () => {
    // Log moderation action
    console.log('User Warned (Chat Report):', {
      reportId: selectedReport.id,
      chatId: selectedReport.chatId,
      reportedUserId: selectedReport.reportedUser.id,
      reportedUserName: selectedReport.reportedUser.name,
      message: warnMessage,
      timestamp: new Date().toISOString(),
      moderator: 'Current Admin'
    });
    setShowWarnDialog(false);
    setWarnMessage('');
  };

  const confirmBlock = () => {
    // Log moderation action
    console.log('User Temporarily Blocked (Chat Report):', {
      reportId: selectedReport.id,
      chatId: selectedReport.chatId,
      reportedUserId: selectedReport.reportedUser.id,
      reportedUserName: selectedReport.reportedUser.name,
      duration: blockDuration + ' days',
      reason: blockReason,
      timestamp: new Date().toISOString(),
      moderator: 'Current Admin'
    });
    setShowBlockDialog(false);
    setBlockDuration('7');
    setBlockReason('');
  };

  // Filter and sort reports
  const filteredReports = chatReportsData
    .filter(report => {
      const matchesSearch = 
        report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.chatId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      
      return matchesSearch && matchesSeverity && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime();
      if (sortBy === 'severity') {
        const severityOrder: any = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return 0;
    });

  // Stats
  const totalReports = chatReportsData.length;
  const pendingReports = chatReportsData.filter(r => r.status === 'Pending').length;
  const underReviewReports = chatReportsData.filter(r => r.status === 'Under Review').length;
  const resolvedReports = chatReportsData.filter(r => r.status === 'Resolved').length;
  const criticalReports = chatReportsData.filter(r => r.severity === 'Critical').length;
  const highSeverityReports = chatReportsData.filter(r => r.severity === 'High').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat & Reports Management</h1>
        <p className="text-gray-600 mt-1">Review reported conversations and take moderation actions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{totalReports}</div>
            <p className="text-sm text-gray-600 mt-1">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E1B047]">{pendingReports}</div>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{underReviewReports}</div>
            <p className="text-sm text-gray-600 mt-1">Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
            <p className="text-sm text-gray-600 mt-1">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{criticalReports}</div>
            <p className="text-sm text-gray-600 mt-1">Critical</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{highSeverityReports}</div>
            <p className="text-sm text-gray-600 mt-1">High Severity</p>
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
                  placeholder="Search by reporter, reported user, chat ID, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Report Date</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chat Reports ({filteredReports.length})</CardTitle>
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
                <TableHead>Reporter</TableHead>
                <TableHead>Reported User</TableHead>
                <TableHead>Chat ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {report.reporter.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{report.reporter.name}</p>
                        <p className="text-xs text-gray-500">{report.reporter.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={report.reportedUser.name} size="sm" />
                      <div>
                        <p className="font-medium">{report.reportedUser.name}</p>
                        <p className="text-xs text-gray-500">{report.reportedUser.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm font-medium text-[#195440]">{report.chatId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {report.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(report.severity)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(report.reportDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewChat(report)}
                        title="Review Chat Logs"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWarnUser(report)}
                        title="Warn User"
                      >
                        <AlertTriangle className="w-4 h-4 text-[#E1B047]" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBlockUser(report)}
                        title="Temporary Block"
                      >
                        <Clock className="w-4 h-4 text-orange-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Chat Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Chat Logs (Read-Only)
            </DialogTitle>
            <DialogDescription>
              Review the conversation to assess violations
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 px-6" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                  <Label className="text-gray-600">Report ID</Label>
                  <p className="font-medium text-[#195440]">{selectedReport.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Chat ID</Label>
                  <p className="font-medium font-mono">{selectedReport.chatId}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Reporter</Label>
                  <p className="font-medium">{selectedReport.reporter.name}</p>
                  <p className="text-sm text-gray-600">{selectedReport.reporter.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Reported User</Label>
                  <p className="font-medium text-red-600">{selectedReport.reportedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedReport.reportedUser.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Reason</Label>
                  <p className="font-medium">{selectedReport.reason}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Severity</Label>
                  <div className="mt-1">{getSeverityBadge(selectedReport.severity)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-600">Detailed Reason</Label>
                  <p className="text-sm mt-1 bg-white p-3 rounded border">{selectedReport.detailedReason}</p>
                </div>
              </div>

              <Separator />

              {/* Chat Messages */}
              <div>
                <Label className="text-gray-600 mb-3 block">Conversation History</Label>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                  {selectedReport.chatMessages.map((msg: any) => {
                    const isReportedUser = msg.sender === selectedReport.reportedUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isReportedUser ? 'bg-red-50 border-l-4 border-red-500 pl-3 py-2 rounded' : ''}`}
                      >
                        <UserAvatar name={msg.senderName} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium text-sm ${isReportedUser ? 'text-red-900' : 'text-gray-900'}`}>
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(msg.timestamp)}</span>
                          </div>
                          <p className={`text-sm ${
                            msg.message.includes('[') && msg.message.includes('REMOVED') 
                              ? 'italic text-red-600 font-medium bg-red-100 p-2 rounded' 
                              : 'text-gray-700'
                          }`}>
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  This is a read-only view. Messages cannot be edited or deleted from this interface.
                </p>
              </div>

              {/* Moderation History */}
              {selectedReport.moderationHistory.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-gray-600">Moderation History</Label>
                    <div className="space-y-2 mt-3">
                      {selectedReport.moderationHistory.map((action: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-orange-900">{action.action}</p>
                              <span className="text-xs text-gray-500">{formatDate(action.date)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{action.reason}</p>
                            <p className="text-xs text-gray-600 mt-1">By: {action.by}</p>
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
            <Button variant="outline" onClick={() => setShowLogsDialog(false)}>
              Close
            </Button>
            {selectedReport && (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowLogsDialog(false);
                    handleWarnUser(selectedReport);
                  }}
                  className="border-[#E1B047] text-[#E1B047] hover:bg-[#E1B047] hover:text-white"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Warn User
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowLogsDialog(false);
                    handleBlockUser(selectedReport);
                  }}
                  className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Temp Block
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warn User Dialog */}
      <Dialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Warn User
            </DialogTitle>
            <DialogDescription>
              Send a warning message about inappropriate chat behavior
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="mx-[20px] my-[0px]">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium">Reported User: {selectedReport.reportedUser.name}</p>
                <p className="text-xs text-gray-600 mt-1">Email: {selectedReport.reportedUser.email}</p>
                <p className="text-xs text-gray-600">User ID: {selectedReport.reportedUser.id}</p>
                <p className="text-xs text-gray-600">Chat ID: {selectedReport.chatId}</p>
                <p className="text-xs text-gray-600">Violation: {selectedReport.reason}</p>
              </div>

              <div>
                <Label>Warning Message</Label>
                <Textarea
                  placeholder="Enter the warning message to send to the user..."
                  value={warnMessage}
                  onChange={(e) => setWarnMessage(e.target.value)}
                  className="mt-2"
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-2">
                  The user will receive this warning via email and in-app notification.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarnDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmWarn}
              disabled={!warnMessage}
              className="bg-[#E1B047] hover:bg-[#c99a3a]"
            >
              Send Warning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Temporary Block Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Temporary Block
            </DialogTitle>
            <DialogDescription>
              Temporarily restrict the user's ability to send chat messages
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium">Reported User: {selectedReport.reportedUser.name}</p>
                <p className="text-xs text-gray-600 mt-1">Email: {selectedReport.reportedUser.email}</p>
                <p className="text-xs text-gray-600">User ID: {selectedReport.reportedUser.id}</p>
                <p className="text-xs text-gray-600">Chat ID: {selectedReport.chatId}</p>
                <p className="text-xs text-red-600 font-medium">Violation: {selectedReport.reason}</p>
              </div>

              <div>
                <Label>Block Duration</Label>
                <Select value={blockDuration} onValueChange={setBlockDuration}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reason for Block</Label>
                <Textarea
                  placeholder="Enter the reason for temporarily blocking this user..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmBlock}
              disabled={!blockReason}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
