import { z } from 'zod';

export const FormSchema = z.object({
  input: z.string(),
  toStyle: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  prepend: z.string().optional(),
  output: z.string().optional().readonly(), // using only for display result
});
