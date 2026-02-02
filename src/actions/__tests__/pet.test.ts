import { vi, describe, it, expect, beforeEach } from 'vitest'
import { deletePet } from '../pet'
import { prisma } from '@/lib/prisma'
import { DeepMockProxy } from 'vitest-mock-extended'
import { PrismaClient, Pet } from '@prisma/client'
import { jwtVerify } from 'jose'

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

// Mock jwtVerify from jose
vi.mock('jose', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jose')>()
  return {
    ...actual,
    jwtVerify: vi.fn(),
  }
})

// Setup global cookies mock value for tests
const mockSessionValue = "valid_token"
vi.mock('next/headers', () => ({
    cookies: () => ({
        get: () => ({ value: mockSessionValue }),
    })
}))

// Helper to create a complete mock Pet object to satisfy Typescript
const createMockPet = (overrides?: Partial<Pet>): Pet => ({
    id: 1,
    name: "Rex",
    type: "DOG",
    breed: "Vira-lata",
    birthDate: "01/01/2021",
    ownerName: "João",
    ownerPhone: "11999999999",
    ownerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
})

describe('Pet Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default valid session simulation
        vi.mocked(jwtVerify).mockResolvedValue({
            payload: { sub: "1" },
            protectedHeader: { alg: "HS256" },
            key: new Uint8Array()
        })
    })

    describe('deletePet', () => {
        it('should return 404 if pet does not exist', async () => {
            prismaMock.pet.findUnique.mockResolvedValue(null)

            const result = await deletePet(999)
            expect(result.error).toContain("Pet não encontrado")
        })

        it('should return 403 if user is not the owner', async () => {
            prismaMock.pet.findUnique.mockResolvedValue(createMockPet({
                id: 1,
                name: "Rex",
                ownerId: 2 // Different from session userId (1)
            }))

            const result = await deletePet(1)
            expect(result.error).toContain("permissão")
        })

        it('should delete successfully if user is owner', async () => {
            prismaMock.pet.findUnique.mockResolvedValue(createMockPet({
                id: 1,
                name: "Rex",
                ownerId: 1 // Matches session userId (1)
            }))
            
            prismaMock.pet.delete.mockResolvedValue(createMockPet({ id: 1 }))

            const result = await deletePet(1)
            expect(result.success).toBe(true)
            expect(prismaMock.pet.delete).toHaveBeenCalledWith({ where: { id: 1 } })
        })
    })
})
