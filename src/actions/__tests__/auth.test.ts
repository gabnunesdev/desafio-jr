import { vi, describe, it, expect, beforeEach } from 'vitest'
import { register, login } from '../auth'
import { prisma } from '@/lib/prisma'
import { DeepMockProxy } from 'vitest-mock-extended'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  name: "Test User",
  email: "test@example.com",
  contact: "12345",
  password: "hashed_password",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

describe('Auth Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

  describe('register', () => {
    it('should fail with validation error for invalid email', async () => {
      const result = await register({
        name: 'Test User',
        email: 'invalid-email',
        contact: '12345',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Erro de validação')
    })

    it('should fail if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(createMockUser({ email: 'test@example.com' }))

      const result = await register({
        name: 'Test User',
        email: 'test@example.com',
        contact: '12345',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Este email já está cadastrado.')
    })

    it('should create user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as never)
      prismaMock.user.create.mockResolvedValue(createMockUser({ 
          email: 'new@example.com',
          name: 'Test User' 
      }))

      const result = await register({
        name: 'Test User',
        email: 'new@example.com',
        contact: '12345',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      expect(prismaMock.user.create).toHaveBeenCalled()
    })
  })

  // Basic sanity check for login structure, though mocking Jose/Cookies fully is complex in this context
  // focusing on business logic flow
  describe('login', () => {
      it('should fail if user not found', async () => {
          prismaMock.user.findUnique.mockResolvedValue(null)
          
          const result = await login({
              email: 'notfound@example.com',
              password: 'password123'
          })
          
          expect(result.success).toBe(false)
          expect(result.message).toBe('Email ou senha incorretos.')
      })
  })
})
