import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitErrorHandler, useForm } from "react-hook-form"
import { z } from "zod"

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
import PresetDropdown from "./components/preset-dropdown"
import LineCountBadge from "./components/line-count-badge"

const FormSchema = z.object({
  input: z.string(),
  toStyle: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  prepend: z.string().optional(),
  output: z.string().optional().readonly() // using only for display result
})

export default function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { toStyle: CAMEL_CASE }
  })

  form.watch("input")

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    if (data.input && data.toStyle) {
      const resultText = convertText(data.input, data.toStyle, {
        prefix: data.prefix ? data.prefix : "",
        suffix: data.suffix ? data.suffix : "",
        prepend: data.prepend ? data.prepend : ""
      })

      form.setValue("output", resultText)
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
                  <FormItem className="relative min-h-[50%]">
                    <FormControl>
                      <Textarea
                        className="resize-none h-full font-mono"
                        placeholder="Enter your text here... (multiple lines allowed)"
                        {...field}
                      />
                    </FormControl>
                    <LineCountBadge name="input" className="absolute bottom-2 right-2" />
                  </FormItem>
                )}
              />
              <div className="grow relative">
                <FormField
                  control={form.control}
                  name="output"
                  render={({ field }) => (
                    <FormItem className="relative h-full">
                      <FormControl>
                        <Textarea
                          className="resize-none h-full font-mono"
                          placeholder="Converted result will appear here"
                          {...field}
                        />
                      </FormControl>
                      <LineCountBadge name="output" className="absolute bottom-2 right-2" />
                    </FormItem>
                  )}
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
                    <FormDescription>Add text in front of each line.</FormDescription>
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

            <PresetDropdown />
          </div>
        </div>
      </form>
    </Form>
  )
}
