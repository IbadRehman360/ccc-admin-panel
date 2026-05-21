'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Ban, Briefcase, Building2, Users, Calendar, MapPin, DollarSign, Clock, FileText, Mail, Phone, ShieldAlert, AlertTriangle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/layout/UserAvatar';

const jobsData = [
  {
    id: 'JOB001',
    business: {
      id: 'BUS001',
      name: 'Green Valley Healthcare',
      hiringStatus: 'Active'
    },
    title: 'Senior Registered Nurse',
    type: 'Full-time',
    location: 'Downtown Medical Center, Suite 400',
    salary: '$75,000 - $95,000',
    description: 'We are seeking an experienced registered nurse to join our healthcare team. The ideal candidate will have 5+ years of experience in a clinical setting and demonstrate excellent patient care skills.',
    status: 'Active',
    applicationsCount: 45,
    postedDate: '2026-02-10T09:00:00'
  },
  {
    id: 'JOB002',
    business: {
      id: 'BUS002',
      name: 'TechCorp Solutions',
      hiringStatus: 'Active'
    },
    title: 'Senior Software Engineer',
    type: 'Full-time',
    location: 'Tech Park, Building 5 (Hybrid)',
    salary: '$120,000 - $160,000',
    description: 'Join our innovative engineering team to build cutting-edge cloud-based solutions. We\'re looking for a passionate software engineer with expertise in modern web technologies and cloud architecture.',
    status: 'Active',
    applicationsCount: 123,
    postedDate: '2026-02-05T08:00:00'
  },
  {
    id: 'JOB003',
    business: {
      id: 'BUS003',
      name: 'Elite Consulting Group',
      hiringStatus: 'Active'
    },
    title: 'Senior Business Analyst',
    type: 'Full-time',
    location: 'Business District Plaza, Floor 12',
    salary: '$85,000 - $110,000',
    description: 'We are seeking a skilled business analyst to help our clients optimize their operations. This role requires strong analytical abilities and excellent communication skills.',
    status: 'Closed',
    applicationsCount: 67,
    postedDate: '2026-01-28T10:00:00'
  },
  {
    id: 'JOB004',
    business: {
      id: 'BUS004',
      name: 'Elite Fitness Center',
      hiringStatus: 'Active'
    },
    title: 'Certified Personal Trainer',
    type: 'Full-time',
    location: '123 Fitness Avenue',
    salary: '$45,000 - $65,000 + Commission',
    description: 'Join our dynamic fitness team! We\'re looking for passionate personal trainers to help our members achieve their fitness goals.',
    status: 'Active',
    applicationsCount: 34,
    postedDate: '2026-02-12T07:00:00'
  },
  {
    id: 'JOB005',
    business: {
      id: 'BUS005',
      name: 'La Bella Italia Restaurant',
      hiringStatus: 'Active'
    },
    title: 'Executive Chef',
    type: 'Full-time',
    location: '456 Main Street',
    salary: '$70,000 - $90,000',
    description: 'Seeking an experienced executive chef to lead our kitchen team. Must have expertise in Italian cuisine and proven leadership abilities.',
    status: 'Active',
    applicationsCount: 28,
    postedDate: '2026-02-08T09:30:00'
  },
  {
    id: 'JOB006',
    business: {
      id: 'BUS006',
      name: 'TechLearn Academy',
      hiringStatus: 'Active'
    },
    title: 'Web Development Instructor',
    type: 'Full-time',
    location: 'Education Campus, Block A',
    salary: '$65,000 - $80,000',
    description: 'Join our teaching team to educate the next generation of web developers. Must have strong technical skills and teaching experience.',
    status: 'Active',
    applicationsCount: 19,
    postedDate: '2026-02-14T08:00:00'
  },
  {
    id: 'JOB007',
    business: {
      id: 'BUS007',
      name: 'Premium Real Estate Group',
      hiringStatus: 'Active'
    },
    title: 'Real Estate Sales Agent',
    type: 'Full-time',
    location: 'Luxury Plaza, Floor 10',
    salary: '$50,000 + Commission',
    description: 'Looking for ambitious sales agents to join our luxury real estate team. High earning potential for the right candidates.',
    status: 'Active',
    applicationsCount: 56,
    postedDate: '2026-02-06T10:00:00'
  },
  {
    id: 'JOB008',
    business: {
      id: 'BUS008',
      name: 'Marketing Masters Inc',
      hiringStatus: 'Active'
    },
    title: 'Digital Marketing Manager',
    type: 'Full-time',
    location: 'Creative Hub, Suite 300',
    salary: '$75,000 - $95,000',
    description: 'Lead our digital marketing initiatives and drive growth for our clients. Must have proven experience in digital marketing strategies.',
    status: 'Active',
    applicationsCount: 89,
    postedDate: '2026-02-01T09:00:00'
  },
  {
    id: 'JOB009',
    business: {
      id: 'BUS009',
      name: 'Financial Services Corp',
      hiringStatus: 'Active'
    },
    title: 'Financial Advisor',
    type: 'Full-time',
    location: 'Financial District Tower, Floor 15',
    salary: '$60,000 - $80,000 + Bonus',
    description: 'Join our wealth management team to help clients achieve their financial goals. Series 7 and 63 licenses required.',
    status: 'Closed',
    applicationsCount: 42,
    postedDate: '2026-01-25T08:30:00'
  },
  {
    id: 'JOB010',
    business: {
      id: 'BUS010',
      name: 'Suspicious Recruitment Agency',
      hiringStatus: 'Suspended'
    },
    title: 'Work From Home - Easy Money',
    type: 'Remote',
    location: 'Work from anywhere',
    salary: '$5,000+ per week',
    description: 'Make easy money from home! No experience needed! Just pay $500 registration fee to get started!',
    status: 'Closed',
    applicationsCount: 12,
    postedDate: '2026-02-16T10:00:00'
  }
];

export default function JobsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('permanent');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-[#195440]">Active</Badge>;
      case 'Closed':
        return <Badge variant="secondary">Closed</Badge>;
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

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setShowDetailsDialog(true);
  };

  const handleSuspendBusiness = (job: any) => {
    setSelectedJob(job);
    setShowSuspendDialog(true);
  };

  const confirmSuspend = () => {
    // Log moderation action
    console.log('Business Hiring Privileges Suspended:', {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      businessId: selectedJob.business.id,
      businessName: selectedJob.business.name,
      businessContact: selectedJob.business.contact,
      businessEmail: selectedJob.business.email,
      suspendReason: suspendReason,
      suspendDuration: suspendDuration,
      timestamp: new Date().toISOString(),
      suspendedBy: 'Current Admin'
    });
    setShowSuspendDialog(false);
    setSuspendReason('');
    setSuspendDuration('permanent');
  };

  // Filter jobs
  const filteredJobs = jobsData
    .filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  // Stats
  const totalJobs = jobsData.length;
  const activeJobs = jobsData.filter(j => j.status === 'Active').length;
  const closedJobs = jobsData.filter(j => j.status === 'Closed').length;
  const totalApplications = jobsData.reduce((sum, j) => sum + j.applicationsCount, 0);
  const avgApplications = Math.round(totalApplications / totalJobs);
  const suspendedBusinesses = jobsData.filter(j => j.business.hiringStatus === 'Suspended').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
        <p className="text-gray-600 mt-1">Monitor job postings and manage hiring privileges</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{totalJobs}</div>
            <p className="text-sm text-gray-600 mt-1">Total Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{activeJobs}</div>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{closedJobs}</div>
            <p className="text-sm text-gray-600 mt-1">Closed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
            <p className="text-sm text-gray-600 mt-1">Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E1B047]">{avgApplications}</div>
            <p className="text-sm text-gray-600 mt-1">Avg per Job</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{suspendedBusinesses}</div>
            <p className="text-sm text-gray-600 mt-1">Suspended</p>
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
                  placeholder="Search by job title, business name, or job ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Listings ({filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} className={job.business.hiringStatus === 'Suspended' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.business.name}</p>
                      <p className="text-xs text-gray-500">{job.business.id}</p>
                      {job.business.hiringStatus === 'Suspended' && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          <Ban className="w-3 h-3 mr-1" />
                          Suspended
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-blue-600">{job.applicationsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(job.postedDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(job)}
                        title="View Job Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendBusiness(job)}
                        disabled={job.business.hiringStatus === 'Suspended'}
                        title="Suspend Hiring Privileges"
                      >
                        <Ban className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Job Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Complete job listing information and applications</DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6 px-6 overflow-y-auto flex-1">
              {/* Job Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-lg text-gray-600 mt-1">{selectedJob.business.name}</p>
                  <div className="flex items-center gap-4 mt-3">
                    {getStatusBadge(selectedJob.status)}
                    <Badge variant="outline">{selectedJob.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#195440]">{selectedJob.applicationsCount}</div>
                  <p className="text-sm text-gray-600 mt-1">Applications</p>
                </div>
              </div>

              <Separator />

              {/* Job Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Job ID</Label>
                  <p className="font-medium text-[#195440]">{selectedJob.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Business Name</Label>
                  <p className="font-medium">{selectedJob.business.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Type</Label>
                  <Badge variant="outline" className="mt-1">{selectedJob.type}</Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Salary Range</Label>
                  <p className="font-medium">{selectedJob.salary}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-600">Location</Label>
                  <p className="font-medium">{selectedJob.location}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Posted Date</Label>
                  <p className="font-medium">{formatDate(selectedJob.postedDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedJob.status)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Job Description */}
              <div>
                <Label className="text-gray-600 mb-2 block">Job Description</Label>
                <p className="text-sm bg-gray-50 p-4 rounded-lg border leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedJob && selectedJob.business.hiringStatus !== 'Suspended' && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleSuspendBusiness(selectedJob);
                }}
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspend Hiring
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Business Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Suspend Hiring Privileges
            </DialogTitle>
            <DialogDescription>
              Suspend this business's ability to post new job listings
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm font-bold text-red-900">WARNING: This action will prevent new job postings</p>
                </div>
                <p className="text-sm font-medium">Business: {selectedJob.business.name}</p>
                <p className="text-xs text-gray-600 mt-1">Business ID: {selectedJob.business.id}</p>
                <p className="text-xs text-gray-600">Contact: {selectedJob.business.contact}</p>
                <p className="text-xs text-gray-600">Current Job: {selectedJob.title}</p>
              </div>

              <div>
                <Label>Suspension Duration</Label>
                <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reason for Suspension</Label>
                <Textarea
                  placeholder="Provide a detailed reason for suspending this business's hiring privileges..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="mt-2"
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-2">
                  The business will be notified via email about this suspension.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Effects of suspension:</strong><br />
                  • Business cannot post new job listings<br />
                  • Existing active job listings will remain visible<br />
                  • Business can still manage applications for existing jobs
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmSuspend}
              disabled={!suspendReason}
            >
              <Ban className="w-4 h-4 mr-2" />
              Confirm Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
