'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Send, 
  RefreshCw, 
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Eye,
  AlertTriangle,
  Users,
  Megaphone,
  TrendingUp,
  Calendar,
  Search
} from 'lucide-react';

interface NotificationLog {
  id: string;
  type: 'System' | 'Marketing' | 'Alert' | 'Event' | 'Announcement' | 'Reminder';
  title: string;
  message: string;
  recipients: string;
  recipientCount: number;
  sent: string;
  status: 'Sent' | 'Failed' | 'Pending';
  deliveryRate?: number;
  failureReason?: string;
  sentBy: string;
}

const initialNotifications: NotificationLog[] = [
  { 
    id: 'NOT001', 
    type: 'System', 
    title: 'Platform Maintenance',
    message: 'Scheduled maintenance on Feb 25, 2026 from 2:00 AM - 4:00 AM EST. Services will be temporarily unavailable.', 
    recipients: 'All Users', 
    recipientCount: 15420,
    sent: '2026-02-19T09:30:00', 
    status: 'Sent',
    deliveryRate: 98.5,
    sentBy: 'System Admin'
  },
  { 
    id: 'NOT002', 
    type: 'Marketing', 
    title: 'Premium Features Launch',
    message: 'Exciting new premium features are now available! Upgrade your account to unlock advanced matching, priority support, and exclusive events.', 
    recipients: 'Active Users', 
    recipientCount: 8750,
    sent: '2026-02-19T08:15:00', 
    status: 'Sent',
    deliveryRate: 97.2,
    sentBy: 'Marketing Team'
  },
  { 
    id: 'NOT003', 
    type: 'Alert', 
    title: 'Security Update Required',
    message: 'Critical security patch available. Please update your app to version 2.5.1 to ensure your account security.', 
    recipients: 'All Users', 
    recipientCount: 15420,
    sent: '2026-02-19T07:45:00', 
    status: 'Failed',
    deliveryRate: 45.3,
    failureReason: 'Push notification service timeout',
    sentBy: 'Security Team'
  },
  { 
    id: 'NOT004', 
    type: 'Event', 
    title: 'Networking Event Tomorrow',
    message: 'Reminder: Tech Networking Mixer starts tomorrow at 6:00 PM at Innovation Hub. Don\'t forget to check in!', 
    recipients: 'Event Attendees', 
    recipientCount: 250,
    sent: '2026-02-19T06:00:00', 
    status: 'Sent',
    deliveryRate: 99.6,
    sentBy: 'Event Manager'
  },
  { 
    id: 'NOT005', 
    type: 'Announcement', 
    title: 'New Community Guidelines',
    message: 'We\'ve updated our community guidelines to ensure a safe and respectful environment for all members. Please review the changes.', 
    recipients: 'All Users', 
    recipientCount: 15420,
    sent: '2026-02-19T05:30:00', 
    status: 'Sent',
    deliveryRate: 96.8,
    sentBy: 'Community Manager'
  },
  { 
    id: 'NOT006', 
    type: 'Reminder', 
    title: 'Complete Your Profile',
    message: 'Your profile is 60% complete. Add more information to improve your matching results and connect with like-minded professionals.', 
    recipients: 'Incomplete Profiles', 
    recipientCount: 3200,
    sent: '2026-02-18T18:00:00', 
    status: 'Sent',
    deliveryRate: 94.1,
    sentBy: 'System'
  },
  { 
    id: 'NOT007', 
    type: 'Marketing', 
    title: 'Valentine\'s Day Special',
    message: 'Limited time offer! Get 30% off premium membership this weekend only. Connect with more professionals today.', 
    recipients: 'Free Tier Users', 
    recipientCount: 6890,
    sent: '2026-02-18T16:30:00', 
    status: 'Failed',
    failureReason: 'Email service provider error',
    sentBy: 'Marketing Team'
  },
  { 
    id: 'NOT008', 
    type: 'Event', 
    title: 'Workshop Registration Open',
    message: 'Registration is now open for our upcoming Professional Development Workshop on March 5th. Limited seats available!', 
    recipients: 'Premium Members', 
    recipientCount: 4200,
    sent: '2026-02-18T15:00:00', 
    status: 'Sent',
    deliveryRate: 98.9,
    sentBy: 'Event Manager'
  },
  { 
    id: 'NOT009', 
    type: 'Alert', 
    title: 'Suspicious Login Detected',
    message: 'We detected a login attempt from an unusual location. If this wasn\'t you, please secure your account immediately.', 
    recipients: 'Affected Users', 
    recipientCount: 15,
    sent: '2026-02-18T14:20:00', 
    status: 'Sent',
    deliveryRate: 100,
    sentBy: 'Security System'
  },
  { 
    id: 'NOT010', 
    type: 'Announcement', 
    title: 'New Mobile App Features',
    message: 'Check out our latest app update with dark mode, advanced filters, and improved chat experience!', 
    recipients: 'Mobile Users', 
    recipientCount: 10500,
    sent: '2026-02-18T12:00:00', 
    status: 'Pending',
    sentBy: 'Product Team'
  },
  { 
    id: 'NOT011', 
    type: 'Reminder', 
    title: 'Subscription Expiring Soon',
    message: 'Your premium subscription will expire in 7 days. Renew now to continue enjoying all premium features.', 
    recipients: 'Expiring Subscriptions', 
    recipientCount: 450,
    sent: '2026-02-18T10:00:00', 
    status: 'Sent',
    deliveryRate: 99.3,
    sentBy: 'Billing System'
  },
  { 
    id: 'NOT012', 
    type: 'System', 
    title: 'Terms of Service Update',
    message: 'We\'ve updated our Terms of Service. Please review the changes which will take effect on March 1, 2026.', 
    recipients: 'All Users', 
    recipientCount: 15420,
    sent: '2026-02-18T09:00:00', 
    status: 'Failed',
    deliveryRate: 62.1,
    failureReason: 'Rate limit exceeded',
    sentBy: 'Legal Team'
  },
  { 
    id: 'NOT013', 
    type: 'Event', 
    title: 'Monthly Webinar Series',
    message: 'Join us for our monthly webinar on Industry Trends this Friday at 3:00 PM EST. Register now to reserve your spot!', 
    recipients: 'All Users', 
    recipientCount: 15420,
    sent: '2026-02-17T16:00:00', 
    status: 'Sent',
    deliveryRate: 96.5,
    sentBy: 'Event Manager'
  },
  { 
    id: 'NOT014', 
    type: 'Marketing', 
    title: 'Refer a Friend',
    message: 'Invite your friends and earn rewards! Both you and your friend get a free month of premium when they sign up.', 
    recipients: 'Active Users', 
    recipientCount: 8750,
    sent: '2026-02-17T14:00:00', 
    status: 'Sent',
    deliveryRate: 95.8,
    sentBy: 'Marketing Team'
  },
  { 
    id: 'NOT015', 
    type: 'Alert', 
    title: 'Policy Violation Warning',
    message: 'Your recent post was flagged for review. Please ensure all content follows our community guidelines.', 
    recipients: 'Flagged Users', 
    recipientCount: 8,
    sent: '2026-02-17T11:30:00', 
    status: 'Sent',
    deliveryRate: 100,
    sentBy: 'Moderation Team'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationLog[]>(initialNotifications);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationLog | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Sent' | 'Failed' | 'Pending'>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Announcement form state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementRecipients, setAnnouncementRecipients] = useState<string>('All Users');

  // Calculate stats
  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === 'Sent').length;
  const failedNotifications = notifications.filter(n => n.status === 'Failed').length;
  const pendingNotifications = notifications.filter(n => n.status === 'Pending').length;
  const averageDeliveryRate = notifications
    .filter(n => n.deliveryRate)
    .reduce((acc, n) => acc + (n.deliveryRate || 0), 0) / notifications.filter(n => n.deliveryRate).length;

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const statusMatch = filterStatus === 'All' || notification.status === filterStatus;
    const typeMatch = filterType === 'All' || notification.type === filterType;
    const searchMatch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.recipients.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && typeMatch && searchMatch;
  });

  const handleRetry = (notification: NotificationLog) => {
    // Log retry action
    console.log('Retrying Failed Notification:', {
      notificationId: notification.id,
      title: notification.title,
      recipients: notification.recipients,
      recipientCount: notification.recipientCount,
      originalSentDate: notification.sent,
      failureReason: notification.failureReason,
      retryTimestamp: new Date().toISOString(),
      retriedBy: 'Current Admin',
      action: 'Notification Retry Initiated'
    });

    // Update notification status
    setNotifications(notifications.map(n => 
      n.id === notification.id 
        ? { ...n, status: 'Pending' as const, sent: new Date().toISOString() }
        : n
    ));

    alert(`Retrying notification: ${notification.title}\nRecipients: ${notification.recipientCount}`);
    
    // Simulate retry success after 2 seconds
    setTimeout(() => {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'Sent' as const, deliveryRate: 99.1 }
          : n
      ));
      console.log('Notification Retry Successful:', {
        notificationId: notification.id,
        newStatus: 'Sent',
        deliveryRate: 99.1,
        completedTimestamp: new Date().toISOString()
      });
    }, 2000);
  };

  const handleSendAnnouncement = () => {
    if (!announcementTitle || !announcementMessage) {
      alert('Please fill in all required fields');
      return;
    }

    const recipientCounts: { [key: string]: number } = {
      'All Users': 15420,
      'Active Users': 8750,
      'Premium Members': 4200,
      'Free Tier Users': 6890,
      'Inactive Users': 6670
    };

    const newNotification: NotificationLog = {
      id: `NOT${String(notifications.length + 1).padStart(3, '0')}`,
      type: 'Announcement' as any,
      title: announcementTitle,
      message: announcementMessage,
      recipients: announcementRecipients,
      recipientCount: recipientCounts[announcementRecipients] || 0,
      sent: new Date().toISOString(),
      status: 'Pending',
      sentBy: 'Current Admin'
    };

    // Log announcement
    console.log('Manual Announcement Sent:', {
      notificationId: newNotification.id,
      type: 'Announcement',
      title: announcementTitle,
      message: announcementMessage,
      recipients: announcementRecipients,
      recipientCount: newNotification.recipientCount,
      channels: {
        email: true,
        push: true,
        sms: false
      },
      sentTimestamp: new Date().toISOString(),
      sentBy: 'Current Admin',
      action: 'Manual Announcement Created'
    });

    setNotifications([newNotification, ...notifications]);
    setShowAnnouncementDialog(false);
    
    // Reset form
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setAnnouncementRecipients('All Users');

    alert(`Announcement "${announcementTitle}" is being sent to ${newNotification.recipientCount} users`);

    // Simulate sending completion
    setTimeout(() => {
      setNotifications(prev => prev.map(n => 
        n.id === newNotification.id 
          ? { ...n, status: 'Sent' as const, deliveryRate: 98.7 }
          : n
      ));
      console.log('Manual Announcement Delivered:', {
        notificationId: newNotification.id,
        status: 'Sent',
        deliveryRate: 98.7,
        completedTimestamp: new Date().toISOString()
      });
    }, 3000);
  };

  const handleViewDetails = (notification: NotificationLog) => {
    setSelectedNotification(notification);
    setShowViewDialog(true);
    
    // Log view action
    console.log('Notification Details Viewed:', {
      notificationId: notification.id,
      title: notification.title,
      viewedBy: 'Current Admin',
      timestamp: new Date().toISOString()
    });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent':
        return <CheckCircle className="w-4 h-4" />;
      case 'Failed':
        return <XCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'System':
        return 'bg-blue-100 text-blue-800';
      case 'Marketing':
        return 'bg-purple-100 text-purple-800';
      case 'Alert':
        return 'bg-red-100 text-red-800';
      case 'Event':
        return 'bg-green-100 text-green-800';
      case 'Announcement':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reminder':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p className="text-gray-600 mt-1">View notification logs, retry failed messages, and send manual announcements</p>
        </div>
        <Button 
          onClick={() => setShowAnnouncementDialog(true)}
          className="bg-[#E1B047] hover:bg-[#d4a851]"
        >
          <Megaphone className="w-4 h-4 mr-2" />
          Send Manual Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalNotifications}</div>
                <p className="text-sm text-gray-600 mt-1">Total Notifications</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{sentNotifications}</div>
                <p className="text-sm text-gray-600 mt-1">Sent</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{failedNotifications}</div>
                <p className="text-sm text-gray-600 mt-1">Failed</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingNotifications}</div>
                <p className="text-sm text-gray-600 mt-1">Pending</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#195440]">{averageDeliveryRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-600 mt-1">Avg Delivery Rate</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Logs
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Track all sent, failed, and pending notifications
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <Label>Search Notifications</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, message, or recipients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-[180px]">
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredNotifications.length} of {totalNotifications} notifications
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Recipients</TableHead>
                  <TableHead className="font-semibold">Sent At</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Delivery Rate</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No notifications found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification) => (
                    <TableRow key={notification.id} className="hover:bg-gray-50">
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{notification.id}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[250px]">
                        <div className="truncate" title={notification.title}>
                          {notification.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{notification.recipients}</div>
                          <div className="text-xs text-gray-500">{notification.recipientCount.toLocaleString()} users</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(notification.sent)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(notification.status)}`}>
                          {getStatusIcon(notification.status)}
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {notification.deliveryRate !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${notification.deliveryRate > 95 ? 'bg-green-500' : notification.deliveryRate > 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${notification.deliveryRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{notification.deliveryRate}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(notification)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {notification.status === 'Failed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRetry(notification)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Retry
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
        </CardContent>
      </Card>

      {/* Send Manual Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Send Manual Announcement
            </DialogTitle>
            <DialogDescription>
              Broadcast urgent or important updates to all or selected users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="Enter notification title..."
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Enter your announcement message..."
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-gray-500">
                {announcementMessage.length} / 500 characters
              </p>
            </div>

            <Separator />

            {/* Recipients */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Target Recipients *
              </Label>
              <Select value={announcementRecipients} onValueChange={setAnnouncementRecipients}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">All Users (15,420)</SelectItem>
                  <SelectItem value="Active Users">Active Users (8,750)</SelectItem>
                  <SelectItem value="Premium Members">Premium Members (4,200)</SelectItem>
                  <SelectItem value="Free Tier Users">Free Tier Users (6,890)</SelectItem>
                  <SelectItem value="Inactive Users">Inactive Users (6,670)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            {announcementTitle && announcementMessage && (
              <>
                <Separator />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Preview</h4>
                  <div className="bg-white rounded p-3 border">
                    <div className="flex items-start gap-2 mb-2">
                      <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-gray-900">{announcementTitle}</h5>
                        <p className="text-sm text-gray-600 mt-1">{announcementMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Badge className="bg-blue-100 text-blue-800">Push Notification</Badge>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendAnnouncement}
              className="bg-[#195440] hover:bg-[#195440]/90"
              disabled={!announcementTitle || !announcementMessage}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Notification Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="w-[95vw] max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Notification Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this notification
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4 px-6">
              {/* Header */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTypeColor(selectedNotification.type)}>
                      {selectedNotification.type}
                    </Badge>
                    <Badge className={getStatusColor(selectedNotification.status)}>
                      {getStatusIcon(selectedNotification.status)}
                      {selectedNotification.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedNotification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">ID: {selectedNotification.id}</p>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message</Label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-900">{selectedNotification.message}</p>
                </div>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Recipients</Label>
                  <p className="font-medium mt-1">{selectedNotification.recipients}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Recipient Count</Label>
                  <p className="font-medium mt-1">{selectedNotification.recipientCount.toLocaleString()} users</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Sent At</Label>
                  <p className="font-medium mt-1">{formatDate(selectedNotification.sent)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Sent By</Label>
                  <p className="font-medium mt-1">{selectedNotification.sentBy}</p>
                </div>
              </div>

              <Separator />

              {/* Delivery Information */}
              <div className="space-y-3">
                <Label>Delivery Information</Label>
                
                {selectedNotification.deliveryRate !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Delivery Rate</span>
                      <span className="text-sm font-bold">{selectedNotification.deliveryRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${selectedNotification.deliveryRate > 95 ? 'bg-green-500' : selectedNotification.deliveryRate > 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${selectedNotification.deliveryRate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Delivered: {Math.round(selectedNotification.recipientCount * selectedNotification.deliveryRate / 100).toLocaleString()}</span>
                      <span>Failed: {Math.round(selectedNotification.recipientCount * (100 - selectedNotification.deliveryRate) / 100).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {selectedNotification.failureReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Failure Reason</p>
                        <p className="text-sm text-red-800 mt-1">{selectedNotification.failureReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            {selectedNotification?.status === 'Failed' && (
              <Button 
                onClick={() => {
                  handleRetry(selectedNotification);
                  setShowViewDialog(false);
                }}
                className="bg-[#195440] hover:bg-[#195440]/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Notification
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
