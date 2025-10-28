/**
 * Validação de variáveis de ambiente
 * Este arquivo deve ser importado no início da aplicação
 */

import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL deve ser uma URL válida"),

  // NextAuth
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET deve ter pelo menos 32 caracteres"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL deve ser uma URL válida").optional(),

  // Google OAuth (opcional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Stripe (opcional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // UploadThing (opcional)
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),

  // Email (opcional)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Admin Setup (opcional)
  ADMIN_SETUP_KEY: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export type Env = z.infer<typeof envSchema>

/**
 * Valida as variáveis de ambiente na inicialização
 * Lança um erro se alguma variável obrigatória estiver faltando ou inválida
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env)

    // Validações condicionais
    if (env.NODE_ENV === "production") {
      if (!env.ADMIN_SETUP_KEY) {
        console.warn("⚠️ ADMIN_SETUP_KEY não configurada em produção. O endpoint /api/setup/admin ficará desprotegido!")
      }
      if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
        console.warn("⚠️ Variáveis do Stripe não configuradas. Pagamentos não funcionarão.")
      }
    }

    console.log("✅ Variáveis de ambiente validadas com sucesso")
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Erro na validação de variáveis de ambiente:")
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`)
      })
      throw new Error("Variáveis de ambiente inválidas. Verifique o arquivo .env")
    }
    throw error
  }
}

// Exporta as variáveis validadas
export const env = validateEnv()
