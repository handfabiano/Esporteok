"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutForm } from "@/components/checkout-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage({ params }: { params: { registrationId: string } }) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [registrationData, setRegistrationData] = useState<any>(null)

  useEffect(() => {
    // Criar Payment Intent
    async function createPaymentIntent() {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: params.registrationId,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao criar pagamento")
        }

        setClientSecret(data.clientSecret)

        // Buscar dados da inscrição
        const regResponse = await fetch(`/api/registrations/${params.registrationId}`)
        const regData = await regResponse.json()
        if (regData.success) {
          setRegistrationData(regData.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [params.registrationId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Preparando checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/minha-conta/inscricoes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para inscrições
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/minha-conta/inscricoes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Finalizar Inscrição</CardTitle>
              <CardDescription>
                Complete o pagamento para confirmar sua inscrição
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registrationData && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-2">
                  <h3 className="font-semibold">{registrationData.event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {registrationData.category.name}
                  </p>
                  <p className="text-sm">
                    {new Date(registrationData.event.startDate).toLocaleDateString("pt-BR")} -{" "}
                    {registrationData.event.city}, {registrationData.event.state}
                  </p>
                </div>
              )}

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                    },
                    locale: "pt-BR",
                  }}
                >
                  <CheckoutForm
                    registrationId={params.registrationId}
                    amount={registrationData?.category.price || 0}
                    onSuccess={() => {
                      router.push("/minha-conta/inscricoes?success=true")
                    }}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
