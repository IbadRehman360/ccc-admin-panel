'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/layout/UserAvatar';
import { 
  Eye,
  User,
  Building,
  Users,
  TrendingUp,
  CheckCircle,
  Search,
  Sliders
} from 'lucide-react';

interface UserPreferences {
  socialEnvironmental?: string;
  rightsAdvocacy?: string;
  culturalDemographic?: string;
  lifestyle?: string;
  business?: string;
  political?: string;
  gunControl?: string;
}

interface UserWithPreferences {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: 'User' | 'Business';
  profileCompletion: number;
  preferencesSet: boolean;
  preferencesCount: number;
  preferences: UserPreferences;
  joinedDate: string;
  lastActive: string;
  location: string;
}

const usersWithPreferences: UserWithPreferences[] = [
  {
    id: 'U12345',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    accountType: 'User',
    profileCompletion: 95,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Progressive',
      rightsAdvocacy: 'Strong Support',
      culturalDemographic: 'Diverse',
      lifestyle: 'Active & Health-Conscious',
      business: 'Entrepreneurial',
      political: 'Liberal',
      gunControl: 'Support Regulation'
    },
    joinedDate: '2025-06-15T00:00:00',
    lastActive: '2026-03-03T10:30:00',
    location: 'San Francisco, CA'
  },
  {
    id: 'B23456',
    name: 'Tech Innovations Inc',
    email: 'contact@techinnovations.com',
    phone: '+1 (555) 234-5678',
    accountType: 'Business',
    profileCompletion: 100,
    preferencesSet: true,
    preferencesCount: 6,
    preferences: {
      socialEnvironmental: 'Eco-Friendly',
      rightsAdvocacy: 'Inclusive Workplace',
      culturalDemographic: 'Global Team',
      lifestyle: 'Work-Life Balance',
      business: 'Innovation-Driven',
      political: 'Moderate'
    },
    joinedDate: '2025-08-20T00:00:00',
    lastActive: '2026-03-03T10:15:00',
    location: 'San Francisco, CA'
  },
  {
    id: 'U34567',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1 (555) 345-6789',
    accountType: 'User',
    profileCompletion: 88,
    preferencesSet: true,
    preferencesCount: 6,
    preferences: {
      socialEnvironmental: 'Environmental Advocate',
      rightsAdvocacy: 'Social Justice',
      culturalDemographic: 'Multicultural',
      lifestyle: 'Community-Oriented',
      business: 'Social Enterprise',
      political: 'Progressive'
    },
    joinedDate: '2025-09-10T00:00:00',
    lastActive: '2026-03-03T09:45:00',
    location: 'Los Angeles, CA'
  },
  {
    id: 'U45678',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '+1 (555) 456-7890',
    accountType: 'User',
    profileCompletion: 92,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Conservation',
      rightsAdvocacy: 'Civil Liberties',
      culturalDemographic: 'Traditional Values',
      lifestyle: 'Outdoor Enthusiast',
      business: 'Small Business Owner',
      political: 'Conservative',
      gunControl: 'Second Amendment Support'
    },
    joinedDate: '2025-07-22T00:00:00',
    lastActive: '2026-03-03T09:30:00',
    location: 'Austin, TX'
  },
  {
    id: 'B56789',
    name: 'Green Earth Solutions',
    email: 'info@greenearthsolutions.com',
    phone: '+1 (555) 567-8901',
    accountType: 'Business',
    profileCompletion: 96,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Sustainability First',
      rightsAdvocacy: 'Environmental Justice',
      culturalDemographic: 'Community-Focused',
      lifestyle: 'Green Living',
      business: 'B-Corporation',
      political: 'Non-Partisan',
      gunControl: 'Support Regulation'
    },
    joinedDate: '2025-05-30T00:00:00',
    lastActive: '2026-03-03T09:00:00',
    location: 'Portland, OR'
  },
  {
    id: 'U67890',
    name: 'James Anderson',
    email: 'james.a@email.com',
    phone: '+1 (555) 678-9012',
    accountType: 'User',
    profileCompletion: 85,
    preferencesSet: true,
    preferencesCount: 5,
    preferences: {
      socialEnvironmental: 'Moderate',
      rightsAdvocacy: 'Individual Freedom',
      culturalDemographic: 'American Values',
      lifestyle: 'Traditional',
      business: 'Free Market'
    },
    joinedDate: '2025-10-05T00:00:00',
    lastActive: '2026-03-03T08:45:00',
    location: 'Dallas, TX'
  },
  {
    id: 'U78901',
    name: 'Maria Garcia',
    email: 'maria.g@email.com',
    phone: '+1 (555) 789-0123',
    accountType: 'User',
    profileCompletion: 90,
    preferencesSet: true,
    preferencesCount: 6,
    preferences: {
      socialEnvironmental: 'Climate Activist',
      rightsAdvocacy: 'Human Rights',
      culturalDemographic: 'Hispanic Heritage',
      lifestyle: 'Family-Oriented',
      business: 'Local Business Support',
      political: 'Democrat'
    },
    joinedDate: '2025-11-12T00:00:00',
    lastActive: '2026-03-03T08:30:00',
    location: 'Miami, FL'
  },
  {
    id: 'B89012',
    name: 'Diversity Consulting Group',
    email: 'contact@diversityconsulting.com',
    phone: '+1 (555) 890-1234',
    accountType: 'Business',
    profileCompletion: 100,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'DEI Focused',
      rightsAdvocacy: 'Equality Champion',
      culturalDemographic: 'Inclusive',
      lifestyle: 'Collaborative',
      business: 'Purpose-Driven',
      political: 'Non-Partisan',
      gunControl: 'Neutral'
    },
    joinedDate: '2025-04-18T00:00:00',
    lastActive: '2026-03-03T08:15:00',
    location: 'New York, NY'
  },
  {
    id: 'U90123',
    name: 'Jennifer Lee',
    email: 'jennifer.l@email.com',
    phone: '+1 (555) 901-2345',
    accountType: 'User',
    profileCompletion: 94,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Green Advocate',
      rightsAdvocacy: 'LGBTQ+ Ally',
      culturalDemographic: 'Asian-American',
      lifestyle: 'Tech-Savvy',
      business: 'Startup Culture',
      political: 'Independent',
      gunControl: 'Support Regulation'
    },
    joinedDate: '2025-08-25T00:00:00',
    lastActive: '2026-03-03T08:00:00',
    location: 'Seattle, WA'
  },
  {
    id: 'U01234',
    name: 'Alex Martinez',
    email: 'alex.m@email.com',
    phone: '+1 (555) 012-3456',
    accountType: 'User',
    profileCompletion: 87,
    preferencesSet: true,
    preferencesCount: 6,
    preferences: {
      socialEnvironmental: 'Urban Living',
      rightsAdvocacy: 'Education Equity',
      culturalDemographic: 'Latino Community',
      lifestyle: 'Fitness & Wellness',
      business: 'Freelancer',
      political: 'Moderate'
    },
    joinedDate: '2025-12-01T00:00:00',
    lastActive: '2026-03-03T07:45:00',
    location: 'Denver, CO'
  },
  {
    id: 'B11223',
    name: 'Sustainable Foods Co',
    email: 'info@sustainablefoods.com',
    phone: '+1 (555) 112-2334',
    accountType: 'Business',
    profileCompletion: 98,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Organic & Local',
      rightsAdvocacy: 'Fair Trade',
      culturalDemographic: 'Farm-to-Table',
      lifestyle: 'Healthy Living',
      business: 'Ethical Sourcing',
      political: 'Progressive',
      gunControl: 'Support Regulation'
    },
    joinedDate: '2025-03-14T00:00:00',
    lastActive: '2026-03-03T07:30:00',
    location: 'San Francisco, CA'
  },
  {
    id: 'U22334',
    name: 'Amanda Wilson',
    email: 'amanda.w@email.com',
    phone: '+1 (555) 223-3445',
    accountType: 'User',
    profileCompletion: 91,
    preferencesSet: true,
    preferencesCount: 6,
    preferences: {
      socialEnvironmental: 'Climate Conscious',
      rightsAdvocacy: 'Women\'s Rights',
      culturalDemographic: 'Feminist',
      lifestyle: 'Professional',
      business: 'Corporate',
      political: 'Liberal'
    },
    joinedDate: '2025-07-08T00:00:00',
    lastActive: '2026-03-03T07:15:00',
    location: 'Boston, MA'
  },
  {
    id: 'U33445',
    name: 'Christopher Davis',
    email: 'chris.d@email.com',
    phone: '+1 (555) 334-4556',
    accountType: 'User',
    profileCompletion: 89,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Pragmatic',
      rightsAdvocacy: 'States Rights',
      culturalDemographic: 'Patriotic',
      lifestyle: 'Sports Enthusiast',
      business: 'Capitalist',
      political: 'Republican',
      gunControl: 'Second Amendment'
    },
    joinedDate: '2025-09-19T00:00:00',
    lastActive: '2026-03-03T07:00:00',
    location: 'Nashville, TN'
  },
  {
    id: 'B44556',
    name: 'Community Health Center',
    email: 'info@communityhealthcenter.org',
    phone: '+1 (555) 445-5667',
    accountType: 'Business',
    profileCompletion: 100,
    preferencesSet: true,
    preferencesCount: 6,
    preferences: {
      socialEnvironmental: 'Public Health',
      rightsAdvocacy: 'Healthcare Access',
      culturalDemographic: 'Underserved Communities',
      lifestyle: 'Wellness',
      business: 'Non-Profit',
      political: 'Non-Partisan'
    },
    joinedDate: '2025-06-22T00:00:00',
    lastActive: '2026-03-03T06:45:00',
    location: 'Chicago, IL'
  },
  {
    id: 'U55667',
    name: 'Daniel Taylor',
    email: 'daniel.t@email.com',
    phone: '+1 (555) 556-6778',
    accountType: 'User',
    profileCompletion: 93,
    preferencesSet: true,
    preferencesCount: 7,
    preferences: {
      socialEnvironmental: 'Renewable Energy',
      rightsAdvocacy: 'Tech Privacy',
      culturalDemographic: 'Digital Native',
      lifestyle: 'Minimalist',
      business: 'Tech Industry',
      political: 'Libertarian',
      gunControl: 'Neutral'
    },
    joinedDate: '2025-10-30T00:00:00',
    lastActive: '2026-03-03T06:30:00',
    location: 'San Jose, CA'
  }
];

export default function MatchingEnginePage() {
  const [allUsers] = useState<UserWithPreferences[]>(usersWithPreferences);
  const [selectedUser, setSelectedUser] = useState<UserWithPreferences | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAccountType, setFilterAccountType] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('all');

  // Calculate stats
  const totalWithPreferences = allUsers.filter(u => u.preferencesSet).length;
  const regularUsersWithPrefs = allUsers.filter(u => u.preferencesSet && u.accountType === 'User').length;
  const businessesWithPrefs = allUsers.filter(u => u.preferencesSet && u.accountType === 'Business').length;
  const avgProfileCompletion = Math.round(
    allUsers.filter(u => u.preferencesSet).reduce((sum, u) => sum + u.profileCompletion, 0) / totalWithPreferences
  );
  const completeProfiles = allUsers.filter(u => u.preferencesSet && u.profileCompletion >= 90).length;

  // Filter users
  const filteredUsers = allUsers.filter(user => {
    if (!user.preferencesSet) return false;
    
    const accountTypeMatch = filterAccountType === 'All' || user.accountType === filterAccountType;
    const searchMatch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return accountTypeMatch && searchMatch;
  });

  // Separate by account type
  const regularUsers = filteredUsers.filter(u => u.accountType === 'User');
  const businesses = filteredUsers.filter(u => u.accountType === 'Business');

  const handleViewDetails = (user: UserWithPreferences) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
    
    // Log view action
    console.log('User Preferences Viewed:', {
      userId: user.id,
      userName: user.name,
      accountType: user.accountType,
      viewedBy: 'Current Admin',
      timestamp: new Date().toISOString()
    });
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

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'text-green-600';
    if (completion >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const UsersTable = ({ users, type }: { users: UserWithPreferences[], type: string }) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">{type === 'User' ? 'User' : 'Business'}</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Profile Completion</TableHead>
            <TableHead className="font-semibold">Preferences Set</TableHead>
            <TableHead className="font-semibold">Last Active</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No {type === 'User' ? 'users' : 'businesses'} found with preferences set
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} size="md" />
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {user.location}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${user.profileCompletion >= 90 ? 'bg-green-500' : user.profileCompletion >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${user.profileCompletion}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getCompletionColor(user.profileCompletion)}`}>
                      {user.profileCompletion}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {user.preferencesCount}/7 Categories
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDateTime(user.lastActive)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
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
        <h1 className="text-2xl font-bold text-gray-900">User Preferences</h1>
        <p className="text-gray-600 mt-1">View users and businesses who have set their preferences</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#195440]">{totalWithPreferences}</div>
                <p className="text-sm text-gray-600 mt-1">Total with Preferences</p>
              </div>
              <Sliders className="w-8 h-8 text-[#195440]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{regularUsersWithPrefs}</div>
                <p className="text-sm text-gray-600 mt-1">Users</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{businessesWithPrefs}</div>
                <p className="text-sm text-gray-600 mt-1">Businesses</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{avgProfileCompletion}%</div>
                <p className="text-sm text-gray-600 mt-1">Avg Profile Completion</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completeProfiles}</div>
                <p className="text-sm text-gray-600 mt-1">90%+ Complete</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users & Businesses with Preferences
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Monitor accounts that have completed their preference settings
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <Label>Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, ID, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Account Type Filter */}
              <div className="w-[180px]">
                <Label>Account Type</Label>
                <Select value={filterAccountType} onValueChange={setFilterAccountType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="User">Users Only</SelectItem>
                    <SelectItem value="Business">Businesses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {totalWithPreferences} accounts with preferences
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({filteredUsers.length})
              </TabsTrigger>
              <TabsTrigger value="users">
                Users ({regularUsers.length})
              </TabsTrigger>
              <TabsTrigger value="businesses">
                Businesses ({businesses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <UsersTable users={filteredUsers} type="All" />
            </TabsContent>

            <TabsContent value="users">
              <UsersTable users={regularUsers} type="User" />
            </TabsContent>

            <TabsContent value="businesses">
              <UsersTable users={businesses} type="Business" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              Preference Details
            </DialogTitle>
            <DialogDescription>
              Complete preference information for this account
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 px-6">
              {/* User/Business Header */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start gap-4">
                  <UserAvatar name={selectedUser.name} size="lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedUser.email}</p>
                    <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={selectedUser.accountType === 'Business' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}>
                        {selectedUser.accountType === 'Business' ? <Building className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                        {selectedUser.accountType}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {selectedUser.preferencesCount}/7 Preferences Set
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Profile Completion</h4>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Completion</span>
                    <span className={`text-lg font-bold ${getCompletionColor(selectedUser.profileCompletion)}`}>
                      {selectedUser.profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${selectedUser.profileCompletion >= 90 ? 'bg-green-500' : selectedUser.profileCompletion >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${selectedUser.profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Preference Categories</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedUser.preferences.socialEnvironmental && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-900">🌍 Social & Environmental</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.socialEnvironmental}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {selectedUser.preferences.rightsAdvocacy && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">✊ Rights & Advocacy</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.rightsAdvocacy}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {selectedUser.preferences.culturalDemographic && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-900">🌐 Cultural & Demographic</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.culturalDemographic}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {selectedUser.preferences.lifestyle && (
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-pink-900">🎨 Lifestyle</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.lifestyle}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {selectedUser.preferences.business && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-900">💼 Business</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.business}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {selectedUser.preferences.political && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-indigo-900">🗳️ Political</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.political}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {selectedUser.preferences.gunControl && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-900">🔫 Gun Control</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedUser.preferences.gunControl}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">User ID</Label>
                    <p className="font-medium mt-1">{selectedUser.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Location</Label>
                    <p className="font-medium mt-1">{selectedUser.location}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Joined Date</Label>
                    <p className="font-medium mt-1">{formatDate(selectedUser.joinedDate)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Last Active</Label>
                    <p className="font-medium mt-1">{formatDateTime(selectedUser.lastActive)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
