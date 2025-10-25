import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email notifications will not work.")
}

export const resend = new Resend(process.env.RESEND_API_KEY || "")

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Ticket Sports <noreply@ticketsports.com>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}
