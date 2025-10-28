import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Atualizar pagamento
        const payment = await prisma.payment.findUnique({
          where: { paymentIntentId: paymentIntent.id },
          include: {
            registration: {
              include: {
                user: true,
                event: true,
                category: true,
              },
            },
          },
        })

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "APPROVED",
              paidAt: new Date(),
              paymentMethod: paymentIntent.payment_method_types[0],
            },
          })

          // Atualizar status da inscrição
          await prisma.registration.update({
            where: { id: payment.registrationId },
            data: {
              status: "CONFIRMED",
            },
          })

          // Incrementar contador de participantes do evento
          await prisma.event.update({
            where: { id: payment.registration.eventId },
            data: {
              currentParticipants: {
                increment: 1,
              },
            },
          })

          // Enviar email de confirmação
          await sendEmail({
            to: payment.registration.user.email,
            subject: `Inscrição confirmada - ${payment.registration.event.title}`,
            html: `
              <h1>Inscrição Confirmada!</h1>
              <p>Olá ${payment.registration.user.name},</p>
              <p>Sua inscrição no evento <strong>${payment.registration.event.title}</strong> foi confirmada com sucesso!</p>

              <h2>Detalhes da inscrição:</h2>
              <ul>
                <li><strong>Evento:</strong> ${payment.registration.event.title}</li>
                <li><strong>Categoria:</strong> ${payment.registration.category.name}</li>
                <li><strong>Data:</strong> ${new Date(payment.registration.event.startDate).toLocaleDateString("pt-BR")}</li>
                <li><strong>Local:</strong> ${payment.registration.event.city}, ${payment.registration.event.state}</li>
                <li><strong>Valor pago:</strong> R$ ${Number(payment.amount).toFixed(2)}</li>
              </ul>

              <p>Aguarde mais informações sobre o evento em breve.</p>

              <p>Nos vemos na largada!</p>
              <p><strong>Equipe Ticket Sports</strong></p>
            `,
          })

          // Criar notificação in-app
          await prisma.notification.create({
            data: {
              userId: payment.registration.userId,
              type: "IN_APP",
              title: "Inscrição confirmada!",
              message: `Sua inscrição no evento ${payment.registration.event.title} foi confirmada com sucesso!`,
              status: "SENT",
              sentAt: new Date(),
              metadata: {
                registrationId: payment.registrationId,
                eventId: payment.registration.eventId,
              },
            },
          })
        }
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        const failedPaymentRecord = await prisma.payment.findUnique({
          where: { paymentIntentId: failedPayment.id },
        })

        if (failedPaymentRecord) {
          await prisma.payment.update({
            where: { id: failedPaymentRecord.id },
            data: {
              status: "REJECTED",
            },
          })
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
