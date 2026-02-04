import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, User } from "lucide-react";

interface ItemCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  seller: string;
  category?: string;
  condition?: string;
}

export function ItemCard({ image, name, price, seller, category, condition }: ItemCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <Badge variant="secondary" className="absolute top-3 left-3">
            {category}
          </Badge>
        )}
        {condition && (
          <Badge variant="muted" className="absolute top-3 right-3">
            {condition}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{name}</h3>
        <p className="text-2xl font-bold text-primary">${price}</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{seller}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full gap-2">
          <MessageCircle className="h-4 w-4" />
          Contact Seller
        </Button>
      </CardFooter>
    </Card>
  );
}
