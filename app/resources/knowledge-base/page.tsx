"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { useScrollToTop } from "../../hooks/useScrollToTop"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  Users,
  Route,
  Settings,
  MessageSquare,
  FileText,
  Video,
  Download,
  HelpCircle,
} from "lucide-react"

export default function KnowledgeBasePage() {
  useScrollToTop()
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of RedFox CRM",
      icon: BookOpen,
      articles: 12,
      color: "bg-blue-500",
    },
    {
      title: "Customer Management",
      description: "Manage your customer relationships effectively",
      icon: Users,
      articles: 18,
      color: "bg-green-500",
    },
    {
      title: "Route Optimization",
      description: "Optimize your service routes and scheduling",
      icon: Route,
      articles: 8,
      color: "bg-orange-500",
    },
    {
      title: "System Settings",
      description: "Configure your CRM settings",
      icon: Settings,
      articles: 15,
      color: "bg-purple-500",
    },
    {
      title: "Communication Tools",
      description: "Use messaging and notification features",
      icon: MessageSquare,
      articles: 10,
      color: "bg-pink-500",
    },
    {
      title: "Reports & Analytics",
      description: "Generate insights from your data",
      icon: FileText,
      articles: 14,
      color: "bg-indigo-500",
    },
  ]

  const popularArticles = [
    {
      title: "How to Import Your Customer List",
      category: "Getting Started",
      readTime: "5 min read",
      views: "2.1k views",
    },
    {
      title: "Setting Up Route Optimization",
      category: "Route Optimization",
      readTime: "8 min read",
      views: "1.8k views",
    },
    {
      title: "Creating Professional Estimates",
      category: "Customer Management",
      readTime: "6 min read",
      views: "1.5k views",
    },
    {
      title: "Understanding Your Dashboard",
      category: "Getting Started",
      readTime: "4 min read",
      views: "1.3k views",
    },
    {
      title: "Managing Seasonal Workflows",
      category: "System Settings",
      readTime: "7 min read",
      views: "1.1k views",
    },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Knowledge Base</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Find answers, learn best practices, and get the most out of RedFox CRM
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for articles, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our comprehensive guides organized by topic
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-orange-500 transition-colors">
                          {category.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Articles</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Most viewed guides and tutorials from our community
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {popularArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.readTime}</span>
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-orange-50 group-hover:text-orange-600"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
              >
                View All Articles
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quick Access</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Jump directly to the resources you need</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/resources/videos" onClick={scrollToTop}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group text-center">
                  <CardContent className="p-8">
                    <Video className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                      Video Tutorials
                    </h3>
                    <p className="text-gray-600 text-sm">Step-by-step video guides</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/resources/templates" onClick={scrollToTop}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group text-center">
                  <CardContent className="p-8">
                    <FileText className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                      Templates
                    </h3>
                    <p className="text-gray-600 text-sm">Ready-to-use templates</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/resources/downloads" onClick={scrollToTop}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group text-center">
                  <CardContent className="p-8">
                    <Download className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                      Downloads
                    </h3>
                    <p className="text-gray-600 text-sm">Tools and resources</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/resources/support" onClick={scrollToTop}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group text-center">
                  <CardContent className="p-8">
                    <HelpCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                      Get Support
                    </h3>
                    <p className="text-gray-600 text-sm">Contact our team</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Our support team is here to help you succeed with RedFox CRM
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact-sales" onClick={scrollToTop}>
                  Contact Support
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                asChild
              >
                <Link href="/resources/community" onClick={scrollToTop}>
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
