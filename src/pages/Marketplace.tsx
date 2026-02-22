import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ItemCard } from "@/components/cards/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, SlidersHorizontal, Loader2, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Other"];

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_url: string;
  seller: { full_name: string } | null;
}

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "", price: "", category: "Other", condition: "Good" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:profiles(full_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handlePostItem = async () => {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to post." });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('marketplace_items')
      .insert({
        seller_id: user.id,
        title: newItem.title,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        condition: newItem.condition,
        image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop" // Placeholder for now
      });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Item posted successfully!" });
      setIsDialogOpen(false);
      setNewItem({ title: "", description: "", price: "", category: "Other", condition: "Good" });
      fetchItems();
    }
    setSubmitting(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground">Buy and sell with fellow students</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Post New Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sell an Item</DialogTitle>
                <DialogDescription>List your item for sale on the campus marketplace.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g. Calculus Textbook"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(val) => setNewItem({ ...newItem, category: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "All").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={newItem.condition} onValueChange={(val) => setNewItem({ ...newItem, condition: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe your item..."
                  />
                </div>
                <Button onClick={handlePostItem} className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Post Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 sm:w-auto">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer px-4 py-1.5 text-sm transition-all hover:scale-105"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                name={item.title}
                price={item.price}
                image={item.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"}
                seller={item.seller?.full_name || "Unknown"}
                category={item.category}
                condition={item.condition}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found matching your criteria.</p>
            <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
