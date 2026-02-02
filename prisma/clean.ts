import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Cleaning up seed data...')

  const seedEmail = 'seed@example.com'

  const user = await prisma.user.findUnique({
    where: { email: seedEmail }
  })

  if (user) {
    const deletedPets = await prisma.pet.deleteMany({
        where: { ownerId: user.id }
    })
    console.log(`Deleted ${deletedPets.count} pets.`)

    await prisma.user.delete({
        where: { id: user.id }
    })
    console.log(`Deleted user ${seedEmail}.`)
  } else {
    console.log('Seed user not found.')
  }

  console.log('Cleanup finished.')
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
