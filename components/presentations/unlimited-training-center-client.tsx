"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Dumbbell,
  Clock,
  MapPin,
  Check,
  Smartphone,
  Monitor,
  Instagram,
  ArrowRight,
  Timer,
  Trophy,
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  Play,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Target,
  Flag,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function UnlimitedPresentationClient() {
  const scrollToContent = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Image - Palácio de Mafra */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://www.cm-mafra.pt/cmmafra/uploads/page/image1/1084/palacio_nacional_de_mafra_10_1.jpg')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-zinc-800/85 to-zinc-900/90" />

        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Athlifyr Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2"
            >
              <span className="text-sm font-medium text-primary">
                Apresentação Exclusiva
              </span>
            </motion.div>

            {/* Box Name */}
            <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-white">Unlimited</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Training Center
              </span>
            </h1>

            {/* Location */}
            <div className="mb-8 flex items-center justify-center gap-2 text-lg text-zinc-400">
              <MapPin className="h-5 w-5" />
              <span>Mafra, Portugal</span>
            </div>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-2xl text-xl text-zinc-300">
              Descobre como o{" "}
              <span className="font-bold text-primary">Athlifyr</span> pode
              transformar a gestão do teu box e criar uma comunidade mais forte.
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="min-w-[200px] gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-lg font-bold hover:from-orange-600 hover:to-red-600"
                onClick={scrollToContent}
              >
                Ver Demonstração
                <Play className="h-5 w-5" />
              </Button>
              <Badge
                variant="outline"
                className="border-green-500/50 bg-green-500/10 px-4 py-2 text-green-400"
              >
                <Check className="mr-1 h-4 w-4" />
                100% Grátis
              </Badge>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={scrollToContent}
          >
            <ChevronDown className="h-8 w-8 text-zinc-500" />
          </motion.div>
        </div>
      </section>

      {/* What is Athlifyr Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge className="mb-4" variant="secondary">
              O que é o Athlifyr?
            </Badge>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              A plataforma que o{" "}
              <span className="text-primary">Unlimited Training Center</span>{" "}
              precisa
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Gestão completa, comunidade engajada e zero custos. Tudo o que
              precisas para levar o teu box ao próximo nível.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Calendar,
                title: "Agendamento",
                description: "Sessões, WODs e reservas automáticas",
                color: "bg-blue-500",
              },
              {
                icon: Users,
                title: "Comunidade",
                description: "Feed social e interação entre atletas",
                color: "bg-purple-500",
              },
              {
                icon: Dumbbell,
                title: "500+ Exercícios",
                description: "Base de dados completa em português",
                color: "bg-orange-500",
              },
              {
                icon: Zap,
                title: "Easy Book",
                description: "Reservas em 30 segundos via link",
                color: "bg-green-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none bg-gradient-to-br from-muted/50 to-muted/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} text-white`}
                    >
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Booking Demo */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <Smartphone className="h-3 w-3" />
                Vista Mobile
              </Badge>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Reservas em <span className="text-primary">30 segundos</span>
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Os teus atletas podem reservar aulas diretamente do telemóvel.
                Sem apps, sem complicações. Apenas um link simples que podes
                partilhar no Instagram.
              </p>

              <div className="space-y-4">
                {[
                  "Link único: athlifyr.com/v/unlimited-training/book",
                  "Funciona em qualquer telemóvel",
                  "Sem necessidade de instalar app",
                  "Confirmação automática por email",
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative mx-auto w-[280px] overflow-hidden rounded-[3rem] border-[12px] border-zinc-900 bg-zinc-900 shadow-2xl">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

                  {/* Screen Content */}
                  <div className="relative h-[580px] overflow-hidden bg-background">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 pb-6 pt-10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                          <span className="text-lg font-bold text-white">
                            UTC
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">
                            Unlimited Training
                          </h3>
                          <p className="text-xs text-white/80">Mafra</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Date Selector */}
                      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                        {["Seg", "Ter", "Qua", "Qui", "Sex"].map((day, i) => (
                          <div
                            key={i}
                            className={`flex shrink-0 flex-col items-center rounded-xl px-3 py-2 ${i === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            <span className="text-[10px]">{day}</span>
                            <span className="text-sm font-bold">{5 + i}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sessions */}
                      <div className="space-y-3">
                        {[
                          {
                            time: "07:00",
                            title: "WOD",
                            spots: 3,
                            total: 15,
                          },
                          {
                            time: "09:30",
                            title: "WOD",
                            spots: 8,
                            total: 15,
                          },
                          {
                            time: "12:00",
                            title: "Open Gym",
                            spots: 12,
                            total: 20,
                          },
                          {
                            time: "18:30",
                            title: "WOD",
                            spots: 2,
                            total: 15,
                          },
                          {
                            time: "19:30",
                            title: "WOD",
                            spots: 0,
                            total: 15,
                          },
                        ].map((session, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between rounded-xl border p-3 ${session.spots === 0 ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <Clock className="mx-auto h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium">
                                  {session.time}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{session.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {session.spots > 0
                                    ? `${session.spots} lugares`
                                    : "Cheio"}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={
                                session.spots === 0 ? "outline" : "default"
                              }
                              disabled={session.spots === 0}
                              className="h-8 text-xs"
                            >
                              {session.spots === 0 ? "Cheio" : "Reservar"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[3rem] bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Desktop Dashboard Demo */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Monitor className="h-3 w-3" />
              Vista Desktop
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Dashboard de <span className="text-primary">Gestão Completa</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Controla tudo a partir do computador. Sessões, membros, planos,
              estatísticas - tudo num único lugar.
            </p>
          </motion.div>

          {/* Desktop Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl"
          >
            <div className="overflow-hidden rounded-xl border bg-background shadow-2xl">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-background/50 px-3 py-1 text-center text-xs text-muted-foreground">
                  athlifyr.com/venues/unlimited-training-center
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="hidden w-56 shrink-0 border-r bg-muted/20 p-4 md:block">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white">
                      UTC
                    </div>
                    <span className="text-sm font-semibold">Unlimited TC</span>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { icon: "📊", label: "Dashboard", active: true },
                      { icon: "📅", label: "Sessões", active: false },
                      { icon: "👥", label: "Membros", active: false },
                      { icon: "💳", label: "Planos", active: false },
                      { icon: "📝", label: "Feed", active: false },
                      { icon: "⚙️", label: "Definições", active: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  {/* Stats */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        label: "Membros Ativos",
                        value: "87",
                        change: "+12%",
                        icon: Users,
                      },
                      {
                        label: "Sessões Hoje",
                        value: "8",
                        change: "",
                        icon: Calendar,
                      },
                      {
                        label: "Reservas Hoje",
                        value: "64",
                        change: "+8%",
                        icon: Check,
                      },
                      {
                        label: "Taxa Ocupação",
                        value: "82%",
                        change: "+5%",
                        icon: Trophy,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-xl border bg-card p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {stat.label}
                          </span>
                          <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {stat.value}
                          </span>
                          {stat.change && (
                            <span className="text-xs text-green-500">
                              {stat.change}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sessions Table Preview */}
                  <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b p-4">
                      <h3 className="font-semibold">Sessões de Hoje</h3>
                    </div>
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-muted-foreground">
                            <th className="pb-3">Hora</th>
                            <th className="pb-3">Tipo</th>
                            <th className="pb-3">Coach</th>
                            <th className="pb-3">Ocupação</th>
                            <th className="pb-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              time: "07:00",
                              type: "WOD",
                              coach: "Coach João",
                              spots: "12/15",
                              status: "Concluído",
                            },
                            {
                              time: "09:30",
                              type: "WOD",
                              coach: "Coach Ana",
                              spots: "7/15",
                              status: "A decorrer",
                            },
                            {
                              time: "12:00",
                              type: "Open Gym",
                              coach: "—",
                              spots: "8/20",
                              status: "Próxima",
                            },
                            {
                              time: "18:30",
                              type: "WOD",
                              coach: "Coach João",
                              spots: "13/15",
                              status: "Próxima",
                            },
                          ].map((row, i) => (
                            <tr key={i} className="border-t">
                              <td className="py-3 font-medium">{row.time}</td>
                              <td className="py-3">{row.type}</td>
                              <td className="py-3">{row.coach}</td>
                              <td className="py-3">{row.spots}</td>
                              <td className="py-3">
                                <Badge
                                  variant={
                                    row.status === "Concluído"
                                      ? "secondary"
                                      : row.status === "A decorrer"
                                        ? "default"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {row.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WOD Example Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* WOD Card Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="mx-auto max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl">
                {/* Post Header */}
                <div className="flex items-center gap-3 border-b p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white">
                    UTC
                  </div>
                  <div>
                    <p className="font-semibold">Unlimited Training Center</p>
                    <p className="text-xs text-muted-foreground">
                      há 2 horas • WOD do dia
                    </p>
                  </div>
                </div>

                {/* WOD Content */}
                <div className="p-4">
                  <div className="mb-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Timer className="h-5 w-5 text-orange-500" />
                      <span className="font-bold">AMRAP 20 min</span>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                      <p>5 Pull-ups</p>
                      <p>10 Push-ups</p>
                      <p>15 Air Squats</p>
                    </div>
                    <div className="mt-4 border-t border-orange-500/20 pt-3">
                      <p className="text-xs text-muted-foreground">
                        <strong>Rx:</strong> Kipping permitido
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Scale:</strong> Ring rows, knee push-ups
                      </p>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">24</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">8</span>
                      </button>
                      <button className="hover:text-primary">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Trophy className="h-4 w-4" />
                      Registar Score
                    </Button>
                  </div>
                </div>

                {/* Comments Preview */}
                <div className="border-t bg-muted/30 p-4">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                    <div className="rounded-xl bg-background px-3 py-2">
                      <p className="text-xs font-semibold">@miguel_cf</p>
                      <p className="text-sm">12 rondas + 8 reps 💪🔥</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <Dumbbell className="h-3 w-3" />
                WODs & Treinos
              </Badge>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Publica o <span className="text-primary">WOD do dia</span> em
                segundos
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Cria WODs rapidamente usando a nossa base de dados de 500+
                exercícios. Os atletas podem ver, comentar e registar os seus
                resultados.
              </p>

              <div className="space-y-4">
                {[
                  "Base de dados com 500+ exercícios catalogados",
                  "Vídeos demonstrativos para cada movimento",
                  "Atletas registam scores e PRs automaticamente",
                  "Leaderboard da comunidade",
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Athlete Progress Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <TrendingUp className="h-3 w-3" />
                Evolução dos Atletas
              </Badge>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Acompanha a <span className="text-primary">evolução</span> de
                cada atleta
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Gráficos de progresso detalhados para cada movimento. Os atletas
                veem a sua evolução ao longo do tempo e tu podes acompanhar o
                desenvolvimento de toda a comunidade.
              </p>

              <div className="space-y-4">
                {[
                  "Gráficos de evolução por exercício",
                  "Histórico completo de PRs",
                  "Comparação com médias do box",
                  "Exportar dados de performance",
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress Chart Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl">
                {/* Header */}
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Back Squat</h3>
                      <p className="text-sm text-muted-foreground">
                        Evolução últimos 6 meses
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">125 kg</p>
                      <p className="text-xs text-green-500">+15 kg desde Jan</p>
                    </div>
                  </div>
                </div>

                {/* Chart Mockup */}
                <div className="p-4">
                  <div className="relative h-48">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[140, 130, 120, 110, 100].map((val, i) => (
                        <div key={i} className="flex items-center">
                          <span className="w-8 text-right text-xs text-muted-foreground">
                            {val}
                          </span>
                          <div className="ml-2 flex-1 border-t border-dashed border-muted-foreground/20" />
                        </div>
                      ))}
                    </div>

                    {/* Chart line */}
                    <svg
                      className="absolute inset-0 ml-10"
                      viewBox="0 0 300 180"
                      preserveAspectRatio="none"
                    >
                      {/* Gradient fill */}
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {/* Area fill */}
                      <path
                        d="M 0 140 L 50 130 L 100 125 L 150 110 L 200 90 L 250 70 L 300 40 L 300 180 L 0 180 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Line */}
                      <path
                        d="M 0 140 L 50 130 L 100 125 L 150 110 L 200 90 L 250 70 L 300 40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data points */}
                      {[
                        [0, 140],
                        [50, 130],
                        [100, 125],
                        [150, 110],
                        [200, 90],
                        [250, 70],
                        [300, 40],
                      ].map(([x, y], i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="hsl(var(--background))"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="ml-10 mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Set</span>
                    <span>Out</span>
                    <span>Nov</span>
                    <span>Dez</span>
                    <span>Jan</span>
                    <span>Fev</span>
                  </div>
                </div>

                {/* PR History */}
                <div className="border-t bg-muted/30 p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Últimos PRs
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        date: "5 Fev 2026",
                        weight: "125 kg",
                        badge: "NOVO PR",
                      },
                      { date: "15 Jan 2026", weight: "120 kg", badge: null },
                      { date: "20 Dez 2025", weight: "117.5 kg", badge: null },
                    ].map((pr, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{pr.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pr.weight}</span>
                          {pr.badge && (
                            <Badge className="bg-green-500/20 text-[10px] text-green-600">
                              {pr.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section - HYROX Lisboa */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Flag className="h-3 w-3" />
              Eventos
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Descobre <span className="text-primary">eventos</span> perto de ti
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Calendário completo de competições, trails, maratonas e eventos de
              fitness. Os teus atletas podem encontrar e inscrever-se
              diretamente.
            </p>
          </motion.div>

          {/* Event Card - HYROX Lisboa */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
              {/* Event Header Image */}
              <div className="relative h-48 bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 sm:h-64">
                {/* HYROX Logo mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-5xl font-black tracking-tighter text-white sm:text-7xl">
                      HYROX
                    </span>
                    <span className="mt-1 block text-xl font-bold text-white/80 sm:text-2xl">
                      LISBOA 2026
                    </span>
                  </div>
                </div>

                {/* Featured badge */}
                <div className="absolute left-4 top-4">
                  <Badge className="bg-white/20 text-white backdrop-blur-sm">
                    ⭐ Em Destaque
                  </Badge>
                </div>

                {/* Sport type badge */}
                <div className="absolute right-4 top-4">
                  <Badge className="bg-black/30 text-white backdrop-blur-sm">
                    HYROX
                  </Badge>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">HYROX Lisboa</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>1-3 Maio 2026</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>FIL - Parque das Nações, Lisboa</span>
                      </div>
                    </div>
                  </div>
                  <Button className="gap-2 bg-yellow-500 text-black hover:bg-yellow-600">
                    <Ticket className="h-4 w-4" />
                    Ver Evento
                  </Button>
                </div>

                {/* Description */}
                <p className="mb-6 text-muted-foreground">
                  A maior competição mundial de fitness chega finalmente a
                  Portugal! 3 dias de competição na FIL com categorias para
                  todos: Individual, Doubles e Relay. Qualificação para o World
                  Championship em jogo!
                </p>

                {/* Event Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Duração", value: "3 dias" },
                    { label: "Categorias", value: "12+" },
                    { label: "Distância", value: "8 km run" },
                    { label: "Estações", value: "8 workout" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-muted/50 p-3 text-center"
                    >
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Variants Preview */}
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="mb-3 text-sm font-medium">
                    Provas Disponíveis:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "HYROX MEN",
                      "HYROX WOMEN",
                      "HYROX PRO MEN",
                      "HYROX PRO WOMEN",
                      "DOUBLES MIXED",
                      "DOUBLES MEN",
                      "DOUBLES WOMEN",
                      "RELAY MIXED",
                    ].map((variant, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {variant}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Friends Going */}
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[
                        "from-blue-500 to-cyan-500",
                        "from-purple-500 to-pink-500",
                        "from-green-500 to-emerald-500",
                        "from-orange-500 to-red-500",
                      ].map((color, i) => (
                        <div
                          key={i}
                          className={`h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br ${color}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      <strong>12 amigos</strong> vão participar
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>324 interessados</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* More events hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">
              + de <strong>200 eventos</strong> já na plataforma: Trail runs,
              Maratonas, CrossFit Open, Throwdowns...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Exercise Database Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4" variant="secondary">
              Base de Dados de Exercícios
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-primary">500+</span> exercícios catalogados
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Todos os movimentos de CrossFit, Weightlifting, Gymnastics e mais.
              Em português, com vídeos e instruções detalhadas.
            </p>
          </motion.div>

          {/* Exercise Cards Grid */}
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Clean & Jerk",
                category: "Weightlifting",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Muscle-up",
                category: "Gymnastics",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Double Under",
                category: "Cardio",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Thruster",
                category: "Functional",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Handstand Walk",
                category: "Gymnastics",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Box Jump",
                category: "Plyometric",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={`flex h-32 items-center justify-center bg-gradient-to-br ${exercise.color}`}
                >
                  <Dumbbell className="h-12 w-12 text-white/80 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exercise.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge className="mb-4 gap-1 bg-green-500/20" variant="secondary">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                100% Gratuito
              </span>
            </Badge>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Porque é que o Athlifyr é{" "}
              <span className="text-green-500">grátis</span>?
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Acreditamos que todos os boxes merecem ferramentas de qualidade,
              independentemente do orçamento.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Sem Limites",
                  description: "Membros, sessões e reservas ilimitadas",
                },
                {
                  icon: Shield,
                  title: "Sem Custos",
                  description: "Zero mensalidades, zero taxas escondidas",
                },
                {
                  icon: Globe,
                  title: "Para Sempre",
                  description: "O core da plataforma permanece grátis",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border bg-background p-6 shadow-sm"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                    <item.icon className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="mb-2 font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Comparação com <span className="text-primary">alternativas</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Vê como o Athlifyr se compara a outras soluções
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl overflow-x-auto"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-4 pr-4"></th>
                  <th className="pb-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                        A
                      </div>
                      <span className="font-bold">Athlifyr</span>
                    </div>
                  </th>
                  <th className="pb-4 pr-4 text-muted-foreground">SugarWOD</th>
                  <th className="pb-4 pr-4 text-muted-foreground">Wodify</th>
                  <th className="pb-4 text-muted-foreground">Mindbody</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Preço/mês",
                    athlifyr: "€0",
                    sugarwod: "~€50-150",
                    wodify: "~€100-300",
                    mindbody: "~€150-400",
                  },
                  {
                    feature: "Membros ilimitados",
                    athlifyr: true,
                    sugarwod: false,
                    wodify: false,
                    mindbody: false,
                  },
                  {
                    feature: "Rede social",
                    athlifyr: true,
                    sugarwod: false,
                    wodify: false,
                    mindbody: false,
                  },
                  {
                    feature: "Base exercícios",
                    athlifyr: "500+",
                    sugarwod: "300+",
                    wodify: "Limitada",
                    mindbody: "N/A",
                  },
                  {
                    feature: "Multilingue (6 idiomas)",
                    athlifyr: true,
                    sugarwod: false,
                    wodify: false,
                    mindbody: false,
                  },
                  {
                    feature: "Made in Portugal 🇵🇹",
                    athlifyr: true,
                    sugarwod: false,
                    wodify: false,
                    mindbody: false,
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-4 pr-4 font-medium">{row.feature}</td>
                    <td className="py-4 pr-4">
                      {typeof row.athlifyr === "boolean" ? (
                        row.athlifyr ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="font-bold text-green-500">
                          {row.athlifyr}
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {typeof row.sugarwod === "boolean" ? (
                        row.sugarwod ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          "—"
                        )
                      ) : (
                        row.sugarwod
                      )}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {typeof row.wodify === "boolean" ? (
                        row.wodify ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          "—"
                        )
                      ) : (
                        row.wodify
                      )}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {typeof row.mindbody === "boolean" ? (
                        row.mindbody ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          "—"
                        )
                      ) : (
                        row.mindbody
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-20">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Pronto para começar,
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Unlimited Training Center
              </span>
              ?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
              Cria a tua conta gratuita em 2 minutos e começa a transformar a
              gestão do teu box hoje.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="min-w-[200px] gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-lg font-bold hover:from-orange-600 hover:to-red-600"
              >
                <Link href="/auth/signup">
                  Começar Grátis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Contact */}
            <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-center sm:gap-8">
              <p className="text-sm text-zinc-500">Questões? Contacta-nos:</p>
              <div className="flex items-center gap-6 text-zinc-400">
                <a
                  href="https://instagram.com/athlifyr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                  @athlifyr
                </a>
                <a
                  href="mailto:hello@athlifyr.com"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                >
                  hello@athlifyr.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Athlifyr. Feito com ❤️ em Portugal 🇵🇹
          </p>
        </div>
      </footer>
    </div>
  );
}
