import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ItemCard } from "@/components/cards/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

const categories = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Other"];

const mockItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    name: "Calculus: Early Transcendentals",
    price: 45,
    seller: "Alex M.",
    category: "Textbooks",
    condition: "Like New",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    name: "MacBook Pro 13\" 2021",
    price: 899,
    seller: "Sarah K.",
    category: "Electronics",
    condition: "Excellent",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    name: "Modern Desk Chair",
    price: 75,
    seller: "Mike T.",
    category: "Furniture",
    condition: "Good",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=400&h=400&fit=crop",
    name: "TI-84 Plus Calculator",
    price: 60,
    seller: "Emma L.",
    category: "Electronics",
    condition: "Like New",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    name: "Organic Chemistry Textbook",
    price: 55,
    seller: "James W.",
    category: "Textbooks",
    condition: "Good",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
    name: "iPad Air 4th Gen",
    price: 420,
    seller: "Lisa R.",
    category: "Electronics",
    condition: "Excellent",
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post New Item
          </Button>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {filteredItems.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
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
