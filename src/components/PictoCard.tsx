import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Picto {
  "Pictos Name": string;
  "Affected Attributes": string;
  "Luminas Effect": string;
  Cost: number;
}

interface PictoCardProps {
  picto: Picto;
  onClick: () => void;
  selected: boolean;
  disabled?: boolean;
}

export const PictoCard = ({ picto, onClick, selected, disabled }: PictoCardProps) => {
  const attributes = picto["Affected Attributes"].split(", ");

  return (
    <Card
      className={`relative bg-gaming-card border-gaming-border transition-all duration-300 ${selected ? 'border-mystical' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-mystical hover:border-mystical/50 transform hover:scale-105 cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
    >
      {selected && (
        <div className="absolute top-2 right-2 bg-mystical rounded-full p-1">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-mystical text-base font-bold">
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
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-xs leading-relaxed">
          {(() => {
            let effectText = picto["Luminas Effect"];
            const patterns = [
              { regex: /(\d+)% increased damage(?! Break)|Deal (\d+)% more damage/g, className: "highlight-damage" },
              { regex: /(?:\+|Gain |Give )(\d+) AP/g, className: "highlight-ap" },
              { regex: /(?:\+|gain |add )(\d+) Shield(?: points)?/g, className: "highlight-shield" },
              { regex: /Recover (\d+)% Health/g, className: "highlight-heal" },
              { regex: /Heal (\d+)% HP/g, className: "highlight-heal" },
              { regex: /Recover (\d+) Health/g, className: "highlight-heal" },
              { regex: /(\d+)% increased Break damage/g, className: "highlight-break-damage" },
              { regex: /(\d+)% of a Gradient Charge/g, className: "highlight-gradient" },
              { regex: /50% chance to deal either 50% or 200%/g, className: "highlight-damage" },
            ];

            patterns.forEach(item => {
              effectText = effectText.replace(item.regex, (match) => `<span class="highlight-effect ${item.className}">${match}</span>`);
            });

            return <span dangerouslySetInnerHTML={{ __html: effectText }} />;
          })()}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-gaming-border">
          <span className="text-sm text-muted-foreground">Cost</span>
          <span className="text-mystical font-bold text-base">{picto.Cost}</span>
        </div>
      </CardContent>
    </Card>
  );
};