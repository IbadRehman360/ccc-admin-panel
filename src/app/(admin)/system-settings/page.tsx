'use client';

import { useEffect, useState } from 'react';
import {
  FileText, Shield, Info, Save, RotateCcw, Loader2, Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetTermsQuery,
  useSetTermsMutation,
  useGetPrivacyQuery,
  useSetPrivacyMutation,
  useGetAboutQuery,
  useSetAboutMutation,
  type SettingsContent,
} from '@/store/api/settingsApi';

const formatDateTime = (iso: string | null) => {
  if (!iso) return 'Never';
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
};

const extractError = (err: unknown) => {
  const msg = (err as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong.';
};

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Manage Terms, Privacy Policy, and About content</p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="terms">
            <FileText className="w-4 h-4 mr-2" />Terms & Conditions
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="about">
            <Info className="w-4 h-4 mr-2" />About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms"><TermsEditor /></TabsContent>
        <TabsContent value="privacy"><PrivacyEditor /></TabsContent>
        <TabsContent value="about"><AboutEditor /></TabsContent>
      </Tabs>
    </div>
  );
}

function TermsEditor() {
  const { data, isLoading, refetch } = useGetTermsQuery();
  const [save, { isLoading: saving }] = useSetTermsMutation();
  return (
    <ContentEditor
      title="Terms & Conditions"
      icon={FileText}
      data={data}
      isLoading={isLoading}
      saving={saving}
      onSave={async (content) => { await save({ content }).unwrap(); refetch(); }}
    />
  );
}

function PrivacyEditor() {
  const { data, isLoading, refetch } = useGetPrivacyQuery();
  const [save, { isLoading: saving }] = useSetPrivacyMutation();
  return (
    <ContentEditor
      title="Privacy Policy"
      icon={Shield}
      data={data}
      isLoading={isLoading}
      saving={saving}
      onSave={async (content) => { await save({ content }).unwrap(); refetch(); }}
    />
  );
}

function AboutEditor() {
  const { data, isLoading, refetch } = useGetAboutQuery();
  const [save, { isLoading: saving }] = useSetAboutMutation();
  return (
    <ContentEditor
      title="About App"
      icon={Info}
      data={data}
      isLoading={isLoading}
      saving={saving}
      onSave={async (content) => { await save({ content }).unwrap(); refetch(); }}
    />
  );
}

function ContentEditor({
  title, icon: Icon, data, isLoading, saving, onSave,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data?: SettingsContent;
  isLoading: boolean;
  saving: boolean;
  onSave: (content: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft(data.content || '');
  }, [data]);

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  const dirty = draft !== (data.content || '');
  const charCount = draft.length;
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  const handleSave = async () => {
    setError(null);
    try {
      await onSave(draft);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e) {
      setError(extractError(e));
    }
  };

  const handleReset = () => {
    setDraft(data.content || '');
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-[#195440]" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Last updated: {formatDateTime(data.updated_at)}
              </span>
              {data.id && <Badge variant="outline" className="text-xs">ID: {data.id.substring(0, 8)}…</Badge>}
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>{wordCount.toLocaleString()} words</div>
            <div>{charCount.toLocaleString()} chars</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`content-${title}`} className="sr-only">{title} content</Label>
          <Textarea
            id={`content-${title}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()} content...`}
            rows={20}
            className="font-mono text-sm leading-relaxed"
          />
          <p className="text-xs text-gray-500 mt-2">
            Plain text or Markdown. Renders as-is on the mobile app.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {savedAt && !dirty && (
          <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            ✓ Saved at {savedAt}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {dirty ? <span className="text-orange-600 font-medium">Unsaved changes</span> : 'No changes'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!dirty || saving}>
              <RotateCcw className="w-4 h-4 mr-2" />Discard
            </Button>
            <Button onClick={handleSave} disabled={!dirty || saving} className="bg-[#195440] hover:bg-[#195440]/90">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
