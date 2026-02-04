import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Calendar, LogOut, Settings, Edit, ShoppingBag } from "lucide-react";

const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  university: "State University",
  major: "Computer Science",
  year: "Junior",
  joinDate: "September 2023",
};

const mockListings = [
  {
    id: "1",
    name: "Calculus Textbook",
    price: 45,
    status: "active",
    views: 23,
  },
  {
    id: "2",
    name: "Desk Lamp",
    price: 25,
    status: "sold",
    views: 12,
  },
  {
    id: "3",
    name: "USB-C Hub",
    price: 35,
    status: "active",
    views: 8,
  },
];

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="border-border/50 shadow-card overflow-hidden animate-fade-in">
          {/* Banner */}
          <div className="h-32 gradient-hero" />
          
          <CardContent className="relative pt-0 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-card shadow-lg">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-2xl">{mockUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mb-12 pt-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{mockUser.name}</h1>
                <p className="text-muted-foreground">{mockUser.major} • {mockUser.year}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{mockUser.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{mockUser.university}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {mockUser.joinDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Listings */}
        <Card className="border-border/50 shadow-card animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              My Listings
            </CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{listing.name}</p>
                      <p className="text-sm text-muted-foreground">${listing.price} • {listing.views} views</p>
                    </div>
                  </div>
                  <Badge variant={listing.status === "active" ? "success" : "secondary"}>
                    {listing.status === "active" ? "Active" : "Sold"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Separator className="my-6" />
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" asChild>
            <Link to="/">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
