import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "courtida by Preddita — Vídeo, Streaming e Gestão para Esportes de Quadra",
  description:
    "Plataforma SaaS de vídeo, streaming ao vivo e gestão inteligente para clubes e esportes de quadra. Reconhecimento facial, transmissão automática e análise de desempenho.",
};

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg-page) 80%, transparent)", borderBottom: "1px solid var(--border-default)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
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
          <span className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            courtida
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          <a href="#funcionalidades" className="hover:text-emerald-400 transition-colors">
            Funcionalidades
          </a>
          <a href="/sobre" className="hover:text-emerald-400 transition-colors">
            Sobre
          </a>
          <a href="/precos" className="hover:text-emerald-400 transition-colors">
            Preços
          </a>
          <a href="#contato" className="hover:text-emerald-400 transition-colors">
            Contato
          </a>
        </nav>
        <a
          href="#contato"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Falar conosco
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Plataforma para esportes de quadra
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6" style={{ color: "var(--text-primary)" }}>
          Cada jogada gravada.
          <br />
          <span className="text-emerald-400">Cada jogo ao vivo.</span>
        </h1>

        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Vídeo inteligente, streaming automático e reconhecimento facial
          integrados em uma única plataforma para seu clube.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contato"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 text-center"
          >
            Quero para meu clube
          </a>
          <a
            href="#como-funciona"
            className="w-full sm:w-auto px-8 py-3.5 font-medium rounded-xl transition-all text-center"
            style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
          >
            Como funciona
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "24/7", label: "Gravação contínua" },
            { value: "Full HD", label: "Streaming ao vivo" },
            { value: "<1s", label: "Reconhecimento facial" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.6 11.6L22 7v10l-6.4-4.6" />
        <rect x="2" y="7" width="14" height="10" rx="2" />
      </svg>
    ),
    title: "Gravação inteligente",
    description:
      "Câmeras Full HD com reconhecimento facial gravam automaticamente cada partida. Sem operador, sem complicação. O sistema identifica jogadores e organiza os vídeos por pessoa e por jogo.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    title: "Streaming ao vivo",
    description:
      "Transmita jogos ao vivo direto no YouTube com um clique. Familiares, torcedores e patrocinadores assistem de qualquer lugar. Aumente a visibilidade do seu clube sem esforço.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M2 12l2-2 2 2" />
        <path d="M18 12l2-2 2 2" />
      </svg>
    ),
    title: "Reconhecimento facial",
    description:
      "Controle de acesso inteligente com IDFace da Control iD. Identifica jogadores na entrada, registra presença automaticamente e libera o acesso à quadra sem catracas manuais.",
  },
];

function Features() {
  return (
    <section id="funcionalidades" className="py-24" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Tudo que seu clube precisa
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Três pilares integrados em uma plataforma única
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl transition-all duration-300"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)";
                e.currentTarget.style.backgroundColor = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.backgroundColor = "var(--bg-card)";
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed text-[15px]" style={{ color: "var(--text-secondary)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Instalação",
    description: "Instalamos as câmeras e o terminal de reconhecimento facial na sua quadra em menos de um dia.",
  },
  {
    number: "02",
    title: "Cadastro",
    description: "Jogadores fazem um cadastro rápido com foto. A partir daí, o sistema os reconhece automaticamente.",
  },
  {
    number: "03",
    title: "Automação total",
    description: "Gravação, streaming e controle de acesso funcionam sozinhos. Sem operador, sem intervenção manual. Você foca na gestão do clube.",
  },
  {
    number: "04",
    title: "Resultados",
    description: "Jogadores acessam seus vídeos, famílias assistem ao vivo, e você tem dados reais do uso da quadra.",
  },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Como funciona
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Do zero ao funcionamento em menos de uma semana
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+0.25rem)] w-[calc(100%-3.5rem)] h-px border-t border-dashed border-emerald-500/20" />
              )}
              <div
                className="p-6 rounded-2xl h-full flex flex-col"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                <span className="text-3xl font-bold text-emerald-500/20">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold mt-3 mb-2" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contato" className="py-24" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Leve o courtida para seu clube
          </h2>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Deixe seu contato e nossa equipe entra em contato para agendar uma
            demonstração gratuita.
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
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
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Preddita — Automação Inteligente · SC
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © {new Date().getFullYear()} Preddita. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
