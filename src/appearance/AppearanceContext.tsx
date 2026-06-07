import { createContext, useContext, useMemo, useState } from "react";
import { schemes, defaultSchemeId, type ColorScheme } from "./schemes";
import { characters, defaultCharacterId, type Character } from "./characters";

interface AppearanceValue {
  schemes: ColorScheme[];
  scheme: ColorScheme;
  setSchemeId: (id: string) => void;
  characters: Character[];
  character: Character;
  setCharacterId: (id: string) => void;
}

/** Sensible default so frames/marks still render outside a provider (e.g. tests). */
const defaultValue: AppearanceValue = {
  schemes,
  scheme: schemes[0],
  setSchemeId: () => {},
  characters,
  character: characters[0],
  setCharacterId: () => {},
};

const AppearanceContext = createContext<AppearanceValue>(defaultValue);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [schemeId, setSchemeId] = useState(defaultSchemeId);
  const [characterId, setCharacterId] = useState(defaultCharacterId);

  const value = useMemo<AppearanceValue>(() => {
    return {
      schemes,
      scheme: schemes.find((s) => s.id === schemeId) ?? schemes[0],
      setSchemeId,
      characters,
      character: characters.find((c) => c.id === characterId) ?? characters[0],
      setCharacterId,
    };
  }, [schemeId, characterId]);

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}
