import * as z from "zod"

export const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zipCode: z.string().min(6, { message: "PIN Code must be at least 6 digits." }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
