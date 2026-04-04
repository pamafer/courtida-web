import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preços — courtida by Preddita",
  description: "Planos e preços do courtida. Escolha o melhor para o seu clube.",
};

const plans = [
  {
    name: "Starter",
    description: "Para clubes que querem começar por conta própria, com a plataforma completa.",
    price: "199",
    period: "/mês por quadra",
    highlight: false,
    features: [
      "Plataforma courtida completa",
      "Gravação Full HD + clips + streaming",
      "Gestor de quadras",
      "Torneios e rankings (2 formatos)",
      "Revenue share: 50% para o clube",
      "Suporte por email",
    ],
    notIncluded: [
      "Hardware por conta do clube",
      "Instalação por conta do clube",
      "API dedicada",
    ],
    cta: "Começar agora",
    fidelity: "Fidelidade mínima: 12 meses",
  },
  {
    name: "Pro",
    description: "O plano mais popular. Hardware incluso, instalação gratuita e maior revenue share.",
    price: "399",
    period: "/mês por quadra",
    highlight: true,
    features: [
      "Tudo do Starter, mais:",
      "Hardware incluso em comodato",
      "Instalação completa gratuita",
      "Torneios e rankings (4 formatos)",
      "Revenue share: 60% para o clube",
      "Suporte prioritário",
    ],
    notIncluded: [
      "API dedicada",
    ],
    cta: "Escolher Pro",
    fidelity: "Fidelidade mínima: 24 meses",
  },
  {
    name: "Enterprise",
    description: "Para redes de clubes e operações com múltiplas quadras. Tudo personalizado.",
    price: "Sob consulta",
    period: "",
    highlight: false,
    features: [
      "Tudo do Pro, mais:",
      "Revenue share: 70% para o clube",
      "Desconto por volume (5+ quadras)",
      "API dedicada",
      "Branding personalizado",
      "Torneios personalizados",
      "Gerente de conta dedicado",
      "Fidelidade negociável",
    ],
    notIncluded: [],
    cta: "Falar com vendas",
    fidelity: "Fidelidade negociável",
  },
];

const playerPrices = [
  { service: "Clip avulso (ponto)", price: "R$ 1,49", margin: "~99%" },
  { service: "Pacote 50 clips", price: "R$ 59,90 (R$ 1,20/clip)", margin: "~98%" },
  { service: "Pacote mensal ilimitado", price: "R$ 39,90/mês", margin: "~87-95%" },
  { service: "Streaming YouTube (por hora)", price: "R$ 4,99/hora", margin: "~99%" },
  { service: "Streaming particular (por hora)", price: "R$ 4,99/hora", margin: "~99%" },
];

const faqs = [
  {
    question: "A instalação está inclusa no preço?",
    answer: "No plano Pro e Enterprise, sim. A instalação completa é gratuita. No plano Starter, a instalação e o hardware ficam por conta do clube.",
  },
  {
    question: "O que é revenue share?",
    answer: "Revenue share é a porcentagem da receita gerada pelos jogadores (clips, pacotes, streaming) que o clube recebe. Quanto maior o plano, maior a fatia do clube: 50% no Starter, 60% no Pro, 70% no Enterprise.",
  },
  {
    question: "Quanto o clube pode ganhar por quadra?",
    answer: "No cenário base com plano Pro (15 jogadores com pacote mensal, 100 clips avulsos e 20h de streaming/mês), o clube recebe aproximadamente R$ 509/mês em revenue share por quadra — além de oferecer uma experiência diferenciada aos jogadores.",
  },
  {
    question: "Preciso comprar equipamentos?",
    answer: "No plano Pro e Enterprise, não. O hardware (câmeras Full HD e terminal de reconhecimento facial) está incluso em regime de comodato. No plano Starter, o clube adquire os equipamentos (a partir de R$ 2.299 por quadra).",
  },
  {
    question: "Tem fidelidade ou multa de cancelamento?",
    answer: "Starter: 12 meses. Pro: 24 meses (hardware em comodato). Enterprise: negociável. Após o período mínimo, cancelamento com 30 dias de aviso prévio.",
  },
  {
    question: "O streaming gasta internet do clube?",
    answer: "Sim. Recomendamos no mínimo 20 Mbps de upload por quadra com streaming ativo. Podemos ajudar a avaliar sua infraestrutura antes da instalação.",
  },
];

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg-page) 80%, transparent)", borderBottom: "1px solid var(--border-default)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 68 68" fill="none">
            <rect width="68" height="68" rx="10" fill="#10B981"/>
            <rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none"/>
            <line x1="34" y1="8" x2="34" y2="18" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
            <line x1="34" y1="50" x2="34" y2="60" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
            <line x1="8" y1="34" x2="18" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
            <line x1="50" y1="34" x2="60" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
            <circle cx="34" cy="34" r="16" fill="#FFFFFF"/>
            <polygon points="29,24 29,44 45,34" fill="#0A1410"/>
          </svg>
          <span className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>courtida</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          <a href="/#funcionalidades" className="hover:text-emerald-400 transition-colors">Funcionalidades</a>
          <a href="/sobre" className="hover:text-emerald-400 transition-colors">Sobre</a>
          <a href="/precos" className="text-emerald-400">Preços</a>
          <a href="/#contato" className="hover:text-emerald-400 transition-colors">Contato</a>
        </nav>
        <a href="/#contato" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
          Falar conosco
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="py-12" style={{ backgroundColor: "var(--bg-surface)", borderTop: "1px solid var(--border-default)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 68 68" fill="none">
              <rect width="68" height="68" rx="10" fill="#10B981"/>
              <rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none"/>
              <line x1="34" y1="8" x2="34" y2="18" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
              <line x1="34" y1="50" x2="34" y2="60" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
              <line x1="8" y1="34" x2="18" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
              <line x1="50" y1="34" x2="60" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35"/>
              <circle cx="34" cy="34" r="16" fill="#FFFFFF"/>
              <polygon points="29,24 29,44 45,34" fill="#0A1410"/>
            </svg>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>courtida</span>
            <span className="text-sm ml-1" style={{ color: "var(--text-tertiary)" }}>by Preddita</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Preddita — Automação Inteligente · SC</p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>© {new Date().getFullYear()} Preddita. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PrecosPage() {
  return (
    <main className="antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}>
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Preços transparentes
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-6" style={{ color: "var(--text-primary)" }}>
            Seu clube ganha junto.
            <br />
            <span className="text-emerald-400">Revenue share real.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Além de tecnologia de ponta, seu clube recebe uma fatia da receita gerada pelos jogadores. Quanto mais seu clube usa, mais ele ganha.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${plan.highlight ? "relative" : ""}`}
              style={
                plan.highlight
                  ? { border: "2px solid rgba(16,185,129,0.4)", backgroundColor: "rgba(16,185,129,0.03)" }
                  : { backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }
              }
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                  Mais popular
                </span>
              )}

              <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{plan.description}</p>

              <div className="mb-2">
                {plan.price === "Sob consulta" ? (
                  <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Sob consulta</p>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>R$</span>
                    <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{plan.period}</span>
                  </div>
                )}
              </div>
              <p className="text-xs mb-6" style={{ color: "var(--text-tertiary)" }}>{plan.fidelity}</p>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="/#contato"
                className={`w-full py-3 rounded-xl font-semibold text-center transition-all block ${
                  plan.highlight
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/20"
                    : ""
                }`}
                style={
                  plan.highlight
                    ? undefined
                    : { border: "1px solid var(--border-default)", color: "var(--text-secondary)" }
                }
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Preços para jogadores */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: "var(--text-primary)" }}>Preços para o jogador</h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>Valores acessíveis para maximizar adoção. Margens acima de 87% em todos os serviços.</p>
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
            <div className="grid grid-cols-3 px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ borderBottom: "1px solid var(--border-default)", color: "var(--text-tertiary)" }}>
              <span>Serviço</span>
              <span>Preço</span>
              <span className="text-right">Margem</span>
            </div>
            {playerPrices.map((item, i) => (
              <div
                key={item.service}
                className="grid grid-cols-3 px-5 py-4"
                style={i < playerPrices.length - 1 ? { borderBottom: "1px solid var(--border-default)" } : undefined}
              >
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>{item.service}</span>
                <span className="text-sm text-emerald-400 font-medium">{item.price}</span>
                <span className="text-sm text-right" style={{ color: "var(--text-secondary)" }}>{item.margin}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulação de receita */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: "var(--text-primary)" }}>Simulação de receita</h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>Cenário base: plano Pro, por quadra, com 15 jogadores ativos</p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] text-center">
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>O clube recebe por mês</p>
              <p className="text-4xl font-bold text-emerald-400">R$ 509</p>
              <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>por quadra (revenue share 60%)</p>
            </div>
            <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Receita bruta por quadra</p>
              <p className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>R$ 848</p>
              <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>clips + pacotes + streaming</p>
            </div>
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>Projeção 10 clubes</span> (2 quadras cada, plano Pro): cada clube recebe aproximadamente R$ 1.018/mês em revenue share. Payback do hardware para quadra de tênis (Pro): ~12 meses. A partir do 13º mês, margem líquida de ~83% sobre a mensalidade.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: "var(--text-primary)" }}>Perguntas frequentes</h2>
          <p className="text-center mb-12" style={{ color: "var(--text-secondary)" }}>Tire suas dúvidas antes de contratar</p>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-6 rounded-xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{faq.question}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Pronto para transformar seu clube?</h2>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Agende uma demonstração gratuita e veja o courtida funcionando ao vivo.</p>
          <a href="/#contato" className="inline-flex px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            Solicitar demonstração
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
