import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, MessageCircle } from "lucide-react";

interface LostFoundCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  location: string;
  date: string;
  type: "lost" | "found";
  reporter: string;
}

export function LostFoundCard({ image, name, description, location, date, type, reporter }: LostFoundCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
          <Badge 
            variant={type === "lost" ? "destructive" : "success"} 
            className="absolute top-2 left-2"
          >
            {type === "lost" ? "Lost" : "Found"}
          </Badge>
        </div>
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-foreground text-lg mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reported by {reporter}</span>
            <Button size="sm" variant="outline" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
