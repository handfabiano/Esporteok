import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Papa from "papaparse"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const eventId = formData.get("eventId") as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Arquivo não fornecido" },
        { status: 400 }
      )
    }

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    // Ler CSV
    const text = await file.text()

    const parseResult = await new Promise<any>((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results),
        error: (error: Error) => reject(error),
      })
    })

    const results = parseResult.data

    // Processar resultados
    let created = 0
    let updated = 0
    let errors: string[] = []

    for (const row of results) {
      try {
        // CSV esperado: bibNumber, position, categoryPosition, time, pace, status
        const bibNumber = row.bibNumber || row.bib || row.numero
        const position = parseInt(row.position || row.posicao)
        const categoryPosition = parseInt(row.categoryPosition || row.posicaoCategoria)
        const time = row.time || row.tempo
        const pace = row.pace || row.ritmo
        const status = row.status || "COMPLETED"

        if (!bibNumber) {
          errors.push(`Linha sem número de peito`)
          continue
        }

        // Buscar inscrição pelo BIB
        const registration = await prisma.registration.findFirst({
          where: {
            eventId: eventId,
            bibNumber: bibNumber.toString(),
          },
        })

        if (!registration) {
          errors.push(`BIB ${bibNumber} não encontrado`)
          continue
        }

        // Criar ou atualizar resultado
        const existingResult = await prisma.result.findUnique({
          where: { registrationId: registration.id },
        })

        if (existingResult) {
          await prisma.result.update({
            where: { id: existingResult.id },
            data: {
              position: isNaN(position) ? null : position,
              categoryPosition: isNaN(categoryPosition) ? null : categoryPosition,
              time,
              pace,
              status,
            },
          })
          updated++
        } else {
          await prisma.result.create({
            data: {
              registrationId: registration.id,
              position: isNaN(position) ? null : position,
              categoryPosition: isNaN(categoryPosition) ? null : categoryPosition,
              time,
              pace,
              status,
            },
          })
          created++
        }
      } catch (error: any) {
        errors.push(`Erro ao processar linha: ${error.message}`)
      }
    }

    // Marcar evento como concluído
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "COMPLETED" },
    })

    return NextResponse.json({
      success: true,
      data: {
        created,
        updated,
        total: created + updated,
        errors: errors.length > 0 ? errors : undefined,
      },
    })
  } catch (error) {
    console.error("Error uploading results:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao processar resultados" },
      { status: 500 }
    )
  }
}
