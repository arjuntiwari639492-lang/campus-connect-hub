import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LostFoundCard } from "@/components/cards/LostFoundCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, AlertTriangle, CheckCircle } from "lucide-react";

const mockLostItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    name: "Silver Watch",
    description: "Lost my silver analog watch near the library entrance. Has sentimental value.",
    location: "Main Library",
    date: "Jan 15, 2024",
    type: "lost" as const,
    reporter: "John D.",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    name: "AirPods Pro Case",
    description: "White AirPods Pro case with a small scratch on the lid. No AirPods inside.",
    location: "Engineering Building",
    date: "Jan 14, 2024",
    type: "lost" as const,
    reporter: "Emily S.",
  },
];

const mockFoundItems = [
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    name: "Black Backpack",
    description: "Found a black North Face backpack with textbooks inside. Left at the student center.",
    location: "Student Center",
    date: "Jan 16, 2024",
    type: "found" as const,
    reporter: "Campus Security",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    name: "Student ID Card",
    description: "Found a student ID card on the ground near the cafeteria. Name starts with 'M'.",
    location: "Cafeteria",
    date: "Jan 15, 2024",
    type: "found" as const,
    reporter: "Staff Member",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    name: "Reading Glasses",
    description: "Black frame reading glasses found in lecture hall 101.",
    location: "Lecture Hall 101",
    date: "Jan 14, 2024",
    type: "found" as const,
    reporter: "Professor K.",
  },
];

export default function LostFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<"lost" | "found">("lost");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lost & Found</h1>
            <p className="text-muted-foreground">Report or recover lost items on campus</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Report Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report an Item</DialogTitle>
                <DialogDescription>
                  Help fellow students find their lost belongings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Report Type */}
                <div className="flex gap-3">
                  <Button
                    variant={reportType === "lost" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setReportType("lost")}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    I Lost Something
                  </Button>
                  <Button
                    variant={reportType === "found" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setReportType("found")}
                  >
                    <CheckCircle className="h-4 w-4" />
                    I Found Something
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input id="itemName" placeholder="e.g., Blue Water Bottle" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the item in detail..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Where was it lost/found?" />
                </div>
                <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative animate-slide-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lost & found items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lost" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="lost" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Lost Items ({mockLostItems.length})
            </TabsTrigger>
            <TabsTrigger value="found" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Found Items ({mockFoundItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lost" className="mt-6 space-y-4">
            {mockLostItems.map((item) => (
              <LostFoundCard key={item.id} {...item} />
            ))}
          </TabsContent>

          <TabsContent value="found" className="mt-6 space-y-4">
            {mockFoundItems.map((item) => (
              <LostFoundCard key={item.id} {...item} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
