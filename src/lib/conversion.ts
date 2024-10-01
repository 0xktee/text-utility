import _ from "lodash";
import {
  CAMEL_CASE,
  SNAKE_CASE,
  KEBAB_CASE,
  ARG_INDEX,
  ARG_ORIGINAL_VALUE,
  ARG_CONVERTED_VALUE,
} from "@/constants/text";

type Options = {
  prefix: string;
  suffix: string;
  prepend: string;
};

export function convertText(
  text: string,
  toStyle: string,
  { prefix, suffix, prepend }: Options
) {
  if (!_.isEmpty(prepend)) {
    prepend = prepend.concat("\n");
  }

  let displayText = "";
  const lines = text
    .split("\n")
    .filter((line) => !_.chain(line).trim().isEmpty().value());
  lines.forEach((line, index) => {
    const replacedArgLine = line.replace(ARG_INDEX, index.toString());
    const convertedLine = applyConversionStyle(replacedArgLine, toStyle);

    const replacedArgPrepend = prepend
      .replace(ARG_INDEX, index.toString())
      .replace(ARG_ORIGINAL_VALUE, replacedArgLine)
      .replace(ARG_CONVERTED_VALUE, convertedLine);
    const endOfLine = lines.length - 1 === index ? "" : "\n";

    displayText = displayText.concat(
      `${replacedArgPrepend}${prefix}${convertedLine}${suffix}${endOfLine}`
    );
  });

  return displayText;
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
