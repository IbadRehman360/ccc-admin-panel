'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const claimsData = [
  { id: 1, businessName: 'Green Valley Healthcare', claimedBy: 'John Doe', email: 'john@example.com', documentsUploaded: 3, status: 'Pending', date: '2026-02-15' },
  { id: 2, businessName: 'Elite Consulting', claimedBy: 'Jane Smith', email: 'jane@example.com', documentsUploaded: 2, status: 'Approved', date: '2026-02-10' },
  { id: 3, businessName: 'Tech Solutions Inc', claimedBy: 'Mike Johnson', email: 'mike@example.com', documentsUploaded: 4, status: 'Rejected', date: '2026-02-12' },
];

export default function ClaimManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Claim Business Management</h1>
        <p className="text-gray-600 mt-1">Review and approve business ownership claims</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E1B047]">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">8</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Claims Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Claimed By</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claimsData.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.businessName}</TableCell>
                  <TableCell>{claim.claimedBy}</TableCell>
                  <TableCell>{claim.email}</TableCell>
                  <TableCell>{claim.documentsUploaded} files</TableCell>
                  <TableCell>
                    <Badge variant={claim.status === 'Approved' ? 'default' : claim.status === 'Pending' ? 'secondary' : 'destructive'}
                      className={claim.status === 'Approved' ? 'bg-[#E1B047]' : ''}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                      {claim.status === 'Pending' && (
                        <>
                          <Button size="sm" className="bg-[#E1B047] hover:bg-[#d4a851]"><CheckCircle className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive"><XCircle className="w-4 h-4" /></Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
