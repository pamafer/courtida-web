import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre — courtida by Preddita",
  description: "Conheça a história da Preddita e do courtida. Automação inteligente para esportes de quadra.",
};

const timeline = [
  {
    year: "2024",
    title: "Nasce a Preddita",
    description: "Fundada em Santa Catarina com a missão de levar automação inteligente para mercados tradicionais, entre os quais esportes de quadra.",
  },
  {
    year: "2025",
    title: "Pesquisa e desenvolvimento",
    description: "Início do projeto courtida. Meses de pesquisa com clubes, jogadores e gestores para entender as dores reais do mercado.",
  },
  {
    year: "2025",
    title: "Clube-laboratório",
    description: "Parceria com o primeiro clube para testes reais. Instalação de câmeras Full HD, terminal de reconhecimento facial e infraestrutura de streaming.",
  },
  {
    year: "2026",
    title: "Lançamento do courtida",
    description: "Plataforma completa: gravação inteligente, streaming ao vivo e reconhecimento facial integrados em uma única solução para clubes.",
  },
];

const values = [
  {
    title: "Tecnologia acessível",
    description: "Acreditamos que ferramentas avançadas como reconhecimento facial e streaming automatizado não devem ser exclusivas de grandes organizações.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Automação real",
    description: "Não vendemos promessas. Cada funcionalidade do courtida foi testada em ambiente real, com jogadores reais e condições reais de operação.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Parceria com o clube",
    description: "Não somos apenas um fornecedor de software. Trabalhamos lado a lado com cada clube para garantir que a tecnologia gere resultado real.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1410]/80 backdrop-blur-md border-b border-white/5">
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
          <span className="text-lg font-semibold tracking-tight text-white">courtida</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="/#funcionalidades" className="hover:text-emerald-400 transition-colors">Funcionalidades</a>
          <a href="/sobre" className="text-emerald-400">Sobre</a>
          <a href="/precos" className="hover:text-emerald-400 transition-colors">Preços</a>
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
    <footer className="py-12 bg-[#050C08] border-t border-white/5">
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
            <span className="text-sm font-semibold text-white">courtida</span>
            <span className="text-sm text-gray-600 ml-1">by Preddita</span>
          </div>
          <p className="text-sm text-gray-600">Preddita — Automação Inteligente · SC</p>
          <p className="text-xs text-gray-700">© {new Date().getFullYear()} Preddita. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function SobrePage() {
  return (
    <main className="bg-[#0A1410] text-white antialiased">
      <Header />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Nossa história
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Tecnologia que entende
            <br />
            <span className="text-emerald-400">o esporte de quadra.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A Preddita nasceu com um propósito claro: levar automação inteligente para mercados que ainda operam de forma manual. O courtida é nosso primeiro produto — e o resultado de muita pesquisa, testes reais e paixão por esporte.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#060E0A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Por que criamos o courtida?</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Clubes de esportes de quadra movimentam milhões de reais por ano no Brasil, mas a maioria ainda opera com processos manuais: controle de acesso com lista de papel, gravações improvisadas com celular, e zero visibilidade para familiares e torcedores.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Vimos que a tecnologia para resolver isso já existia — câmeras inteligentes, reconhecimento facial, streaming automatizado. O que faltava era alguém juntar tudo em uma plataforma simples, acessível e feita para a realidade dos clubes brasileiros.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Esse é o courtida: a ponte entre a tecnologia de ponta e o dia a dia do seu clube.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                <p className="text-3xl font-bold text-emerald-400">Full HD</p>
                <p className="text-sm text-gray-400 mt-1">Qualidade de vídeo</p>
              </div>
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                <p className="text-3xl font-bold text-emerald-400">&lt;1s</p>
                <p className="text-sm text-gray-400 mt-1">Reconhecimento facial</p>
              </div>
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                <p className="text-3xl font-bold text-emerald-400">24/7</p>
                <p className="text-sm text-gray-400 mt-1">Gravação contínua</p>
              </div>
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                <p className="text-3xl font-bold text-emerald-400">0</p>
                <p className="text-sm text-gray-400 mt-1">Operadores necessários</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0A1410]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Nossa trajetória</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                    {item.year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px h-full bg-white/5 my-2" />
                  )}
                </div>
                <div className="pb-10">
                  <p className="text-xs text-emerald-400 font-medium mb-1">{item.year}</p>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#060E0A]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-4">No que acreditamos</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">Os princípios que guiam cada decisão no courtida</p>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed text-[15px]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0A1410]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Quer fazer parte dessa história?</h2>
          <p className="text-gray-400 mb-8">Entre em contato e descubra como o courtida pode transformar seu clube.</p>
          <a href="/#contato" className="inline-flex px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            Falar com a equipe
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
