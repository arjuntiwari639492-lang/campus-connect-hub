import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, MapPin, TrendingUp, Package, Eye } from "lucide-react";

const stats = [
  { label: "Active Listings", value: "24", icon: Package, trend: "+3 this week" },
  { label: "Items Sold", value: "12", icon: TrendingUp, trend: "+5 this month" },
  { label: "Profile Views", value: "156", icon: Eye, trend: "+23 today" },
];

const quickActions = [
  {
    title: "Marketplace",
    description: "Buy or sell textbooks, electronics, and more",
    icon: ShoppingBag,
    to: "/marketplace",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Lost & Found",
    description: "Report or find lost items on campus",
    icon: Search,
    to: "/lost-found",
    color: "bg-warning/10 text-warning",
  },
  {
    title: "Study Spaces",
    description: "Find available rooms and quiet spots",
    icon: MapPin,
    to: "/study-spaces",
    color: "bg-success/10 text-success",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Student! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening on your campus today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 animate-slide-up">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-success mt-1">{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.to}>
                <Card className="h-full border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Card className="border-border/50 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "New message about 'Calculus Textbook'", time: "2 hours ago" },
                  { text: "Your listing 'MacBook Pro' was viewed 5 times", time: "4 hours ago" },
                  { text: "Study Room 204 is now available", time: "6 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
