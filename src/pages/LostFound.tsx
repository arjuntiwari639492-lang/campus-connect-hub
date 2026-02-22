import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LostFoundCard } from "@/components/cards/LostFoundCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date_reported: string;
  type: "lost" | "found";
  image_url: string;
  reporter: { full_name: string } | null;
}

export default function LostFound() {
  const [lostItems, setLostItems] = useState<LostFoundItem[]>([]);
  const [foundItems, setFoundItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({ title: "", description: "", location: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lost_found_items')
      .select(`
          *,
          reporter:profiles(full_name)
        `)
      .eq('status', 'open')
      .order('date_reported', { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      const allItems = (data || []) as LostFoundItem[];
      setLostItems(allItems.filter((i) => i.type === 'lost'));
      setFoundItems(allItems.filter((i) => i.type === 'found'));
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleReportItem = async () => {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to report." });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('lost_found_items')
      .insert({
        reporter_id: user.id,
        title: newItem.title,
        description: newItem.description,
        location: newItem.location,
        type: reportType,
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" // Placeholder
      });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Report Submitted", description: "Your report has been successfully added." });
      setIsDialogOpen(false);
      setNewItem({ title: "", description: "", location: "" });
      fetchItems();
    }
    setSubmitting(false);
  };


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
                  <Input
                    id="itemName"
                    placeholder="e.g., Blue Water Bottle"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the item in detail..."
                    rows={3}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where was it lost/found?"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleReportItem} disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Submit Report"}
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
              Lost Items ({lostItems.length})
            </TabsTrigger>
            <TabsTrigger value="found" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Found Items ({foundItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lost" className="mt-6 space-y-4">
            {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : (
              lostItems.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                <LostFoundCard
                  key={item.id}
                  id={item.id}
                  name={item.title}
                  description={item.description}
                  location={item.location}
                  date={new Date(item.date_reported).toLocaleDateString()}
                  image={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"}
                  type={item.type}
                  reporter={item.reporter?.full_name || "Anonymous"}
                />
              ))
            )}
            {!loading && lostItems.length === 0 && <p className="text-center text-muted-foreground py-8">No lost items reported.</p>}

          </TabsContent>

          <TabsContent value="found" className="mt-6 space-y-4">
            {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : (
              foundItems.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                <LostFoundCard
                  key={item.id}
                  id={item.id}
                  name={item.title}
                  description={item.description}
                  location={item.location}
                  date={new Date(item.date_reported).toLocaleDateString()}
                  image={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"}
                  type={item.type}
                  reporter={item.reporter?.full_name || "Anonymous"}
                />
              ))
            )}
            {!loading && foundItems.length === 0 && <p className="text-center text-muted-foreground py-8">No found items reported.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
