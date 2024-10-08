import _ from 'lodash';
import {
  CAMEL_CASE,
  SNAKE_CASE,
  KEBAB_CASE,
  ARG_INDEX,
  ARG_ORIGINAL_VALUE,
  ARG_CONVERTED_VALUE,
} from '@/constants/text';

type Options = {
  prefix: string;
  suffix: string;
  prepend: string;
};

export function convertText(text: string, toStyle: string, { prefix, suffix, prepend }: Options) {
  if (!_.isEmpty(prepend)) {
    prepend = prepend.concat('\n');
  }

  let displayText = '';
  const lines = text.split('\n').filter((line) => !_.chain(line).trim().isEmpty().value());
  lines.forEach((line, index) => {
    const convertedLine = applyConversionStyle(line, toStyle);

    const replacedArgPrefix = replaceArg(prefix, {
      index: index,
      originalValue: line,
      convertedValue: convertedLine,
    });
    const replacedArgSuffix = replaceArg(suffix, {
      index: index,
      originalValue: line,
      convertedValue: convertedLine,
    });
    const replacedArgPrepend = replaceArg(prepend, {
      index: index,
      originalValue: line,
      convertedValue: convertedLine,
    });
    const endOfLine = lines.length - 1 === index ? '' : '\n';

    displayText = displayText.concat(
      `${replacedArgPrepend}${replacedArgPrefix}${convertedLine}${replacedArgSuffix}${endOfLine}`,
    );
  });

  return displayText;
}

function replaceArg(
  textToReplace: string,
  args: { index: number; originalValue: string; convertedValue: string },
) {
  return textToReplace
    .replace(ARG_INDEX, args.index.toString())
    .replace(ARG_ORIGINAL_VALUE, args.originalValue)
    .replace(ARG_CONVERTED_VALUE, args.convertedValue);
}

function applyConversionStyle(text: string, toStyle: string) {
  switch (toStyle) {
    case CAMEL_CASE:
      return _.camelCase(text);
    case SNAKE_CASE:
      return _.chain(text).snakeCase().upperCase().value();
    case KEBAB_CASE:
      return _.kebabCase(text);
    default:
      return text;
  }
}
