import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudySpaceCard } from "@/components/cards/StudySpaceCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin } from "lucide-react";

const buildings = ["All Buildings", "Library", "Student Center", "Engineering", "Science Hall"];

const mockStudySpaces = [
  {
    id: "1",
    name: "Quiet Study Room 101",
    building: "Main Library",
    capacity: 4,
    available: true,
    amenities: ["WiFi", "Power", "Whiteboard"],
  },
  {
    id: "2",
    name: "Group Study Room A",
    building: "Student Center",
    capacity: 8,
    available: false,
    amenities: ["WiFi", "Power", "TV Screen"],
    nextAvailable: "3:00 PM",
  },
  {
    id: "3",
    name: "Computer Lab 205",
    building: "Engineering Building",
    capacity: 20,
    available: true,
    amenities: ["WiFi", "Power", "Computers"],
  },
  {
    id: "4",
    name: "Private Pod 3",
    building: "Main Library",
    capacity: 1,
    available: true,
    amenities: ["WiFi", "Power"],
  },
  {
    id: "5",
    name: "Conference Room B",
    building: "Student Center",
    capacity: 12,
    available: false,
    amenities: ["WiFi", "Power", "Projector", "Whiteboard"],
    nextAvailable: "5:00 PM",
  },
  {
    id: "6",
    name: "Study Lounge",
    building: "Science Hall",
    capacity: 15,
    available: true,
    amenities: ["WiFi", "Power"],
  },
];

export default function StudySpaces() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("All Buildings");

  const filteredSpaces = mockStudySpaces.filter((space) => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = selectedBuilding === "All Buildings" || space.building.includes(selectedBuilding);
    return matchesSearch && matchesBuilding;
  });

  const availableCount = filteredSpaces.filter((s) => s.available).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Study Spaces</h1>
          <p className="text-muted-foreground">Find and reserve available rooms and spots</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{availableCount} Available</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{filteredSpaces.length - availableCount} Occupied</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search study spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Building Filter */}
          <div className="flex flex-wrap gap-2">
            {buildings.map((building) => (
              <Badge
                key={building}
                variant={selectedBuilding === building ? "default" : "secondary"}
                className="cursor-pointer px-4 py-1.5 text-sm transition-all hover:scale-105"
                onClick={() => setSelectedBuilding(building)}
              >
                {building}
              </Badge>
            ))}
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {filteredSpaces.map((space) => (
            <StudySpaceCard key={space.id} {...space} />
          ))}
        </div>

        {/* Empty State */}
        {filteredSpaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No study spaces found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
