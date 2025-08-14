"use client";

import { useAdminStats } from "@/hooks/useAdminStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Video, DollarSign, Share2, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export const description = "A pie chart with no separator"

const chartData = [
  { videoStyle:"Realistic", count:1, fill:"var(--color-chrome)"},
  { videoStyle:"Optimistic", count:2, fill:"var(--color-chrome)"},
  { videoStyle:"Pessimistic", count:3, fill:"var(--color-chrome)"},
  { videoStyle:"Realistic", count:4, fill:"var(--color-chrome)"},
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig


export default function AdminDashboard() {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error loading dashboard: {error}</div>;
  }

  if (!stats) {
    return <div className="flex items-center justify-center min-h-screen">No data available</div>;
  }

  // Format data for charts
  const userGrowthChartData = stats.userGrowth.map((item: any) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const revenueChartData = stats.revenueOverTime.map((item: any) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const pieChartConfig = {

  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your application metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.verified} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videos.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.videos.recent} created this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.revenue.purchases} purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.referrals.total}</div>
            <p className="text-xs text-muted-foreground">
              Active referral program
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Video Style Distribution */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Video Style</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={{}}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={stats.videoStyles.map((item: any, index: number) => ({
                    videoStyle: item.style,
                    count: item.count,
                    fill: COLORS[index % COLORS.length],
                  }))}
                  dataKey="count"
                  nameKey="videoStyle"
                  stroke="0"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Showing Style Distribution of Videos
            </div>
          </CardFooter>
        </Card>

        {/* Top Referrers */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topReferrers && stats.topReferrers.length > 0 ? (
                stats.topReferrers.map((referrer: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{referrer.firstName} {referrer.lastName}</p>
                        <p className="text-xs text-muted-foreground">@{referrer.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{referrer.totalReferrals} referrals</p>
                      <p className="text-xs text-muted-foreground">{referrer.referralCreditsEarned} credits</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No referral data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
