import { z } from "zod/v4";

export const formSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8).max(50),
    confirm: z.string().min(8).max(50),
}).refine((data) => data.password == data.confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm"]
});

export type FormSchema = typeof formSchema;