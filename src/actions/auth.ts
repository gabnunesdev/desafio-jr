"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "default-dev-secret" // In production use process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  contact: z.string().min(5, "Contato deve ter pelo menos 5 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

export type AuthState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function register(values: z.infer<typeof registerSchema>): Promise<AuthState> {
  console.log("Register action called with:", JSON.stringify({ ...values, password: "***" }))
  const validatedFields = registerSchema.safeParse(values)

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error)
    return {
      success: false,
      message: "Erro de validação",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, contact, password } = validatedFields.data
  console.log("Validation passed. Checking existing user for email:", email)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return {
        success: false,
        message: "Este email já está cadastrado.",
      }
    }

    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("Creating user in database...")
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        contact,
        password: hashedPassword,
      },
    })
    console.log("User created successfully:", newUser.id)

    return {
      success: true,
      message: "Usuário cadastrado com sucesso!",
    }
  } catch (error) {
    console.error("Registration error FULL DEBUG:", error)
    return {
      success: false,
      message: `Erro debug: ${(error as Error)?.message || "Erro desconhecido"}`,
    }
  }
}

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Erro de validação",
      errors: z.treeifyError(validatedFields.error),
    }
  }

  const { email, password } = validatedFields.data

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        message: "Email ou senha incorretos.",
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return {
        success: false,
        message: "Email ou senha incorretos.",
      }
    }

    // Create session
    // Expires in 24 hours
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id.toString())
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key)

    const cookieStore = await cookies()
    cookieStore.set("session", session, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        expires: expires,
        sameSite: "lax",
        path: "/" 
    })

    return {
      success: true,
      message: "Login realizado com sucesso!",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Erro ao realizar login.",
    }
  }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("session")
}
