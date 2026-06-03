'use client';

import { AlertCircle, Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">News</h1>
        <p className="text-gray-600 mt-2">Manage news articles in the platform feed</p>
      </div>

      <Card>
        <CardContent className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
            <Newspaper className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-sm text-gray-500 max-w-md mb-4">
            News article management requires a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">news_article</code> table
            with title, source, content URL, image, tags, views, likes, and feature flag.
          </p>
          <div className="flex items-start gap-2 max-w-md bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-left text-sm text-blue-900">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Schema migration needed. Page not in sidebar — accessible via direct URL only.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
