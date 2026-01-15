"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send, Mail, MessageSquare, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    type: "suggestion",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor preenche o assunto e a mensagem.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast({
        title: "Mensagem enviada!",
        description:
          "Obrigado pelo teu contacto. Responderemos em breve por email.",
      });

      // Reset form
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        type: "suggestion",
        subject: "",
        message: "",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem. Tenta novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Contacta-nos</h1>
        <p className="text-muted-foreground">
          Envia-nos sugestões, reporta problemas ou faz perguntas
        </p>
      </div>

      {/* Contact Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center p-6 text-center">
          <MessageSquare className="mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-1 font-semibold">Sugestões</h3>
          <p className="text-sm text-muted-foreground">
            Partilha ideias para melhorar a plataforma
          </p>
        </Card>

        <Card className="flex flex-col items-center p-6 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-orange-500" />
          <h3 className="mb-1 font-semibold">Reportar Problema</h3>
          <p className="text-sm text-muted-foreground">
            Encontraste um bug? Avisa-nos!
          </p>
        </Card>

        <Card className="flex flex-col items-center p-6 text-center">
          <Mail className="mb-3 h-8 w-8 text-blue-500" />
          <h3 className="mb-1 font-semibold">Perguntas</h3>
          <p className="text-sm text-muted-foreground">
            Tens alguma dúvida? Estamos aqui para ajudar
          </p>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="O teu nome"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="teu@email.com"
              required
            />
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">Tipo de Contacto *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="suggestion">💡 Sugestão</option>
              <option value="bug">🐛 Reportar Bug</option>
              <option value="question">❓ Pergunta</option>
              <option value="feedback">💬 Feedback</option>
              <option value="other">📧 Outro</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Assunto *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Resumo do teu contacto"
              required
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Mensagem *</Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Descreve em detalhe..."
              className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Sê o mais específico possível para podermos ajudar melhor
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />A enviar...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          📧 Também podes contactar-nos diretamente em:{" "}
          <a
            href="mailto:info@athlifyr.com"
            className="text-primary hover:underline"
          >
            info@athlifyr.com
          </a>
        </p>
        <p className="mt-2">
          Normalmente respondemos em <strong>24-48 horas</strong>
        </p>
      </div>
    </div>
  );
}
