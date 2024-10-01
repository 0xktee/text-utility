import { CAMEL_CASE } from './text';

type SettingPreset = {
  label: string;
  value: string;
  field: {
    toStyle?: string;
    prefix?: string;
    suffix?: string;
    prepend?: string;
  };
};

export const SETTING_PRESETS: Array<SettingPreset> = [
  {
    label: '@CsvBindPosition for Java',
    value: 'csvBindPositionJava',
    field: {
      toStyle: CAMEL_CASE,
      prefix: 'private String ',
      suffix: ';',
      prepend: '\n@CsvBindPosition(position = {INDEX})',
    },
  },
  {
    label: '@Column for Java',
    value: 'columnJava',
    field: {
      toStyle: CAMEL_CASE,
      prefix: 'private String ',
      suffix: ';',
      prepend: '\n@Column(name = "{ORIGINAL_VALUE}")',
    },
  },
  {
    label: '@JsonProperty for Java',
    value: 'jsonPropertyJava',
    field: {
      toStyle: CAMEL_CASE,
      prefix: 'private String ',
      suffix: ';',
      prepend: '\n@JsonProperty("{CONVERTED_VALUE}")',
    },
  },
];
