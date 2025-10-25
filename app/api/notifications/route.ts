import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar notificações do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const where: any = {
      userId: session.user.id,
    }

    if (unreadOnly) {
      where.status = {
        in: ["PENDING", "SENT"],
      }
      where.readAt = null
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        status: {
          in: ["PENDING", "SENT"],
        },
        readAt: null,
      },
    })

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar notificações" },
      { status: 500 }
    )
  }
}

// POST - Marcar notificação como lida
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          readAt: null,
        },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Todas as notificações marcadas como lidas",
      })
    }

    if (notificationId) {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      })

      if (!notification || notification.userId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Notificação não encontrada" },
          { status: 404 }
        )
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Notificação marcada como lida",
      })
    }

    return NextResponse.json(
      { success: false, error: "Parâmetros inválidos" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar notificação" },
      { status: 500 }
    )
  }
}
