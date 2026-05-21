'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Eye, Calendar, ExternalLink, Newspaper, ShieldAlert, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const newsArticles = [
  {
    id: 'NEWS001',
    category: 'Technology',
    title: 'AI Revolution: New Breakthrough in Machine Learning Transforms Industries',
    description: 'Researchers have developed a groundbreaking machine learning algorithm that promises to revolutionize data processing across multiple sectors.',
    fullContent: 'In a remarkable development, scientists at leading tech institutions have unveiled a new machine learning algorithm that demonstrates unprecedented efficiency in processing complex datasets. The breakthrough, which has been in development for over three years, shows promise in applications ranging from healthcare diagnostics to financial forecasting. Industry experts predict this innovation could reduce processing times by up to 70% while improving accuracy significantly. The technology is expected to be commercially available within the next 18 months.',
    source: 'TechCrunch',
    author: 'Sarah Johnson',
    publishedDate: '2026-02-18T10:30:00',
    fetchedDate: '2026-02-18T10:35:00',
    url: 'https://techcrunch.com/ai-breakthrough-2026',
    image: 'https://images.unsplash.com/photo-1761223976379-04c361d3068a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMG5ld3N8ZW58MXx8fHwxNzcxNTM4MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 12450,
    engagement: 'High'
  },
  {
    id: 'NEWS002',
    category: 'Healthcare',
    title: 'New Treatment Shows Promise in Clinical Trials for Rare Disease',
    description: 'Medical researchers announce positive results from Phase 3 trials of innovative therapy targeting rare genetic disorder.',
    fullContent: 'Medical researchers have announced encouraging results from Phase 3 clinical trials of a novel treatment for a rare genetic disorder affecting thousands worldwide. The therapy, which uses advanced gene editing techniques, showed a 85% success rate in improving patient outcomes with minimal side effects. Lead researcher Dr. Michael Chen stated that this represents a significant milestone in personalized medicine. The treatment is now awaiting FDA approval and could be available to patients as early as next year. Patient advocacy groups have welcomed the news, expressing hope for those affected by the condition.',
    source: 'Medical News Today',
    author: 'Dr. Emily Rodriguez',
    publishedDate: '2026-02-18T08:15:00',
    fetchedDate: '2026-02-18T08:20:00',
    url: 'https://medicalnewstoday.com/rare-disease-treatment',
    image: 'https://images.unsplash.com/photo-1758691462651-611d730c5272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHJlc2VhcmNofGVufDF8fHx8MTc3MTUzODMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 8920,
    engagement: 'High'
  },
  {
    id: 'NEWS003',
    category: 'Education',
    title: 'Universities Adopt Hybrid Learning Model as Standard Practice',
    description: 'Major educational institutions worldwide embrace flexible learning approaches combining in-person and online instruction.',
    fullContent: 'Leading universities across the globe are formally adopting hybrid learning models as a permanent fixture in their educational framework. This decision comes after extensive research showing improved student outcomes and accessibility. The hybrid model allows students to attend classes both in-person and remotely, providing flexibility for diverse learning needs. University administrators report increased enrollment and student satisfaction rates. The approach includes sophisticated online platforms, interactive virtual classrooms, and redesigned campus spaces to support both learning modes. Educators have noted that this shift requires new teaching methodologies and continuous professional development.',
    source: 'Education Weekly',
    author: 'Prof. Jennifer Martinez',
    publishedDate: '2026-02-17T14:45:00',
    fetchedDate: '2026-02-17T14:50:00',
    url: 'https://edweek.org/hybrid-learning-standard',
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBzdHVkZW50cyUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MTQ4OTI4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 6750,
    engagement: 'Medium'
  },
  {
    id: 'NEWS004',
    category: 'Technology',
    title: 'Quantum Computing Achieves Major Milestone in Error Correction',
    description: 'Scientists demonstrate stable quantum computing system with breakthrough error correction capability.',
    fullContent: 'In a landmark achievement for quantum computing, researchers have successfully demonstrated a quantum system with significantly improved error correction, bringing practical quantum computers closer to reality. The breakthrough addresses one of the biggest challenges in quantum computing: maintaining quantum states long enough to perform complex calculations. The new error correction method allows quantum bits to remain stable 100 times longer than previous systems. This development could accelerate applications in cryptography, drug discovery, and climate modeling. Industry leaders are calling it a pivotal moment in the evolution of computing technology.',
    source: 'Science Daily',
    author: 'David Thompson',
    publishedDate: '2026-02-17T11:20:00',
    fetchedDate: '2026-02-17T11:25:00',
    url: 'https://sciencedaily.com/quantum-milestone',
    image: 'https://images.unsplash.com/photo-1761223976379-04c361d3068a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMG5ld3N8ZW58MXx8fHwxNzcxNTM4MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 15230,
    engagement: 'High'
  },
  {
    id: 'NEWS005',
    category: 'Business',
    title: 'Global Supply Chain Shows Signs of Recovery After Years of Disruption',
    description: 'Industry analysts report significant improvements in international logistics and manufacturing efficiency.',
    fullContent: 'Global supply chains are showing robust signs of recovery as companies adapt to new operational models and technologies. After years of disruption, shipping times have normalized, and inventory backlogs have cleared significantly. Experts attribute the improvement to increased automation, diversified sourcing strategies, and better demand forecasting. Manufacturing sector leaders report improved efficiency and reduced costs. However, analysts caution that geopolitical factors still pose potential risks. Companies are investing heavily in supply chain resilience and digital transformation to prevent future disruptions. The recovery is expected to boost global economic growth in the coming quarters.',
    source: 'Business Insider',
    author: 'Lisa Wang',
    publishedDate: '2026-02-16T09:30:00',
    fetchedDate: '2026-02-16T09:35:00',
    url: 'https://businessinsider.com/supply-chain-recovery',
    image: 'https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNTA2NzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 5420,
    engagement: 'Medium'
  },
  {
    id: 'NEWS006',
    category: 'Finance',
    title: 'Central Banks Signal Coordinated Approach to Interest Rate Policy',
    description: 'Major central banks indicate collaborative strategy on monetary policy in response to global economic conditions.',
    fullContent: 'Central banks from major economies have signaled a more coordinated approach to interest rate policy, marking a shift in global monetary strategy. Federal Reserve Chair and European Central Bank President held joint meetings to discuss economic outlooks and policy alignment. Financial analysts view this as a positive development for currency stability and international trade. The coordinated approach aims to prevent competitive devaluations and support balanced global growth. Markets responded positively to the announcement, with major indices showing gains. Economists note this collaboration could help address inflation concerns while maintaining economic expansion.',
    source: 'Financial Times',
    author: 'Robert Anderson',
    publishedDate: '2026-02-16T07:00:00',
    fetchedDate: '2026-02-16T07:05:00',
    url: 'https://ft.com/central-banks-coordination',
    image: 'https://images.unsplash.com/photo-1716279083224-d366e6d4144d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwbWFya2V0JTIwdHJhZGluZ3xlbnwxfHx8fDE3NzE1MzgzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 9830,
    engagement: 'High'
  },
  {
    id: 'NEWS007',
    category: 'Healthcare',
    title: 'Mental Health Services Expand with Telehealth Integration',
    description: 'Healthcare providers report increased access to mental health support through digital platforms.',
    fullContent: 'Mental health services have seen a significant expansion through the integration of telehealth platforms, providing improved access to care for millions. Healthcare providers report that virtual therapy sessions have reduced wait times and increased patient engagement. The model allows therapists to reach patients in remote areas and provides flexible scheduling options. Insurance companies have expanded coverage for telehealth mental health services. Mental health professionals note that the digital approach reduces stigma and increases treatment adherence. However, experts emphasize the importance of maintaining quality standards and ensuring privacy in virtual care settings.',
    source: 'Healthcare Today',
    author: 'Dr. Alex Kumar',
    publishedDate: '2026-02-15T13:20:00',
    fetchedDate: '2026-02-15T13:25:00',
    url: 'https://healthcaretoday.com/telehealth-mental-health',
    image: 'https://images.unsplash.com/photo-1758691462651-611d730c5272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHJlc2VhcmNofGVufDF8fHx8MTc3MTUzODMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 7650,
    engagement: 'High'
  },
  {
    id: 'NEWS008',
    category: 'Education',
    title: 'STEM Education Programs Report Record Enrollment Growth',
    description: 'Schools nationwide see surge in students pursuing science, technology, engineering, and mathematics programs.',
    fullContent: 'Educational institutions across the country are reporting record enrollment in STEM programs, reflecting growing student interest in science and technology careers. The increase is attributed to enhanced outreach efforts, scholarship opportunities, and evolving industry demands. Schools have expanded lab facilities and hired additional faculty to meet demand. Industry partnerships provide students with hands-on experience and internship opportunities. Education officials note particular growth in computer science and bioengineering fields. The trend is expected to help address the skills gap in technical industries and drive innovation in key sectors.',
    source: 'Education Matters',
    author: 'Maria Gonzales',
    publishedDate: '2026-02-15T10:45:00',
    fetchedDate: '2026-02-15T10:50:00',
    url: 'https://educationmatters.org/stem-growth',
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBzdHVkZW50cyUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MTQ4OTI4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 4920,
    engagement: 'Medium'
  },
  {
    id: 'NEWS009',
    category: 'Finance',
    title: 'Cryptocurrency Market Sees Institutional Investment Surge',
    description: 'Major financial institutions increase cryptocurrency holdings as digital assets gain mainstream acceptance.',
    fullContent: 'The cryptocurrency market is experiencing a significant influx of institutional investment as major financial players expand their digital asset portfolios. Banks and investment firms are establishing dedicated crypto divisions and offering cryptocurrency services to clients. Regulatory clarity in major markets has boosted institutional confidence. Financial analysts note that cryptocurrencies are increasingly viewed as legitimate asset classes for portfolio diversification. Bitcoin and Ethereum lead institutional adoption, while newer blockchain technologies attract venture capital. Industry experts predict continued growth as infrastructure and regulatory frameworks mature.',
    source: 'Crypto News',
    author: 'James Chen',
    publishedDate: '2026-02-14T16:30:00',
    fetchedDate: '2026-02-14T16:35:00',
    url: 'https://cryptonews.com/institutional-investment',
    image: 'https://images.unsplash.com/photo-1716279083224-d366e6d4144d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwbWFya2V0JTIwdHJhZGluZ3xlbnwxfHx8fDE3NzE1MzgzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 11240,
    engagement: 'High'
  },
  {
    id: 'NEWS010',
    category: 'Business',
    title: 'Remote Work Transforms Commercial Real Estate Landscape',
    description: 'Companies adapt office spaces as hybrid work models become permanent feature of business operations.',
    fullContent: 'The commercial real estate sector is undergoing a major transformation as companies permanently embrace hybrid work models. Office spaces are being redesigned to prioritize collaboration areas over individual workstations. Real estate firms report increased demand for flexible workspace solutions and shorter lease terms. Many companies are downsizing their office footprint while investing in upgraded facilities for hybrid workers. The shift is creating new opportunities in suburban office markets and co-working spaces. Industry analysts predict continued evolution as organizations optimize their real estate strategies for the new work environment.',
    source: 'Business Review',
    author: 'Tom Wilson',
    publishedDate: '2026-02-14T12:15:00',
    fetchedDate: '2026-02-14T12:20:00',
    url: 'https://businessreview.com/remote-work-real-estate',
    image: 'https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNTA2NzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    views: 6340,
    engagement: 'Medium'
  }
];

const initialNewsCategories = [
  { id: 1, name: 'Technology', enabled: true, articles: 234 },
  { id: 2, name: 'Healthcare', enabled: true, articles: 156 },
  { id: 3, name: 'Education', enabled: true, articles: 89 },
  { id: 4, name: 'Business', enabled: false, articles: 45 },
  { id: 5, name: 'Finance', enabled: true, articles: 123 },
];

export default function NewsManagementPage() {
  const [newsCategories, setNewsCategories] = useState(initialNewsCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showCategoryNewsDialog, setShowCategoryNewsDialog] = useState(false);
  const [showArticleDialog, setShowArticleDialog] = useState(false);

  const handleToggle = (categoryId: number) => {
    const category = newsCategories.find(c => c.id === categoryId);
    const newStatus = !category?.enabled;
    
    setNewsCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, enabled: newStatus }
          : cat
      )
    );

    // Log the action
    console.log('News Category Toggle:', {
      categoryId,
      categoryName: category?.name,
      previousStatus: category?.enabled,
      newStatus: newStatus,
      timestamp: new Date().toISOString(),
      changedBy: 'Current Admin',
      action: newStatus ? 'Category Enabled' : 'Category Disabled'
    });
  };

  const handleViewCategoryNews = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setShowCategoryNewsDialog(true);
  };

  const handleViewArticle = (article: any) => {
    setSelectedArticle(article);
    setShowArticleDialog(true);
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

  const getCategoryArticles = (categoryName: string) => {
    return newsArticles.filter(article => article.category === categoryName);
  };

  const getEngagementBadge = (engagement: string) => {
    switch (engagement) {
      case 'High':
        return <Badge className="bg-[#195440]">High Engagement</Badge>;
      case 'Medium':
        return <Badge className="bg-[#E1B047]">Medium Engagement</Badge>;
      case 'Low':
        return <Badge variant="secondary">Low Engagement</Badge>;
      default:
        return <Badge variant="outline">{engagement}</Badge>;
    }
  };

  // Stats
  const totalArticles = newsCategories.reduce((sum, cat) => sum + cat.articles, 0);
  const enabledCategories = newsCategories.filter(c => c.enabled).length;
  const disabledCategories = newsCategories.filter(c => !c.enabled).length;
  const totalViews = newsArticles.reduce((sum, article) => sum + article.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
        <p className="text-gray-600 mt-1">Manage news categories and view fetched content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#195440]">{totalArticles}</div>
            <p className="text-sm text-gray-600 mt-1">Total Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{enabledCategories}</div>
            <p className="text-sm text-gray-600 mt-1">Enabled Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{disabledCategories}</div>
            <p className="text-sm text-gray-600 mt-1">Disabled Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{(totalViews / 1000).toFixed(1)}K</div>
            <p className="text-sm text-gray-600 mt-1">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* News Categories Control */}
      <Card>
        <CardHeader>
          <CardTitle>News Categories Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Newspaper className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-lg">{category.name}</div>
                      <div className="text-sm text-gray-600">{category.articles} articles fetched</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCategoryNews(category.name)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Articles
                  </Button>
                  <Badge variant={category.enabled ? 'default' : 'secondary'}
                    className={category.enabled ? 'bg-[#E1B047]' : ''}>
                    {category.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={category.enabled}
                      onCheckedChange={() => handleToggle(category.id)}
                    />
                    <span className="text-sm text-gray-600">
                      {category.enabled ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent News Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fetched News (Read-Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsArticles.slice(0, 5).map((article) => {
              const category = newsCategories.find(c => c.name === article.category);
              return (
                <div key={article.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition">
                  {/* Article Image */}
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Article Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                          {category && (
                            <Badge 
                              variant={category.enabled ? 'default' : 'secondary'}
                              className={category.enabled ? 'bg-[#195440]' : ''}
                            >
                              {category.enabled ? 'Visible' : 'Hidden'}
                            </Badge>
                          )}
                          {getEngagementBadge(article.engagement)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.publishedDate)}
                          </span>
                          <span>{article.source}</span>
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewArticle(article)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Read
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Category News Dialog */}
      <Dialog open={showCategoryNewsDialog} onOpenChange={setShowCategoryNewsDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              {selectedCategory} News Articles (Read-Only)
            </DialogTitle>
            <DialogDescription>
              Viewing all fetched articles for this category
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-4 px-6">
              {getCategoryArticles(selectedCategory).map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                          </div>
                          {getEngagementBadge(article.engagement)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.publishedDate)}
                          </span>
                          <span>By {article.author}</span>
                          <span>{article.source}</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {article.views.toLocaleString()} views
                          </span>
                        </div>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowCategoryNewsDialog(false);
                              handleViewArticle(article);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Read Full Article
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryNewsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Article Dialog */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              Read-Only Article View
            </DialogTitle>
            <DialogDescription>
              This is a read-only view. Content cannot be edited or altered.
            </DialogDescription>
          </DialogHeader>

          {selectedArticle && (
            <div className="space-y-6 px-6">
              {/* Article Image */}
              <div className="w-full aspect-video rounded-lg overflow-hidden border">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{selectedArticle.category}</Badge>
                  {getEngagementBadge(selectedArticle.engagement)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h2>
                <p className="text-lg text-gray-600">{selectedArticle.description}</p>
              </div>

              <Separator />

              {/* Article Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Article ID</Label>
                  <p className="font-medium text-[#195440]">{selectedArticle.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Category</Label>
                  <p className="font-medium">{selectedArticle.category}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Author</Label>
                  <p className="font-medium">{selectedArticle.author}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Source</Label>
                  <p className="font-medium">{selectedArticle.source}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Published Date</Label>
                  <p className="font-medium">{formatDate(selectedArticle.publishedDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Fetched Date</Label>
                  <p className="font-medium">{formatDate(selectedArticle.fetchedDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Views</Label>
                  <p className="font-medium">{selectedArticle.views.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Engagement</Label>
                  <p className="font-medium">{selectedArticle.engagement}</p>
                </div>
              </div>

              <Separator />

              {/* Full Article Content */}
              <div>
                <Label className="text-gray-600 mb-3 block">Full Article Content</Label>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {selectedArticle.fullContent}
                  </p>
                </div>
              </div>

              {/* Source URL */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-blue-900 mb-1 block">Original Source</Label>
                    <a 
                      href={selectedArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {selectedArticle.url}
                    </a>
                  </div>
                </div>
              </div>

              {/* Read-Only Notice */}
              <div className="bg-gray-100 border rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <ShieldAlert className="w-5 h-5" />
                  <p className="text-sm">
                    <strong>Read-Only Mode:</strong> This content is fetched from external sources and cannot be edited. 
                    Use category enable/disable controls to manage visibility on the platform.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArticleDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
