import React from "react";
import _ from "lodash";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function InputLineCountBadge({
  name,
  className,
  ...props
}: { name: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { watch } = useFormContext();
  const [total, setTotal] = React.useState<number>(1);
  const [nonEmpty, setNonEmpty] = React.useState<number>(0);

  React.useEffect(() => {
    const value = watch(name) as string;
    if (value) {
      const lines = value.split("\n");
      const nonEmptyLines = lines.filter(
        (line) => !_.chain(line).trim().isEmpty().value()
      );
      setTotal(lines.length);
      setNonEmpty(nonEmptyLines.length);
    } else {
      setTotal(1);
      setNonEmpty(0);
    }
    return () => {};
  }, [watch(name)]);

  return (
    <div className={cn("space-x-1", className)} {...props}>
      <Badge variant="outline">Non-empty lines: {nonEmpty}</Badge>
      <Badge variant="outline">Total lines: {total}</Badge>
    </div>
  );
}
