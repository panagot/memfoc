import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type GrantPolishState = {
  judgeMode: boolean;
  appliedFixes: string[];
  tourDismissed: boolean;
  enableJudgeMode: (fixes: string[]) => void;
  disableJudgeMode: () => void;
  dismissTour: () => void;
};

const STORAGE_KEY = "memfoc-judge-tour-dismissed";

const GrantPolishContext = createContext<GrantPolishState | null>(null);

export function GrantPolishProvider({ children }: { children: ReactNode }) {
  const [judgeMode, setJudgeMode] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);
  const [tourDismissed, setTourDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1",
  );

  const enableJudgeMode = useCallback((fixes: string[]) => {
    setJudgeMode(true);
    setAppliedFixes(fixes);
  }, []);

  const disableJudgeMode = useCallback(() => {
    setJudgeMode(false);
    setAppliedFixes([]);
  }, []);

  const dismissTour = useCallback(() => {
    setTourDismissed(true);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const value = useMemo(
    () => ({
      judgeMode,
      appliedFixes,
      tourDismissed,
      enableJudgeMode,
      disableJudgeMode,
      dismissTour,
    }),
    [judgeMode, appliedFixes, tourDismissed, enableJudgeMode, disableJudgeMode, dismissTour],
  );

  return <GrantPolishContext.Provider value={value}>{children}</GrantPolishContext.Provider>;
}

export function useGrantPolish() {
  const ctx = useContext(GrantPolishContext);
  if (!ctx) throw new Error("useGrantPolish must be used within GrantPolishProvider");
  return ctx;
}
