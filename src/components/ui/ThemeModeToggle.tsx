
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Switch } from "./switch";

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(theme === "dark");

  useEffect(() => {
    setIsChecked(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setIsChecked(newTheme === "dark");
  };

  return (
    <div className="flex items-center gap-2 justify-between">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isChecked}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
