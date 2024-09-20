import _ from "lodash"

export function toCamelCase(str: string): Array<string> {
  const textList = str.split("\n")
  return textList.map((text, index) => {
    if (!_.isEmpty(text)) {
      text = text.replace("{INDEX}", index.toString())
      return _.camelCase(text)
    }
  }) as Array<string>
}

export function toSnakeCase(str: string): Array<string> {
  const textList = str.split("\n")
  return textList.map((text, index) => {
    if (!_.isEmpty(text)) {
      text = text.replace("{INDEX}", index.toString())
      return _.chain(text).snakeCase().upperCase().value()
    }
  }) as Array<string>
}

export function toKebabCase(str: string): Array<string> {
  const textList = str.split("\n")
  return textList.map((text, index) => {
    if (!_.isEmpty(text)) {
      text = text.replace("{INDEX}", index.toString())
      return _.kebabCase(text)
    }
  }) as Array<string>
}

export function toDefault(str: string): Array<string> {
  const textList = str.split("\n")
  return textList.map((text, index) => {
    if (!_.isEmpty(text)) {
      return text.replace("{INDEX}", index.toString())
    }
  }) as Array<string>
}

export function convertToMarkdown(
  textList: Array<string>,
  options: {
    prefix?: string
    suffix?: string
    above?: string
  }
): string {
  if (_.isEmpty(textList)) {
    return ""
  }
  const { prefix = "", suffix = "", above = "" } = options

  let aboveText = ""
  if (!_.isEmpty(above)) {
    aboveText = above.concat("\n")
  }

  let markdownText = ""
  textList.forEach((text, index) => {
    if (!_.isEmpty(text)) {
      const temp = aboveText.replace("{INDEX}", index.toString())
      markdownText = markdownText.concat(`${temp}${prefix}${text}${suffix}\n`)
    }
  })

  return markdownText
}
