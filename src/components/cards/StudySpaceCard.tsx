import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Wifi, Zap } from "lucide-react";

interface StudySpaceCardProps {
  id: string;
  name: string;
  building: string;
  capacity: number;
  available: boolean;
  amenities: string[];
  nextAvailable?: string;
}

export function StudySpaceCard({ name, building, capacity, available, amenities, nextAvailable }: StudySpaceCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-3.5 w-3.5" />;
      case "power":
        return <Zap className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 ${available ? "" : "opacity-75"}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{building}</p>
          </div>
          <Badge variant={available ? "success" : "destructive"}>
            {available ? "Available" : "Occupied"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to {capacity}</span>
          </div>
          {!available && nextAvailable && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Free at {nextAvailable}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.map((amenity) => (
            <Badge key={amenity} variant="secondary" className="gap-1">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
        </div>

        <Button 
          className="w-full" 
          variant={available ? "default" : "secondary"}
          disabled={!available}
        >
          {available ? "Reserve Now" : "View Schedule"}
        </Button>
      </CardContent>
    </Card>
  );
}
