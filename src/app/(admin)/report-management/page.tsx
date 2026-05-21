'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/layout/UserAvatar';
import { 
  Eye, 
  Trash2,
  Bell,
  AlertTriangle,
  User,
  FileText,
  Users,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  Search,
  AlertCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface Report {
  id: string;
  type: 'User' | 'Post' | 'Community' | 'Business';
  reportedItem: string;
  reportedItemId: string;
  reportedBy: string;
  reportedById: string;
  reason: string;
  description: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Dismissed';
  date: string;
  resolvedBy?: string;
  resolvedDate?: string;
  actionTaken?: string;
}

const initialReports: Report[] = [
  { 
    id: 'RPT001', 
    type: 'User', 
    reportedItem: 'John Doe', 
    reportedItemId: 'U12345',
    reportedBy: 'Jane Smith', 
    reportedById: 'U67890',
    reason: 'Inappropriate behavior', 
    description: 'User has been sending harassing messages to multiple community members and using offensive language in group chats.',
    status: 'Pending', 
    date: '2026-02-19T10:30:00'
  },
  { 
    id: 'RPT002', 
    type: 'Post', 
    reportedItem: 'Looking for quick money schemes...', 
    reportedItemId: 'P78901',
    reportedBy: 'Mike Johnson', 
    reportedById: 'U23456',
    reason: 'Spam content', 
    description: 'Post contains spam links promoting get-rich-quick schemes and pyramid marketing.',
    status: 'Under Review', 
    date: '2026-02-19T09:15:00'
  },
  { 
    id: 'RPT003', 
    type: 'Business', 
    reportedItem: 'Fake Investment Corp', 
    reportedItemId: 'B45678',
    reportedBy: 'Sarah Lee', 
    reportedById: 'U34567',
    reason: 'Fraudulent business', 
    description: 'Business profile contains false credentials, fake testimonials, and is likely a scam operation.',
    status: 'Pending', 
    date: '2026-02-19T08:45:00'
  },
  { 
    id: 'RPT004', 
    type: 'Community', 
    reportedItem: 'Conspiracy Theorists United', 
    reportedItemId: 'C12345',
    reportedBy: 'David Chen', 
    reportedById: 'U45678',
    reason: 'Misinformation spreading', 
    description: 'Community is actively spreading false health information and conspiracy theories that could harm users.',
    status: 'Under Review', 
    date: '2026-02-19T07:30:00'
  },
  { 
    id: 'RPT005', 
    type: 'User', 
    reportedItem: 'Bob Wilson', 
    reportedItemId: 'U56789',
    reportedBy: 'Emily Taylor', 
    reportedById: 'U78901',
    reason: 'Impersonation', 
    description: 'User is impersonating a well-known business executive to gain credibility and connections.',
    status: 'Pending', 
    date: '2026-02-18T18:20:00'
  },
  { 
    id: 'RPT006', 
    type: 'Post', 
    reportedItem: 'Exclusive discount offer...', 
    reportedItemId: 'P23456',
    reportedBy: 'Alex Martinez', 
    reportedById: 'U89012',
    reason: 'Phishing attempt', 
    description: 'Post contains phishing links disguised as exclusive discount offers.',
    status: 'Resolved', 
    date: '2026-02-18T16:00:00',
    resolvedBy: 'Security Admin',
    resolvedDate: '2026-02-18T17:30:00',
    actionTaken: 'Content Deleted'
  },
  { 
    id: 'RPT007', 
    type: 'Community', 
    reportedItem: 'Hate Speech Group', 
    reportedItemId: 'C67890',
    reportedBy: 'Lisa Anderson', 
    reportedById: 'U90123',
    reason: 'Hate speech', 
    description: 'Community promotes hate speech targeting specific ethnic and religious groups.',
    status: 'Resolved', 
    date: '2026-02-18T14:00:00',
    resolvedBy: 'Moderation Team',
    resolvedDate: '2026-02-18T15:00:00',
    actionTaken: 'Content Deleted'
  },
  { 
    id: 'RPT008', 
    type: 'Business', 
    reportedItem: 'QuickCash Loans', 
    reportedItemId: 'B78901',
    reportedBy: 'Robert Kim', 
    reportedById: 'U01234',
    reason: 'Predatory practices', 
    description: 'Business is offering predatory loans with extremely high interest rates targeting vulnerable users.',
    status: 'Under Review', 
    date: '2026-02-18T12:30:00'
  },
  { 
    id: 'RPT009', 
    type: 'User', 
    reportedItem: 'Spam Bot 123', 
    reportedItemId: 'U11111',
    reportedBy: 'Jennifer White', 
    reportedById: 'U22222',
    reason: 'Bot account', 
    description: 'Account is clearly automated, sending mass messages and friend requests to thousands of users.',
    status: 'Resolved', 
    date: '2026-02-18T10:00:00',
    resolvedBy: 'System Admin',
    resolvedDate: '2026-02-18T11:00:00',
    actionTaken: 'Notification Sent'
  },
  { 
    id: 'RPT010', 
    type: 'Post', 
    reportedItem: 'Political extremism post', 
    reportedItemId: 'P34567',
    reportedBy: 'Thomas Lee', 
    reportedById: 'U33333',
    reason: 'Extremist content', 
    description: 'Post promotes political extremism and encourages violence against opposing groups.',
    status: 'Pending', 
    date: '2026-02-18T09:00:00'
  },
  { 
    id: 'RPT011', 
    type: 'Business', 
    reportedItem: 'Crypto Miracle Inc', 
    reportedItemId: 'B90123',
    reportedBy: 'Maria Garcia', 
    reportedById: 'U44444',
    reason: 'Cryptocurrency scam', 
    description: 'Business is running a cryptocurrency investment scam promising unrealistic returns.',
    status: 'Under Review', 
    date: '2026-02-17T16:00:00'
  },
  { 
    id: 'RPT012', 
    type: 'Community', 
    reportedItem: 'Unofficial Product Sales', 
    reportedItemId: 'C23456',
    reportedBy: 'Chris Brown', 
    reportedById: 'U55555',
    reason: 'Counterfeit goods', 
    description: 'Community is facilitating the sale of counterfeit designer products.',
    status: 'Dismissed', 
    date: '2026-02-17T14:00:00',
    resolvedBy: 'Moderation Team',
    resolvedDate: '2026-02-17T16:00:00',
    actionTaken: 'Notification Sent'
  },
  { 
    id: 'RPT013', 
    type: 'User', 
    reportedItem: 'Scammer Profile', 
    reportedItemId: 'U66666',
    reportedBy: 'Nancy Davis', 
    reportedById: 'U77777',
    reason: 'Financial scam', 
    description: 'User is soliciting money from community members with false sob stories.',
    status: 'Pending', 
    date: '2026-02-17T12:00:00'
  },
  { 
    id: 'RPT014', 
    type: 'Post', 
    reportedItem: 'Adult content in professional space', 
    reportedItemId: 'P45678',
    reportedBy: 'Kevin Moore', 
    reportedById: 'U88888',
    reason: 'Inappropriate content', 
    description: 'User posted adult/NSFW content in a professional networking space.',
    status: 'Resolved', 
    date: '2026-02-17T10:00:00',
    resolvedBy: 'Content Moderator',
    resolvedDate: '2026-02-17T10:30:00',
    actionTaken: 'Content Deleted'
  },
  { 
    id: 'RPT015', 
    type: 'Business', 
    reportedItem: 'Unlicensed Medical Service', 
    reportedItemId: 'B34567',
    reportedBy: 'Patricia Wilson', 
    reportedById: 'U99999',
    reason: 'Unlicensed services', 
    description: 'Business is offering medical services without proper licensing or credentials.',
    status: 'Under Review', 
    date: '2026-02-17T08:00:00'
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionNotes, setActionNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // Calculate stats
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const underReviewReports = reports.filter(r => r.status === 'Under Review').length;
  const resolvedToday = reports.filter(r => {
    if (r.resolvedDate) {
      const today = new Date().toISOString().split('T')[0];
      const resolvedDate = r.resolvedDate.split('T')[0];
      return resolvedDate === today;
    }
    return false;
  }).length;
  const totalThisMonth = reports.length;

  // Filter reports
  const filteredReports = reports.filter(report => {
    const typeMatch = filterType === 'All' || report.type === filterType;
    const searchMatch = searchQuery === '' || 
      report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const handleReviewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReviewDialog(true);
    
    // Log review action
    console.log('Report Reviewed:', {
      reportId: report.id,
      reportType: report.type,
      reportedItem: report.reportedItem,
      reviewedBy: 'Current Admin',
      timestamp: new Date().toISOString(),
      action: 'Report Review Initiated'
    });
  };

  const handleTakeAction = (report: Report) => {
    setSelectedReport(report);
    setShowActionDialog(true);
    setActionType('');
    setActionNotes('');
  };

  const handleSubmitAction = () => {
    if (!selectedReport || !actionType) {
      return;
    }
    // Open confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (!selectedReport || !actionType) {
      return;
    }

    // Log action taken
    console.log('Admin Action Taken on Report:', {
      reportId: selectedReport.id,
      reportType: selectedReport.type,
      reportedItem: selectedReport.reportedItem,
      reportedItemId: selectedReport.reportedItemId,
      actionTaken: actionType,
      actionNotes: actionNotes,
      previousStatus: selectedReport.status,
      newStatus: 'Resolved',
      actionBy: 'Current Admin',
      timestamp: new Date().toISOString()
    });

    // Update report status
    setReports(reports.map(r => 
      r.id === selectedReport.id 
        ? { 
            ...r, 
            status: 'Resolved' as const,
            resolvedBy: 'Current Admin',
            resolvedDate: new Date().toISOString(),
            actionTaken: actionType
          }
        : r
    ));

    setShowConfirmDialog(false);
    setShowActionDialog(false);
    setActionType('');
    setActionNotes('');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'User':
        return <User className="w-4 h-4" />;
      case 'Post':
        return <FileText className="w-4 h-4" />;
      case 'Community':
        return <Users className="w-4 h-4" />;
      case 'Business':
        return <Building className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Under Review':
        return <Eye className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Dismissed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const ReportsTable = ({ data }: { data: Report[] }) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Reported Item</TableHead>
            <TableHead className="font-semibold">Reported By</TableHead>
            <TableHead className="font-semibold">Reason</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No reports found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            data.map((report) => (
              <TableRow key={report.id} className="hover:bg-gray-50">
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{report.id}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    {getTypeIcon(report.type)}
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{report.reportedItem}</div>
                    <div className="text-xs text-gray-500">{report.reportedItemId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={report.reportedBy} size="sm" />
                    <div>
                      <div className="font-medium text-gray-700">{report.reportedBy}</div>
                      <div className="text-xs text-gray-500">{report.reportedById}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate font-medium" title={report.reason}>
                    {report.reason}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(report.date)}
                </TableCell>
                <TableCell>
                  <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReviewReport(report)}
                      title="Review Report"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {(report.status === 'Pending' || report.status === 'Under Review') && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleTakeAction(report)}
                        className="bg-[#195440] hover:bg-[#195440]/90"
                        title="Take Action"
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Action
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
        <p className="text-gray-600 mt-1">Review and take action on reported content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingReports}</div>
                <p className="text-sm text-gray-600 mt-1">Pending Reports</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{underReviewReports}</div>
                <p className="text-sm text-gray-600 mt-1">Under Review</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{resolvedToday}</div>
                <p className="text-sm text-gray-600 mt-1">Resolved Today</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalThisMonth}</div>
                <p className="text-sm text-gray-600 mt-1">Total This Month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Report Queue
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Monitor and manage all user, post, community, and business reports
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <Label>Search Reports</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by item, reporter, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-[180px]">
                <Label>Report Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="User">User Reports</SelectItem>
                    <SelectItem value="Post">Post Reports</SelectItem>
                    <SelectItem value="Community">Community Reports</SelectItem>
                    <SelectItem value="Business">Business Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All Reports ({filteredReports.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({filteredReports.filter(r => r.status === 'Pending').length})
              </TabsTrigger>
              <TabsTrigger value="review">
                Under Review ({filteredReports.filter(r => r.status === 'Under Review').length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({filteredReports.filter(r => r.status === 'Resolved').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ReportsTable data={filteredReports} />
            </TabsContent>

            <TabsContent value="pending">
              <ReportsTable data={filteredReports.filter(r => r.status === 'Pending')} />
            </TabsContent>

            <TabsContent value="review">
              <ReportsTable data={filteredReports.filter(r => r.status === 'Under Review')} />
            </TabsContent>

            <TabsContent value="resolved">
              <ReportsTable data={filteredReports.filter(r => r.status === 'Resolved')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Report Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Review Report Details
            </DialogTitle>
            <DialogDescription>
              Detailed information for this report
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 px-6">
              {/* Report Header */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(selectedReport.type)}
                        {selectedReport.type} Report
                      </Badge>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {getStatusIcon(selectedReport.status)}
                        {selectedReport.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Report ID: {selectedReport.id}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-600">Reported Item</Label>
                    <p className="font-medium mt-1">{selectedReport.reportedItem}</p>
                    <p className="text-xs text-gray-500">{selectedReport.reportedItemId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Reported By</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <UserAvatar name={selectedReport.reportedBy} size="sm" />
                      <div>
                        <p className="font-medium">{selectedReport.reportedBy}</p>
                        <p className="text-xs text-gray-500">{selectedReport.reportedById}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Report Date</Label>
                    <p className="font-medium mt-1">{formatDate(selectedReport.date)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Reason</Label>
                    <p className="font-medium mt-1">{selectedReport.reason}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  Report Description
                </Label>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-900">{selectedReport.description}</p>
                </div>
              </div>

              <Separator />

              {/* Resolution Info (if resolved) */}
              {selectedReport.status === 'Resolved' && selectedReport.resolvedBy && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-2">Report Resolved</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label className="text-xs text-green-700">Resolved By</Label>
                          <p className="font-medium text-green-900">{selectedReport.resolvedBy}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-green-700">Resolved Date</Label>
                          <p className="font-medium text-green-900">{formatDate(selectedReport.resolvedDate!)}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-green-700">Action Taken</Label>
                          <p className="font-medium text-green-900">{selectedReport.actionTaken}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport.status === 'Dismissed' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Report Dismissed</h4>
                      <p className="text-sm text-gray-700">This report was reviewed and dismissed. Action: {selectedReport.actionTaken}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Close
            </Button>
            {selectedReport && (selectedReport.status === 'Pending' || selectedReport.status === 'Under Review') && (
              <Button 
                onClick={() => {
                  setShowReviewDialog(false);
                  handleTakeAction(selectedReport);
                }}
                className="bg-[#195440] hover:bg-[#195440]/90"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Take Action
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Take Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="w-[95vw] max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Take Action on Report
            </DialogTitle>
            <DialogDescription>
              Choose an appropriate action to address this report
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 px-6">
              {/* Report Summary */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(selectedReport.type)}
                    {selectedReport.type}
                  </Badge>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{selectedReport.reportedItem}</p>
                  <p className="text-gray-600 mt-1">{selectedReport.reason}</p>
                </div>
              </div>

              <Separator />

              {/* Action Type */}
              <div className="space-y-2">
                <Label>Action Type *</Label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Content Deleted">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Content
                      </div>
                    </SelectItem>
                    <SelectItem value="Notification Sent">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Send Notification to User
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Notes */}
              <div className="space-y-2">
                <Label>Action Notes</Label>
                <Textarea
                  placeholder="Add notes explaining your decision and any additional context..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Warning based on action */}
              {actionType && (
                <div className={`p-3 rounded-lg border ${
                  actionType === 'Content Deleted'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      actionType === 'Content Deleted'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        actionType === 'Content Deleted'
                          ? 'text-red-900'
                          : 'text-blue-900'
                      }`}>
                        {actionType === 'Content Deleted' 
                          ? 'Permanent Removal' 
                          : 'User Notification'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        actionType === 'Content Deleted'
                          ? 'text-red-800'
                          : 'text-blue-800'
                      }`}>
                        {actionType === 'Content Deleted' 
                          ? 'The reported content will be permanently deleted from the platform and cannot be recovered.' 
                          : 'A notification will be sent to the user informing them about this report and requesting action.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowActionDialog(false);
                setActionType('');
                setActionNotes('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitAction}
              className="bg-[#195440] hover:bg-[#195440]/90"
              disabled={!actionType}
            >
              Submit Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to take this action on the reported content? This will mark the report as resolved.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="my-4 p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">Report: {selectedReport.id}</p>
                <p className="text-gray-600">Action: <span className="font-medium">{actionType}</span></p>
                {actionNotes && (
                  <p className="text-gray-600 mt-2">Notes: <span className="font-medium">{actionNotes}</span></p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmAction}
              className="bg-[#195440] hover:bg-[#195440]/90"
            >
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
