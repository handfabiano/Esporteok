import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

/**
 * API Route para inicializar o banco de dados
 *
 * Esta rota executa `prisma db push` para criar as tabelas no banco de dados
 *
 * ATENÇÃO: Esta rota deve ser protegida em produção!
 * Configure a variável ADMIN_SETUP_KEY no .env para proteger esta rota
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { setupKey } = body

    // Verificar chave de setup (se configurada)
    const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY
    if (ADMIN_SETUP_KEY && setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: "Chave de setup inválida" },
        { status: 401 }
      )
    }

    console.log("🔄 Iniciando setup do banco de dados...")

    // Executar prisma db push
    const { stdout, stderr } = await execAsync("npx prisma db push --skip-generate --accept-data-loss")

    console.log("✅ Banco de dados configurado com sucesso!")
    console.log("Output:", stdout)

    if (stderr && !stderr.includes("warn")) {
      console.error("Stderr:", stderr)
    }

    return NextResponse.json({
      success: true,
      message: "Banco de dados inicializado com sucesso",
      output: stdout,
      nextStep: "Agora acesse /api/setup/admin para criar o usuário admin"
    })
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorOutput = (error as any).stdout || ""
    const errorStderr = (error as any).stderr || ""

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao configurar banco de dados",
        details: errorMessage,
        stdout: errorOutput,
        stderr: errorStderr,
        hint: "Verifique se a DATABASE_URL está correta e se o banco está acessível"
      },
      { status: 500 }
    )
  }
}

// Endpoint GET para verificar o status do banco
export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma")

    // Tentar contar usuários para verificar se o banco está configurado
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: "Banco de dados já está configurado",
      userCount,
      nextStep: userCount === 0
        ? "Use POST /api/setup/admin para criar o primeiro admin"
        : "Banco de dados já possui usuários"
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Se a tabela não existe, instruir a executar o setup
    if (errorMessage.includes("does not exist")) {
      return NextResponse.json({
        success: false,
        message: "Banco de dados não está configurado",
        error: "Tabelas não foram criadas ainda",
        nextStep: "Execute: POST /api/setup/database para criar as tabelas"
      }, { status: 424 })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar banco de dados",
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
