export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Suspended' | 'Banned';
  joinDate: string;
  location: string;
  accountType?: 'User' | 'Business';
}

export interface BusinessProfile {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joinDate: string;
  location: string;
}

export interface Report {
  id: string;
  type: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: 'Pending' | 'Reviewed' | 'Resolved' | 'Dismissed';
  createdDate: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  status: 'Active' | 'Inactive' | 'Expired';
  usageCount: number;
  maxUsage: number;
  expiryDate: string;
  createdDate: string;
}

export interface NotificationLog {
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Moderator';
  status: 'Active' | 'Inactive';
  createdDate: string;
  lastLogin: string;
}

export interface GeofencingUser {
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

export interface UserPreferences {
  socialEnvironmental?: string;
  rightsAdvocacy?: string;
  culturalDemographic?: string;
  lifestyle?: string;
  business?: string;
  political?: string;
  gunControl?: string;
}

export interface UserWithPreferences {
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
