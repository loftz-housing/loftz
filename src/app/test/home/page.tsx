/* eslint-disable @next/next/no-img-element */
// 1:1 mockup of the 2020 LOFTZ wireframe home page (Henrique's own agency
// concept) for side-by-side comparison. Static, PT, self-contained styling.

const TEAL = "#12a3bd";
const CORAL = "#f4704e";
const HERO =
  "https://feurjocffatjbmxzpsuu.supabase.co/storage/v1/object/public/room-photos/ms-61/common/00.jpg";
const IMG1 =
  "https://feurjocffatjbmxzpsuu.supabase.co/storage/v1/object/public/room-photos/ms-61/other/00.jpg";
const IMG2 =
  "https://feurjocffatjbmxzpsuu.supabase.co/storage/v1/object/public/room-photos/ao/common/00.jpg";

const NAV_L = ["Sobre nós", "Residências", "Proprietários"];
const NAV_R = ["Parcerias", "F.A.Q."];

const VALUE_PROPS = [
  ["🏷️", "Renda", "“Tudo incluído”", "Sem custos extra: água, luz, gás, internet incluídos, sem limites."],
  ["🧹", "Limpeza incluída", "Foca-te em ti!", "Nós tratamos da limpeza da casa."],
  ["📶", "Wi-Fi rápida", "", "As velocidades mais rápidas que existem no mercado!"],
  ["🍳", "Cozinhas equipadas", "", "Para que nunca te falte nada para libertares o teu lado gourmet!"],
  ["🚇", "Transportes", "", "Metro, autocarros, comboios e táxis mesmo ao lado da porta de casa."],
  ["🛍️", "Comodidades", "", "Vários serviços perto da residência, como supermercados, restaurantes e cafés."],
  ["🔧", "Manutenções", "", "Estragou-se algo? Estamos aqui para ti!"],
  ["📄", "Tudo legal", "", "Com contrato registado nas finanças e segurança social."],
];

const STEPS = [
  ["🧳", "Como funciona", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor incididunt ut labore.", "Descobrir"],
  ["🏠", "Conhecer residências", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor incididunt ut labore.", "Marcar visita"],
  ["🔑", "Anunciar propriedade", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor incididunt ut labore.", "Pedir"],
];

export default function TestHome() {
  return (
    <div style={{ color: "#2b2b2b", background: "#ffffff" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 text-sm">
          <nav className="hidden gap-6 text-gray-500 md:flex">
            {NAV_L.map((n) => <span key={n} className="cursor-pointer hover:text-gray-900">{n}</span>)}
          </nav>
          <div className="text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-poppins)" }}>LOFTZ</div>
          <nav className="hidden items-center gap-6 text-gray-500 md:flex">
            {NAV_R.map((n) => <span key={n} className="cursor-pointer hover:text-gray-900">{n}</span>)}
            <button className="rounded-full px-5 py-2 font-medium text-white" style={{ background: CORAL }}>Reserva já</button>
            <span className="cursor-pointer">PT ⌄</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[520px] w-full overflow-hidden">
          <img src={HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl" style={{ fontFamily: "var(--font-poppins)" }}>
              Olá!<br />Aqui vais encontrar à tua próxima casa com <span style={{ color: TEAL }}>conforto!</span>
            </h1>
          </div>
        </div>
        {/* Floating search */}
        <div className="mx-auto -mt-10 max-w-5xl px-6">
          <div className="flex items-stretch overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex-1 border-r border-gray-100 p-4">
              <div className="text-xs text-gray-400">Localização / Universidade</div>
              <div className="mt-1 font-semibold">Lisboa</div>
            </div>
            <div className="flex-1 border-r border-gray-100 p-4">
              <div className="text-xs text-gray-400">Entrada</div>
              <div className="mt-1 font-semibold">Seg, 22 Fev</div>
            </div>
            <div className="flex-1 p-4">
              <div className="text-xs text-gray-400">Saída</div>
              <div className="mt-1 font-semibold">Dom, 28 Fev</div>
            </div>
            <button className="flex w-16 items-center justify-center text-white" style={{ background: CORAL }}>🔍</button>
          </div>
        </div>
      </section>

      {/* Stats + map */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ul className="space-y-2 text-lg font-medium text-gray-700">
            <li>&gt; 9 residências</li>
            <li>&gt; 62 quartos</li>
            <li>&gt; 7 localizações</li>
            <li>&gt; 200 clientes</li>
            <li className="pt-4 text-sm font-normal text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor incididunt ut labore.</li>
          </ul>
          <div className="relative h-72 overflow-hidden rounded-2xl bg-[#e8eef0]">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #d3dde0 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            {[["20%","30%"],["55%","45%"],["70%","20%"],["40%","70%"]].map(([l,t],i)=>(
              <span key={i} className="absolute h-4 w-4 rounded-full ring-4 ring-white" style={{ left:l, top:t, background: TEAL }} />
            ))}
            <div className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 text-center shadow-lg">
              <div className="font-semibold">Residência ABC</div>
              <div className="text-sm text-gray-400">14 quartos</div>
              <button className="mt-2 rounded-full px-4 py-1.5 text-sm font-medium text-white" style={{ background: CORAL }}>Conhecer</button>
            </div>
          </div>
        </div>
      </section>

      {/* Residences split */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <img src={IMG1} alt="" className="col-span-2 h-56 w-full rounded-2xl object-cover" />
          <img src={IMG2} alt="" className="h-40 w-full rounded-2xl object-cover" />
          <img src={HERO} alt="" className="h-40 w-full rounded-2xl object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>As nossas residências</h2>
          <p className="mt-4 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
          <button className="mt-6 rounded-full px-6 py-3 font-medium text-white" style={{ background: CORAL }}>Conhecer</button>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-[#f7f8f9] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>Lorem ipsum dolor sit amet</h2>
            <p className="mt-3 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map(([icon, title, sub, body]) => (
              <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl" style={{ background: "#e3f4f8" }}>{icon}</div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                {sub && <div className="text-sm font-medium" style={{ color: TEAL }}>{sub}</div>}
                <p className="mt-1 text-sm text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {STEPS.map(([icon, title, body, cta]) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full text-5xl" style={{ background: "#e3f4f8" }}>{icon}</div>
              <h3 className="mt-6 text-xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-gray-400">{body}</p>
              <button className="mt-4 rounded-full px-6 py-2.5 font-medium text-white" style={{ background: CORAL }}>{cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: TEAL }} className="text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[2fr_1fr_1fr_auto]">
          <div>
            <div className="mb-3 font-semibold">Sobre nós</div>
            <p className="max-w-xs text-sm text-white/80">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div>
            <div className="mb-3 font-semibold">Contactos</div>
            <ul className="space-y-1 text-sm text-white/80"><li>+351 20 000 000</li><li>geral@loftz.net</li><li>Adress xxx xxx xxx xxx</li></ul>
          </div>
          <div>
            <div className="mb-3 font-semibold">Link úteis</div>
            <ul className="space-y-1 text-sm text-white/80"><li>Como funciona</li><li>Ajuda</li><li>Parceiros</li><li>Condições</li><li>Contactos</li></ul>
          </div>
          <button className="h-fit rounded-full px-6 py-2.5 font-medium text-white" style={{ background: CORAL }}>Reserva já</button>
        </div>
        <div className="border-t border-white/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-xs text-white/70">
            <span>Condições · Privacidade · © 2020 Your Company All rights reserved</span>
            <span className="flex gap-2"><i className="h-3 w-3 rounded-full bg-white/70" /><i className="h-3 w-3 rounded-full bg-white/70" /><i className="h-3 w-3 rounded-full bg-white/70" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
