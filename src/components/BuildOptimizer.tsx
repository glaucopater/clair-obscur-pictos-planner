import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Sparkles className="text-mystical w-8 h-8" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-mystical to-mystical-glow bg-clip-text text-transparent">
              Clair Obscur: Expedition 33 Build Optimizer
            </h1>
            <Sparkles className="text-mystical w-8 h-8" />
          </div>
          <p className="text-muted-foreground text-lg">
            Optimize your pictos build for maximum effectiveness
          </p>
        </div>

        {/* Luminas Input */}
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between">
            <CardTitle className="text-mystical">Build Configuration</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2 md:mb-0">
                <label className="text-mystical text-sm">Max Luminas:</label>
                <Input
                  type="number"
                  value={maxLuminas}
                  onChange={(e) => setMaxLuminas(Number(e.target.value))}
                  className="w-24 bg-gaming-bg border-gaming-border"
                />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2 md:mb-0">
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
              </div>
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
          <Card className="bg-gaming-card border-gaming-border sticky top-6 z-10 opacity-90">
            <CardHeader>
              <CardTitle className="text-mystical">
                Pictos Effects Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4 max-h-60 overflow-y-auto">
              <div className="w-full md:w-1/2 space-y-2">
                {totalEffectsSummary.increasedDamage > 0 && (
                  <div className="highlight-damage">
                    Total Increased Damage:{" "}
                    {totalEffectsSummary.increasedDamage}%
                    {totalEffectsSummary.estimatedDamage > 0 && (
                      <span>
                        {" "}
                        (Estimated Damage:{" "}
                        {totalEffectsSummary.estimatedDamage}
                        {totalEffectsSummary.hasRoulette && (
                          <span>
                            {" "}
                            (Min: {totalEffectsSummary.minDamage} /
                            Max: {totalEffectsSummary.maxDamage})
                          </span>
                        )}
                        )
                      </span>
                    )}
                  </div>
                )}
                {totalEffectsSummary.totalAPGain > 0 && (
                  <div className="highlight-ap">
                    Total AP Gain: {totalEffectsSummary.totalAPGain}
                  </div>
                )}
                {totalEffectsSummary.totalShieldGain > 0 && (
                  <div className="highlight-shield">
                    Total Shield Gain: {totalEffectsSummary.totalShieldGain}
                  </div>
                )}
                {totalEffectsSummary.totalHeal > 0 && (
                  <div className="highlight-heal">
                    Total Heal: {totalEffectsSummary.totalHeal}%
                  </div>
                )}
                {totalEffectsSummary.totalHealthGain > 0 && (
                  <div className="highlight-heal">
                    Total Health Gain: {totalEffectsSummary.totalHealthGain}
                  </div>
                )}
                {totalEffectsSummary.totalBreakDamageIncrease > 0 && (
                  <div className="highlight-break-damage">
                    Total Increased Break Damage:{" "}
                    {totalEffectsSummary.totalBreakDamageIncrease}%
                  </div>
                )}
                {totalEffectsSummary.totalGradientCharge > 0 && (
                  <div className="highlight-gradient">
                    Total Gradient Charge:{" "}
                    {totalEffectsSummary.totalGradientCharge}%
                  </div>
                )}
                {totalEffectsSummary.totalCounterattackDamage > 0 && (
                  <div className="highlight-counterattack">
                    Total Increased Counterattack Damage:{" "}
                    {totalEffectsSummary.totalCounterattackDamage}%
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 hidden md:block">
                <label className="text-mystical">List of the effects</label>
                <div className="w-full bg-gaming-bg border-gaming-border p-2 rounded-md max-h-[7.5em] overflow-y-auto">
                  {totalEffect.map((effect, index) => {
                    let effectClass = "text-muted-foreground";
                    if (effect.includes("increased Counterattack damage")) {
                      effectClass = "highlight-counterattack";
                    } else if (effect.includes("increased damage")) {
                      effectClass = "highlight-damage";
                    } else if (effect.includes("AP")) {
                      effectClass = "highlight-ap";
                    } else if (effect.includes("Shield")) {
                      effectClass = "highlight-shield";
                    } else if (effect.includes("Heal")) {
                      effectClass = "highlight-heal";
                    } else if (effect.includes("Break damage")) {
                      effectClass = "highlight-break-damage";
                    } else if (effect.includes("Gradient Charge")) {
                      effectClass = "highlight-gradient";
                    }
                    return (
                      <div key={index} className={effectClass}>
                        {effect}
                      </div>
                    );
                  })}
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
                  Category Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={selectedAttribute.length === 0 ? "default" : "outline"}
                    onClick={() => setSelectedAttribute([])}
                    className={
                      selectedAttribute.length === 0
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
                        selectedAttribute.includes(attr) ? "default" : "outline"
                      }
                      onClick={() => {
                        setSelectedAttribute((prev) =>
                          prev.includes(attr)
                            ? prev.filter((a) => a !== attr)
                            : [...prev, attr]
                        );
                      }}
                      className={
                        selectedAttribute.includes(attr)
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
      </div>
      <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>Disclaimer: This is a fan-made tool and not affiliated with the official Clair Obscur: Expedition 33 game or its developers.</p>
      </footer>
    </div>
  );
};
