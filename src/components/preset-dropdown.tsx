import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { SETTING_PRESETS } from "../constants/preset";
import { useFormContext } from "react-hook-form";

export default function PresetDropdown() {
  const { setValue } = useFormContext();

  const handlePresetSelection = (value: string) => {
    const preset = SETTING_PRESETS.find((preset) => preset.value === value);

    if (preset) {
      const { toStyle, prefix, suffix, prepend } = preset.field;
      setValue("toStyle", toStyle);
      setValue("prefix", prefix);
      setValue("suffix", suffix);
      setValue("prepend", prepend);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Presets</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {SETTING_PRESETS.map((preset, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handlePresetSelection(preset.value)}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
