'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Save, 
  Settings,
  Shield,
  Info,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function SystemSettingsPage() {
  // Terms & Conditions state
  const [termsContent, setTermsContent] = useState(`TERMS AND CONDITIONS

Last Updated: February 1, 2026

1. ACCEPTANCE OF TERMS

By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE

Permission is granted to temporarily access the materials on this platform for personal, non-commercial transitory viewing only.

3. USER ACCOUNTS

3.1 Account Creation
- You must provide accurate and complete information
- You are responsible for maintaining the confidentiality of your account
- You must be at least 18 years old to create an account

3.2 Account Security
- Choose a strong password and keep it confidential
- Notify us immediately of any unauthorized use
- We reserve the right to suspend accounts that violate these terms

4. USER CONDUCT

You agree not to:
- Violate any applicable laws or regulations
- Harass, abuse, or harm other users
- Post false, misleading, or fraudulent content
- Attempt to gain unauthorized access to the platform
- Use the platform for commercial purposes without permission

5. CONTENT GUIDELINES

5.1 User-Generated Content
- You retain ownership of content you post
- You grant us a license to use, display, and distribute your content
- Content must not violate intellectual property rights

5.2 Prohibited Content
- Hate speech or discriminatory content
- Explicit or adult content
- Spam or unsolicited commercial messages
- Malicious code or harmful software

6. PRIVACY

Your use of the platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.

7. INTELLECTUAL PROPERTY

All platform content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.

8. TERMINATION

We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users.

9. LIMITATION OF LIABILITY

In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the platform.

10. CHANGES TO TERMS

We reserve the right to modify these terms at any time. We will notify users of any material changes.

11. GOVERNING LAW

These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate.

12. CONTACT INFORMATION

For questions about these Terms, please contact us at:
Email: legal@platform.com
Address: 123 Legal Street, City, State, ZIP`);

  const [termsLastUpdated, setTermsLastUpdated] = useState('February 1, 2026');
  const [termsUpdatedBy, setTermsUpdatedBy] = useState('Legal Team');
  const [termsHasChanges, setTermsHasChanges] = useState(false);

  // Privacy Policy state
  const [privacyContent, setPrivacyContent] = useState(`PRIVACY POLICY

Last Updated: February 1, 2026

1. INTRODUCTION

We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data.

2. DATA WE COLLECT

2.1 Information You Provide
- Account information (name, email, phone number)
- Profile information (photo, bio, preferences)
- Communications (messages, posts, comments)
- Payment information (for premium features)

2.2 Information We Collect Automatically
- Device information (device type, operating system)
- Usage data (features used, time spent)
- Location data (with your permission)
- Cookies and similar technologies

3. HOW WE USE YOUR DATA

We use your data to:
- Provide and improve our services
- Personalize your experience
- Connect you with other users
- Send notifications and updates
- Ensure platform security
- Comply with legal obligations
- Analyze platform usage and trends

4. DATA SHARING

We may share your data with:
- Other users (based on your privacy settings)
- Service providers (who assist in platform operations)
- Business partners (with your consent)
- Legal authorities (when required by law)

We never sell your personal data to third parties.

5. YOUR PRIVACY RIGHTS

You have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your data (right to be forgotten)
- Object to data processing
- Data portability
- Withdraw consent

6. DATA SECURITY

We implement appropriate technical and organizational measures to protect your data:
- Encryption in transit and at rest
- Regular security audits
- Access controls and authentication
- Employee training on data protection

7. DATA RETENTION

We retain your data for as long as necessary to:
- Provide our services
- Comply with legal obligations
- Resolve disputes
- Enforce our agreements

When you delete your account, we will delete or anonymize your data within 90 days, except where retention is required by law.

8. COOKIES

We use cookies and similar technologies to:
- Remember your preferences
- Analyze platform usage
- Improve user experience
- Provide targeted content

You can control cookies through your browser settings.

9. THIRD-PARTY SERVICES

Our platform may contain links to third-party websites or services. We are not responsible for their privacy practices.

10. CHILDREN'S PRIVACY

Our platform is not intended for users under 18. We do not knowingly collect data from children.

11. INTERNATIONAL DATA TRANSFERS

Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.

12. CHANGES TO PRIVACY POLICY

We may update this privacy policy from time to time. We will notify you of significant changes via email or platform notification.

13. CONTACT US

If you have questions about this privacy policy or our data practices:
Email: privacy@platform.com
Address: 123 Privacy Street, City, State, ZIP
Data Protection Officer: dpo@platform.com`);

  const [privacyLastUpdated, setPrivacyLastUpdated] = useState('February 1, 2026');
  const [privacyUpdatedBy, setPrivacyUpdatedBy] = useState('Legal Team');
  const [privacyHasChanges, setPrivacyHasChanges] = useState(false);

  // About App state
  const [aboutContent, setAboutContent] = useState(`ABOUT OUR APP

Version: 2.5.3
Build: 2530
Release Date: February 15, 2026

OVERVIEW

Welcome to our platform - a comprehensive social networking and business connection solution designed to bring people and opportunities together. Our app is built with cutting-edge technology to provide a seamless, secure, and engaging experience for all users.

KEY FEATURES

🌐 Social Networking
Connect with like-minded individuals, join communities, and build meaningful relationships in a safe and moderated environment.

💼 Business Connections
Discover job opportunities, connect with businesses, and grow your professional network with our intelligent matching system.

🎯 Smart Matching
Our AI-powered matching engine connects you with relevant people, businesses, and opportunities based on your interests and preferences.

📍 Location-Based Services
Find events, businesses, and communities near you with our advanced geofencing technology.

🔔 Real-Time Notifications
Stay updated with instant notifications for messages, events, and important updates.

🛡️ Security & Privacy
Your data security is our top priority. We employ industry-leading encryption and security measures to protect your information.

PLATFORM AVAILABILITY

📱 iOS - Available on App Store
🤖 Android - Available on Google Play Store
💻 Web - Access via web browser

SUPPORT

For assistance, please contact:
Email: support@platform.com
Phone: 1-800-PLATFORM
Help Center: help.platform.com

COMPANY INFORMATION

Founded: 2024
Headquarters: San Francisco, CA
Mission: Connecting people and opportunities worldwide

Follow Us:
Twitter: @ourplatform
Facebook: /ourplatform
LinkedIn: /company/ourplatform
Instagram: @ourplatform

© 2026 Platform Inc. All rights reserved.`);

  const [aboutLastUpdated, setAboutLastUpdated] = useState('February 15, 2026');
  const [aboutUpdatedBy, setAboutUpdatedBy] = useState('Content Team');
  const [aboutHasChanges, setAboutHasChanges] = useState(false);

  const handleTermsChange = (value: string) => {
    setTermsContent(value);
    setTermsHasChanges(true);
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacyContent(value);
    setPrivacyHasChanges(true);
  };

  const handleAboutChange = (value: string) => {
    setAboutContent(value);
    setAboutHasChanges(true);
  };

  const handleSaveTerms = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    console.log('Terms & Conditions Updated:', {
      previousContent: termsContent.substring(0, 100) + '...',
      newContent: termsContent,
      previousLastUpdated: termsLastUpdated,
      newLastUpdated: formattedDate,
      updatedBy: 'Current Admin',
      timestamp: now.toISOString(),
      action: 'Terms & Conditions Saved',
      contentLength: termsContent.length,
      changesMade: termsHasChanges
    });

    setTermsLastUpdated(formattedDate);
    setTermsUpdatedBy('Current Admin');
    setTermsHasChanges(false);

    alert('Terms & Conditions have been successfully updated!\n\nAll users will see the latest version.');
  };

  const handleSavePrivacy = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    console.log('Privacy Policy Updated:', {
      previousContent: privacyContent.substring(0, 100) + '...',
      newContent: privacyContent,
      previousLastUpdated: privacyLastUpdated,
      newLastUpdated: formattedDate,
      updatedBy: 'Current Admin',
      timestamp: now.toISOString(),
      action: 'Privacy Policy Saved',
      contentLength: privacyContent.length,
      changesMade: privacyHasChanges
    });

    setPrivacyLastUpdated(formattedDate);
    setPrivacyUpdatedBy('Current Admin');
    setPrivacyHasChanges(false);

    alert('Privacy Policy has been successfully updated!\n\nAll users will see the latest version to ensure legal compliance.');
  };

  const handleSaveAbout = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    console.log('About App Updated:', {
      previousContent: aboutContent.substring(0, 100) + '...',
      newContent: aboutContent,
      previousLastUpdated: aboutLastUpdated,
      newLastUpdated: formattedDate,
      updatedBy: 'Current Admin',
      timestamp: now.toISOString(),
      action: 'About App Saved',
      contentLength: aboutContent.length,
      changesMade: aboutHasChanges
    });

    setAboutLastUpdated(formattedDate);
    setAboutUpdatedBy('Current Admin');
    setAboutHasChanges(false);

    alert('About App information has been successfully updated!\n\nAll users will see the latest information.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Manage app content, legal documents, and about information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{termsLastUpdated}</div>
                <p className="text-sm text-gray-600 mt-1">Terms Last Updated</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{privacyLastUpdated}</div>
                <p className="text-sm text-gray-600 mt-1">Privacy Last Updated</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#195440]">{aboutLastUpdated}</div>
                <p className="text-sm text-gray-600 mt-1">About Last Updated</p>
              </div>
              <Info className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Content Management System
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Update legal documents and app information visible to all users
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="terms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Terms & Conditions
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                About App
              </TabsTrigger>
            </TabsList>

            {/* Terms & Conditions Tab */}
            <TabsContent value="terms" className="space-y-4">
              {/* Document Info */}
              <div className="flex items-start justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Terms & Conditions Document</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-blue-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last Updated: {termsLastUpdated}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        By: {termsUpdatedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {termsContent.length} characters
                      </div>
                    </div>
                  </div>
                </div>
                {termsHasChanges && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Document Content</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTermsContent(termsContent);
                      setTermsHasChanges(false);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Discard Changes
                  </Button>
                </div>
                <Textarea
                  value={termsContent}
                  onChange={(e) => handleTermsChange(e.target.value)}
                  rows={20}
                  className="text-sm"
                  placeholder="Enter Terms & Conditions content..."
                />
                <p className="text-xs text-gray-500">
                  Users will see this content when they sign up or access the Terms & Conditions page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  onClick={handleSaveTerms}
                  className="bg-[#195440] hover:bg-[#195440]/90"
                  disabled={!termsHasChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Terms & Conditions
                </Button>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Important Note</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Updates to Terms & Conditions will be visible to all users immediately. Users who haven't accepted the latest version may be prompted to review and accept the updated terms.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Privacy Policy Tab */}
            <TabsContent value="privacy" className="space-y-4">
              {/* Document Info */}
              <div className="flex items-start justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900">Privacy Policy Document</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-purple-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last Updated: {privacyLastUpdated}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        By: {privacyUpdatedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {privacyContent.length} characters
                      </div>
                    </div>
                  </div>
                </div>
                {privacyHasChanges && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Document Content</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPrivacyContent(privacyContent);
                      setPrivacyHasChanges(false);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Discard Changes
                  </Button>
                </div>
                <Textarea
                  value={privacyContent}
                  onChange={(e) => handlePrivacyChange(e.target.value)}
                  rows={20}
                  className="text-sm"
                  placeholder="Enter Privacy Policy content..."
                />
                <p className="text-xs text-gray-500">
                  Users will see this content when they access the Privacy Policy page. Keeping this updated ensures legal compliance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  onClick={handleSavePrivacy}
                  className="bg-[#195440] hover:bg-[#195440]/90"
                  disabled={!privacyHasChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Privacy Policy
                </Button>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Legal Compliance</p>
                    <p className="text-sm text-green-800 mt-1">
                      Regularly updating your Privacy Policy ensures compliance with data protection regulations like GDPR, CCPA, and other privacy laws. Users will be notified of significant changes.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* About App Tab */}
            <TabsContent value="about" className="space-y-4">
              {/* Document Info */}
              <div className="flex items-start justify-between p-4 bg-[#195440]/5 border border-[#195440]/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#195440] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#195440]">About App Information</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last Updated: {aboutLastUpdated}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        By: {aboutUpdatedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {aboutContent.length} characters
                      </div>
                    </div>
                  </div>
                </div>
                {aboutHasChanges && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">About App Content</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAboutContent(aboutContent);
                      setAboutHasChanges(false);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Discard Changes
                  </Button>
                </div>
                <Textarea
                  value={aboutContent}
                  onChange={(e) => handleAboutChange(e.target.value)}
                  rows={20}
                  className="text-sm"
                  placeholder="Enter About App content..."
                />
                <p className="text-xs text-gray-500">
                  Users will see this content in the About section of the app. Include app version, features, contact information, and company details.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  onClick={handleSaveAbout}
                  className="bg-[#195440] hover:bg-[#195440]/90"
                  disabled={!aboutHasChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save About App
                </Button>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">App Information</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Keep the About App section updated with the latest app version, features, and contact information. This helps users understand your app and know how to reach you for support.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
