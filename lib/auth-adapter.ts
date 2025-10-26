import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const baseAdapter = PrismaAdapter(prisma)

  return {
    ...baseAdapter,
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          ...data,
          role: "PARTICIPANT", // Default role
        },
      })
      return user
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({
        where: { id },
      })
      return user
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      return user
    },
    getUserByAccount: async (providerAccountId) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: providerAccountId.provider,
            providerAccountId: providerAccountId.providerAccountId,
          },
        },
        include: { user: true },
      })
      return account?.user ?? null
    },
  } as Adapter
}
