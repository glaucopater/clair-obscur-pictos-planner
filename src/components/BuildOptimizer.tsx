import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PictoCard } from "./PictoCard";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Filter, Calculator } from "lucide-react";
import clairObscurBg from "@/assets/clair-obscur-bg.jpg";
import defaultPictosData from "@/data/pictos.json";

interface Picto {
  "Pictos Name": string;
  "Affected Attributes": string;
  "Luminas Effect": string;
  Cost: number;
}

export const BuildOptimizer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [pictos, setPictos] = useState<Picto[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const { toast } = useToast();


  const handleLoadData = () => {
    try {
      const parsed = jsonInput ? JSON.parse(jsonInput) : defaultPictosData;
      setPictos(parsed);
      toast({
        title: "Data Loaded Successfully",
        description: `Loaded ${parsed.length} pictos`,
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON format",
        variant: "destructive",
      });
    }
  };

  const allAttributes = useMemo(() => {
    const attrs = new Set<string>();
    pictos.forEach((picto) => {
      picto["Affected Attributes"].split(", ").forEach((attr) => {
        attrs.add(attr.trim());
      });
    });
    return Array.from(attrs).sort();
  }, [pictos]);

  const filteredPictos = useMemo(() => {
    if (!selectedAttribute) return pictos;
    return pictos.filter((picto) =>
      picto["Affected Attributes"].toLowerCase().includes(selectedAttribute.toLowerCase())
    );
  }, [pictos, selectedAttribute]);

  const totalCost = useMemo(() => {
    return filteredPictos.reduce((sum, picto) => sum + Number(picto.Cost), 0);
  }, [filteredPictos]);

  return (
    <div 
      className="min-h-screen bg-gaming-bg p-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 15, 23, 0.85), rgba(15, 15, 23, 0.85)), url(${clairObscurBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-mystical w-8 h-8" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-mystical to-mystical-glow bg-clip-text text-transparent">
              Clair Obscur Build Optimizer
            </h1>
            <Sparkles className="text-mystical w-8 h-8" />
          </div>
          <p className="text-muted-foreground text-lg">
            Optimize your pictos build for maximum effectiveness
          </p>
        </div>

        {/* Data Input Section */}
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader>
            <CardTitle className="text-mystical flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Pictos Data Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your pictos JSON data here, or leave empty to use default data..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={8}
              className="bg-gaming-bg border-gaming-border"
            />
            <Button onClick={handleLoadData} className="bg-mystical hover:bg-mystical-glow">
              Load Pictos Data
            </Button>
          </CardContent>
        </Card>

        {/* Filters Section */}
        {pictos.length > 0 && (
          <Card className="bg-gaming-card border-gaming-border">
            <CardHeader>
              <CardTitle className="text-mystical flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Attribute Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedAttribute === "" ? "default" : "outline"}
                  onClick={() => setSelectedAttribute("")}
                  className={selectedAttribute === "" ? "bg-mystical hover:bg-mystical-glow" : ""}
                >
                  All Attributes
                </Button>
                {allAttributes.map((attr) => (
                  <Button
                    key={attr}
                    variant={selectedAttribute === attr ? "default" : "outline"}
                    onClick={() => setSelectedAttribute(attr)}
                    className={selectedAttribute === attr ? "bg-mystical hover:bg-mystical-glow" : ""}
                  >
                    {attr}
                  </Button>
                ))}
              </div>
              
              {/* Stats */}
              <div className="flex gap-4 pt-4 border-t border-gaming-border">
                <Badge variant="secondary" className="bg-mystical/20 text-mystical-foreground border-mystical/30">
                  {filteredPictos.length} Pictos
                </Badge>
                <Badge variant="secondary" className="bg-mystical/20 text-mystical-foreground border-mystical/30">
                  Total Cost: {totalCost}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {filteredPictos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPictos.map((picto, index) => (
              <PictoCard key={index} picto={picto} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {pictos.length === 0 && (
          <Card className="bg-gaming-card border-gaming-border">
            <CardContent className="text-center py-12">
              <Sparkles className="w-12 h-12 text-mystical mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-mystical mb-2">Ready to Optimize</h3>
              <p className="text-muted-foreground">
                Load your pictos data to start building the perfect character setup
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};