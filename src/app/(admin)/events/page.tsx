'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Calendar, MapPin, Users, DollarSign, Link2, Heart, UserCheck, UserPlus, Clock, Globe, Lock, TrendingUp, Star, MoreVertical, CheckCircle, XCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/layout/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const eventsData = [
  {
    id: 'EVT001',
    name: 'Healthcare Innovation Summit 2026',
    image: 'https://images.unsplash.com/photo-1616992510024-f1293eb00e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29uZmVyZW5jZSUyMHN1bW1pdHxlbnwxfHx8fDE3NzE1MzU3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Join us for a comprehensive summit on the latest innovations in healthcare technology, featuring keynote speakers from leading medical institutions and tech companies.',
    location: 'San Francisco Convention Center, CA',
    charges: 150,
    currency: 'USD',
    dateTime: '2026-03-15T09:00:00',
    endDateTime: '2026-03-15T17:00:00',
    privacy: 'Public',
    url: 'https://healthcaresummit2026.com',
    communityId: 'COM001',
    communityName: 'Healthcare Professionals Network',
    organizerId: 'USR001',
    organizerName: 'Dr. Sarah Johnson',
    organizerEmail: 'sarah.j@example.com',
    totalAttendees: 234,
    goingCount: 189,
    maybeCount: 45,
    favoritesCount: 312,
    status: 'Upcoming',
    capacity: 500,
    going: [
      { id: 'USR001', name: 'Dr. Sarah Johnson', email: 'sarah.j@example.com', rsvpDate: '2026-02-10', status: 'Going' },
      { id: 'USR012', name: 'Dr. Michael Chen', email: 'm.chen@healthmail.com', rsvpDate: '2026-02-11', status: 'Going' },
      { id: 'USR023', name: 'Nurse Emily Davis', email: 'e.davis@hospital.com', rsvpDate: '2026-02-12', status: 'Going' },
      { id: 'USR034', name: 'Dr. Robert Wilson', email: 'r.wilson@clinic.com', rsvpDate: '2026-02-13', status: 'Going' },
      { id: 'USR045', name: 'Lisa Anderson', email: 'l.anderson@medical.com', rsvpDate: '2026-02-14', status: 'Going' }
    ],
    maybe: [
      { id: 'USR056', name: 'Dr. James Martinez', email: 'j.martinez@hospital.com', rsvpDate: '2026-02-15', status: 'Maybe' },
      { id: 'USR067', name: 'Sarah Thompson', email: 's.thompson@clinic.com', rsvpDate: '2026-02-16', status: 'Maybe' },
      { id: 'USR078', name: 'Dr. Patricia Lee', email: 'p.lee@medical.com', rsvpDate: '2026-02-17', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR001', name: 'Dr. Sarah Johnson', email: 'sarah.j@example.com', favoritedDate: '2026-02-09' },
      { id: 'USR012', name: 'Dr. Michael Chen', email: 'm.chen@healthmail.com', favoritedDate: '2026-02-10' },
      { id: 'USR089', name: 'Jennifer White', email: 'j.white@healthcare.com', favoritedDate: '2026-02-11' },
      { id: 'USR090', name: 'Dr. David Brown', email: 'd.brown@clinic.com', favoritedDate: '2026-02-12' }
    ],
    tags: ['Healthcare', 'Technology', 'Innovation', 'Medical'],
    createdDate: '2026-01-15'
  },
  {
    id: 'EVT002',
    name: 'Tech Startup Networking Mixer',
    image: 'https://images.unsplash.com/photo-1731160807880-daf859b64420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMG1lZXR1cHxlbnwxfHx8fDE3NzE0ODA3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Connect with fellow tech entrepreneurs, investors, and innovators. Share ideas, find co-founders, and explore collaboration opportunities.',
    location: 'TechHub NYC, New York',
    charges: 0,
    currency: 'USD',
    dateTime: '2026-02-28T18:00:00',
    endDateTime: '2026-02-28T22:00:00',
    privacy: 'Private',
    url: 'https://techmixer.io/nyc-feb',
    communityId: 'COM002',
    communityName: 'Tech Entrepreneurs Hub',
    organizerId: 'USR002',
    organizerName: 'Mike Chen',
    organizerEmail: 'm.chen@example.com',
    totalAttendees: 87,
    goingCount: 72,
    maybeCount: 15,
    favoritesCount: 145,
    status: 'Upcoming',
    capacity: 100,
    going: [
      { id: 'USR002', name: 'Mike Chen', email: 'm.chen@example.com', rsvpDate: '2026-02-01', status: 'Going' },
      { id: 'USR091', name: 'Lisa Wang', email: 'l.wang@startup.com', rsvpDate: '2026-02-02', status: 'Going' },
      { id: 'USR092', name: 'John Martinez', email: 'j.martinez@tech.io', rsvpDate: '2026-02-03', status: 'Going' }
    ],
    maybe: [
      { id: 'USR093', name: 'Sarah Lee', email: 's.lee@venture.com', rsvpDate: '2026-02-04', status: 'Maybe' },
      { id: 'USR094', name: 'David Kim', email: 'd.kim@innovation.io', rsvpDate: '2026-02-05', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR002', name: 'Mike Chen', email: 'm.chen@example.com', favoritedDate: '2026-01-28' },
      { id: 'USR095', name: 'Rachel Green', email: 'r.green@investor.com', favoritedDate: '2026-01-29' },
      { id: 'USR096', name: 'Tom Anderson', email: 't.anderson@startup.com', favoritedDate: '2026-01-30' }
    ],
    tags: ['Networking', 'Technology', 'Startups', 'Business'],
    createdDate: '2026-01-20'
  },
  {
    id: 'EVT003',
    name: 'Education Leadership Workshop',
    image: 'https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB3b3Jrc2hvcCUyMHNlbWluYXJ8ZW58MXx8fHwxNzcxNTMyODE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'A hands-on workshop for education leaders to explore innovative teaching methods, leadership strategies, and policy development.',
    location: 'Austin Convention Center, TX',
    charges: 75,
    currency: 'USD',
    dateTime: '2026-04-10T10:00:00',
    endDateTime: '2026-04-10T16:00:00',
    privacy: 'Public',
    url: 'https://eduworkshop.org/austin',
    communityId: 'COM003',
    communityName: 'Education Leaders Forum',
    organizerId: 'USR003',
    organizerName: 'Jennifer Martinez',
    organizerEmail: 'j.martinez@example.com',
    totalAttendees: 156,
    goingCount: 134,
    maybeCount: 22,
    favoritesCount: 98,
    status: 'Upcoming',
    capacity: 200,
    going: [
      { id: 'USR003', name: 'Jennifer Martinez', email: 'j.martinez@example.com', rsvpDate: '2026-02-20', status: 'Going' },
      { id: 'USR097', name: 'Dr. Anderson', email: 'anderson@school.edu', rsvpDate: '2026-02-21', status: 'Going' },
      { id: 'USR098', name: 'Principal Davis', email: 'davis@district.edu', rsvpDate: '2026-02-22', status: 'Going' }
    ],
    maybe: [
      { id: 'USR099', name: 'Teacher Brown', email: 'brown@school.edu', rsvpDate: '2026-02-23', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR003', name: 'Jennifer Martinez', email: 'j.martinez@example.com', favoritedDate: '2026-02-18' },
      { id: 'USR100', name: 'Superintendent Lee', email: 's.lee@district.edu', favoritedDate: '2026-02-19' }
    ],
    tags: ['Education', 'Leadership', 'Workshop', 'Professional Development'],
    createdDate: '2026-02-05'
  },
  {
    id: 'EVT004',
    name: 'Community Fitness Challenge',
    image: 'https://images.unsplash.com/photo-1600881333195-dbad115a6162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGNsYXNzfGVufDF8fHx8MTc3MTUzNTcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '30-day fitness challenge with group workouts, nutrition tips, and wellness activities. All fitness levels welcome!',
    location: 'Central Park Fitness Center',
    charges: 25,
    currency: 'USD',
    dateTime: '2026-03-01T07:00:00',
    endDateTime: '2026-03-30T19:00:00',
    privacy: 'Public',
    url: 'https://fitchallenge.com/march2026',
    communityId: 'COM004',
    communityName: 'Fitness & Wellness Community',
    organizerId: 'USR004',
    organizerName: 'James Wilson',
    organizerEmail: 'j.wilson@example.com',
    totalAttendees: 445,
    goingCount: 389,
    maybeCount: 56,
    favoritesCount: 523,
    status: 'Ongoing',
    capacity: 500,
    going: [
      { id: 'USR004', name: 'James Wilson', email: 'j.wilson@example.com', rsvpDate: '2026-01-25', status: 'Going' },
      { id: 'USR101', name: 'Trainer Sarah', email: 'sarah@fitness.com', rsvpDate: '2026-01-26', status: 'Going' },
      { id: 'USR102', name: 'Coach Mike', email: 'mike@workout.com', rsvpDate: '2026-01-27', status: 'Going' }
    ],
    maybe: [
      { id: 'USR103', name: 'Jane Smith', email: 'jane@wellness.com', rsvpDate: '2026-01-28', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR104', name: 'Nutritionist Kelly', email: 'kelly@health.com', favoritedDate: '2026-01-23' },
      { id: 'USR105', name: 'Yoga Instructor Amy', email: 'amy@yoga.com', favoritedDate: '2026-01-24' }
    ],
    tags: ['Fitness', 'Wellness', 'Challenge', 'Community'],
    createdDate: '2026-01-10'
  },
  {
    id: 'EVT005',
    name: 'Gourmet Food Festival',
    image: 'https://images.unsplash.com/photo-1760026759916-16e48b34cee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWwlMjBjb29raW5nfGVufDF8fHx8MTc3MTUzNTcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Taste dishes from the best local restaurants, meet renowned chefs, and enjoy live cooking demonstrations.',
    location: 'Downtown Waterfront Plaza',
    charges: 45,
    currency: 'USD',
    dateTime: '2026-05-15T11:00:00',
    endDateTime: '2026-05-15T20:00:00',
    privacy: 'Public',
    url: 'https://foodfest.local/may2026',
    communityId: 'COM006',
    communityName: 'Local Foodies Network',
    organizerId: 'USR006',
    organizerName: 'Emma Davis',
    organizerEmail: 'e.davis@example.com',
    totalAttendees: 678,
    goingCount: 612,
    maybeCount: 66,
    favoritesCount: 891,
    status: 'Upcoming',
    capacity: 1000,
    going: [
      { id: 'USR006', name: 'Emma Davis', email: 'e.davis@example.com', rsvpDate: '2026-02-05', status: 'Going' },
      { id: 'USR106', name: 'Chef Carlos', email: 'carlos@restaurant.com', rsvpDate: '2026-02-06', status: 'Going' },
      { id: 'USR107', name: 'Food Blogger Sam', email: 'sam@foodblog.com', rsvpDate: '2026-02-07', status: 'Going' }
    ],
    maybe: [
      { id: 'USR108', name: 'Mike Johnson', email: 'mike@foodies.com', rsvpDate: '2026-02-08', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR109', name: 'Restaurant Critic', email: 'critic@food.com', favoritedDate: '2026-02-03' },
      { id: 'USR110', name: 'Chef Maria', email: 'maria@cuisine.com', favoritedDate: '2026-02-04' }
    ],
    tags: ['Food', 'Festival', 'Culinary', 'Community'],
    createdDate: '2026-01-30'
  },
  {
    id: 'EVT006',
    name: 'Photography Exhibition: Urban Stories',
    image: 'https://images.unsplash.com/photo-1742497359858-8e0a442c9c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGV4aGliaXRpb24lMjBnYWxsZXJ5fGVufDF8fHx8MTc3MTQ3OTAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'An exclusive exhibition showcasing urban photography from talented community members. Wine and networking included.',
    location: 'City Art Gallery',
    charges: 20,
    currency: 'USD',
    dateTime: '2026-03-20T18:00:00',
    endDateTime: '2026-03-20T22:00:00',
    privacy: 'Private',
    url: 'https://photomasters.art/urban-stories',
    communityId: 'COM007',
    communityName: 'Photography Masters',
    organizerId: 'USR007',
    organizerName: 'David Lee',
    organizerEmail: 'd.lee@example.com',
    totalAttendees: 92,
    goingCount: 78,
    maybeCount: 14,
    favoritesCount: 156,
    status: 'Upcoming',
    capacity: 120,
    going: [
      { id: 'USR007', name: 'David Lee', email: 'd.lee@example.com', rsvpDate: '2026-02-10', status: 'Going' },
      { id: 'USR111', name: 'Photo Pro Anna', email: 'anna@photography.com', rsvpDate: '2026-02-11', status: 'Going' },
      { id: 'USR112', name: 'Lens Master Tom', email: 'tom@lenswork.com', rsvpDate: '2026-02-12', status: 'Going' }
    ],
    maybe: [
      { id: 'USR113', name: 'New Photographer', email: 'newbie@photos.com', rsvpDate: '2026-02-13', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR114', name: 'Gallery Owner', email: 'owner@gallery.com', favoritedDate: '2026-02-08' },
      { id: 'USR115', name: 'Art Curator', email: 'curator@art.com', favoritedDate: '2026-02-09' }
    ],
    tags: ['Photography', 'Art', 'Exhibition', 'Networking'],
    createdDate: '2026-02-01'
  },
  {
    id: 'EVT007',
    name: 'Summer Concert in the Park',
    image: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzE1MTY2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Free outdoor concert featuring local bands and musicians. Bring your family and enjoy live music under the stars.',
    location: 'Memorial Park Amphitheater',
    charges: 0,
    currency: 'USD',
    dateTime: '2026-06-20T19:00:00',
    endDateTime: '2026-06-20T23:00:00',
    privacy: 'Public',
    url: 'https://cityconcerts.org/summer',
    communityId: 'COM001',
    communityName: 'Healthcare Professionals Network',
    organizerId: 'USR001',
    organizerName: 'Dr. Sarah Johnson',
    organizerEmail: 'sarah.j@example.com',
    totalAttendees: 1234,
    goingCount: 1089,
    maybeCount: 145,
    favoritesCount: 2156,
    status: 'Upcoming',
    capacity: 2000,
    going: [
      { id: 'USR116', name: 'Music Lover Sarah', email: 'sarah@music.com', rsvpDate: '2026-03-01', status: 'Going' },
      { id: 'USR117', name: 'Concert Fan Mike', email: 'mike@concerts.com', rsvpDate: '2026-03-02', status: 'Going' }
    ],
    maybe: [
      { id: 'USR118', name: 'Family Johnson', email: 'family@email.com', rsvpDate: '2026-03-03', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR119', name: 'Band Member', email: 'band@music.com', favoritedDate: '2026-02-28' },
      { id: 'USR120', name: 'Event Planner', email: 'planner@events.com', favoritedDate: '2026-03-01' }
    ],
    tags: ['Music', 'Concert', 'Free', 'Community', 'Family'],
    createdDate: '2026-02-15'
  },
  {
    id: 'EVT008',
    name: 'Business Leadership Roundtable',
    image: 'https://images.unsplash.com/photo-1675716921224-e087a0cca69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwYnVzaW5lc3MlMjBldmVudHxlbnwxfHx8fDE3NzE0Mjc2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Monthly roundtable discussion for business leaders to share insights, challenges, and strategies.',
    location: 'Executive Lounge, Business District',
    charges: 100,
    currency: 'USD',
    dateTime: '2026-02-25T17:00:00',
    endDateTime: '2026-02-25T20:00:00',
    privacy: 'Private',
    url: 'https://businessleaders.net/roundtable',
    communityId: 'COM002',
    communityName: 'Tech Entrepreneurs Hub',
    organizerId: 'USR002',
    organizerName: 'Mike Chen',
    organizerEmail: 'm.chen@example.com',
    totalAttendees: 45,
    goingCount: 42,
    maybeCount: 3,
    favoritesCount: 67,
    status: 'Upcoming',
    capacity: 50,
    going: [
      { id: 'USR121', name: 'CEO Jennifer', email: 'jennifer@company.com', rsvpDate: '2026-02-01', status: 'Going' },
      { id: 'USR122', name: 'Director Tom', email: 'tom@business.com', rsvpDate: '2026-02-02', status: 'Going' }
    ],
    maybe: [
      { id: 'USR123', name: 'VP Marketing', email: 'vp@marketing.com', rsvpDate: '2026-02-03', status: 'Maybe' }
    ],
    favorites: [
      { id: 'USR124', name: 'Executive Coach', email: 'coach@executive.com', favoritedDate: '2026-01-30' },
      { id: 'USR125', name: 'Business Consultant', email: 'consultant@biz.com', favoritedDate: '2026-01-31' }
    ],
    tags: ['Business', 'Leadership', 'Networking', 'Executive'],
    createdDate: '2026-01-25'
  }
];

export default function EventManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsTab, setDetailsTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return <Badge className="bg-[#195440]">Upcoming</Badge>;
      case 'Ongoing':
        return <Badge className="bg-[#E1B047]">Ongoing</Badge>;
      case 'Completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrivacyBadge = (privacy: string) => {
    return privacy === 'Public' ? (
      <Badge variant="outline" className="border-[#195440] text-[#195440]">
        <Globe className="w-3 h-3 mr-1" />
        Public
      </Badge>
    ) : (
      <Badge variant="outline">
        <Lock className="w-3 h-3 mr-1" />
        Private
      </Badge>
    );
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

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return 'Free';
    return `$${amount} ${currency}`;
  };

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
    setDetailsTab('overview');
  };

  // Filter and sort events
  const filteredEvents = eventsData
    .filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.communityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrivacy = privacyFilter === 'all' || event.privacy === privacyFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesPrivacy && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      if (sortBy === 'attendees') return b.totalAttendees - a.totalAttendees;
      if (sortBy === 'favorites') return b.favoritesCount - a.favoritesCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Stats
  const totalEvents = eventsData.length;
  const upcomingEvents = eventsData.filter(e => e.status === 'Upcoming').length;
  const ongoingEvents = eventsData.filter(e => e.status === 'Ongoing').length;
  const totalAttendees = eventsData.reduce((sum, e) => sum + e.totalAttendees, 0);
  const avgAttendees = Math.round(totalAttendees / totalEvents);
  const totalFavorites = eventsData.reduce((sum, e) => sum + e.favoritesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Events Overview</h1>
        <p className="text-gray-600 mt-1">View and monitor all community events and participation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{totalEvents}</div>
            <p className="text-sm text-gray-600 mt-1">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{upcomingEvents}</div>
            <p className="text-sm text-gray-600 mt-1">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E1B047]">{ongoingEvents}</div>
            <p className="text-sm text-gray-600 mt-1">Ongoing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalAttendees}</div>
            <p className="text-sm text-gray-600 mt-1">Total Attendees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{avgAttendees}</div>
            <p className="text-sm text-gray-600 mt-1">Avg per Event</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-pink-600">{totalFavorites}</div>
            <p className="text-sm text-gray-600 mt-1">Total Favorites</p>
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
                  placeholder="Search events by name, location, or community..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Privacy</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Event Date</SelectItem>
                <SelectItem value="attendees">Most Attendees</SelectItem>
                <SelectItem value="favorites">Most Favorites</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>Privacy</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Favorites</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="max-w-xs">
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-gray-500">{event.communityName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(event.dateTime)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{formatCurrency(event.charges, event.currency)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPrivacyBadge(event.privacy)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">{event.totalAttendees}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.goingCount} going, {event.maybeCount} maybe
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-pink-600" />
                      <span className="font-medium text-pink-600">{event.favoritesCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(event)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete event information and participation tracking
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <Tabs value={detailsTab} onValueChange={setDetailsTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="going">Going ({selectedEvent.goingCount})</TabsTrigger>
                <TabsTrigger value="maybe">Maybe ({selectedEvent.maybeCount})</TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({selectedEvent.favoritesCount})</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6 px-6">
                {/* Event Image */}
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Event Name & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedEvent.communityName}</p>
                  </div>
                  {getStatusBadge(selectedEvent.status)}
                </div>

                <Separator />

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Event ID</Label>
                    <p className="font-medium text-[#195440]">{selectedEvent.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Privacy</Label>
                    <div className="mt-1">{getPrivacyBadge(selectedEvent.privacy)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Start Date & Time</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{formatDate(selectedEvent.dateTime)}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">End Date & Time</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{formatDate(selectedEvent.endDateTime)}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Charges</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-lg">{formatCurrency(selectedEvent.charges, selectedEvent.currency)}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Capacity</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{selectedEvent.totalAttendees} / {selectedEvent.capacity}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Event URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <a 
                        href={selectedEvent.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#195440] hover:underline font-medium"
                      >
                        {selectedEvent.url}
                      </a>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <Label className="text-gray-600">Description</Label>
                  <p className="mt-2 text-sm bg-gray-50 p-4 rounded-lg">{selectedEvent.description}</p>
                </div>

                <Separator />

                {/* Organizer Info */}
                <div>
                  <Label className="text-gray-600">Organizer Information</Label>
                  <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={selectedEvent.organizerName} size="md" />
                      <div className="flex-1">
                        <div className="font-medium">{selectedEvent.organizerName}</div>
                        <div className="text-sm text-gray-600">ID: {selectedEvent.organizerId}</div>
                        <div className="text-sm text-gray-600">{selectedEvent.organizerEmail}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Participation Stats */}
                <div>
                  <Label className="text-gray-600">Participation & Engagement</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{selectedEvent.totalAttendees}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Attendees</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{selectedEvent.goingCount}</div>
                      <div className="text-sm text-gray-600 mt-1">Going</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">{selectedEvent.maybeCount}</div>
                      <div className="text-sm text-gray-600 mt-1">Maybe</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                      <div className="text-2xl font-bold text-pink-600">{selectedEvent.favoritesCount}</div>
                      <div className="text-sm text-gray-600 mt-1">Favorites</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <Label className="text-gray-600">Event Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEvent.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Going Tab */}
              <TabsContent value="going" className="space-y-6 mt-6 px-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900">Confirmed Attendees (Going)</h3>
                      <p className="text-sm text-green-800 mt-1">
                        {selectedEvent.goingCount} users confirmed attendance
                      </p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedEvent.going.map((attendee: any) => (
                    <div key={attendee.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {attendee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-sm text-gray-600">{attendee.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-600">Going</Badge>
                        <p className="text-xs text-gray-500 mt-1">RSVP: {attendee.rsvpDate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEvent.going.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                    <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No confirmed attendees yet</p>
                  </div>
                )}
              </TabsContent>

              {/* Maybe Tab */}
              <TabsContent value="maybe" className="space-y-6 mt-6 px-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-purple-900">Interested Attendees (Maybe)</h3>
                      <p className="text-sm text-purple-800 mt-1">
                        {selectedEvent.maybeCount} users marked as interested
                      </p>
                    </div>
                    <Info className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedEvent.maybe.map((attendee: any) => (
                    <div key={attendee.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                          {attendee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-sm text-gray-600">{attendee.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-purple-600">Maybe</Badge>
                        <p className="text-xs text-gray-500 mt-1">RSVP: {attendee.rsvpDate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEvent.maybe.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                    <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No interested attendees</p>
                  </div>
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6 mt-6 px-6">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-pink-900">Users Who Favorited This Event</h3>
                      <p className="text-sm text-pink-800 mt-1">
                        {selectedEvent.favoritesCount} users added this event to favorites
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedEvent.favorites.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-pink-600">
                          <Heart className="w-3 h-3 mr-1" />
                          Favorited
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Added: {user.favoritedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEvent.favorites.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No favorites yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
