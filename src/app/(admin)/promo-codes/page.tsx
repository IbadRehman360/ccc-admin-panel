'use client';

import { useState } from 'react';
import { Plus, Search, TrendingUp, User, Edit, Trash2, Eye, Activity, Calendar, CheckCircle, XCircle, BarChart3, Users, TrendingDown, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const promoCodesData = [
  {
    id: 'PC001',
    code: 'SARAH2026',
    influencer: 'Sarah Marketing',
    influencerEmail: 'sarah@example.com',
    influencerPhone: '+1 (555) 123-4567',
    totalSignups: 234,
    completedProfiles: 189,
    status: 'Active',
    createdDate: '2026-01-15',
    createdBy: 'Admin (John Admin)',
    lastUsed: '2026-02-19',
    usageFrequency: 'High',
    topLocations: ['New York', 'Los Angeles', 'Chicago'],
    performanceRating: 'Excellent'
  },
  {
    id: 'PC002',
    code: 'MIKE50',
    influencer: 'Mike Jones',
    influencerEmail: 'mike@example.com',
    influencerPhone: '+1 (555) 234-5678',
    totalSignups: 156,
    completedProfiles: 134,
    status: 'Active',
    createdDate: '2026-01-20',
    createdBy: 'Admin (Jane Admin)',
    lastUsed: '2026-02-18',
    usageFrequency: 'Medium',
    topLocations: ['San Francisco', 'Seattle', 'Portland'],
    performanceRating: 'Good'
  },
  {
    id: 'PC003',
    code: 'JESSICA2026',
    influencer: 'Jessica Lee',
    influencerEmail: 'jessica@example.com',
    influencerPhone: '+1 (555) 345-6789',
    totalSignups: 89,
    completedProfiles: 67,
    status: 'Inactive',
    createdDate: '2025-12-01',
    createdBy: 'Admin (John Admin)',
    lastUsed: '2026-01-30',
    usageFrequency: 'Low',
    topLocations: ['Boston', 'Miami', 'Atlanta'],
    performanceRating: 'Average',
    deactivatedDate: '2026-02-01',
    deactivatedBy: 'Admin (Jane Admin)',
    deactivationReason: 'Campaign ended'
  },
  {
    id: 'PC004',
    code: 'TECH2026',
    influencer: 'David Chen',
    influencerEmail: 'david.chen@example.com',
    influencerPhone: '+1 (555) 456-7890',
    totalSignups: 312,
    completedProfiles: 278,
    status: 'Active',
    createdDate: '2026-01-10',
    createdBy: 'Admin (John Admin)',
    lastUsed: '2026-02-19',
    usageFrequency: 'Very High',
    topLocations: ['Austin', 'Denver', 'Phoenix'],
    performanceRating: 'Excellent'
  },
  {
    id: 'PC005',
    code: 'FITNESS2026',
    influencer: 'Rachel Brown',
    influencerEmail: 'rachel.b@example.com',
    influencerPhone: '+1 (555) 567-8901',
    totalSignups: 178,
    completedProfiles: 145,
    status: 'Active',
    createdDate: '2026-01-25',
    createdBy: 'Admin (Jane Admin)',
    lastUsed: '2026-02-19',
    usageFrequency: 'High',
    topLocations: ['Dallas', 'Houston', 'San Antonio'],
    performanceRating: 'Good'
  },
  {
    id: 'PC006',
    code: 'FOOD2026',
    influencer: 'Carlos Mendez',
    influencerEmail: 'carlos.m@example.com',
    influencerPhone: '+1 (555) 678-9012',
    totalSignups: 67,
    completedProfiles: 52,
    status: 'Inactive',
    createdDate: '2026-02-01',
    createdBy: 'Admin (John Admin)',
    lastUsed: '2026-02-10',
    usageFrequency: 'Low',
    topLocations: ['Philadelphia', 'Detroit', 'Minneapolis'],
    performanceRating: 'Below Average',
    deactivatedDate: '2026-02-15',
    deactivatedBy: 'Admin (John Admin)',
    deactivationReason: 'Low performance'
  },
  {
    id: 'PC007',
    code: 'WELLNESS2026',
    influencer: 'Emily Rodriguez',
    influencerEmail: 'emily.r@example.com',
    influencerPhone: '+1 (555) 789-0123',
    totalSignups: 245,
    completedProfiles: 201,
    status: 'Active',
    createdDate: '2026-01-12',
    createdBy: 'Admin (Jane Admin)',
    lastUsed: '2026-02-19',
    usageFrequency: 'Very High',
    topLocations: ['San Diego', 'Sacramento', 'San Jose'],
    performanceRating: 'Excellent'
  },
  {
    id: 'PC008',
    code: 'TRAVEL2026',
    influencer: 'Amanda Wilson',
    influencerEmail: 'amanda.w@example.com',
    influencerPhone: '+1 (555) 890-1234',
    totalSignups: 123,
    completedProfiles: 98,
    status: 'Active',
    createdDate: '2026-02-05',
    createdBy: 'Admin (John Admin)',
    lastUsed: '2026-02-18',
    usageFrequency: 'Medium',
    topLocations: ['Orlando', 'Tampa', 'Jacksonville'],
    performanceRating: 'Good'
  },
];

const signupTrendsData = [
  { date: '2026-02-15', signups: 45 },
  { date: '2026-02-16', signups: 52 },
  { date: '2026-02-17', signups: 38 },
  { date: '2026-02-18', signups: 61 },
  { date: '2026-02-19', signups: 73 },
];

export default function PromoCodeManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    influencer: '',
    influencerEmail: '',
    influencerPhone: '',
    isActive: true
  });
  const [editPromoCode, setEditPromoCode] = useState({
    code: '',
    influencer: '',
    influencerEmail: '',
    influencerPhone: '',
    isActive: true
  });

  const filteredCodes = promoCodesData.filter(code => {
    const matchesSearch = 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.influencer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || code.status.toLowerCase() === statusFilter;
    const matchesPerformance = performanceFilter === 'all' || code.performanceRating === performanceFilter;
    return matchesSearch && matchesStatus && matchesPerformance;
  });

  const handleCreatePromo = () => {
    console.log('Creating promo code:', newPromoCode);
    setShowCreateDialog(false);
    setNewPromoCode({
      code: '',
      influencer: '',
      influencerEmail: '',
      influencerPhone: '',
      isActive: true
    });
  };

  const handleEditPromo = (code: any) => {
    setSelectedCode(code);
    setEditPromoCode({
      code: code.code,
      influencer: code.influencer,
      influencerEmail: code.influencerEmail,
      influencerPhone: code.influencerPhone,
      isActive: code.status === 'Active'
    });
    setShowEditDialog(true);
  };

  const handleUpdatePromo = () => {
    console.log('Updating promo code:', selectedCode.id, editPromoCode);
    setShowEditDialog(false);
    setSelectedCode(null);
  };

  const handleDeletePromo = (code: any) => {
    setSelectedCode(code);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    console.log('Deleting promo code:', selectedCode);
    setShowDeleteDialog(false);
    setSelectedCode(null);
  };

  const handleViewAnalytics = (code: any) => {
    setSelectedCode(code);
    setShowAnalyticsDialog(true);
  };

  const handleToggleStatus = (code: any) => {
    console.log(`Toggling status for ${code.code} from ${code.status}`);
    // In a real app, this would update the backend
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPromoCodes = promoCodesData.length;
  const activePromoCodes = promoCodesData.filter(c => c.status === 'Active').length;
  const inactivePromoCodes = promoCodesData.filter(c => c.status === 'Inactive').length;
  const totalSignups = promoCodesData.reduce((sum, code) => sum + code.totalSignups, 0);
  const totalActiveUsers = promoCodesData.reduce((sum, code) => sum + code.completedProfiles, 0);
  const avgRetentionRate = ((totalActiveUsers / totalSignups) * 100).toFixed(1);

  const getPerformanceBadge = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return <Badge className="bg-[#195440]">Excellent</Badge>;
      case 'Good':
        return <Badge className="bg-[#E1B047]">Good</Badge>;
      case 'Average':
        return <Badge variant="secondary">Average</Badge>;
      case 'Below Average':
        return <Badge variant="destructive">Below Average</Badge>;
      default:
        return <Badge variant="outline">{rating}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Code Management</h1>
          <p className="text-gray-600 mt-2">Create and track promo codes for influencer marketing campaigns</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-[#195440] hover:bg-[#195440]/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Promo Code
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Promo Codes
            </CardTitle>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalPromoCodes}</div>
            <p className="text-sm text-gray-600 mt-1">{activePromoCodes} Active / {inactivePromoCodes} Inactive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Signups
            </CardTitle>
            <Users className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#195440]">{totalSignups}</div>
            <p className="text-sm text-[#195440] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18.2% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Profiles
            </CardTitle>
            <User className="w-5 h-5 text-[#E1B047]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E1B047]">{totalActiveUsers}</div>
            <p className="text-sm text-gray-600 mt-1">Profile completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Performance
            </CardTitle>
            <Activity className="w-5 h-5 text-[#195440]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">Good</div>
            <p className="text-sm text-gray-600 mt-1">Overall rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by code, influencer, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Below Average">Below Average</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promo Code ID</TableHead>
                  <TableHead>Promo Code</TableHead>
                  <TableHead>Influencer Name</TableHead>
                  <TableHead>Total Signups</TableHead>
                  <TableHead>Completed Profiles</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium text-[#195440]">{code.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#195440] bg-[#195440]/5 px-3 py-1 rounded">
                          {code.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code.code)}
                          className="h-6 w-6 p-0"
                        >
                          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{code.influencer}</div>
                        <div className="text-xs text-gray-500">{code.influencerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xl font-bold text-gray-900">{code.totalSignups}</div>
                      <div className="text-xs text-gray-500">registrations</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xl font-bold text-[#195440]">{code.completedProfiles}</div>
                      <div className="text-xs text-gray-500">active now</div>
                    </TableCell>
                    <TableCell>
                      {getPerformanceBadge(code.performanceRating)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={code.status === 'Active' ? 'default' : 'secondary'} 
                        className={code.status === 'Active' ? 'bg-green-600' : ''}>
                        {code.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewAnalytics(code)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPromo(code)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleStatus(code)}
                          className={code.status === 'Active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {code.status === 'Active' ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePromo(code)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Promo Code Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="w-[95vw] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Promo Code</DialogTitle>
            <DialogDescription>
              Create a promo code to track user registrations from an influencer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Promo Code Name *</Label>
              <Input
                id="code"
                placeholder="e.g., INFLUENCER2026"
                value={newPromoCode.code}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">Use uppercase letters and numbers only</p>
            </div>
            <div>
              <Label htmlFor="influencer">Influencer Name *</Label>
              <Input
                id="influencer"
                placeholder="Enter influencer name"
                value={newPromoCode.influencer}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, influencer: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Influencer Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="influencer@example.com"
                value={newPromoCode.influencerEmail}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, influencerEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Influencer Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={newPromoCode.influencerPhone}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, influencerPhone: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="active" className="font-medium">Active Status</Label>
                <p className="text-xs text-gray-500 mt-1">Enable promo code immediately</p>
              </div>
              <Switch
                id="active"
                checked={newPromoCode.isActive}
                onCheckedChange={(checked) => setNewPromoCode({ ...newPromoCode, isActive: checked })}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This promo code is for tracking purposes only. It does not provide discounts or unlock features. Users will use this code during sign-up, and you'll be able to track how many registrations came from this influencer.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePromo} 
              className="bg-[#195440] hover:bg-[#195440]/90"
              disabled={!newPromoCode.code || !newPromoCode.influencer || !newPromoCode.influencerEmail}
            >
              Create Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promo Code Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-[95vw] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Update promo code details and influencer information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-code">Promo Code Name *</Label>
              <Input
                id="edit-code"
                placeholder="e.g., INFLUENCER2026"
                value={editPromoCode.code}
                onChange={(e) => setEditPromoCode({ ...editPromoCode, code: e.target.value.toUpperCase() })}
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="edit-influencer">Influencer Name *</Label>
              <Input
                id="edit-influencer"
                placeholder="Enter influencer name"
                value={editPromoCode.influencer}
                onChange={(e) => setEditPromoCode({ ...editPromoCode, influencer: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Influencer Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="influencer@example.com"
                value={editPromoCode.influencerEmail}
                onChange={(e) => setEditPromoCode({ ...editPromoCode, influencerEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Influencer Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={editPromoCode.influencerPhone}
                onChange={(e) => setEditPromoCode({ ...editPromoCode, influencerPhone: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="edit-active" className="font-medium">Active Status</Label>
                <p className="text-xs text-gray-500 mt-1">Enable or disable this promo code</p>
              </div>
              <Switch
                id="edit-active"
                checked={editPromoCode.isActive}
                onCheckedChange={(checked) => setEditPromoCode({ ...editPromoCode, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePromo} 
              className="bg-[#195440] hover:bg-[#195440]/90"
            >
              Update Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete promo code <strong>{selectedCode?.code}</strong>? This action cannot be undone. All associated analytics data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Promo Code Analytics - {selectedCode?.code}</DialogTitle>
            <DialogDescription>
              Detailed performance metrics and user registration data
            </DialogDescription>
          </DialogHeader>

          {selectedCode && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="influencer">Influencer Details</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6 px-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Promo Code ID</Label>
                    <p className="font-medium text-[#195440]">{selectedCode.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedCode.status === 'Active' ? 'default' : 'secondary'} 
                        className={selectedCode.status === 'Active' ? 'bg-green-600' : ''}>
                        {selectedCode.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Registration Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-[#195440]">{selectedCode.totalSignups}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Signups</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-[#E1B047]">{selectedCode.completedProfiles}</div>
                      <div className="text-sm text-gray-600 mt-1">Active Users</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {((selectedCode.completedProfiles / selectedCode.totalSignups) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Retention Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-[#195440]">{selectedCode.usageFrequency}</div>
                      <div className="text-sm text-gray-600 mt-1">Usage Frequency</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Signup Trends (Last 5 Days)</h3>
                  <div className="space-y-3">
                    {signupTrendsData.map((day, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-32 text-sm text-gray-600">{day.date}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-8 bg-gray-200 rounded overflow-hidden">
                            <div 
                              className="h-full bg-[#195440] flex items-center justify-end pr-2"
                              style={{ width: `${(day.signups / 80) * 100}%` }}
                            >
                              <span className="text-white text-sm font-medium">{day.signups}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Top Locations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCode.topLocations.map((location: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm text-gray-600">{selectedCode.createdDate}</p>
                        <p className="text-xs text-gray-500">by {selectedCode.createdBy}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Last Used</p>
                        <p className="text-sm text-gray-600">{selectedCode.lastUsed}</p>
                      </div>
                    </div>
                    {selectedCode.status === 'Inactive' && selectedCode.deactivatedDate && (
                      <div className="flex items-start gap-4">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Deactivated</p>
                          <p className="text-sm text-gray-600">{selectedCode.deactivatedDate}</p>
                          <p className="text-xs text-gray-500">by {selectedCode.deactivatedBy}</p>
                          <p className="text-xs text-red-600 mt-1">Reason: {selectedCode.deactivationReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6 mt-6 px-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-[#195440]">{selectedCode.performanceRating}</div>
                    {getPerformanceBadge(selectedCode.performanceRating)}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Sign Up & Profile Completion</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <div className="text-4xl font-bold text-[#195440] mb-2">{selectedCode.totalSignups}</div>
                      <div className="text-sm text-gray-600">Users Signed Up</div>
                      <p className="text-xs text-gray-500 mt-2">Total registrations via promo code</p>
                    </div>
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <div className="text-4xl font-bold text-[#E1B047] mb-2">{selectedCode.completedProfiles}</div>
                      <div className="text-sm text-gray-600">Completed Profiles</div>
                      <p className="text-xs text-gray-500 mt-2">Users who finished profile setup</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Insights</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>This promo code is performing {selectedCode.performanceRating.toLowerCase()} compared to platform average</li>
                    <li>{selectedCode.completedProfiles} out of {selectedCode.totalSignups} users completed their profiles</li>
                    <li>Most signups come from {selectedCode.topLocations[0]}</li>
                    <li>Usage frequency is {selectedCode.usageFrequency.toLowerCase()}</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Influencer Details Tab */}
              <TabsContent value="influencer" className="space-y-6 mt-6 px-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Influencer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600">Influencer Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-lg">{selectedCode.influencer}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Email Address</Label>
                      <p className="mt-1">{selectedCode.influencerEmail}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone Number</Label>
                      <p className="mt-1">{selectedCode.influencerPhone}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Campaign Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#195440] mb-2">{selectedCode.totalSignups}</div>
                      <div className="text-sm text-gray-600">Users Registered</div>
                      <p className="text-xs text-gray-500 mt-2">via {selectedCode.code}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#E1B047] mb-2">{selectedCode.completedProfiles}</div>
                      <div className="text-sm text-gray-600">Still Active</div>
                      <p className="text-xs text-gray-500 mt-2">
                        {((selectedCode.completedProfiles / selectedCode.totalSignups) * 100).toFixed(1)}% retention
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-[#195440]/5 border border-[#195440] rounded-lg p-4">
                  <h4 className="font-medium text-[#195440] mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Influencer Impact
                  </h4>
                  <p className="text-sm text-gray-800">
                    {selectedCode.influencer} has successfully brought {selectedCode.totalSignups} new users to the platform through the {selectedCode.code} promo code. With a {((selectedCode.completedProfiles / selectedCode.totalSignups) * 100).toFixed(1)}% retention rate, this campaign is delivering {selectedCode.performanceRating.toLowerCase()} results.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnalyticsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
