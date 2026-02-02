import * as z from "zod"

export const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["DOG", "CAT"], { message: "Selecione o tipo do animal" }),
  breed: z.string().min(2, "A raça deve ter pelo menos 2 caracteres"),
  ownerName: z.string().min(2, "O nome do dono deve ter pelo menos 2 caracteres"),
  ownerPhone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (DD/MM/AAAA)"),
})
