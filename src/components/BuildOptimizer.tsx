import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PictoCard } from "./PictoCard";
import { Sparkles, Filter, Calculator } from "lucide-react";
import clairObscurBg from "@/assets/clair-obscur-bg.jpg";
import { usePictoLogic } from "@/hooks/usePictoLogic";

export const BuildOptimizer = () => {
  const {
    jsonInput,
    setJsonInput,
    pictos,
    selectedAttribute,
    setSelectedAttribute,
    sortOption,
    setSortOption,
    maxLuminas,
    setMaxLuminas,
    weaponDamage,
    setWeaponDamage,
    selectedPictos,
    handlePictoSelection,
    handleClearSelection,
    handleLoadData,
    allAttributes,
    filteredPictos,
    totalCost,
    totalEffect,
    totalEffectsSummary,
  } = usePictoLogic();

  return (
    <div
      className="min-h-screen bg-gaming-bg p-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 15, 23, 0.85), rgba(15, 15, 23, 0.85)), url(${clairObscurBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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

        {/* Luminas Input */}
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-mystical">Build Configuration</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-mystical text-sm">Max Luminas:</label>
              <Input
                type="number"
                value={maxLuminas}
                onChange={(e) => setMaxLuminas(Number(e.target.value))}
                className="w-24 bg-gaming-bg border-gaming-border"
              />
              <label className="text-mystical text-sm">Weapon Damage:</label>
              <Input
                type="number"
                value={weaponDamage}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1 && value <= 15000) {
                    setWeaponDamage(value);
                  } else if (value < 1) {
                    setWeaponDamage(1);
                  } else if (value > 15000) {
                    setWeaponDamage(15000);
                  }
                }}
                className="w-24 bg-gaming-bg border-gaming-border"
              />
              <Badge
                variant="secondary"
                className="bg-mystical/20 text-mystical-foreground border-mystical/30"
              >
                Total Cost: {totalCost} / {maxLuminas}
              </Badge>
              <Button
                onClick={handleClearSelection}
                variant="outline"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Total Effects Summary */}
        {Object.keys(totalEffectsSummary).length > 0 && (
          <Card className="bg-gaming-card border-gaming-border sticky top-6 z-10">
            <CardHeader>
              <CardTitle className="text-mystical">
                Total Effects Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-4 max-h-60 overflow-y-auto">
              <div className="flex-1 space-y-2">
                {totalEffectsSummary.increasedDamage > 0 && (
                  <div className="text-muted-foreground highlight-damage">
                    Total Increased Damage: {totalEffectsSummary.increasedDamage}%
                    {totalEffectsSummary.estimatedDamage > 0 && (
                      <span>
                        {" "}(Estimated Damage: {totalEffectsSummary.estimatedDamage.toFixed(2)}
                        {totalEffectsSummary.hasRoulette && (
                          <span>
                            {" "}(Min: {totalEffectsSummary.minDamage.toFixed(2)} / Max: {totalEffectsSummary.maxDamage.toFixed(2)})
                          </span>
                        )}
                        )
                      </span>
                    )}
                  </div>
                )}
                {totalEffectsSummary.totalAPGain > 0 && (
                  <div className="text-muted-foreground highlight-ap">
                    Total AP Gain: {totalEffectsSummary.totalAPGain}
                  </div>
                )}
                {totalEffectsSummary.totalShieldGain > 0 && (
                  <div className="text-muted-foreground highlight-shield">
                    Total Shield Gain: {totalEffectsSummary.totalShieldGain}
                  </div>
                )}
                {totalEffectsSummary.totalHeal > 0 && (
                  <div className="text-muted-foreground highlight-heal">
                    Total Heal: {totalEffectsSummary.totalHeal}%
                  </div>
                )}
                {totalEffectsSummary.totalHealthGain > 0 && (
                  <div className="text-muted-foreground highlight-heal">
                    Total Health Gain: {totalEffectsSummary.totalHealthGain}
                  </div>
                )}
                {totalEffectsSummary.totalBreakDamageIncrease > 0 && (
                  <div className="text-muted-foreground highlight-break-damage">
                    Total Increased Break Damage:{" "}
                    {totalEffectsSummary.totalBreakDamageIncrease}%
                  </div>
                )}
                {totalEffectsSummary.totalGradientCharge > 0 && (
                  <div className="text-muted-foreground highlight-gradient">
                    Total Gradient Charge:{" "}
                    {totalEffectsSummary.totalGradientCharge}%
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="text-mystical">List of the effects</label>
                <div className="w-full bg-gaming-bg border-gaming-border p-2 rounded-md max-h-40 overflow-y-auto">
                  {totalEffect.map((effect, index) => (
                    <div key={index} className="text-muted-foreground">
                      {effect}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-6">
          {/* Filters Section */}
          {pictos.length > 0 && (
            <Card className="bg-gaming-card border-gaming-border flex-1">
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
                    className={
                      selectedAttribute === ""
                        ? "bg-mystical hover:bg-mystical-glow"
                        : ""
                    }
                  >
                    All Attributes
                  </Button>
                  {allAttributes.map((attr) => (
                    <Button
                      key={attr}
                      variant={
                        selectedAttribute === attr ? "default" : "outline"
                      }
                      onClick={() => setSelectedAttribute(attr)}
                      className={
                        selectedAttribute === attr
                          ? "bg-mystical hover:bg-mystical-glow"
                          : ""
                      }
                    >
                      {attr}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sorting Section */}
          {pictos.length > 0 && (
            <Card className="bg-gaming-card border-gaming-border flex-1">
              <CardHeader>
                <CardTitle className="text-mystical flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Sort Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={sortOption === "name" ? "default" : "outline"}
                    onClick={() => setSortOption("name")}
                    className={
                      sortOption === "name"
                        ? "bg-mystical hover:bg-mystical-glow"
                        : ""
                    }
                  >
                    Sort by Name
                  </Button>
                  <Button
                    variant={sortOption === "selected" ? "default" : "outline"}
                    onClick={() => setSortOption("selected")}
                    className={
                      sortOption === "selected"
                        ? "bg-mystical hover:bg-mystical-glow"
                        : ""
                    }
                  >
                    Sort by Selected
                  </Button>
                  <Button
                    variant={sortOption === "cost" ? "default" : "outline"}
                    onClick={() => setSortOption("cost")}
                    className={
                      sortOption === "cost"
                        ? "bg-mystical hover:bg-mystical-glow"
                        : ""
                    }
                  >
                    Sort by Cost
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Grid */}
        {filteredPictos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPictos.map((picto, index) => {
              const isSelected = selectedPictos.some(
                (p) => p["Pictos Name"] === picto["Pictos Name"]
              );
              const remainingPoints = maxLuminas - totalCost;
              const isDisabled = !isSelected && picto.Cost > remainingPoints;

              return (
                <PictoCard
                  key={index}
                  picto={picto}
                  onClick={() => handlePictoSelection(picto)}
                  selected={isSelected}
                  disabled={isDisabled}
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {pictos.length === 0 && (
          <Card className="bg-gaming-card border-gaming-border">
            <CardContent className="text-center py-12">
              <Sparkles className="w-12 h-12 text-mystical mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-mystical mb-2">
                Ready to Optimize
              </h3>
              <p className="text-muted-foreground">
                Load your pictos data to start building the perfect character
                setup
              </p>
            </CardContent>
          </Card>
        )}

        {/* Data Input Section */}
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader>
            <CardTitle className="text-mystical flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Override Pictos Data
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
            <Button
              onClick={handleLoadData}
              className="bg-mystical hover:bg-mystical-glow"
            >
              Override Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
