"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", club: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao enviar");

      setSuccess(true);

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      if (whatsappNumber) {
        const text = encodeURIComponent(
          `Olá! Sou ${formData.name} do clube ${formData.club}. Acabei de preencher o formulário no site do courtida e gostaria de saber mais sobre a plataforma.`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
      }
    } catch {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 px-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Mensagem enviada!</h3>
        <p className="text-sm text-gray-400">Obrigado pelo interesse. Nossa equipe entrará em contato em breve.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-8 border border-white/5 bg-white/[0.02]">
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Seu nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">WhatsApp</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nome do clube</label>
            <input
              type="text"
              value={formData.club}
              onChange={(e) => setFormData({ ...formData, club: e.target.value })}
              placeholder="Nome do seu clube"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Mensagem</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Conte um pouco sobre seu clube e o que precisa..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !formData.name || !formData.email}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
        >
          {loading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </div>
    </div>
  );
}
