"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
const secretKey = process.env.JWT_SECRET || "default-dev-secret"
const key = new TextEncoder().encode(secretKey)

const createPetSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["DOG", "CAT"], { message: "Selecione o tipo do animal" }),
  breed: z.string().min(2, "A raça deve ter pelo menos 2 caracteres"),
  ownerName: z.string().min(2, "O nome do dono deve ter pelo menos 2 caracteres"),
  ownerPhone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (DD/MM/AAAA)"),
})

export type PetState = {
  success?: boolean
  error?: string
}

export async function createPet(prevState: PetState | null, formData: FormData): Promise<PetState> {
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
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
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
const updatePetSchema = createPetSchema.extend({
  id: z.string(), // We'll receive ID from formData
})

export async function updatePet(prevState: PetState | null, formData: FormData): Promise<PetState> {
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
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return { error: "Sessão inválida" }
  }

  // 2. Validate Data
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    type: formData.get("type"),
    breed: formData.get("breed"),
    ownerName: formData.get("ownerName"),
    ownerPhone: formData.get("ownerPhone"),
    birthDate: formData.get("birthDate"),
  }

  const validatedFields = updatePetSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const errorMap = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errorMap)[0]?.[0] || "Erro na validação dos dados"
    return { error: firstError }
  }

  const petId = Number(validatedFields.data.id)

  // 3. Verify Ownership
  const existingPet = await prisma.pet.findUnique({
    where: { id: petId },
  })

  if (!existingPet) {
    return { error: "Pet não encontrado (404)" }
  }

  if (existingPet.ownerId !== userId) {
    return { error: "Você não tem permissão para editar este pet (403)" }
  }

  // 4. Update Pet in DB
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: {
        name: validatedFields.data.name,
        type: validatedFields.data.type,
        breed: validatedFields.data.breed,
        ownerName: validatedFields.data.ownerName,
        ownerPhone: validatedFields.data.ownerPhone,
        birthDate: validatedFields.data.birthDate,
      },
    })
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar pet:", error)
    return { error: "Erro ao atualizar pet. Tente novamente." }
  }
}

export async function deletePet(id: number): Promise<PetState> {
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
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return { error: "Sessão inválida" }
  }

  // 2. Verify Ownership
  const existingPet = await prisma.pet.findUnique({
    where: { id },
  })

  if (!existingPet) {
    return { error: "Pet não encontrado (404)" }
  }

  if (existingPet.ownerId !== userId) {
    return { error: "Você não tem permissão para excluir este pet (403)" }
  }

  // 3. Delete Pet
  try {
    await prisma.pet.delete({
      where: { id },
    })
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir pet:", error)
    return { error: "Erro ao excluir pet. Tente novamente." }
  }
}
