import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitErrorHandler, useForm } from "react-hook-form"
import { z } from "zod"
import _ from "lodash"

import { Separator } from "@/components/ui/separator"
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
import { convertText } from "./lib/conversion"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./components/ui/select"
import { CAMEL_CASE, TEXT_STYLES } from "./constant/text"
import { SETTING_PRESETS } from "./constant/preset"

const FormSchema = z.object({
  input: z.string(),
  toStyle: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  prepend: z.string().optional(),
  preset: z.string().optional()
})

export default function App() {
  const [result, setResult] = React.useState<string>()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { toStyle: CAMEL_CASE }
  })

  const handlePresetChange = (value: string) => {
    const preset = SETTING_PRESETS.find((preset) => preset.value === value)

    if (preset) {
      const { toStyle, prefix, suffix, prepend } = preset.field
      form.setValue("toStyle", toStyle)
      form.setValue("prefix", prefix)
      form.setValue("suffix", suffix)
      form.setValue("prepend", prepend)
    }

    // switch (value) {
    //   case "csvBindPositionJava":
    //     form.setValue("toStyle", CAMEL_CASE)
    //     form.setValue("prefix", "private String ")
    //     form.setValue("suffix", ";")
    //     form.setValue("prepend", "\n@CsvBindPosition(position = {INDEX})")
    //     break
    //   case "columnJava":
    //     form.setValue("toStyle", CAMEL_CASE)
    //     form.setValue("prefix", "private String ")
    //     form.setValue("suffix", ";")
    //     form.setValue("prepend", '\n@Column(name = "{ORIGINAL_VALUE}")')
    //     break
    //   case "jsonPropertyJava":
    //     form.setValue("toStyle", CAMEL_CASE)
    //     form.setValue("prefix", "private String ")
    //     form.setValue("suffix", ";")
    //     form.setValue("prepend", '\n@JsonProperty("{CONVERTED_VALUE}")')
    //     break
    // }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    if (data.input && data.toStyle) {
      const displayText = convertText(data.input, data.toStyle, {
        prefix: data.prefix ? data.prefix : "",
        suffix: data.suffix ? data.suffix : "",
        prepend: data.prepend ? data.prepend : ""
      })

      setResult(displayText)
    }
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
            <div className="flex flex-col h-full space-y-2">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem className="min-h-[50%]">
                    <FormControl>
                      <Textarea
                        className="resize-none h-full font-mono"
                        placeholder="Enter your text here... (multiple lines allowed)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grow relative">
                <Textarea
                  className="resize-none h-full font-mono"
                  placeholder="Converted result will appear here"
                  disabled={_.isEmpty(result)}
                  value={result}
                />
              </div>
            </div>
          </div>

          <div className="flex-none min-w-80 space-y-4">
            <FormField
              name="toStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convert to</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={CAMEL_CASE}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style to be converted" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEXT_STYLES.map((style, index) => (
                        <SelectItem key={index} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
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
              name="prepend"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0">
                    <FormLabel>Prepend</FormLabel>
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

            <Separator />

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
                      {SETTING_PRESETS.map((preset, index) => (
                        <SelectItem key={index} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
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
