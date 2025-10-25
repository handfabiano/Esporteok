"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface CheckoutFormProps {
  registrationId: string
  amount: number
  onSuccess?: () => void
}

export function CheckoutForm({ registrationId, amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/minha-conta/inscricoes?success=true`,
        },
      })

      if (error) {
        toast({
          title: "Erro no pagamento",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Pagamento realizado!",
          description: "Sua inscrição foi confirmada.",
        })
        onSuccess?.()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total a pagar:</span>
          <span className="text-2xl font-bold text-primary">
            R$ {amount.toFixed(2)}
          </span>
        </div>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processando..." : "Confirmar Pagamento"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Pagamento seguro processado pelo Stripe
      </p>
    </form>
  )
}
