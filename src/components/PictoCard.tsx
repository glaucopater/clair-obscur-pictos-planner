import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Picto {
  "Pictos Name": string;
  "Affected Attributes": string;
  "Luminas Effect": string;
  Cost: number;
}

interface PictoCardProps {
  picto: Picto;
}

export const PictoCard = ({ picto }: PictoCardProps) => {
  const attributes = picto["Affected Attributes"].split(", ");

  return (
    <Card className="bg-gaming-card border-gaming-border hover:shadow-mystical transition-all duration-300 hover:border-mystical/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-mystical text-lg font-bold">
          {picto["Pictos Name"]}
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {attributes.map((attr) => (
            <Badge 
              key={attr} 
              variant="secondary" 
              className="bg-mystical/20 text-mystical-foreground border-mystical/30 text-xs"
            >
              {attr.trim()}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {picto["Luminas Effect"]}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-gaming-border">
          <span className="text-sm text-muted-foreground">Cost</span>
          <span className="text-mystical font-bold text-lg">{picto.Cost}</span>
        </div>
      </CardContent>
    </Card>
  );
};