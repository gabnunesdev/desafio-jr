import { PrismaClient, PetType } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  // Create a default user if not exists (for owner relation)
  const user = await prisma.user.upsert({
    where: { email: 'seed@example.com' },
    update: {},
    create: {
      email: 'seed@example.com',
      name: 'Seed User',
      password: 'hashed_password_placeholder', // Not used for login really
      contact: '99999999999'
    },
  })

  // Create 50 pets
  const petTypes: PetType[] = ['DOG', 'CAT']
  const breeds = ['Vira-lata', 'Labrador', 'Poodle', 'Persa', 'Siamês']
  
  for (let i = 1; i <= 50; i++) {
    await prisma.pet.create({
      data: {
        name: `Pet Teste ${i}`,
        type: petTypes[i % 2],
        breed: breeds[i % 5],
        birthDate: '01/01/2020',
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.contact,
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
