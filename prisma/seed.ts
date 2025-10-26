import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Criar usuário admin padrão
  const adminEmail = "admin@ticketsports.com"
  const adminPassword = "admin123" // TROCAR ISSO EM PRODUÇÃO!

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await hash(adminPassword, 10)

    const admin = await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("✅ Admin user created:")
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log(`   ⚠️  IMPORTANTE: Altere a senha após o primeiro login!`)
  } else {
    console.log("ℹ️  Admin user already exists")
  }

  // Criar usuário organizador de teste
  const orgEmail = "organizador@test.com"
  const existingOrg = await prisma.user.findUnique({
    where: { email: orgEmail },
  })

  if (!existingOrg) {
    const hashedPassword = await hash("123456", 10)

    await prisma.user.create({
      data: {
        name: "Organizador Teste",
        email: orgEmail,
        password: hashedPassword,
        role: "ORGANIZER",
      },
    })

    console.log("✅ Organizer test user created:")
    console.log(`   Email: ${orgEmail}`)
    console.log(`   Password: 123456`)
  }

  // Criar usuário participante de teste
  const partEmail = "participante@test.com"
  const existingPart = await prisma.user.findUnique({
    where: { email: partEmail },
  })

  if (!existingPart) {
    const hashedPassword = await hash("123456", 10)

    await prisma.user.create({
      data: {
        name: "Participante Teste",
        email: partEmail,
        password: hashedPassword,
        role: "PARTICIPANT",
      },
    })

    console.log("✅ Participant test user created:")
    console.log(`   Email: ${partEmail}`)
    console.log(`   Password: 123456`)
  }

  console.log("✨ Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
