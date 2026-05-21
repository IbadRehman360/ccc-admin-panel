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
import { UserAvatar } from '@/components/layout/UserAvatar';
import { 
  MapPin, 
  CheckCircle,
  XCircle,
  Eye,
  User,
  Users,
  TrendingUp,
  Smartphone,
  Search,
  MapPinned
} from 'lucide-react';

interface GeofencingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: 'User' | 'Business';
  geofencingEnabled: boolean;
  lastLocationUpdate: string;
  deviceType: 'iOS' | 'Android';
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  locationPermission: 'Always' | 'While Using' | 'Denied';
  joinedDate: string;
}

const geofencingUsers: GeofencingUser[] = [
  {
    id: 'U12345',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T10:30:00',
    deviceType: 'iOS',
    latitude: 37.7749,
    longitude: -122.4194,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-06-15T00:00:00'
  },
  {
    id: 'U23456',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    phone: '+1 (555) 234-5678',
    accountType: 'Business',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T10:15:00',
    deviceType: 'Android',
    latitude: 37.7849,
    longitude: -122.4094,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-08-20T00:00:00'
  },
  {
    id: 'U34567',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1 (555) 345-6789',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T09:45:00',
    deviceType: 'iOS',
    latitude: 37.7649,
    longitude: -122.4294,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'While Using',
    joinedDate: '2025-09-10T00:00:00'
  },
  {
    id: 'U45678',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '+1 (555) 456-7890',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T09:30:00',
    deviceType: 'Android',
    latitude: 37.7949,
    longitude: -122.3994,
    city: 'Oakland',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-07-22T00:00:00'
  },
  {
    id: 'U56789',
    name: 'Lisa Wang',
    email: 'lisa.w@email.com',
    phone: '+1 (555) 567-8901',
    accountType: 'Business',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T09:00:00',
    deviceType: 'iOS',
    latitude: 37.7549,
    longitude: -122.4394,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-05-30T00:00:00'
  },
  {
    id: 'U67890',
    name: 'James Anderson',
    email: 'james.a@email.com',
    phone: '+1 (555) 678-9012',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T08:45:00',
    deviceType: 'Android',
    latitude: 37.7449,
    longitude: -122.4494,
    city: 'Berkeley',
    state: 'CA',
    locationPermission: 'While Using',
    joinedDate: '2025-10-05T00:00:00'
  },
  {
    id: 'U78901',
    name: 'Maria Garcia',
    email: 'maria.g@email.com',
    phone: '+1 (555) 789-0123',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T08:30:00',
    deviceType: 'iOS',
    latitude: 37.7349,
    longitude: -122.4594,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-11-12T00:00:00'
  },
  {
    id: 'U89012',
    name: 'Robert Kim',
    email: 'robert.k@email.com',
    phone: '+1 (555) 890-1234',
    accountType: 'Business',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T08:15:00',
    deviceType: 'Android',
    latitude: 37.7249,
    longitude: -122.4694,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-04-18T00:00:00'
  },
  {
    id: 'U90123',
    name: 'Jennifer Lee',
    email: 'jennifer.l@email.com',
    phone: '+1 (555) 901-2345',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T08:00:00',
    deviceType: 'iOS',
    latitude: 37.7149,
    longitude: -122.4794,
    city: 'Daly City',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-08-25T00:00:00'
  },
  {
    id: 'U01234',
    name: 'Alex Martinez',
    email: 'alex.m@email.com',
    phone: '+1 (555) 012-3456',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T07:45:00',
    deviceType: 'Android',
    latitude: 37.7049,
    longitude: -122.4894,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'While Using',
    joinedDate: '2025-12-01T00:00:00'
  },
  {
    id: 'U11223',
    name: 'Thomas Brown',
    email: 'thomas.b@email.com',
    phone: '+1 (555) 112-2334',
    accountType: 'Business',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T07:30:00',
    deviceType: 'iOS',
    latitude: 37.6949,
    longitude: -122.4994,
    city: 'San Mateo',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-03-14T00:00:00'
  },
  {
    id: 'U22334',
    name: 'Amanda Wilson',
    email: 'amanda.w@email.com',
    phone: '+1 (555) 223-3445',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T07:15:00',
    deviceType: 'Android',
    latitude: 37.7749,
    longitude: -122.4194,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-07-08T00:00:00'
  },
  {
    id: 'U33445',
    name: 'Christopher Davis',
    email: 'chris.d@email.com',
    phone: '+1 (555) 334-4556',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T07:00:00',
    deviceType: 'iOS',
    latitude: 37.7849,
    longitude: -122.4294,
    city: 'Oakland',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-09-19T00:00:00'
  },
  {
    id: 'U44556',
    name: 'Patricia Moore',
    email: 'patricia.m@email.com',
    phone: '+1 (555) 445-5667',
    accountType: 'Business',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T06:45:00',
    deviceType: 'Android',
    latitude: 37.7549,
    longitude: -122.4094,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'While Using',
    joinedDate: '2025-06-22T00:00:00'
  },
  {
    id: 'U55667',
    name: 'Daniel Taylor',
    email: 'daniel.t@email.com',
    phone: '+1 (555) 556-6778',
    accountType: 'User',
    geofencingEnabled: true,
    lastLocationUpdate: '2026-03-03T06:30:00',
    deviceType: 'iOS',
    latitude: 37.7649,
    longitude: -122.4394,
    city: 'San Francisco',
    state: 'CA',
    locationPermission: 'Always',
    joinedDate: '2025-10-30T00:00:00'
  }
];

export default function GeofencingPage() {
  const [users] = useState<GeofencingUser[]>(geofencingUsers);
  const [selectedUser, setSelectedUser] = useState<GeofencingUser | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAccountType, setFilterAccountType] = useState<string>('All');
  const [filterDeviceType, setFilterDeviceType] = useState<string>('All');
  const [filterPermission, setFilterPermission] = useState<string>('All');

  // Calculate stats
  const totalUsersWithGeofencing = users.filter(u => u.geofencingEnabled).length;
  const regularUsers = users.filter(u => u.geofencingEnabled && u.accountType === 'User').length;
  const businessUsers = users.filter(u => u.geofencingEnabled && u.accountType === 'Business').length;
  const iosUsers = users.filter(u => u.geofencingEnabled && u.deviceType === 'iOS').length;
  const androidUsers = users.filter(u => u.geofencingEnabled && u.deviceType === 'Android').length;
  const alwaysPermission = users.filter(u => u.geofencingEnabled && u.locationPermission === 'Always').length;

  // Filter users
  const filteredUsers = users.filter(user => {
    if (!user.geofencingEnabled) return false;
    
    const accountTypeMatch = filterAccountType === 'All' || user.accountType === filterAccountType;
    const deviceTypeMatch = filterDeviceType === 'All' || user.deviceType === filterDeviceType;
    const permissionMatch = filterPermission === 'All' || user.locationPermission === filterPermission;
    const searchMatch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.city && user.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return accountTypeMatch && deviceTypeMatch && permissionMatch && searchMatch;
  });

  const handleViewDetails = (user: GeofencingUser) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
    
    // Log view action
    console.log('User Geofencing Details Viewed:', {
      userId: user.id,
      userName: user.name,
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'Always':
        return 'bg-green-100 text-green-800';
      case 'While Using':
        return 'bg-yellow-100 text-yellow-800';
      case 'Denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Geofencing Users</h1>
        <p className="text-gray-600 mt-1">View all users who have enabled geofencing on their devices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#195440]">{totalUsersWithGeofencing}</div>
                <p className="text-sm text-gray-600 mt-1">Total Users</p>
              </div>
              <MapPinned className="w-8 h-8 text-[#195440]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{regularUsers}</div>
                <p className="text-sm text-gray-600 mt-1">Regular Users</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{businessUsers}</div>
                <p className="text-sm text-gray-600 mt-1">Business Users</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{iosUsers}</div>
                <p className="text-sm text-gray-600 mt-1">iOS Devices</p>
              </div>
              <Smartphone className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{androidUsers}</div>
                <p className="text-sm text-gray-600 mt-1">Android Devices</p>
              </div>
              <Smartphone className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{alwaysPermission}</div>
                <p className="text-sm text-gray-600 mt-1">Always On</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Users with Geofencing Enabled
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Monitor users who have enabled location services and geofencing on their mobile devices
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <Label>Search Users</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, ID, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Account Type Filter */}
              <div className="w-[160px]">
                <Label>Account Type</Label>
                <Select value={filterAccountType} onValueChange={setFilterAccountType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Device Type Filter */}
              <div className="w-[160px]">
                <Label>Device Type</Label>
                <Select value={filterDeviceType} onValueChange={setFilterDeviceType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Devices</SelectItem>
                    <SelectItem value="iOS">iOS</SelectItem>
                    <SelectItem value="Android">Android</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permission Filter */}
              <div className="w-[180px]">
                <Label>Permission Level</Label>
                <Select value={filterPermission} onValueChange={setFilterPermission}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Permissions</SelectItem>
                    <SelectItem value="Always">Always</SelectItem>
                    <SelectItem value="While Using">While Using</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {totalUsersWithGeofencing} users with geofencing enabled
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Account Type</TableHead>
                  <TableHead className="font-semibold">Device</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Permission</TableHead>
                  <TableHead className="font-semibold">Last Update</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} size="md" />
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={user.accountType === 'Business' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                          {user.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Smartphone className={`w-4 h-4 ${user.deviceType === 'iOS' ? 'text-gray-700' : 'text-green-600'}`} />
                          <span className="font-medium">{user.deviceType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.city && user.state ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.city}, {user.state}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No location</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPermissionColor(user.locationPermission)}>
                          {user.locationPermission}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{getTimeAgo(user.lastLocationUpdate)}</div>
                          <div className="text-xs text-gray-500">{formatDateTime(user.lastLocationUpdate)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(user.joinedDate)}
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
        </CardContent>
      </Card>

      {/* View User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Geofencing Details
            </DialogTitle>
            <DialogDescription>
              Location and geofencing information for this user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 px-6">
              {/* User Header */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start gap-4">
                  <UserAvatar name={selectedUser.name} size="lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedUser.email}</p>
                    <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={selectedUser.accountType === 'Business' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}>
                        {selectedUser.accountType}
                      </Badge>
                      <Badge variant="outline">
                        <Smartphone className="w-3 h-3 mr-1" />
                        {selectedUser.deviceType}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Geofencing Enabled
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Permission */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Location Permission</h4>
                <div className={`p-4 rounded-lg border ${
                  selectedUser.locationPermission === 'Always' ? 'bg-green-50 border-green-200' :
                  selectedUser.locationPermission === 'While Using' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {selectedUser.locationPermission === 'Always' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : selectedUser.locationPermission === 'While Using' ? (
                      <MapPin className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-semibold ${
                        selectedUser.locationPermission === 'Always' ? 'text-green-900' :
                        selectedUser.locationPermission === 'While Using' ? 'text-yellow-900' :
                        'text-red-900'
                      }`}>
                        {selectedUser.locationPermission}
                      </p>
                      <p className={`text-sm mt-1 ${
                        selectedUser.locationPermission === 'Always' ? 'text-green-800' :
                        selectedUser.locationPermission === 'While Using' ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {selectedUser.locationPermission === 'Always' && 'User has granted continuous location access. Geofencing works in the background.'}
                        {selectedUser.locationPermission === 'While Using' && 'User has granted location access only when app is in use. Background geofencing may be limited.'}
                        {selectedUser.locationPermission === 'Denied' && 'User has denied location access. Geofencing features are not available.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Current Location</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">City</Label>
                    <p className="font-medium mt-1">{selectedUser.city || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">State</Label>
                    <p className="font-medium mt-1">{selectedUser.state || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Latitude</Label>
                    <p className="font-medium mt-1">{selectedUser.latitude?.toFixed(6) || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Longitude</Label>
                    <p className="font-medium mt-1">{selectedUser.longitude?.toFixed(6) || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Activity Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Activity Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Last Location Update</Label>
                    <p className="font-medium mt-1">{formatDateTime(selectedUser.lastLocationUpdate)}</p>
                    <p className="text-xs text-gray-500 mt-1">{getTimeAgo(selectedUser.lastLocationUpdate)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Joined Date</Label>
                    <p className="font-medium mt-1">{formatDate(selectedUser.joinedDate)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">User ID</Label>
                    <p className="font-medium mt-1">{selectedUser.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs text-gray-600">Device Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Smartphone className={`w-4 h-4 ${selectedUser.deviceType === 'iOS' ? 'text-gray-700' : 'text-green-600'}`} />
                      <span className="font-medium">{selectedUser.deviceType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geofencing Status */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPinned className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Geofencing Active</p>
                    <p className="text-sm text-green-800 mt-1">
                      This user has enabled geofencing and will receive location-based notifications for events, communities, jobs, and businesses when entering or exiting geofenced areas.
                    </p>
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
