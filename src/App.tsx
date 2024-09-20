import React, { type ChangeEvent } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitErrorHandler, useForm } from "react-hook-form"
import { z } from "zod"
import _ from "lodash"

import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import {
  convertToMarkdown,
  toCamelCase,
  toDefault,
  toKebabCase,
  toSnakeCase
} from "./lib/converter"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./components/ui/select"

const FormSchema = z.object({
  input: z.string(),
  case: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  above: z.string().optional(),
  preset: z.string().optional()
})

function App() {
  const [result, setResult] = React.useState<string>()

  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null)

  React.useEffect(() => {
    // initiate textarea height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "2.5rem" // equals min-h-10, 2.5rem, and 40px
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 1}px`
    }

    return () => {}
  }, [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { case: "camel" }
  })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("input", e.target.value)

    // update textarea height on value changed
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "2.5rem"
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 1}px`
    }
  }

  const handlePresetChange = (value: string) => {
    switch (value) {
      case "csv":
        form.setValue("case", "camel")
        form.setValue("prefix", "private String ")
        form.setValue("suffix", ";")
        form.setValue("above", "\n@CsvBindPosition(position = {INDEX})")
        break
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    let textList: Array<string> = []
    if (!_.isEmpty(data.input)) {
      switch (data.case) {
        case "camel":
          textList = toCamelCase(data.input)
          break
        case "snake":
          textList = toSnakeCase(data.input)
          break
        case "kebab":
          textList = toKebabCase(data.input)
          break
        case "none":
        default:
          textList = toDefault(data.input)
          break
      }
    }

    const markdownText = convertToMarkdown(textList, {
      prefix: data.prefix,
      suffix: data.suffix,
      above: data.above
    })

    setResult(markdownText)
  }

  const onError: SubmitErrorHandler<z.infer<typeof FormSchema>> = (error) => {
    console.error(error)
    toast({
      title: "Input invalid:"
      // description: error
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="relative w-full h-screen p-8"
      >
        <div className="flex h-full space-x-6">
          <div className="flex-1">
            <div className="flex flex-col h-full space-y-1">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem className="min-h-[50%]">
                    <FormControl>
                      <Textarea
                        placeholder="Enter your text here... (multiple lines allowed)"
                        className="resize-none min-h-full max-h-full"
                        onChange={handleChange}
                        ref={(e) => {
                          field.ref(e)
                          textAreaRef.current = e
                        }}
                        style={{
                          fontFamily:
                            "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grow">
                <Textarea
                  className="resize-none min-h-full max-h-full"
                  placeholder="Converted result will appear here"
                  disabled={_.isEmpty(result)}
                  value={result}
                  style={{
                    fontFamily:
                      "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-none min-w-80 space-y-4">
            <FormField
              name="case"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convert to</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="camel">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a case to be converted" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="camel">camelCase</SelectItem>
                      <SelectItem value="snake">SNAKE_CASE</SelectItem>
                      <SelectItem value="kebab">kebab-case</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0">
                    <FormLabel>Prefix</FormLabel>
                    <FormDescription>Add text before each line.</FormDescription>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0">
                    <FormLabel>Suffix</FormLabel>
                    <FormDescription>Add text at the end of each line.</FormDescription>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="above"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0">
                    <FormLabel>Above</FormLabel>
                    <FormDescription>
                      Add text above each line, supported multiple lines.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    {"Use {INDEX} to append index number for each above line."}
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Convert
            </Button>

            <FormField
              name="preset"
              render={() => (
                <FormItem>
                  <FormLabel>Preset</FormLabel>
                  <Select onValueChange={handlePresetChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="csv">Add CSV position JAVA</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default App
