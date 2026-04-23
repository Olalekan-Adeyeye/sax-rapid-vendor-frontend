import * as z from "zod";

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
  weight: z.string().min(1, "Weight is required"),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  status: z.enum(["In stock", "Out of Stock", "Pre-order"]),
  images: z.array(z.string()).optional(),
});

export const simpleProductSchema = baseProductSchema.extend({
  type: z.literal("simple"),
  regularPrice: z.string().min(1, "Regular price is required"),
  salePrice: z.string().optional(),
  saleStartDate: z.string().optional(),
  saleEndDate: z.string().optional(),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
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
    price: z.string().min(1, "Price is required"),
    salePrice: z.string().optional(),
    saleStartDate: z.string().optional(),
    saleEndDate: z.string().optional(),
    stock: z.string().min(1, "Stock is required"),
  })),
});

export const productSchema = z.discriminatedUnion("type", [
  simpleProductSchema,
  variableProductSchema,
]);

export type SimpleProductValues = z.infer<typeof simpleProductSchema>;
export type VariableProductValues = z.infer<typeof variableProductSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
