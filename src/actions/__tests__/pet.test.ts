import { vi, describe, it, expect, beforeEach } from 'vitest'
import { updatePet, deletePet } from '../pet'
import { prisma } from '@/lib/prisma'
import { DeepMockProxy, mockReset } from 'vitest-mock-extended'
import { PrismaClient } from '@prisma/client'
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

describe('Pet Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default valid session simulation
        vi.mocked(jwtVerify).mockResolvedValue({
            payload: { sub: "1" },
            protectedHeader: { alg: "HS256" }
        })
    })

    describe('deletePet', () => {
        it('should return 404 if pet does not exist', async () => {
            prismaMock.pet.findUnique.mockResolvedValue(null)

            const result = await deletePet(999)
            expect(result.error).toContain("Pet não encontrado")
        })

        it('should return 403 if user is not the owner', async () => {
            prismaMock.pet.findUnique.mockResolvedValue({
                id: 1,
                name: "Rex",
                ownerId: 2 // Different from session userId (1)
            } as any)

            const result = await deletePet(1)
            expect(result.error).toContain("permissão")
        })

        it('should delete successfully if user is owner', async () => {
            prismaMock.pet.findUnique.mockResolvedValue({
                id: 1,
                name: "Rex",
                ownerId: 1 // Matches session userId (1)
            } as any)
            
            prismaMock.pet.delete.mockResolvedValue({ id: 1 } as any)

            const result = await deletePet(1)
            expect(result.success).toBe(true)
            expect(prismaMock.pet.delete).toHaveBeenCalledWith({ where: { id: 1 } })
        })
    })
})
