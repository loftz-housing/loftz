/* eslint-disable @next/next/no-img-element */
// 1:1 mockup of the 2020 LOFTZ wireframe room page (Henrique's own agency
// concept) for side-by-side comparison. Static, PT, self-contained styling.

const TEAL = "#12a3bd";
const CORAL = "#f4704e";
const B = "https://feurjocffatjbmxzpsuu.supabase.co/storage/v1/object/public/room-photos";
const GALLERY = [`${B}/ms-61/room-1/00.jpg`, `${B}/ms-61/room-1/01.jpg`, `${B}/ms-61/room-1/02.jpg`, `${B}/ms-61/room-1/03.jpg`];
const SIMILAR = [
  [`${B}/gf/room-4/00.jpg`, "350€", "Disponível"],
  [`${B}/ma-3/room-7/00.jpg`, "380€", "Disponível 16 de Junho"],
  [`${B}/ma-5/room-7/00.jpg`, "450€", "Disponível"],
  [`${B}/gf/room-3/00.jpg`, "320€", "Disponível"],
];

const CONTENTS = [
  ["Cama de solteiro", 1], ["Secretária", 1], ["Toalhas", 1], ["Fechadura", 0],
  ["Armário", 1], ["Televisão", 1], ["Sofá", 0], ["Janela", 1],
  ["Cómoda", 1], ["Roupa de cama", 1], ["Sofá-cama", 0], ["Varanda", 0],
];
const TRANSPORT = [["Autocarro", "à 10m"], ["Metro", "à 100m"], ["Comboio", "à 500m"], ["Aeroporto", "à 10km"]];
const NEARBY = [["Jardim", "150m"], ["Gym / Fitness", "200m"], ["Universidade", "230m"], ["Restaurante", "290m"]];
const APARTMENT = ["Planta - 65 m2", "Wi-Fi", "Elevador", "Acessibilidade", "Ar condicionado", "TV Box", "Área exterior", "Aquecimento central"];
const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const PRICES = [400, 400, 400, 400, 450, 450, 500, 600, 550, 500, 400, 450];
const OCCUPIED_2020 = new Set([7, 8]); // AGO, SET occupied (example)

function MonthGrid({ year, occupied }: { year: string; occupied: Set<number> }) {
  return (
    <div>
      <div className="mb-2 text-sm text-gray-400">{year}</div>
      <div className="grid grid-cols-6 gap-2">
        {MONTHS.map((m, i) => {
          const occ = occupied.has(i);
          return (
            <div key={m} className="rounded-lg py-2 text-center text-xs font-medium text-white" style={{ background: occ ? CORAL : TEAL }}>
              <div>{m}</div>
              <div className="text-[11px] opacity-90">{PRICES[i]}€</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TestRoom() {
  return (
    <div style={{ color: "#2b2b2b", background: "#ffffff", paddingBottom: 72 }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 text-sm">
          <nav className="hidden gap-6 text-gray-500 md:flex"><span>Sobre nós</span><span className="font-semibold text-gray-900">Residências</span><span>Proprietários</span></nav>
          <div className="text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-poppins)" }}>LOFTZ</div>
          <nav className="hidden items-center gap-6 text-gray-500 md:flex"><span>Parcerias</span><span>F.A.Q.</span><button className="rounded-full px-5 py-2 font-medium text-white" style={{ background: CORAL }}>Reserva já</button><span>PT ⌄</span></nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        {/* Gallery */}
        <div className="grid grid-cols-4 gap-2 pt-6">
          <img src={GALLERY[0]} alt="" className="col-span-4 h-80 w-full rounded-2xl object-cover" />
          <img src={GALLERY[1]} alt="" className="h-28 w-full rounded-xl object-cover" />
          <img src={GALLERY[2]} alt="" className="h-28 w-full rounded-xl object-cover" />
          <img src={GALLERY[3]} alt="" className="h-28 w-full rounded-xl object-cover" />
          <div className="flex h-28 w-full items-center justify-center rounded-xl text-white" style={{ background: TEAL }}>
            <span className="text-center text-sm">▶<br />House video</span>
          </div>
        </div>

        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 py-6">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <div className="text-xs text-gray-400">Morais Soares 61 · Ref ABCD.EFG</div>
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>Quarto A</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">350€ <span className="text-sm font-normal text-gray-400">/mês</span></div>
            <div className="text-sm font-medium" style={{ color: TEAL }}>Disponível</div>
          </div>
        </div>

        {/* Sobre o quarto */}
        <section className="py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>Sobre o quarto</h2>
            <button className="rounded-full border px-5 py-2 text-sm font-medium" style={{ borderColor: CORAL, color: CORAL }}>Marcar visita</button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[["Local", "Arroios, Lisboa"], ["Tipo de quarto", "Quarto duplo"], ["Número de pessoas", "Até 2 pessoas"], ["Área (ver planta)", "12 m2"]].map(([k, v]) => (
              <div key={k}><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
            ))}
          </div>

          <h3 className="mb-4 mt-8 font-semibold">Conteúdos do quarto</h3>
          <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-4">
            {CONTENTS.map(([label, on]) => (
              <div key={label as string} className={`flex items-center gap-2 text-sm ${on ? "" : "text-gray-300"}`}>
                <span style={{ color: on ? TEAL : "#d1d5db" }}>🛏️</span>{label}
              </div>
            ))}
          </div>
        </section>

        {/* Transportes */}
        <section className="border-t border-gray-100 py-8">
          <h3 className="mb-4 font-semibold">Transportes</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TRANSPORT.map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-sm"><span style={{ color: TEAL }}>🚇</span>{k} <b>{v}</b></div>
            ))}
          </div>
        </section>

        {/* Localização */}
        <section className="border-t border-gray-100 py-8">
          <h3 className="mb-4 font-semibold">Localização</h3>
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="relative h-64 overflow-hidden rounded-2xl bg-[#e8eef0]">
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #d3dde0 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white" style={{ background: TEAL }} />
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="mb-2 text-sm text-gray-400">Nas proximidades</div>
              {NEARBY.map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 py-2 text-sm"><span>{k}</span><span className="text-gray-400">{v}</span></div>
              ))}
              <button className="mt-3 text-sm font-medium" style={{ color: TEAL }}>Ver mais</button>
            </div>
          </div>
        </section>

        {/* Sobre o apartamento */}
        <section className="border-t border-gray-100 py-8">
          <h3 className="mb-4 font-semibold">Sobre o apartamento</h3>
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <ul className="space-y-2 text-sm">
              {["Apartamento", "Sala de estar", "Cozinha", "Casa de banho"].map((s, i) => (
                <li key={s} className={i === 0 ? "font-semibold" : "text-gray-400"}>{s}</li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {APARTMENT.map((a) => (
                <div key={a} className="flex items-center gap-2"><span style={{ color: TEAL }}>✓</span>{a}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Disponibilidade */}
        <section className="border-t border-gray-100 py-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Disponibilidade</h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><i className="h-3 w-3 rounded-full" style={{ background: CORAL }} /> Ocupado</span>
              <span className="flex items-center gap-1"><i className="h-3 w-3 rounded-full" style={{ background: TEAL }} /> Disponível</span>
            </div>
          </div>
          <div className="space-y-5">
            <MonthGrid year="2020" occupied={OCCUPIED_2020} />
            <MonthGrid year="2021" occupied={new Set([0, 1])} />
          </div>
        </section>

        {/* Quartos semelhantes */}
        <section className="border-t border-gray-100 py-8">
          <h3 className="mb-4 font-semibold">Quartos semelhantes</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SIMILAR.map(([img, price, status], i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
                <img src={img as string} alt="" className="h-32 w-full object-cover" />
                <div className="p-3"><div className="font-semibold">{price} <span className="text-xs font-normal text-gray-400">/mês</span></div><div className="text-xs" style={{ color: TEAL }}>{status}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* Also featured in */}
        <section className="border-t border-gray-100 py-8 text-center">
          <h3 className="mb-4 font-semibold">Also featured in</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 text-lg font-bold" style={{ color: TEAL }}>
            <span>Uniplaces</span><span>Spotahome</span><span>HousingAnywhere</span><span>InLife</span>
          </div>
        </section>
      </div>

      {/* Sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div><div className="text-xs text-gray-400">Data</div><div className="text-sm font-semibold" style={{ color: TEAL }}>Seg, 22 Fev - Dom, 28 Fev</div></div>
          <div className="hidden sm:block"><div className="text-xs text-gray-400">Total por mês</div><div className="text-lg font-bold">350€ / mês</div></div>
          <button className="rounded-full px-6 py-3 font-medium text-white" style={{ background: CORAL }}>Enviar pedido de reserva</button>
        </div>
      </div>
    </div>
  );
}
