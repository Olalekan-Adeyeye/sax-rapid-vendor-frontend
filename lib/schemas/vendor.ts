import * as z from "zod";

const positiveAmount = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      `${label} must be a positive number`,
    );

const nonNegativeInteger = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0,
      `${label} must be a whole number (0 or more)`,
    );

/**
 * Profile Schema
 */
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Product Schema
 */
const baseProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Please select a category"),
  sku: z.string().optional(),
  weight: positiveAmount("Weight"),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const simpleProductSchema = baseProductSchema.extend({
  type: z.literal("simple"),
  regularPrice: positiveAmount("Regular price"),
  salePrice: z.string().optional(),
  saleStartDate: z.string().optional(),
  saleEndDate: z.string().optional(),
  stockQuantity: nonNegativeInteger("Stock quantity"),
});

export const variableProductSchema = baseProductSchema.extend({
  type: z.literal("variable"),
  attributes: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Attribute name is required"),
    values: z.array(z.string()).min(1, "At least one value required"),
  })),
  variations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: positiveAmount("Price"),
    salePrice: z.string().optional(),
    saleStartDate: z.string().optional(),
    saleEndDate: z.string().optional(),
    stock: nonNegativeInteger("Stock"),
    attributes: z.array(z.object({
      attributeName: z.string(),
      attributeValue: z.string(),
    })).optional(),
  })),
});

export const productSchema = z.discriminatedUnion("type", [
  simpleProductSchema,
  variableProductSchema,
]);

export type SimpleProductValues = z.infer<typeof simpleProductSchema>;
export type VariableProductValues = z.infer<typeof variableProductSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
