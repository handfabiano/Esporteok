"use client"

import { UploadButton, UploadDropzone } from "@/lib/uploadthing-components"
import type { OurFileRouter } from "@/lib/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  endpoint: keyof OurFileRouter
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  endpoint,
  disabled,
}: ImageUploadProps) {
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Upload"
            className="object-cover w-full h-full"
          />
          {onRemove && !disabled && (
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              onChange(res[0].url)
              toast({
                title: "Upload concluído!",
                description: "Imagem enviada com sucesso.",
              })
            }
          }}
          onUploadError={(error: Error) => {
            toast({
              title: "Erro no upload",
              description: error.message,
              variant: "destructive",
            })
          }}
          disabled={disabled}
          config={{ mode: "auto" }}
        />
      )}
    </div>
  )
}

export function ImageUploadButton({
  onUploadComplete,
  endpoint,
  disabled,
}: {
  onUploadComplete: (url: string) => void
  endpoint: keyof OurFileRouter
  disabled?: boolean
}) {
  const { toast } = useToast()

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploadComplete(res[0].url)
          toast({
            title: "Upload concluído!",
            description: "Imagem enviada com sucesso.",
          })
        }
      }}
      onUploadError={(error: Error) => {
        toast({
          title: "Erro no upload",
          description: error.message,
          variant: "destructive",
        })
      }}
      disabled={disabled}
    />
  )
}
