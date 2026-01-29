"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
const secretKey = "secret-key-change-me"
const key = new TextEncoder().encode(secretKey)

const createPetSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["DOG", "CAT"], { required_error: "Selecione o tipo do animal" }),
  breed: z.string().min(2, "A raça deve ter pelo menos 2 caracteres"),
  ownerName: z.string().min(2, "O nome do dono deve ter pelo menos 2 caracteres"),
  ownerPhone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (DD/MM/AAAA)"),
})

export async function createPet(prevState: any, formData: FormData) {
  // 1. Validate Session
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) {
    return { error: "Usuário não autenticado" }
  }

  let userId: number
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] })
    userId = Number(payload.sub)
  } catch (err) {
    return { error: "Sessão inválida" }
  }

  // 2. Validate Data
  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    breed: formData.get("breed"),
    ownerName: formData.get("ownerName"),
    ownerPhone: formData.get("ownerPhone"),
    birthDate: formData.get("birthDate"),
  }

  const validatedFields = createPetSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const errorMap = validatedFields.error.flatten().fieldErrors
    // Return first error found for simplicity in toast, or generic error
    const firstError = Object.values(errorMap)[0]?.[0] || "Erro na validação dos dados"
    return { error: firstError }
  }

  // 3. Create Pet in DB
  try {
    await prisma.pet.create({
      data: {
        name: validatedFields.data.name,
        type: validatedFields.data.type,
        breed: validatedFields.data.breed,
        ownerName: validatedFields.data.ownerName,
        ownerPhone: validatedFields.data.ownerPhone,
        birthDate: validatedFields.data.birthDate,
        ownerId: userId,
      },
    })
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar pet:", error)
    return { error: "Erro ao criar pet. Tente novamente." }
  }
}
