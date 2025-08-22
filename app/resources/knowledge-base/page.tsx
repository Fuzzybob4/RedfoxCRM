import type { Metadata } from "next"
import { Search, BookOpen, Users, Settings, HelpCircle, FileText, Video, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Knowledge Base - RedFox CRM",
  description: "Find answers, tutorials, and resources to help you get the most out of RedFox CRM.",
}

export default function KnowledgeBasePage() {
  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of RedFox CRM",
      icon: BookOpen,
      articles: 12,
      color: "bg-blue-500",
    },
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: Users,
      articles: 8,
      color: "bg-green-500",
    },
    {
      title: "Settings & Configuration",
      description: "Customize your CRM experience",
      icon: Settings,
      articles: 15,
      color: "bg-purple-500",
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: HelpCircle,
      articles: 6,
      color: "bg-red-500",
    },
  ]

  const popularArticles = [
    {
      title: "How to Import Your Customer Data",
      category: "Getting Started",
      readTime: "5 min read",
      views: "2.1k views",
    },
    {
      title: "Setting Up Email Integration",
      category: "Settings & Configuration",
      readTime: "8 min read",
      views: "1.8k views",
    },
    {
      title: "Creating Custom Fields",
      category: "Settings & Configuration",
      readTime: "6 min read",
      views: "1.5k views",
    },
    {
      title: "Managing User Permissions",
      category: "User Management",
      readTime: "4 min read",
      views: "1.2k views",
    },
    {
      title: "Troubleshooting Login Issues",
      category: "Troubleshooting",
      readTime: "3 min read",
      views: "980 views",
    },
  ]

  const quickLinks = [
    { title: "Video Tutorials", icon: Video, href: "/resources/videos" },
    { title: "API Documentation", icon: FileText, href: "/resources/api" },
    { title: "Download Resources", icon: Download, href: "/resources/downloads" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Knowledge Base</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Find answers, tutorials, and resources to help you get the most out of RedFox CRM
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for articles, tutorials, or topics..."
              className="pl-12 pr-4 py-4 text-lg rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600">
              Search
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary">{category.articles} articles</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Popular Articles</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-orange-600 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.readTime}</span>
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                          Read Article →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <link.icon className="h-12 w-12 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{link.title}</h3>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Explore →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Still Need Help?</h2>
          <p className="text-slate-600 mb-6">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600">Contact Support</Button>
            <Button variant="outline">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
