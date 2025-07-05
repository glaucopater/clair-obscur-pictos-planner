import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import defaultPictosData from "@/data/pictos.json";

interface Picto {
  "Pictos Name": string;
  "Affected Attributes": string;
  "Luminas Effect": string;
  Cost: number;
}

export const usePictoLogic = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [pictos, setPictos] = useState<Picto[]>(defaultPictosData);
  const [selectedAttribute, setSelectedAttribute] = useState<string>(() => {
    const storedAttribute = localStorage.getItem("selectedAttribute");
    return storedAttribute || "";
  });
  const [sortOption, setSortOption] = useState<"name" | "selected" | "cost">(() => {
    const storedSortOption = localStorage.getItem("sortOption");
    return (storedSortOption as "name" | "selected" | "cost") || "name";
  });
  const [maxLuminas, setMaxLuminas] = useState<number>(250);
  const [weaponDamage, setWeaponDamage] = useState<number>(7000);
  const [selectedPictos, setSelectedPictos] = useState<Picto[]>(() => {
    try {
      const storedPictos = localStorage.getItem("selectedPictos");
      return storedPictos ? JSON.parse(storedPictos) : [];
    } catch (error) {
      console.error("Failed to parse selected pictos from local storage:", error);
      return [];
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("selectedPictos", JSON.stringify(selectedPictos));
  }, [selectedPictos]);

  useEffect(() => {
    localStorage.setItem("selectedAttribute", selectedAttribute);
  }, [selectedAttribute]);

  useEffect(() => {
    localStorage.setItem("sortOption", sortOption);
  }, [sortOption]);

  const handlePictoSelection = (picto: Picto) => {
    const isSelected = selectedPictos.find(
      (p) => p["Pictos Name"] === picto["Pictos Name"]
    );
    const currentCost = selectedPictos.reduce((sum, p) => sum + p.Cost, 0);

    if (isSelected) {
      setSelectedPictos(
        selectedPictos.filter((p) => p["Pictos Name"] !== picto["Pictos Name"])
      );
    } else {
      if (currentCost + picto.Cost <= maxLuminas) {
        setSelectedPictos([...selectedPictos, picto]);
      } else {
        toast({
          title: "Luminas Limit Reached",
          description: "You cannot select more pictos.",
          variant: "destructive",
        });
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedPictos([]);
  };

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
    let currentPictos = [...pictos];

    if (selectedAttribute) {
      currentPictos = currentPictos.filter(
        (picto) =>
          picto["Affected Attributes"]
            .toLowerCase()
            .includes(selectedAttribute.toLowerCase())
      );
    }

    const selectedAndFilteredOut = selectedPictos.filter(
      (selectedPicto) =>
        !currentPictos.some(
          (p) => p["Pictos Name"] === selectedPicto["Pictos Name"]
        )
    );

    const combinedPictos = [...currentPictos, ...selectedAndFilteredOut];

    // Apply sorting
    if (sortOption === "name") {
      combinedPictos.sort((a, b) =>
        a["Pictos Name"].localeCompare(b["Pictos Name"])
      );
    } else if (sortOption === "selected") {
      combinedPictos.sort((a, b) => {
        const aSelected = selectedPictos.some(
          (p) => p["Pictos Name"] === a["Pictos Name"]
        );
        const bSelected = selectedPictos.some(
          (p) => p["Pictos Name"] === b["Pictos Name"]
        );
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        // If both are selected or both are unselected, maintain original order (or sort by name as a secondary criteria)
        return a["Pictos Name"].localeCompare(b["Pictos Name"]);
      });
    } else if (sortOption === "cost") {
      combinedPictos.sort((a, b) => a.Cost - b.Cost);
    }

    return combinedPictos;
  }, [pictos, selectedAttribute, selectedPictos, sortOption]);

  const totalCost = useMemo(() => {
    return selectedPictos.reduce((sum, picto) => sum + Number(picto.Cost), 0);
  }, [selectedPictos]);

  const totalEffect = useMemo(() => {
    return selectedPictos.map((p) => p["Luminas Effect"]);
  }, [selectedPictos]);

  const totalEffectsSummary = useMemo(() => {
    const summary = {
      increasedDamage: 0,
      totalAPGain: 0,
      totalShieldGain: 0,
      totalHeal: 0,
      totalHealthGain: 0,
      totalBreakDamageIncrease: 0,
      totalGradientCharge: 0,
      estimatedDamage: 0,
      minDamage: 0,
      maxDamage: 0,
      hasRoulette: false,
    };

    selectedPictos.forEach((picto) => {
      const effect = picto["Luminas Effect"];
      const attributes = picto["Affected Attributes"];

      // Increased Damage
      const damageMatch = effect.match(/(\d+)% increased damage(?! Break)/);
      if (damageMatch && damageMatch[1]) {
        summary.increasedDamage += parseInt(damageMatch[1], 10);
      }

      // AP Gain
      const apMatch = effect.match(/\+(\d+) AP/);
      if (apMatch && apMatch[1]) {
        summary.totalAPGain += parseInt(apMatch[1], 10);
      }

      // Shield Gain
      const shieldMatch = effect.match(/\+(\d+) Shield/);
      if (shieldMatch && shieldMatch[1]) {
        summary.totalShieldGain += parseInt(shieldMatch[1], 10);
      }

      // Heal (percentage or flat)
      const healPercentMatch = effect.match(/Recover (\d+)% Health/);
      const healHPMatch = effect.match(/Heal (\d+)% HP/);
      const healFlatMatch = effect.match(/Recover (\d+) Health/);

      if (healPercentMatch && healPercentMatch[1]) {
        summary.totalHeal += parseInt(healPercentMatch[1], 10);
      } else if (healHPMatch && healHPMatch[1]) {
        summary.totalHeal += parseInt(healHPMatch[1], 10);
      } else if (healFlatMatch && healFlatMatch[1]) {
        summary.totalHealthGain += parseInt(healFlatMatch[1], 10);
      }

      // Increased Break Damage
      const breakDamageMatch = effect.match(/(\d+)% increased Break damage/);
      if (breakDamageMatch && breakDamageMatch[1]) {
        summary.totalBreakDamageIncrease += parseInt(breakDamageMatch[1], 10);
      }

      // Gradient Charge
      const gradientChargeMatch = effect.match(/(\d+)% of a Gradient Charge/);
      if (gradientChargeMatch && gradientChargeMatch[1]) {
        summary.totalGradientCharge += parseInt(gradientChargeMatch[1], 10);
      }

      // Special case: Double all Heals received (this would require more complex logic to apply to other heals)
      // For now, we'll just note its presence if needed for future enhancements.
      if (effect.includes("Double all Heals received")) {
        // Potentially add a flag or a multiplier to the summary if other heal values are present
      }

      // Check for Roulette effect
      if (effect.includes("50% chance to deal either 50% or 200%")) {
        summary.hasRoulette = true;
      }
    });

    // Calculate Estimated Damage
    summary.estimatedDamage = weaponDamage * (1 + summary.increasedDamage / 100);

    // Calculate Min/Max Damage for Roulette
    if (summary.hasRoulette) {
      summary.minDamage = summary.estimatedDamage * 0.5;
      summary.maxDamage = summary.estimatedDamage * 2.0;
    }

    return summary;
  }, [selectedPictos, weaponDamage]);

  return {
    jsonInput,
    setJsonInput,
    pictos,
    setPictos,
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
  };
};