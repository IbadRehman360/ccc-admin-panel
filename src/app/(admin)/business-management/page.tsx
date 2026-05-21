'use client';

import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Flag, Building2, MapPin, User, Mail, Phone, FileText, ExternalLink, Calendar, Star, Users, Clock, Shield, Ban, Trash2, AlertCircle, TrendingUp, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/layout/UserAvatar';

const businessesData = [
  {
    id: 'BUS001',
    name: 'Green Valley Healthcare',
    owner: 'Dr. Sarah Johnson',
    ownerEmail: 'sarah.j@greenvalley.com',
    ownerPhone: '+1 (555) 123-4567',
    category: 'Healthcare',
    type: 'Diverse-Owned',
    location: 'San Francisco, CA',
    address: '123 Health St, San Francisco, CA 94102',
    verified: true,
    status: 'Active',
    members: 234,
    followers: 1250,
    rating: 4.8,
    totalReviews: 145,
    joinedDate: '2025-11-15',
    lastActive: '2026-02-19',
    description: 'Comprehensive healthcare services with focus on preventive care and wellness. Family-owned diverse business serving the community for 10+ years.',
    website: 'https://greenvalleyhealthcare.com',
    businessHours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
    employeeCount: '25-50',
    yearEstablished: 2014,
    documents: [
      { name: 'Business License', status: 'Verified', uploadDate: '2025-11-15', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Verified', uploadDate: '2025-11-15', fileUrl: '#' },
      { name: 'Healthcare License', status: 'Verified', uploadDate: '2025-11-15', fileUrl: '#' },
      { name: 'Insurance Certificate', status: 'Verified', uploadDate: '2025-11-15', fileUrl: '#' },
      { name: 'Diverse Ownership Certification', status: 'Verified', uploadDate: '2025-11-16', fileUrl: '#' }
    ],
    verificationNotes: 'All documents verified. Business owner identity confirmed.',
    lastVerificationDate: '2025-11-20',
    verifiedBy: 'Admin (John Admin)'
  },
  {
    id: 'BUS002',
    name: 'TechCorp Solutions',
    owner: 'Michael Chen',
    ownerEmail: 'michael.chen@techcorp.com',
    ownerPhone: '+1 (555) 234-5678',
    category: 'Technology',
    type: 'Corporation',
    location: 'New York, NY',
    address: '456 Tech Blvd, New York, NY 10001',
    verified: true,
    status: 'Active',
    members: 567,
    followers: 3400,
    rating: 4.6,
    totalReviews: 289,
    joinedDate: '2025-09-20',
    lastActive: '2026-02-18',
    description: 'Leading technology solutions provider specializing in cloud computing and enterprise software development.',
    website: 'https://techcorpsolutions.com',
    businessHours: 'Mon-Fri: 9AM-5PM',
    employeeCount: '200-500',
    yearEstablished: 2010,
    documents: [
      { name: 'Business License', status: 'Verified', uploadDate: '2025-09-20', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Verified', uploadDate: '2025-09-20', fileUrl: '#' },
      { name: 'Articles of Incorporation', status: 'Verified', uploadDate: '2025-09-20', fileUrl: '#' },
      { name: 'Certificate of Good Standing', status: 'Verified', uploadDate: '2025-09-21', fileUrl: '#' }
    ],
    verificationNotes: 'Corporate documents verified. Public records confirmed.',
    lastVerificationDate: '2025-09-25',
    verifiedBy: 'Admin (Jane Admin)'
  },
  {
    id: 'BUS003',
    name: 'Bright Future Academy',
    owner: 'Jennifer Martinez',
    ownerEmail: 'j.martinez@brightfuture.edu',
    ownerPhone: '+1 (555) 345-6789',
    category: 'Education',
    type: 'Education',
    location: 'Austin, TX',
    address: '789 Learning Lane, Austin, TX 78701',
    verified: false,
    status: 'Pending',
    members: 89,
    followers: 450,
    rating: 4.9,
    totalReviews: 67,
    joinedDate: '2026-02-01',
    lastActive: '2026-02-19',
    description: 'Private educational institution offering K-12 programs with emphasis on STEM education and personalized learning.',
    website: 'https://brightfutureacademy.edu',
    businessHours: 'Mon-Fri: 7:30AM-4PM',
    employeeCount: '50-100',
    yearEstablished: 2018,
    documents: [
      { name: 'Business License', status: 'Pending Review', uploadDate: '2026-02-01', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Pending Review', uploadDate: '2026-02-01', fileUrl: '#' },
      { name: 'Educational License', status: 'Pending Review', uploadDate: '2026-02-01', fileUrl: '#' },
      { name: 'Accreditation Certificate', status: 'Pending Review', uploadDate: '2026-02-02', fileUrl: '#' },
      { name: 'Background Check Records', status: 'Pending Review', uploadDate: '2026-02-02', fileUrl: '#' }
    ],
    verificationNotes: 'Documents submitted, awaiting verification.',
    lastVerificationDate: null,
    verifiedBy: null
  },
  {
    id: 'BUS004',
    name: 'Community Health Center',
    owner: 'Dr. James Wilson',
    ownerEmail: 'j.wilson@communityhc.org',
    ownerPhone: '+1 (555) 456-7890',
    category: 'Healthcare',
    type: 'Diverse-Owned',
    location: 'Chicago, IL',
    address: '321 Care Ave, Chicago, IL 60601',
    verified: true,
    status: 'Active',
    members: 345,
    followers: 2100,
    rating: 4.7,
    totalReviews: 198,
    joinedDate: '2025-10-10',
    lastActive: '2026-02-19',
    description: 'Non-profit community health center providing affordable healthcare services to underserved populations.',
    website: 'https://communityhealthcenter.org',
    businessHours: 'Mon-Sun: 8AM-8PM',
    employeeCount: '100-200',
    yearEstablished: 2015,
    documents: [
      { name: 'Business License', status: 'Verified', uploadDate: '2025-10-10', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Verified', uploadDate: '2025-10-10', fileUrl: '#' },
      { name: 'Healthcare License', status: 'Verified', uploadDate: '2025-10-10', fileUrl: '#' },
      { name: '501(c)(3) Certificate', status: 'Verified', uploadDate: '2025-10-11', fileUrl: '#' },
      { name: 'Diverse Ownership Certification', status: 'Verified', uploadDate: '2025-10-11', fileUrl: '#' }
    ],
    verificationNotes: 'Non-profit status verified. All healthcare licenses current.',
    lastVerificationDate: '2025-10-15',
    verifiedBy: 'Admin (John Admin)'
  },
  {
    id: 'BUS005',
    name: 'Elite Business Consulting',
    owner: 'Robert Taylor',
    ownerEmail: 'r.taylor@elitebiz.com',
    ownerPhone: '+1 (555) 567-8901',
    category: 'Business Services',
    type: 'Corporation',
    location: 'Seattle, WA',
    address: '654 Consult Dr, Seattle, WA 98101',
    verified: false,
    status: 'Suspended',
    members: 123,
    followers: 890,
    rating: 3.8,
    totalReviews: 45,
    joinedDate: '2026-01-05',
    lastActive: '2026-02-10',
    description: 'Business consulting services for small to medium enterprises.',
    website: 'https://elitebusinessconsulting.com',
    businessHours: 'Mon-Fri: 9AM-6PM',
    employeeCount: '10-25',
    yearEstablished: 2020,
    documents: [
      { name: 'Business License', status: 'Expired', uploadDate: '2026-01-05', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Under Review', uploadDate: '2026-01-05', fileUrl: '#' },
      { name: 'Professional Liability Insurance', status: 'Missing', uploadDate: null, fileUrl: '#' }
    ],
    verificationNotes: 'Suspended due to expired business license and missing documents.',
    suspensionReason: 'Expired business license. Multiple documents missing or invalid.',
    suspendedDate: '2026-02-10',
    suspendedBy: 'Admin (Jane Admin)',
    lastVerificationDate: '2026-01-08',
    verifiedBy: null
  },
  {
    id: 'BUS006',
    name: 'Fresh Market Grocery',
    owner: 'Maria Garcia',
    ownerEmail: 'm.garcia@freshmarket.com',
    ownerPhone: '+1 (555) 678-9012',
    category: 'Retail',
    type: 'Diverse-Owned',
    location: 'Miami, FL',
    address: '987 Market St, Miami, FL 33101',
    verified: false,
    status: 'Pending',
    members: 156,
    followers: 780,
    rating: 4.5,
    totalReviews: 92,
    joinedDate: '2026-02-10',
    lastActive: '2026-02-19',
    description: 'Family-owned grocery store specializing in fresh produce and organic products.',
    website: 'https://freshmarketgrocery.com',
    businessHours: 'Mon-Sun: 7AM-10PM',
    employeeCount: '10-25',
    yearEstablished: 2019,
    documents: [
      { name: 'Business License', status: 'Pending Review', uploadDate: '2026-02-10', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Pending Review', uploadDate: '2026-02-10', fileUrl: '#' },
      { name: 'Food Handler Permit', status: 'Pending Review', uploadDate: '2026-02-10', fileUrl: '#' },
      { name: 'Health Inspection Certificate', status: 'Pending Review', uploadDate: '2026-02-11', fileUrl: '#' },
      { name: 'Diverse Ownership Certification', status: 'Pending Review', uploadDate: '2026-02-11', fileUrl: '#' }
    ],
    verificationNotes: 'All documents submitted. Pending admin review.',
    lastVerificationDate: null,
    verifiedBy: null
  },
  {
    id: 'BUS007',
    name: 'Metro University',
    owner: 'Dr. Patricia Brown',
    ownerEmail: 'p.brown@metrouniversity.edu',
    ownerPhone: '+1 (555) 789-0123',
    category: 'Education',
    type: 'Education',
    location: 'Boston, MA',
    address: '147 Campus Road, Boston, MA 02101',
    verified: true,
    status: 'Active',
    members: 1240,
    followers: 8500,
    rating: 4.8,
    totalReviews: 456,
    joinedDate: '2025-08-15',
    lastActive: '2026-02-19',
    description: 'Leading metropolitan university offering undergraduate and graduate programs across multiple disciplines.',
    website: 'https://metrouniversity.edu',
    businessHours: 'Mon-Fri: 8AM-6PM',
    employeeCount: '500+',
    yearEstablished: 1995,
    documents: [
      { name: 'Educational License', status: 'Verified', uploadDate: '2025-08-15', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Verified', uploadDate: '2025-08-15', fileUrl: '#' },
      { name: 'Regional Accreditation', status: 'Verified', uploadDate: '2025-08-16', fileUrl: '#' },
      { name: 'State Authorization', status: 'Verified', uploadDate: '2025-08-16', fileUrl: '#' }
    ],
    verificationNotes: 'University accreditation verified. All licenses current.',
    lastVerificationDate: '2025-08-20',
    verifiedBy: 'Admin (John Admin)'
  },
  {
    id: 'BUS008',
    name: 'Wellness Spa & Retreat',
    owner: 'Lisa Anderson',
    ownerEmail: 'l.anderson@wellnessspa.com',
    ownerPhone: '+1 (555) 890-1234',
    category: 'Healthcare',
    type: 'Diverse-Owned',
    location: 'San Diego, CA',
    address: '258 Relaxation Blvd, San Diego, CA 92101',
    verified: false,
    status: 'Flagged',
    members: 78,
    followers: 320,
    rating: 3.2,
    totalReviews: 28,
    joinedDate: '2026-02-05',
    lastActive: '2026-02-18',
    description: 'Holistic wellness center offering spa services and wellness retreats.',
    website: 'https://wellnessspa.com',
    businessHours: 'Mon-Sun: 9AM-7PM',
    employeeCount: '5-10',
    yearEstablished: 2023,
    documents: [
      { name: 'Business License', status: 'Questionable', uploadDate: '2026-02-05', fileUrl: '#' },
      { name: 'Tax ID (EIN)', status: 'Under Investigation', uploadDate: '2026-02-05', fileUrl: '#' },
      { name: 'Health Permit', status: 'Missing', uploadDate: null, fileUrl: '#' }
    ],
    verificationNotes: 'Flagged for suspicious activity and document inconsistencies.',
    flagReason: 'Multiple customer complaints about misleading health claims. Document verification issues detected.',
    flaggedDate: '2026-02-15',
    flaggedBy: 'Admin (Jane Admin)',
    lastVerificationDate: null,
    verifiedBy: null
  }
];

export default function BusinessManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | 'suspend' | 'activate' | 'delete' | 'flag' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [profileTab, setProfileTab] = useState('details');

  const filteredBusinesses = businessesData.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesType = typeFilter === 'all' || business.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || business.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Sort businesses
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'members':
        return b.members - a.members;
      case 'verification':
        return Number(b.verified) - Number(a.verified);
      default:
        return 0;
    }
  });

  const handleAction = (business: any, action: 'approve' | 'reject' | 'suspend' | 'activate' | 'delete' | 'flag') => {
    setSelectedBusiness(business);
    setDialogAction(action);
    setShowActionDialog(true);
  };

  const handleViewProfile = (business: any) => {
    setSelectedBusiness(business);
    setProfileTab('details');
    setShowProfileDialog(true);
  };

  const confirmAction = () => {
    console.log(`${dialogAction} business:`, selectedBusiness);
    if (actionReason) {
      console.log('Reason:', actionReason);
    }
    // Simulate notification
    console.log('Notification sent to business:', selectedBusiness?.ownerEmail);
    // Log in audit trail
    console.log('Action logged:', {
      action: dialogAction,
      businessId: selectedBusiness?.id,
      businessName: selectedBusiness?.name,
      reason: actionReason,
      timestamp: new Date().toISOString(),
      performedBy: 'Current Admin'
    });
    setShowActionDialog(false);
    setActionReason('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'Pending':
        return <Badge className="bg-[#E1B047]">Pending</Badge>;
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'Flagged':
        return <Badge className="bg-red-600">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalBusinesses = businessesData.length;
  const verifiedBusinesses = businessesData.filter(b => b.verified).length;
  const pendingBusinesses = businessesData.filter(b => b.status === 'Pending').length;
  const flaggedBusinesses = businessesData.filter(b => b.status === 'Flagged').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
        <p className="text-gray-600 mt-2">Manage and verify business listings across all categories</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Businesses
            </CardTitle>
            <Building2 className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3,892</div>
            <p className="text-sm text-gray-600 mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Verified
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#195440]">3,104</div>
            <p className="text-sm text-gray-600 mt-1">79.7% verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Verification
            </CardTitle>
            <Clock className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E1B047]">788</div>
            <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Flagged
            </CardTitle>
            <Flag className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">23</div>
            <p className="text-sm text-gray-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, owner, location, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Registration Date</SelectItem>
                  <SelectItem value="name">Business Name</SelectItem>
                  <SelectItem value="verification">Verification Status</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Business Services">Business Services</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Diverse-Owned">Diverse-Owned</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBusinesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium text-[#195440]">{business.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{business.name}</div>
                        {business.verified && (
                          <CheckCircle className="w-4 h-4 text-[#195440]" aria-label="Verified Business" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={business.owner} size="sm" />
                        <span className="text-gray-600">{business.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{business.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{business.type}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {business.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {business.verified ? (
                        <Badge className="bg-[#195440]">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(business.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(business)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {!business.verified && business.status === 'Pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleAction(business, 'approve')}
                              className="bg-[#195440] hover:bg-[#195440]/90"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleAction(business, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {business.status === 'Active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction(business, 'suspend')}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {business.status === 'Suspended' && (
                          <Button 
                            size="sm" 
                            className="bg-[#195440] hover:bg-[#195440]/90"
                            onClick={() => handleAction(business, 'activate')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Business Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Business Profile - {selectedBusiness?.name}
              {selectedBusiness?.verified && (
                <CheckCircle className="w-5 h-5 text-[#195440]" />
              )}
            </DialogTitle>
            <DialogDescription>
              Complete business information and verification details
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <Tabs value={profileTab} onValueChange={setProfileTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Business Details</TabsTrigger>
                <TabsTrigger value="documents">Documents & Verification</TabsTrigger>
              </TabsList>

              {/* Business Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6 px-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Business ID</Label>
                    <p className="font-medium text-[#195440]">{selectedBusiness.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedBusiness.status)}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Business Name</Label>
                      <p className="font-medium text-lg mt-1">{selectedBusiness.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Category</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{selectedBusiness.category}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Business Type</Label>
                      <div className="mt-1">
                        <Badge variant="secondary">{selectedBusiness.type}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Year Established</Label>
                      <p className="mt-1">{selectedBusiness.yearEstablished}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-600">Website</Label>
                      <a href={selectedBusiness.website} className="text-blue-600 hover:underline flex items-center gap-1 mt-1">
                        {selectedBusiness.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-gray-600">Description</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-4 rounded-lg">{selectedBusiness.description}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Owner Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Owner Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <UserAvatar name={selectedBusiness.owner} size="sm" />
                        <p className="font-medium">{selectedBusiness.owner}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Email Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p>{selectedBusiness.ownerEmail}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p>{selectedBusiness.ownerPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Location</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedBusiness.location}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedBusiness.address}</p>
                    </div>
                  </div>
                </div>

                {/* Suspension/Flag Info */}
                {selectedBusiness.status === 'Suspended' && selectedBusiness.suspensionReason && (
                  <>
                    <Separator />
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <Ban className="w-5 h-5" />
                        Suspension Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-red-700 font-medium">Reason: </span>
                          <span className="text-red-800">{selectedBusiness.suspensionReason}</span>
                        </div>
                        <div>
                          <span className="text-red-700 font-medium">Suspended On: </span>
                          <span className="text-red-800">{selectedBusiness.suspendedDate}</span>
                        </div>
                        <div>
                          <span className="text-red-700 font-medium">Suspended By: </span>
                          <span className="text-red-800">{selectedBusiness.suspendedBy}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedBusiness.status === 'Flagged' && selectedBusiness.flagReason && (
                  <>
                    <Separator />
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <Flag className="w-5 h-5" />
                        Flagged for Review
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-red-700 font-medium">Reason: </span>
                          <span className="text-red-800">{selectedBusiness.flagReason}</span>
                        </div>
                        <div>
                          <span className="text-red-700 font-medium">Flagged On: </span>
                          <span className="text-red-800">{selectedBusiness.flaggedDate}</span>
                        </div>
                        <div>
                          <span className="text-red-700 font-medium">Flagged By: </span>
                          <span className="text-red-800">{selectedBusiness.flaggedBy}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Documents & Verification Tab */}
              <TabsContent value="documents" className="space-y-6 mt-6 px-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Verification Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Verification Status</Label>
                      <div className="mt-1">
                        {selectedBusiness.verified ? (
                          <Badge className="bg-[#195440]">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                      </div>
                    </div>
                    {selectedBusiness.lastVerificationDate && (
                      <>
                        <div>
                          <Label className="text-gray-600">Last Verified</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p>{selectedBusiness.lastVerificationDate}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-gray-600">Verified By</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <p>{selectedBusiness.verifiedBy}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Submitted Documents</h3>
                  <div className="space-y-3">
                    {selectedBusiness.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-[#195440]" />
                            <div className="flex-1">
                              <p className="font-medium">{doc.name}</p>
                              {doc.uploadDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Uploaded: {doc.uploadDate}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={
                                doc.status === 'Verified' ? 'default' :
                                doc.status === 'Pending Review' ? 'secondary' :
                                'destructive'
                              }
                              className={doc.status === 'Verified' ? 'bg-[#195440]' : ''}
                            >
                              {doc.status}
                            </Badge>
                            {doc.uploadDate && (
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Verification Notes</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900">{selectedBusiness.verificationNotes}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!selectedBusiness.verified && selectedBusiness.status === 'Pending' && (
                  <div className="bg-[#E1B047]/10 border border-[#E1B047] rounded-lg p-4">
                    <h4 className="font-medium text-[#195440] mb-2">Document Review Checklist</h4>
                    <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                      <li>Verify all documents are current and not expired</li>
                      <li>Confirm business license matches business name and address</li>
                      <li>Check Tax ID (EIN) is valid and matches business records</li>
                      <li>Verify owner identity matches provided documentation</li>
                      <li>Ensure all required documents for business type are submitted</li>
                      <li>Check for any inconsistencies or red flags</li>
                    </ul>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
              Close
            </Button>
            {selectedBusiness?.status === 'Pending' && !selectedBusiness?.verified && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowProfileDialog(false);
                    handleAction(selectedBusiness, 'reject');
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Verification
                </Button>
                <Button
                  className="bg-[#195440] hover:bg-[#195440]/90"
                  onClick={() => {
                    setShowProfileDialog(false);
                    handleAction(selectedBusiness, 'approve');
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Verification
                </Button>
              </>
            )}
            {selectedBusiness?.status === 'Active' && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowProfileDialog(false);
                  handleAction(selectedBusiness, 'suspend');
                }}
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspend Business
              </Button>
            )}
            {selectedBusiness?.status === 'Suspended' && (
              <Button
                className="bg-[#195440] hover:bg-[#195440]/90"
                onClick={() => {
                  setShowProfileDialog(false);
                  handleAction(selectedBusiness, 'activate');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Activate Business
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
              {dialogAction === 'approve' && 'Approve Business Verification'}
              {dialogAction === 'reject' && 'Reject Business Verification'}
              {dialogAction === 'suspend' && 'Suspend Business Profile'}
              {dialogAction === 'activate' && 'Activate Business Profile'}
              {dialogAction === 'delete' && 'Delete Business Profile'}
              {dialogAction === 'flag' && 'Flag Business for Review'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' && `You are about to approve ${selectedBusiness?.name} for verification. They will receive a blue verification badge.`}
              {dialogAction === 'reject' && `You are about to reject ${selectedBusiness?.name}'s verification request. Please provide a detailed reason.`}
              {dialogAction === 'suspend' && `You are about to suspend ${selectedBusiness?.name}. The business profile will no longer appear publicly.`}
              {dialogAction === 'activate' && `You are about to activate ${selectedBusiness?.name}. The business will regain public visibility.`}
              {dialogAction === 'delete' && `You are about to permanently delete ${selectedBusiness?.name}. This action cannot be undone.`}
              {dialogAction === 'flag' && `You are about to flag ${selectedBusiness?.name} for suspicious activity. Please provide details.`}
            </DialogDescription>
          </DialogHeader>

          {(dialogAction === 'reject' || dialogAction === 'suspend' || dialogAction === 'delete' || dialogAction === 'flag') && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div>
                <Label htmlFor="reason">
                  {dialogAction === 'flag' ? 'Flag Reason' : 'Reason'} *
                </Label>
                <Textarea
                  id="reason"
                  placeholder={
                    dialogAction === 'reject' 
                      ? 'Explain what documents are missing or incorrect...'
                      : dialogAction === 'suspend'
                      ? 'Explain why this business is being suspended...'
                      : dialogAction === 'delete'
                      ? 'Explain why this business is being deleted...'
                      : 'Describe the suspicious activity or concern...'
                  }
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {dialogAction === 'reject' && 'This will be sent to the business owner via email'}
                  {dialogAction === 'flag' && 'This will be logged for further investigation'}
                  {(dialogAction === 'suspend' || dialogAction === 'delete') && 'This will be logged in the audit trail'}
                </p>
              </div>
            </div>
          )}

          {dialogAction === 'approve' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4" style={{ marginLeft: '20px', marginRight: '20px' }}>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 mb-1">Approval Actions:</p>
                  <ul className="text-green-800 space-y-1 list-disc list-inside">
                    <li>Business will receive verification badge</li>
                    <li>Email notification will be sent to business owner</li>
                    <li>Profile will be marked as "Active"</li>
                    <li>Action will be logged in audit trail</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={
                dialogAction === 'reject' || dialogAction === 'delete' || dialogAction === 'suspend' 
                  ? 'destructive' 
                  : 'default'
              }
              className={
                dialogAction === 'approve' || dialogAction === 'activate'
                  ? 'bg-[#195440] hover:bg-[#195440]/90'
                  : ''
              }
              onClick={confirmAction}
              disabled={
                (dialogAction === 'reject' || dialogAction === 'suspend' || dialogAction === 'delete' || dialogAction === 'flag') 
                && !actionReason.trim()
              }
            >
              {dialogAction === 'approve' && (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Approval
                </>
              )}
              {dialogAction === 'reject' && (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </>
              )}
              {dialogAction === 'suspend' && (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Confirm Suspension
                </>
              )}
              {dialogAction === 'activate' && (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
              {dialogAction === 'delete' && (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Confirm Deletion
                </>
              )}
              {dialogAction === 'flag' && (
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
