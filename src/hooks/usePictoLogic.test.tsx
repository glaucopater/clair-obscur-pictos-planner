import { renderHook, act } from '@testing-library/react';
import { usePictoLogic } from './usePictoLogic';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('@/data/pictos.json', () => ({
  default: [
    {
      "Pictos Name": "Picto A",
      "Affected Attributes": "Health, Speed",
      "Luminas Effect": "+10% increased damage",
      "Cost": 10
    },
    {
      "Pictos Name": "Picto B",
      "Affected Attributes": "Defense",
      "Luminas Effect": "+5 AP",
      "Cost": 5
    },
    {
      "Pictos Name": "Picto C",
      "Affected Attributes": "Critical Rate",
      "Luminas Effect": "+20% increased Break damage",
      "Cost": 15
    },
    {
      "Pictos Name": "Picto D",
      "Affected Attributes": "Health",
      "Luminas Effect": "Recover 20 Health",
      "Cost": 8
    },
    {
      "Pictos Name": "Picto E",
      "Affected Attributes": "Defense",
      "Luminas Effect": "+3 Shield",
      "Cost": 7
    },
  ]
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('usePictoLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePictoLogic());

    expect(result.current.pictos).toEqual([
      {
        "Pictos Name": "Picto A",
        "Affected Attributes": "Health, Speed",
        "Luminas Effect": "+10% increased damage",
        "Cost": 10
      },
      {
        "Pictos Name": "Picto B",
        "Affected Attributes": "Defense",
        "Luminas Effect": "+5 AP",
        "Cost": 5
      },
      {
        "Pictos Name": "Picto C",
        "Affected Attributes": "Critical Rate",
        "Luminas Effect": "+20% increased Break damage",
        "Cost": 15
      },
      {
        "Pictos Name": "Picto D",
        "Affected Attributes": "Health",
        "Luminas Effect": "Recover 20 Health",
        "Cost": 8
      },
      {
        "Pictos Name": "Picto E",
        "Affected Attributes": "Defense",
        "Luminas Effect": "+3 Shield",
        "Cost": 7
      },
    ]);
    expect(result.current.selectedPictos).toEqual([]);
    expect(result.current.maxLuminas).toBe(250);
    expect(result.current.weaponDamage).toBe(7000);
    expect(result.current.sortOption).toBe('name');
  });

  it('should load selected pictos from local storage', () => {
    const initialSelected = [
      {
        "Pictos Name": "Picto A",
        "Affected Attributes": "Health, Speed",
        "Luminas Effect": "+10% increased damage",
        "Cost": 10
      }
    ];
    localStorage.setItem('selectedPictos', JSON.stringify(initialSelected));
    const { result } = renderHook(() => usePictoLogic());

    expect(result.current.selectedPictos).toEqual(initialSelected);
  });

  it('should add a picto to selectedPictos', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[0]);
    });

    expect(result.current.selectedPictos).toEqual([result.current.pictos[0]]);
  });

  it('should remove a picto from selectedPictos', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[0]);
    });

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[0]);
    });

    expect(result.current.selectedPictos).toEqual([]);
  });

  it('should not add a picto if cost exceeds maxLuminas', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.setMaxLuminas(5);
    });

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[0]); // Cost 10
    });

    expect(result.current.selectedPictos).toEqual([]);
  });

  it('should clear all selected pictos', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[0]);
      result.current.handlePictoSelection(result.current.pictos[1]);
      result.current.handleClearSelection();
    });

    expect(result.current.selectedPictos).toEqual([]);
  });

  it('should filter pictos by attribute', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.setSelectedAttribute('Health');
    });

    expect(result.current.filteredPictos).toEqual([
      result.current.pictos[0], // +10% increased damage (Health, Speed)
      result.current.pictos[3], // Recover 20 Health
    ]);
  });

  it('should sort pictos by name', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.setSortOption('name');
    });

    expect(result.current.filteredPictos.map(p => p["Pictos Name"])).toEqual([
      "Picto A", "Picto B", "Picto C", "Picto D", "Picto E"
    ]);
  });

  it.skip('should sort pictos by selected status', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[2]);
      result.current.handlePictoSelection(result.current.pictos[0]);
      result.current.setSortOption('selected');
    });

    expect(result.current.filteredPictos.map(p => p["Pictos Name"])).toEqual([
      "Picto A", "Picto C", "Picto B", "Picto D", "Picto E"
    ]);
  });

  it.skip('should sort pictos by cost', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.setSortOption('cost');
    });

    expect(result.current.filteredPictos.map(p => p.Cost)).toEqual([
      5, 7, 8, 10, 15
    ]);
  });

  it.skip('should calculate total increased damage', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[0]); // +10% increased damage
      result.current.handlePictoSelection(result.current.pictos[2]); // +20% increased Break damage
    });

    expect(result.current.totalEffectsSummary.increasedDamage).toBe(10);
    expect(result.current.totalEffectsSummary.totalBreakDamageIncrease).toBe(20);
  });

  it('should calculate total AP gain', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[1]); // +5 AP
    });

    expect(result.current.totalEffectsSummary.totalAPGain).toBe(5);
  });

  it('should calculate total Shield gain', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[4]); // +3 Shield
    });

    expect(result.current.totalEffectsSummary.totalShieldGain).toBe(3);
  });

  it('should calculate total heal and health gain', () => {
    const { result } = renderHook(() => usePictoLogic());

    act(() => {
      result.current.handlePictoSelection(result.current.pictos[3]); // Recover 20 Health
    });

    expect(result.current.totalEffectsSummary.totalHealthGain).toBe(20);
  });
});