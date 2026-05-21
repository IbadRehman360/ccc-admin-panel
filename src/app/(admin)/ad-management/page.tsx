'use client';

import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, TrendingUp, Calendar, DollarSign, BarChart3, Image as ImageIcon, Building2, MapPin, Mail, Phone, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const adsData = [
  {
    id: 'AD001',
    title: 'Annual Health Checkup - 50% Off',
    description: 'Get comprehensive health screening at half the price. Limited time offer for new patients.',
    business: {
      id: 'BUS001',
      name: 'Green Valley Healthcare',
      url: 'https://www.greenvalley.com',
      contact: 'Dr. Sarah Johnson',
      email: 'info@greenvalley.com',
      phone: '+1 (555) 123-4567',
      location: 'Downtown Medical Center, Suite 400'
    },
    banner: 'https://images.unsplash.com/photo-1764885415760-d3d8fff41fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMGJhbm5lcnxlbnwxfHx8fDE3NzE1MzczNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    budget: 5000,
    status: 'For Approval',
    submittedDate: '2026-02-18T14:30:00',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: []
  },
  {
    id: 'AD002',
    title: 'New Software Launch - Enterprise Solutions',
    description: 'Revolutionary cloud-based software for modern businesses. Book a demo today and get 3 months free!',
    business: {
      id: 'BUS002',
      name: 'TechCorp Solutions',
      url: 'https://www.techcorp.com',
      contact: 'Mike Chen',
      email: 'marketing@techcorp.com',
      phone: '+1 (555) 234-5678',
      location: 'Tech Park, Building 5'
    },
    banner: 'https://images.unsplash.com/photo-1581094653589-70923c3a198e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwc29mdHdhcmUlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzE1MzczNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    budget: 15000,
    status: 'Active',
    submittedDate: '2026-02-10T09:00:00',
    approvedDate: '2026-02-12T16:30:00',
    impressions: 123450,
    clicks: 6234,
    conversions: 456,
    engagement: 6690,
    ctr: 5.05,
    moderationHistory: [
      { action: 'Approved', by: 'Super Admin', date: '2026-02-12T16:30:00', reason: 'Ad content meets all guidelines' }
    ]
  },
  {
    id: 'AD003',
    title: 'Transform Your Body - New Year Special',
    description: 'Join now and get 50% off on annual membership. Personal training included!',
    business: {
      id: 'BUS003',
      name: 'Elite Fitness Center',
      url: 'https://www.elitefitness.com',
      contact: 'James Wilson',
      email: 'hello@elitefitness.com',
      phone: '+1 (555) 345-6789',
      location: '123 Fitness Avenue'
    },
    banner: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NzE0MTQ4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    budget: 8000,
    status: 'Upcoming',
    submittedDate: '2026-02-17T11:20:00',
    approvedDate: '2026-02-18T10:00:00',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: [
      { action: 'Approved', by: 'Admin', date: '2026-02-18T10:00:00', reason: 'Approved for scheduled launch' }
    ]
  },
  {
    id: 'AD004',
    title: 'Authentic Italian Cuisine - Grand Opening',
    description: 'Experience authentic Italian dining in the heart of the city. 20% off for opening week!',
    business: {
      id: 'BUS004',
      name: 'La Bella Italia Restaurant',
      url: 'https://www.labellaitalia.com',
      contact: 'Chef Carlos Romano',
      email: 'info@labellaitalia.com',
      phone: '+1 (555) 456-7890',
      location: '456 Main Street'
    },
    banner: 'https://images.unsplash.com/photo-1762922425226-8cfe6987e7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NzE0NTA3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-20',
    endDate: '2026-03-20',
    budget: 6000,
    status: 'Active',
    submittedDate: '2026-02-15T13:45:00',
    approvedDate: '2026-02-16T09:30:00',
    impressions: 67890,
    clicks: 3456,
    conversions: 234,
    engagement: 3690,
    ctr: 5.09,
    moderationHistory: [
      { action: 'Approved', by: 'Admin', date: '2026-02-16T09:30:00', reason: 'All guidelines met' }
    ]
  },
  {
    id: 'AD005',
    title: 'Luxury Homes - Exclusive Listings',
    description: 'Premium properties in prime locations. Schedule a private viewing today!',
    business: {
      id: 'BUS005',
      name: 'Premium Real Estate Group',
      url: 'https://www.premiumrealty.com',
      contact: 'Jennifer Martinez',
      email: 'sales@premiumrealty.com',
      phone: '+1 (555) 567-8901',
      location: 'Luxury Plaza, Floor 10'
    },
    banner: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwcHJvcGVydHl8ZW58MXx8fHwxNzcxNDc5MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-10',
    endDate: '2026-05-10',
    budget: 20000,
    status: 'Active',
    submittedDate: '2026-02-05T10:00:00',
    approvedDate: '2026-02-07T14:15:00',
    impressions: 156780,
    clicks: 8934,
    conversions: 567,
    engagement: 9501,
    ctr: 5.70,
    moderationHistory: [
      { action: 'Approved', by: 'Super Admin', date: '2026-02-07T14:15:00', reason: 'Premium ad campaign approved' }
    ]
  },
  {
    id: 'AD006',
    title: 'Summer Coding Bootcamp - Enroll Now',
    description: 'Learn web development in 12 weeks. Career services and job placement assistance included.',
    business: {
      id: 'BUS006',
      name: 'TechLearn Academy',
      url: 'https://www.techlearn.edu',
      contact: 'Dr. Robert Anderson',
      email: 'admissions@techlearn.edu',
      phone: '+1 (555) 678-9012',
      location: 'Education Campus, Block A'
    },
    banner: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMHNjaG9vbHxlbnwxfHx8fDE3NzE1MzczNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-18T08:00:00',
    endDate: '2026-02-24T08:00:00',
    budget: 3500,
    status: 'For Approval',
    submittedDate: '2026-02-17T16:20:00',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: []
  },
  {
    id: 'AD007',
    title: 'Paradise Resort - Summer Vacation Deals',
    description: 'Book your dream vacation now! All-inclusive packages with up to 40% discount.',
    business: {
      id: 'BUS007',
      name: 'Paradise Resorts International',
      url: 'https://www.paradiseresorts.com',
      contact: 'Lisa Wang',
      email: 'bookings@paradiseresorts.com',
      phone: '+1 (555) 789-0123',
      location: 'Beachfront Property'
    },
    banner: 'https://images.unsplash.com/photo-1762379972539-5ec4bd21d680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB2YWNhdGlvbiUyMGhvdGVsfGVufDF8fHx8MTc3MTUzNzM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    budget: 12000,
    status: 'Upcoming',
    submittedDate: '2026-02-16T09:30:00',
    approvedDate: '2026-02-17T11:00:00',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: [
      { action: 'Approved', by: 'Admin', date: '2026-02-17T11:00:00', reason: 'Approved for scheduled campaign' }
    ]
  },
  {
    id: 'AD008',
    title: 'Limited Time Sale - 70% OFF Everything!',
    description: 'HUGE DISCOUNT! EVERYTHING MUST GO! Click now to claim your discount! Limited time only!!!',
    business: {
      id: 'BUS008',
      name: 'Suspicious Online Store',
      url: 'https://www.suspicious.com',
      contact: 'Anonymous Seller',
      email: 'sales@suspicious.com',
      phone: 'N/A',
      location: 'Unknown'
    },
    banner: 'https://images.unsplash.com/photo-1705675451868-014a161e591b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZXxlbnwxfHx8fDE3NzE1MjI5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-19',
    endDate: '2026-03-19',
    budget: 2000,
    status: 'Rejected',
    submittedDate: '2026-02-17T14:00:00',
    rejectedDate: '2026-02-18T09:15:00',
    rejectionReason: 'Ad content violates our advertising policies: 1) Misleading claims with excessive use of urgency tactics and all-caps text. 2) Unverifiable business information - missing proper contact details and business location. 3) Unrealistic discount percentages that may indicate fraudulent activity. Please revise the ad with accurate business information, realistic offers, and professional copy before resubmitting.',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: [
      { action: 'Rejected', by: 'Super Admin', date: '2026-02-18T09:15:00', reason: 'Misleading content and unverifiable business information' }
    ]
  },
  {
    id: 'AD009',
    title: 'Get Rich Quick - Easy Money System',
    description: 'Make $10,000 per day from home! No experience needed! Click here to start earning now!',
    business: {
      id: 'BUS009',
      name: 'Fast Money Inc',
      url: 'https://www.fastmoney.com',
      contact: 'Scam Artist',
      email: 'money@scam.com',
      phone: 'N/A',
      location: 'N/A'
    },
    banner: 'https://images.unsplash.com/photo-1581094653589-70923c3a198e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwc29mdHdhcmUlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzE1MzczNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-20',
    endDate: '2026-03-20',
    budget: 1000,
    status: 'Rejected',
    submittedDate: '2026-02-16T15:30:00',
    rejectedDate: '2026-02-16T16:00:00',
    rejectionReason: 'CRITICAL VIOLATION: This ad promotes a "get rich quick" scheme which is prohibited on our platform. The content contains: 1) Unrealistic earnings claims ($10,000/day). 2) Characteristics of a financial scam. 3) No legitimate business verification. This type of fraudulent advertising is permanently banned. Do not resubmit.',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: [
      { action: 'Rejected', by: 'Super Admin', date: '2026-02-16T16:00:00', reason: 'Financial scam - permanently banned' }
    ]
  },
  {
    id: 'AD010',
    title: 'Spring Fashion Collection - New Arrivals',
    description: 'Discover the latest trends in fashion. Shop our new spring collection with free shipping!',
    business: {
      id: 'BUS010',
      name: 'Elegant Boutique',
      contact: 'Emma Davis',
      email: 'shop@elegantboutique.com',
      phone: '+1 (555) 890-1234',
      location: 'Fashion District, Store 201'
    },
    banner: 'https://images.unsplash.com/photo-1705675451868-014a161e591b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZXxlbnwxfHx8fDE3NzE1MjI5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    startDate: '2026-02-19T06:00:00',
    endDate: '2026-02-22T06:00:00',
    budget: 4500,
    status: 'For Approval',
    submittedDate: '2026-02-18T10:30:00',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    ctr: 0,
    moderationHistory: []
  }
];

export default function AdsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('for-approval');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-[#195440]">Active</Badge>;
      case 'For Approval':
        return <Badge className="bg-[#E1B047]">For Approval</Badge>;
      case 'Upcoming':
        return <Badge className="bg-blue-600">Upcoming</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'Expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (ad: any) => {
    setSelectedAd(ad);
    setShowDetailsDialog(true);
  };

  const handleApprove = (ad: any) => {
    setSelectedAd(ad);
    setShowApproveDialog(true);
  };

  const handleReject = (ad: any) => {
    setSelectedAd(ad);
    setShowRejectDialog(true);
  };

  const handleViewPerformance = (ad: any) => {
    setSelectedAd(ad);
    setShowPerformanceDialog(true);
  };

  const confirmApprove = () => {
    // Log moderation action
    console.log('Ad Approved:', {
      adId: selectedAd.id,
      adTitle: selectedAd.title,
      businessName: selectedAd.business.name,
      businessId: selectedAd.business.id,
      startDate: selectedAd.startDate,
      endDate: selectedAd.endDate,
      budget: selectedAd.budget,
      timestamp: new Date().toISOString(),
      approvedBy: 'Current Admin'
    });
    setShowApproveDialog(false);
  };

  const confirmReject = () => {
    // Log moderation action
    console.log('Ad Rejected:', {
      adId: selectedAd.id,
      adTitle: selectedAd.title,
      businessName: selectedAd.business.name,
      businessId: selectedAd.business.id,
      rejectionReason: rejectionReason,
      timestamp: new Date().toISOString(),
      rejectedBy: 'Current Admin'
    });
    setShowRejectDialog(false);
    setRejectionReason('');
  };

  // Filter ads
  const filterAdsByStatus = (status: string) => {
    let filtered = adsData.filter(ad => ad.status === status);
    
    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(ad => {
        const submitDate = new Date(ad.submittedDate);
        if (dateFilter === 'today') {
          return submitDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return submitDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return submitDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered;
  };

  // Stats
  const activeAds = adsData.filter(ad => ad.status === 'Active').length;
  const upcomingAds = adsData.filter(ad => ad.status === 'Upcoming').length;
  const forApprovalAds = adsData.filter(ad => ad.status === 'For Approval').length;
  const rejectedAds = adsData.filter(ad => ad.status === 'Rejected').length;
  
  const totalImpressions = adsData.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = adsData.reduce((sum, ad) => sum + ad.clicks, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ads Management</h1>
        <p className="text-gray-600 mt-1">Review, approve, and monitor advertisement campaigns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{activeAds}</div>
            <p className="text-sm text-gray-600 mt-1">Active Ads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{upcomingAds}</div>
            <p className="text-sm text-gray-600 mt-1">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E1B047]">{forApprovalAds}</div>
            <p className="text-sm text-gray-600 mt-1">For Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{rejectedAds}</div>
            <p className="text-sm text-gray-600 mt-1">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{(totalImpressions / 1000).toFixed(1)}K</div>
            <p className="text-sm text-gray-600 mt-1">Impressions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalClicks.toLocaleString()}</div>
            <p className="text-sm text-gray-600 mt-1">Total Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{avgCTR}%</div>
            <p className="text-sm text-gray-600 mt-1">Avg CTR</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by ad title, business name, or ad ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ads Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="for-approval">
                For Approval ({filterAdsByStatus('For Approval').length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({filterAdsByStatus('Active').length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({filterAdsByStatus('Upcoming').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({filterAdsByStatus('Rejected').length})
              </TabsTrigger>
            </TabsList>

            {/* For Approval Tab */}
            <TabsContent value="for-approval" className="space-y-4 mt-6">
              {filterAdsByStatus('For Approval').length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No ads pending approval</p>
                </div>
              ) : (
                filterAdsByStatus('For Approval').map((ad) => (
                  <Card key={ad.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        {/* Banner Preview */}
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#E1B047]">
                            <img 
                              src={ad.banner} 
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(ad.status)}
                            </div>
                          </div>
                        </div>

                        {/* Ad Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{ad.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Business</p>
                                <p className="font-medium">{ad.business.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Schedule</p>
                                <p className="font-medium">{formatDate(ad.startDate)} - {formatDate(ad.endDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="font-medium">${ad.budget.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Submitted</p>
                                <p className="font-medium">{formatDate(ad.submittedDate)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(ad)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(ad)}
                              className="bg-[#195440] hover:bg-[#144435]"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(ad)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Active Tab */}
            <TabsContent value="active" className="space-y-4 mt-6">
              {filterAdsByStatus('Active').length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No active ads</p>
                </div>
              ) : (
                filterAdsByStatus('Active').map((ad) => (
                  <Card key={ad.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        {/* Banner Preview */}
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#195440]">
                            <img 
                              src={ad.banner} 
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(ad.status)}
                            </div>
                          </div>
                        </div>

                        {/* Ad Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{ad.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{ad.business.name}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mt-4">
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <div className="flex items-center gap-2 mb-1">
                                <Eye className="w-4 h-4 text-purple-600" />
                                <p className="text-xs text-gray-600">Impressions</p>
                              </div>
                              <p className="text-lg font-bold text-purple-600">{ad.impressions.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <p className="text-xs text-gray-600">Clicks</p>
                              </div>
                              <p className="text-lg font-bold text-green-600">{ad.clicks.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-4 h-4 text-orange-600" />
                                <p className="text-xs text-gray-600">CTR</p>
                              </div>
                              <p className="text-lg font-bold text-orange-600">{ad.ctr}%</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                <p className="text-xs text-gray-600">Conversions</p>
                              </div>
                              <p className="text-lg font-bold text-blue-600">{ad.conversions}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Ends: {formatDate(ad.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Budget: ${ad.budget.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(ad)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleViewPerformance(ad)}
                              className="bg-[#E1B047] hover:bg-[#c99a3a]"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Performance
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Upcoming Tab */}
            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {filterAdsByStatus('Upcoming').length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No upcoming ads</p>
                </div>
              ) : (
                filterAdsByStatus('Upcoming').map((ad) => (
                  <Card key={ad.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-blue-600">
                            <img 
                              src={ad.banner} 
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(ad.status)}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{ad.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{ad.business.name}</p>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Starts</p>
                                <p className="font-medium">{formatDate(ad.startDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="font-medium">${ad.budget.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => handleViewDetails(ad)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Rejected Tab */}
            <TabsContent value="rejected" className="space-y-4 mt-6">
              {filterAdsByStatus('Rejected').length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No rejected ads</p>
                </div>
              ) : (
                filterAdsByStatus('Rejected').map((ad) => (
                  <Card key={ad.id} className="overflow-hidden border-red-200">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-red-600">
                            <img 
                              src={ad.banner} 
                              alt={ad.title}
                              className="w-full h-full object-cover opacity-75"
                            />
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(ad.status)}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{ad.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{ad.business.name}</p>

                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <div className="flex items-start gap-2">
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-red-900 mb-1">Rejection Reason</p>
                                <p className="text-sm text-red-800">{ad.rejectionReason}</p>
                                <p className="text-xs text-gray-600 mt-2">
                                  Rejected on {formatDateTime(ad.rejectedDate ?? '')}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => handleViewDetails(ad)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Advertisement Details</DialogTitle>
            <DialogDescription>Business and campaign information</DialogDescription>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-6 px-6">
              {/* Business Information */}
              <div>
                <Label className="text-gray-600 mb-3 block">Business Information</Label>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium text-lg text-[#195440]">{selectedAd.business.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business URL</p>
                    <a 
                      href={selectedAd.business.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline break-all"
                    >
                      {selectedAd.business.url}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Contact</p>
                    <p className="font-medium">{selectedAd.business.contact}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Advertisement Dates & Amount */}
              <div>
                <Label className="text-gray-600 mb-3 block">Campaign Schedule & Budget</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-bold text-blue-900">{formatDate(selectedAd.startDate)}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <Calendar className="w-5 h-5 text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-bold text-orange-900">{formatDate(selectedAd.endDate)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-green-900">${selectedAd.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedAd && selectedAd.status === 'For Approval' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleReject(selectedAd);
                  }}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleApprove(selectedAd);
                  }}
                  className="bg-[#195440] hover:bg-[#144435]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Approve Advertisement
            </DialogTitle>
            <DialogDescription>
              Confirm approval of this advertisement campaign
            </DialogDescription>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium">Ad: {selectedAd.title}</p>
                <p className="text-xs text-gray-600 mt-1">Business: {selectedAd.business.name}</p>
                <p className="text-xs text-gray-600">Schedule: {formatDate(selectedAd.startDate)} - {formatDate(selectedAd.endDate)}</p>
                <p className="text-xs text-gray-600">Budget: ${selectedAd.budget.toLocaleString()}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ✓ Ad content reviewed and meets platform guidelines<br />
                  ✓ Business information verified<br />
                  ✓ Schedule and budget confirmed
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApprove}
              className="bg-[#195440] hover:bg-[#144435]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Reject Advertisement
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this advertisement
            </DialogDescription>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium">Ad: {selectedAd.title}</p>
                <p className="text-xs text-gray-600 mt-1">Business: {selectedAd.business.name}</p>
              </div>

              <div>
                <Label>Rejection Reason</Label>
                <Textarea
                  placeholder="Provide a detailed explanation for why this ad is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-2"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This message will be sent to the business via email.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Performance Dialog */}
      <Dialog open={showPerformanceDialog} onOpenChange={setShowPerformanceDialog}>
        <DialogContent className="w-[95vw] max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#E1B047]" />
              Ad Performance Metrics
            </DialogTitle>
            <DialogDescription>
              Detailed performance analysis for this campaign
            </DialogDescription>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-6" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-lg">{selectedAd.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedAd.business.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(selectedAd.startDate)} - {formatDate(selectedAd.endDate)}
                </p>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 text-center">
                  <Eye className="w-6 h-6 text-purple-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-purple-600">{selectedAd.impressions.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2">Impressions</p>
                  <p className="text-xs text-gray-500 mt-1">Total views</p>
                </div>
                <div className="bg-green-50 p-5 rounded-lg border border-green-200 text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-600">{selectedAd.clicks.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2">Clicks</p>
                  <p className="text-xs text-gray-500 mt-1">User clicks</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 text-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-600">{selectedAd.conversions}</p>
                  <p className="text-sm text-gray-600 mt-2">Conversions</p>
                  <p className="text-xs text-gray-500 mt-1">Goal completions</p>
                </div>
                <div className="bg-orange-50 p-5 rounded-lg border border-orange-200 text-center">
                  <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-orange-600">{selectedAd.ctr}%</p>
                  <p className="text-sm text-gray-600 mt-2">CTR</p>
                  <p className="text-xs text-gray-500 mt-1">Click-through rate</p>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Total Engagement</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedAd.engagement.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Budget Spent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${(selectedAd.budget * 0.65).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">of ${selectedAd.budget.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedAd.clicks > 0 ? ((selectedAd.conversions / selectedAd.clicks) * 100).toFixed(2) : 0}%
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium">
                  💡 Performance Insights
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                  <li>CTR is {selectedAd.ctr > 5 ? 'above' : 'below'} industry average (5%)</li>
                  <li>Campaign has reached {((selectedAd.impressions / 150000) * 100).toFixed(0)}% of target impressions</li>
                  <li>Engagement rate: {selectedAd.impressions > 0 ? ((selectedAd.engagement / selectedAd.impressions) * 100).toFixed(2) : 0}%</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPerformanceDialog(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
