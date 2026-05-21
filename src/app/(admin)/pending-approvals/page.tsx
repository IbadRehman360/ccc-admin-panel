'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Building2, Megaphone, Users, Search, Filter, FileText, Image as ImageIcon, Calendar, DollarSign, MapPin, Phone, Mail, ExternalLink, AlertCircle, Download, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const businessClaimsData = [
  { 
    id: 1, 
    businessName: 'Green Valley Grocery', 
    claimant: 'Sarah Johnson', 
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    date: '2026-02-15', 
    status: 'Pending', 
    type: 'Ownership Claim',
    category: 'Retail',
    address: '123 Main St, New York, NY 10001',
    documents: [
      { name: 'Business License.pdf', type: 'Business License', uploadDate: '2026-02-15', size: '2.4 MB', status: 'Verified' },
      { name: 'Tax ID.pdf', type: 'Tax Document', uploadDate: '2026-02-15', size: '1.2 MB', status: 'Verified' },
      { name: 'Proof of Ownership.pdf', type: 'Ownership Document', uploadDate: '2026-02-15', size: '3.1 MB', status: 'Pending Review' }
    ],
    description: 'I am the owner of this grocery store and would like to claim this business profile to manage it.',
    currentOwner: 'Unclaimed',
    verificationStatus: 'Documents Submitted'
  },
  { 
    id: 2, 
    businessName: 'Tech Solutions Inc', 
    claimant: 'Michael Chen', 
    email: 'm.chen@email.com',
    phone: '+1 (555) 234-5678',
    date: '2026-02-14', 
    status: 'Pending', 
    type: 'Business Registration',
    category: 'Technology',
    address: '456 Tech Blvd, San Francisco, CA 94102',
    documents: [
      { name: 'EIN Document.pdf', type: 'Tax Document', uploadDate: '2026-02-14', size: '1.8 MB', status: 'Verified' },
      { name: 'Articles of Incorporation.pdf', type: 'Legal Document', uploadDate: '2026-02-14', size: '2.2 MB', status: 'Verified' }
    ],
    description: 'Registering our technology consulting business on the platform.',
    currentOwner: 'N/A',
    verificationStatus: 'Pending Review'
  },
  { 
    id: 3, 
    businessName: 'Downtown Cafe', 
    claimant: 'Emily Rodriguez', 
    email: 'emily.r@email.com',
    phone: '+1 (555) 345-6789',
    date: '2026-02-13', 
    status: 'Pending', 
    type: 'Ownership Claim',
    category: 'Food & Dining',
    address: '789 Coffee St, Seattle, WA 98101',
    documents: [
      { name: 'Business License.pdf', type: 'Business License', uploadDate: '2026-02-13', size: '2.1 MB', status: 'Verified' },
      { name: 'Lease Agreement.pdf', type: 'Legal Document', uploadDate: '2026-02-13', size: '1.5 MB', status: 'Pending Review' }
    ],
    description: 'Claiming our family-owned cafe that has been operating for 5 years.',
    currentOwner: 'Unclaimed',
    verificationStatus: 'Documents Submitted'
  },
  { 
    id: 4, 
    businessName: 'Fitness Pro Gym', 
    claimant: 'James Wilson', 
    email: 'j.wilson@email.com',
    phone: '+1 (555) 456-7890',
    date: '2026-02-12', 
    status: 'Pending', 
    type: 'Business Registration',
    category: 'Health & Fitness',
    address: '321 Workout Ave, Los Angeles, CA 90001',
    documents: [
      { name: 'Business License.pdf', type: 'Business License', uploadDate: '2026-02-12', size: '2.3 MB', status: 'Verified' },
      { name: 'Insurance Certificate.pdf', type: 'Insurance Document', uploadDate: '2026-02-12', size: '1.9 MB', status: 'Verified' },
      { name: 'Tax ID.pdf', type: 'Tax Document', uploadDate: '2026-02-12', size: '1.1 MB', status: 'Verified' }
    ],
    description: 'New gym opening next month, registering business profile.',
    currentOwner: 'N/A',
    verificationStatus: 'Pending Review'
  },
  { 
    id: 5, 
    businessName: 'Beauty Salon Elite', 
    claimant: 'Lisa Martinez', 
    email: 'l.martinez@email.com',
    phone: '+1 (555) 567-8901',
    date: '2026-02-11', 
    status: 'Pending', 
    type: 'Ownership Claim',
    category: 'Beauty & Wellness',
    address: '654 Style Blvd, Miami, FL 33101',
    documents: [
      { name: 'Business License.pdf', type: 'Business License', uploadDate: '2026-02-11', size: '2.0 MB', status: 'Verified' },
      { name: 'Cosmetology License.pdf', type: 'Professional License', uploadDate: '2026-02-11', size: '1.7 MB', status: 'Verified' }
    ],
    description: 'Owner of this beauty salon since 2020, claiming business profile.',
    currentOwner: 'Unclaimed',
    verificationStatus: 'Documents Submitted'
  },
];

const adApprovalsData = [
  { 
    id: 1, 
    businessName: 'Nike Sports', 
    businessUrl: 'https://www.nike.com',
    businessContact: 'John Smith',
    advertiser: 'Nike Sports', 
    adTitle: 'Summer Sale Campaign', 
    budget: '$5,000', 
    startDate: '2026-02-20', 
    endDate: '2026-03-20', 
    status: 'Pending',
    adType: 'Banner Ad',
    targetAudience: 'Ages 18-35, Sports Enthusiasts',
    adContent: 'Up to 50% off on all summer sports gear. Limited time offer!',
    targetLocations: 'New York, Los Angeles, Chicago',
    dailyBudget: '$166.67',
    estimatedReach: '500K - 750K',
    adFormat: 'Image + Text',
    landingUrl: 'https://nike.com/summer-sale'
  },
  { 
    id: 2, 
    businessName: 'Local Restaurant', 
    businessUrl: 'https://www.localrestaurant.com',
    businessContact: 'Maria Rodriguez',
    advertiser: 'Local Restaurant', 
    adTitle: 'Grand Opening Special', 
    budget: '$1,200', 
    startDate: '2026-02-18', 
    endDate: '2026-03-05', 
    status: 'Pending',
    adType: 'Sponsored Post',
    targetAudience: 'Ages 25-55, Food Lovers',
    adContent: 'Join us for our grand opening! 20% off all menu items for the first week.',
    targetLocations: 'Seattle, WA',
    dailyBudget: '$75.00',
    estimatedReach: '50K - 100K',
    adFormat: 'Image + Text',
    landingUrl: 'https://localrestaurant.com/opening'
  },
  { 
    id: 3, 
    businessName: 'Tech Store', 
    businessUrl: 'https://www.techstore.com',
    businessContact: 'David Chen',
    advertiser: 'Tech Store', 
    adTitle: 'New Product Launch', 
    budget: '$3,500', 
    startDate: '2026-02-22', 
    endDate: '2026-04-01', 
    status: 'Pending',
    adType: 'Video Ad',
    targetAudience: 'Ages 20-45, Tech Enthusiasts',
    adContent: 'Introducing the latest smartphones and gadgets. Pre-order now!',
    targetLocations: 'San Francisco, Austin, Boston',
    dailyBudget: '$89.74',
    estimatedReach: '300K - 500K',
    adFormat: 'Video + Text',
    landingUrl: 'https://techstore.com/new-products'
  },
  { 
    id: 4, 
    businessName: 'Fashion Boutique', 
    businessUrl: 'https://www.fashionboutique.com',
    businessContact: 'Sarah Williams',
    advertiser: 'Fashion Boutique', 
    adTitle: 'Winter Clearance', 
    budget: '$2,000', 
    startDate: '2026-02-19', 
    endDate: '2026-03-10', 
    status: 'Pending',
    adType: 'Carousel Ad',
    targetAudience: 'Ages 18-40, Fashion Forward',
    adContent: 'Final winter clearance! Up to 70% off on selected items.',
    targetLocations: 'Miami, Atlanta, Dallas',
    dailyBudget: '$100.00',
    estimatedReach: '150K - 250K',
    adFormat: 'Multiple Images + Text',
    landingUrl: 'https://fashionboutique.com/clearance'
  },
];

const communityApprovalsData = [
  { 
    id: 1, 
    communityName: 'Local Business Owners Network',
    communityImage: 'https://images.unsplash.com/photo-1764726354739-1222d1ea5b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBncm91cHxlbnwxfHx8fDE3NzI0NzgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: '500',
    creator: 'John Smith',
    creatorEmail: 'john.smith@email.com',
    members: '0', 
    category: 'Business', 
    createdDate: '2026-02-16', 
    status: 'Pending',
    description: 'A community for local business owners to network, share resources, and support each other. We aim to foster collaboration and growth among small businesses in our area.',
    guidelines: 'Be respectful, no spam, business-related discussions only',
    isPrivate: false,
    targetAudience: 'Business Owners, Entrepreneurs',
    expectedMembers: '500+',
    contentPolicy: 'Professional business content only'
  },
  { 
    id: 2, 
    communityName: 'Green Living Advocates',
    communityImage: 'https://images.unsplash.com/photo-1755606159507-a98b20d06578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGxpdmluZyUyMHN1c3RhaW5hYmxlfGVufDF8fHx8MTc3MjQ3ODM1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: '1000',
    creator: 'Maria Garcia',
    creatorEmail: 'maria.g@email.com',
    members: '0', 
    category: 'Lifestyle', 
    createdDate: '2026-02-15', 
    status: 'Pending',
    description: 'Join us in our mission to promote sustainable living, eco-friendly practices, and environmental awareness. Share tips, resources, and inspiration for a greener lifestyle.',
    guidelines: 'Respectful discussions, share sustainable living tips, no promotional content',
    isPrivate: false,
    targetAudience: 'Eco-conscious individuals',
    expectedMembers: '1000+',
    contentPolicy: 'Environmental and sustainability topics only'
  },
  { 
    id: 3, 
    communityName: 'Tech Entrepreneurs Hub',
    communityImage: 'https://images.unsplash.com/photo-1733925457822-64c3e048fa1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZW50cmVwcmVuZXVycyUyMHN0YXJ0dXB8ZW58MXx8fHwxNzcyNDc4MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: '300',
    creator: 'David Lee',
    creatorEmail: 'david.lee@email.com',
    members: '0', 
    category: 'Technology', 
    createdDate: '2026-02-14', 
    status: 'Pending',
    description: 'A community for tech entrepreneurs to connect, share startup experiences, discuss funding opportunities, and collaborate on innovative projects.',
    guidelines: 'Professional conduct, no spam, tech startup discussions',
    isPrivate: true,
    targetAudience: 'Tech Entrepreneurs, Startup Founders',
    expectedMembers: '300+',
    contentPolicy: 'Tech startup and entrepreneurship content'
  },
  { 
    id: 4, 
    communityName: 'Fitness Enthusiasts',
    communityImage: 'https://images.unsplash.com/photo-1561579890-3ace74d8e378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGdyb3VwfGVufDF8fHx8MTc3MjQ3ODM1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: '2000',
    creator: 'Rachel Brown',
    creatorEmail: 'rachel.b@email.com',
    members: '0', 
    category: 'Health', 
    createdDate: '2026-02-13', 
    status: 'Pending',
    description: 'Connect with fellow fitness lovers, share workout routines, nutrition tips, and motivate each other to reach health goals.',
    guidelines: 'Support each other, share fitness tips, no body shaming',
    isPrivate: false,
    targetAudience: 'Fitness Enthusiasts, Health-conscious individuals',
    expectedMembers: '2000+',
    contentPolicy: 'Fitness, health, and wellness content'
  },
  { 
    id: 5, 
    communityName: 'Food Lovers Club',
    communityImage: 'https://images.unsplash.com/photo-1676272650338-faaea8e5e5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwY29va2luZyUyMGN1bGluYXJ5fGVufDF8fHx8MTc3MjQ0Mzk2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberLimit: '1500',
    creator: 'Carlos Mendez',
    creatorEmail: 'carlos.m@email.com',
    members: '0', 
    category: 'Food & Dining', 
    createdDate: '2026-02-12', 
    status: 'Pending',
    description: 'Share recipes, restaurant recommendations, cooking tips, and celebrate the joy of food together.',
    guidelines: 'Share food content, be respectful, give credit to original recipes',
    isPrivate: false,
    targetAudience: 'Food lovers, Home cooks, Foodies',
    expectedMembers: '1500+',
    contentPolicy: 'Food, cooking, and dining content'
  },
];

export default function PendingApprovalsPage() {
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<'claims' | 'ads' | 'communities'>('claims');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleAction = (item: any, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setDialogAction(action);
    setShowActionDialog(true);
  };

  const handleView = (item: any, tab: 'claims' | 'ads' | 'communities') => {
    setViewItem(item);
    setCurrentTab(tab);
    setShowViewDialog(true);
  };

  const handleConfirmAction = () => {
    console.log(`${dialogAction} action confirmed for:`, selectedItem);
    if (dialogAction === 'reject' && rejectionReason) {
      console.log('Rejection reason:', rejectionReason);
    }
    setShowActionDialog(false);
    setRejectionReason('');
  };

  const filteredBusinessClaims = businessClaimsData.filter(claim => {
    const matchesSearch = claim.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         claim.claimant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || claim.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredAds = adApprovalsData.filter(ad => {
    const matchesSearch = ad.advertiser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.adTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || ad.adType === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredCommunities = communityApprovalsData.filter(community => {
    const matchesSearch = community.communityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || community.category === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600 mt-2">Review and manage all pending approval requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Business Claims</CardTitle>
            <Building2 className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">89</div>
            <p className="text-sm text-gray-600 mt-1">Awaiting Review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ad Approvals</CardTitle>
            <Megaphone className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">78</div>
            <p className="text-sm text-gray-600 mt-1">Awaiting Review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Community Approvals</CardTitle>
            <Users className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">80</div>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Auto-Approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Different Approval Types */}
      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="claims">Business Claims (89)</TabsTrigger>
          <TabsTrigger value="ads">Ad Approvals (78)</TabsTrigger>
          <TabsTrigger value="communities">Communities (80)</TabsTrigger>
        </TabsList>

        {/* Business Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by business name or claimant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Ownership Claim">Ownership Claim</SelectItem>
                    <SelectItem value="Business Registration">Business Registration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Claims & Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Claimant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBusinessClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.businessName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{claim.claimant}</div>
                            <div className="text-xs text-gray-500">{claim.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{claim.type}</Badge>
                        </TableCell>
                        <TableCell>{claim.category}</TableCell>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>
                          <Badge className="bg-[#E1B047]">{claim.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(claim, 'claims')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#195440] hover:bg-[#195440]/90"
                              onClick={() => handleAction(claim, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(claim, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ad Approvals Tab */}
        <TabsContent value="ads" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by advertiser or ad title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Banner Ad">Banner Ad</SelectItem>
                    <SelectItem value="Sponsored Post">Sponsored Post</SelectItem>
                    <SelectItem value="Video Ad">Video Ad</SelectItem>
                    <SelectItem value="Carousel Ad">Carousel Ad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advertisement Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Advertiser</TableHead>
                      <TableHead>Ad Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAds.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.advertiser}</TableCell>
                        <TableCell>{ad.adTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ad.adType}</Badge>
                        </TableCell>
                        <TableCell>{ad.budget}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {ad.startDate} to {ad.endDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#E1B047]">{ad.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(ad, 'ads')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#195440] hover:bg-[#195440]/90"
                              onClick={() => handleAction(ad, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(ad, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Approvals Tab */}
        <TabsContent value="communities" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by community name or creator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Community Name</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Privacy</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommunities.map((community) => (
                      <TableRow key={community.id}>
                        <TableCell className="font-medium">{community.communityName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{community.creator}</div>
                            <div className="text-xs text-gray-500">{community.creatorEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{community.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={community.isPrivate ? 'secondary' : 'default'}>
                            {community.isPrivate ? 'Private' : 'Public'}
                          </Badge>
                        </TableCell>
                        <TableCell>{community.createdDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">Approved</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(community, 'communities')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Badge className="bg-green-600 text-white px-4 py-1.5">
                              <CheckCircle className="w-4 h-4 mr-1 inline" />
                              Auto-Approved
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {currentTab === 'claims' && 'Business Claim Details'}
              {currentTab === 'ads' && 'Advertisement Details'}
              {currentTab === 'communities' && 'Community Details'}
            </DialogTitle>
            <DialogDescription>
              Review all information before making a decision
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-6">
            {/* Business Claim Details */}
            {currentTab === 'claims' && viewItem && (
              <div className="space-y-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Business Name</Label>
                  <p className="font-medium text-lg">{viewItem.businessName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Category</Label>
                  <p className="font-medium">{viewItem.category}</p>
                </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-gray-600">Claimant Information</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{viewItem.claimant}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{viewItem.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{viewItem.phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-gray-600">Business Address</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p>{viewItem.address}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-gray-600">Claim Type & Status</Label>
                  <div className="flex gap-4 mt-2">
                    <Badge variant="outline" className="text-sm">{viewItem.type}</Badge>
                    <Badge className="bg-[#E1B047] text-sm">{viewItem.verificationStatus}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-gray-600">Description</Label>
                  <p className="mt-2 text-sm">{viewItem.description}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-gray-600">Submitted Documents ({viewItem.documents.length})</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedDocument(viewItem);
                        setShowDocumentsDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View All Documents
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {viewItem.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="w-5 h-5 text-[#195440]" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{doc.name}</span>
                              <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">Size: {doc.size}</span>
                              <span className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={doc.status === 'Verified' ? 'default' : 'secondary'}
                            className={doc.status === 'Verified' ? 'bg-[#195440]' : ''}
                          >
                            {doc.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Verification Checklist</p>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                        <li>Verify business license is valid and matches business name</li>
                        <li>Confirm claimant's identity and ownership documents</li>
                        <li>Check if business address is accurate</li>
                        <li>Review tax ID and ensure it matches business records</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ad Details */}
            {currentTab === 'ads' && viewItem && (
              <div className="space-y-6 py-6">
                {/* Business Information */}
                <div>
                  <Label className="text-gray-600 mb-3 block">Business Information</Label>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="font-medium text-lg text-[#195440]">{viewItem.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business URL</p>
                      <a 
                        href={viewItem.businessUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline break-all"
                      >
                        {viewItem.businessUrl}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Contact</p>
                      <p className="font-medium">{viewItem.businessContact}</p>
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
                      <p className="font-bold text-blue-900">{viewItem.startDate}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <Calendar className="w-5 h-5 text-orange-600 mb-2" />
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-bold text-orange-900">{viewItem.endDate}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-green-900">{viewItem.budget}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Community Details */}
            {currentTab === 'communities' && viewItem && (
              <div className="space-y-6 py-6">
                {/* Community Image */}
                <div>
                  <Label className="text-gray-600 mb-2 block">Community Image</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                    <img 
                      src={viewItem.communityImage} 
                      alt={viewItem.communityName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <Separator />

                {/* Community Name */}
                <div>
                  <Label className="text-gray-600">Community Name</Label>
                  <p className="font-medium text-lg text-[#195440] mt-1">{viewItem.communityName}</p>
                </div>

                <Separator />

                {/* Member Limits */}
                <div>
                  <Label className="text-gray-600">Member Limits</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-5 h-5 text-gray-400" />
                    <p className="font-medium text-lg">{viewItem.memberLimit} members</p>
                  </div>
                </div>

                <Separator />

                {/* Privacy */}
                <div>
                  <Label className="text-gray-600">Privacy</Label>
                  <Badge 
                    variant={viewItem.isPrivate ? 'secondary' : 'default'} 
                    className={`mt-1 text-base px-4 py-1 ${viewItem.isPrivate ? 'bg-gray-600' : 'bg-[#195440]'}`}
                  >
                    {viewItem.isPrivate ? 'Private' : 'Public'}
                  </Badge>
                </div>

                <Separator />

                {/* Rules & Guidelines */}
                <div>
                  <Label className="text-gray-600">Rules & Guidelines</Label>
                  <p className="mt-2 text-sm bg-gray-50 p-4 rounded-lg border">{viewItem.guidelines}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            {currentTab !== 'communities' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowViewDialog(false);
                    handleAction(viewItem, 'reject');
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-[#195440] hover:bg-[#195440]/90"
                  onClick={() => {
                    setShowViewDialog(false);
                    handleAction(viewItem, 'approve');
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {currentTab === 'communities' && (
              <Badge className="bg-green-600 text-white px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Auto-Approved
              </Badge>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve'
                ? 'Are you sure you want to approve this request? This will activate the item immediately.'
                : 'Please provide a detailed reason for rejection. This will be sent to the requester.'}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            {dialogAction === 'reject' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Rejection Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter the reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Be specific and professional in your feedback</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={dialogAction === 'approve' ? 'bg-[#195440] hover:bg-[#195440]/90' : ''}
              variant={dialogAction === 'reject' ? 'destructive' : 'default'}
              disabled={dialogAction === 'reject' && !rejectionReason.trim()}
            >
              {dialogAction === 'approve' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Approval
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View All Documents Dialog - Enhanced */}
      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Submitted Documents Verification</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Comprehensive document review for {selectedDocument?.businessName || selectedDocument?.claimant}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 sm:px-6">
            {selectedDocument && (
              <div className="space-y-3 sm:space-y-6 py-3 sm:py-6">
                {/* Document Summary Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <Card>
                  <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                    <div className="text-center">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#195440] mb-1 sm:mb-2" />
                      <p className="text-xl sm:text-3xl font-bold text-[#195440]">{selectedDocument.documents.length}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Total Documents</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                    <div className="text-center">
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-green-600 mb-1 sm:mb-2" />
                      <p className="text-xl sm:text-3xl font-bold text-green-600">
                        {selectedDocument.documents.filter((d: any) => d.status === 'Verified').length}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Verified</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                    <div className="text-center">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-yellow-600 mb-1 sm:mb-2" />
                      <p className="text-xl sm:text-3xl font-bold text-yellow-600">
                        {selectedDocument.documents.filter((d: any) => d.status === 'Pending Review').length}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Pending Review</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                    <div className="text-center">
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#E1B047] mb-1 sm:mb-2" />
                      <p className="text-xl sm:text-3xl font-bold text-[#E1B047]">
                        {Math.round((selectedDocument.documents.filter((d: any) => d.status === 'Verified').length / selectedDocument.documents.length) * 100)}%
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Completion</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-2 sm:my-0" />

              {/* Claim Details Header */}
              <div className="bg-gradient-to-r from-[#195440]/10 to-[#E1B047]/10 border border-[#195440]/20 rounded-lg p-3 sm:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#195440] mb-2 sm:mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Business Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-600">Business Name</Label>
                        <p className="font-semibold text-sm sm:text-lg break-words">{selectedDocument.businessName}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Category</Label>
                          <p className="text-sm sm:text-base font-medium">{selectedDocument.category}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Claim Type</Label>
                          <p className="text-sm sm:text-base font-medium">{selectedDocument.type}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Address</Label>
                        <div className="flex items-start gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm">{selectedDocument.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#195440] mb-2 sm:mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      Claimant Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-600">Name</Label>
                        <p className="text-sm sm:text-base font-semibold">{selectedDocument.claimant}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Email</Label>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <p className="text-xs sm:text-sm break-all">{selectedDocument.email}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Phone</Label>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <p className="text-xs sm:text-sm">{selectedDocument.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Submission Date</Label>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-sm">{selectedDocument.date}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Verification Status</Label>
                        <Badge className="bg-[#E1B047] mt-1">{selectedDocument.verificationStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-2 sm:my-0" />

              {/* Submitted Documents List */}
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#195440]" />
                    Uploaded Documents ({selectedDocument.documents.length})
                  </h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Download All</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {selectedDocument.documents.map((doc: any, idx: number) => (
                    <div key={idx} className="border-2 rounded-xl p-3 sm:p-5 bg-white hover:shadow-md transition-all hover:border-[#195440]/30">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        {/* Document Icon */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#195440] to-[#195440]/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>

                        {/* Document Details */}
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
                            <div className="flex-1 w-full">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h4 className="font-bold text-base sm:text-lg text-gray-900">{doc.name}</h4>
                                <Badge variant="outline" className="border-[#195440] text-[#195440]">
                                  {doc.type}
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Uploaded: {doc.uploadDate}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Size: {doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={doc.status === 'Verified' ? 'default' : 'secondary'}
                              className={`${doc.status === 'Verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} flex items-center gap-1`}
                            >
                              {doc.status === 'Verified' ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                              {doc.status}
                            </Badge>
                          </div>

                          {/* Document Metadata */}
                          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs">
                              <div>
                                <Label className="text-[10px] sm:text-xs text-gray-500">Document ID</Label>
                                <p className="text-xs font-mono font-medium mt-0.5">DOC-{String(idx + 1).padStart(4, '0')}</p>
                              </div>
                              <div>
                                <Label className="text-[10px] sm:text-xs text-gray-500">Format</Label>
                                <p className="text-xs font-medium mt-0.5">PDF Document</p>
                              </div>
                              <div>
                                <Label className="text-[10px] sm:text-xs text-gray-500">Verification Level</Label>
                                <p className="text-xs font-medium mt-0.5">{doc.status === 'Verified' ? 'Level 2' : 'Pending'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Document Requirements */}
                          {doc.type === 'Business License' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-3">
                              <p className="text-[10px] sm:text-xs font-semibold text-blue-900 mb-1">Verification Requirements:</p>
                              <ul className="text-[10px] sm:text-xs text-blue-800 space-y-0.5 ml-3 sm:ml-4 list-disc">
                                <li>Valid business license number visible</li>
                                <li>Issue and expiration dates clearly shown</li>
                                <li>Business name matches application</li>
                                <li>Issued by authorized government agency</li>
                              </ul>
                            </div>
                          )}
                          {doc.type === 'Tax Document' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-3">
                              <p className="text-[10px] sm:text-xs font-semibold text-blue-900 mb-1">Verification Requirements:</p>
                              <ul className="text-[10px] sm:text-xs text-blue-800 space-y-0.5 ml-3 sm:ml-4 list-disc">
                                <li>Valid Tax ID/EIN number displayed</li>
                                <li>Business name matches other documents</li>
                                <li>Document is current and not expired</li>
                                <li>Issued by IRS or relevant tax authority</li>
                              </ul>
                            </div>
                          )}
                          {doc.type === 'Ownership Document' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-3">
                              <p className="text-[10px] sm:text-xs font-semibold text-blue-900 mb-1">Verification Requirements:</p>
                              <ul className="text-[10px] sm:text-xs text-blue-800 space-y-0.5 ml-3 sm:ml-4 list-disc">
                                <li>Proof of ownership or controlling interest</li>
                                <li>Owner name matches claimant information</li>
                                <li>Document is legally binding and notarized if required</li>
                                <li>Dates and signatures are valid</li>
                              </ul>
                            </div>
                          )}
                          {doc.type === 'Legal Document' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-3">
                              <p className="text-[10px] sm:text-xs font-semibold text-blue-900 mb-1">Verification Requirements:</p>
                              <ul className="text-[10px] sm:text-xs text-blue-800 space-y-0.5 ml-3 sm:ml-4 list-disc">
                                <li>Document is official and properly executed</li>
                                <li>All parties and dates are clearly identified</li>
                                <li>Complies with local legal requirements</li>
                                <li>Contains necessary signatures and seals</li>
                              </ul>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" className="flex-1 border-[#195440] text-[#195440] hover:bg-[#195440] hover:text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">View Document</span>
                              <span className="sm:hidden">View</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            {doc.status === 'Pending Review' && (
                              <Button size="sm" className="bg-[#195440] hover:bg-[#195440]/90 w-full sm:w-auto">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Mark as Verified</span>
                                <span className="sm:hidden">Verify</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-2 sm:my-0" />

              {/* Document Verification Checklist */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span>Document Verification Checklist</span>
                        <Badge variant="outline" className="text-[10px] sm:text-xs bg-white w-fit">Required</Badge>
                      </p>
                      <ul className="space-y-2 sm:space-y-2.5">
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>All documents are clear, legible, and complete</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Business name is consistent across all documents</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Documents are authentic with no signs of tampering</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>All required documents for {selectedDocument.type} are present</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Claimant identity matches document information</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Document dates are valid and not expired</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Document Security */}
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Document Security</p>
                        <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed">
                          All documents are encrypted using AES-256 encryption and stored in secure cloud storage. 
                          Access is logged for audit purposes. Only authorized administrators with proper clearance can view these documents.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required Documents Notice */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-yellow-900 mb-1">Required Documents for {selectedDocument.type}</p>
                        <ul className="text-[10px] sm:text-xs text-yellow-800 space-y-1 ml-3 sm:ml-4 list-disc">
                          {selectedDocument.type === 'Ownership Claim' ? (
                            <>
                              <li>Valid Business License</li>
                              <li>Proof of Ownership (Deed, Title, or Articles)</li>
                              <li>Government-issued Tax ID or EIN</li>
                              <li>Photo ID of claimant</li>
                            </>
                          ) : (
                            <>
                              <li>Business Registration Documents</li>
                              <li>Articles of Incorporation or LLC Formation</li>
                              <li>Tax ID/EIN Documentation</li>
                              <li>Business License (if applicable)</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDocumentsDialog(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setShowDocumentsDialog(false);
                handleAction(selectedDocument, 'reject');
              }}
              className="w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reject Documents</span>
              <span className="sm:hidden">Reject</span>
            </Button>
            <Button 
              className="bg-[#195440] hover:bg-[#195440]/90 w-full sm:w-auto"
              onClick={() => {
                setShowDocumentsDialog(false);
                handleAction(selectedDocument, 'approve');
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Approve All Documents</span>
              <span className="sm:hidden">Approve All</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
