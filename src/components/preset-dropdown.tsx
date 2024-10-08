import { useFormContext } from 'react-hook-form';
import { ResetIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SETTING_PRESETS } from '@/constants/preset';

export default function PresetDropdown() {
  const { setValue } = useFormContext();

  const handlePresetSelection = (value: string) => {
    const preset = SETTING_PRESETS.find((preset) => preset.value === value);

    if (preset) {
      const { toStyle, prefix, suffix, prepend } = preset.field;
      setValue('toStyle', toStyle);
      setValue('prefix', prefix);
      setValue('suffix', suffix);
      setValue('prepend', prepend);
    }
  };

  const reset = () => {
    setValue('toStyle', '');
    setValue('prefix', '');
    setValue('suffix', '');
    setValue('prepend', '');
  };

  return (
    <>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" className="flex-1" variant="outline">
              Select Preset
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {SETTING_PRESETS.map((preset, index) => (
              <DropdownMenuItem key={index} onClick={() => handlePresetSelection(preset.value)}>
                {preset.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="outline" size="icon" onClick={() => reset()}>
          <ResetIcon className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
