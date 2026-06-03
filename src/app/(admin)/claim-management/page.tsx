'use client';

import { AlertCircle, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClaimManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Claim Management</h1>
        <p className="text-gray-600 mt-2">Review and approve business ownership claims</p>
      </div>

      <Card>
        <CardContent className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-sm text-gray-500 max-w-md mb-4">
            Business claim approval requires a new <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">business_claim</code> table
            with claimant info, submitted documents, and status workflow. Schema migration needed.
          </p>
          <div className="flex items-start gap-2 max-w-md bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-left text-sm text-blue-900 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>The Pending Approvals page has a stub for this on the Business Claims tab as well.</span>
          </div>
          <Link href="/pending-approvals">
            <Button variant="outline">Go to Pending Approvals</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
