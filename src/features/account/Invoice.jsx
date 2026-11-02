import { money } from '../../shared/ui.jsx';

const MODE = {
  pickup: (d) => `Retiro en tienda · ${d.stadium}`,
  seat: (d) => `Entrega en asiento · ${d.seat}, ${d.stadium}`,
  home: (d) => `Envío a domicilio · ${d.address.street}, ${d.address.city}, ${d.address.province}`,
  digital: () => 'Boletas digitales enviadas por correo',
};

const fullDate = (iso) => new Date(iso).toLocaleString('es-DO', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' });

// Print-only invoice: light paper layout with the site's type and accent, no app chrome.
export default function Invoice({ order }) {
  const q = order.quote;
  const base = q.total - q.itbis;
  const paid = order.payment.method === 'cash'
    ? 'Pago al retirar (pendiente)'
    : `${order.payment.brand} terminada en ${order.payment.last4} · Autorización ${order.payment.authCode}`;

  return (
    <article className="invoice hidden print:block" aria-label={`Factura ${order.id}`}>
      <header className="flex items-start justify-between border-b-4 border-[#E63946] pb-5">
        <div>
          <p className="font-display text-[30px] font-extrabold uppercase leading-none tracking-wide text-[#0A0F1C]">Quisqueya<span className="text-[#E63946]">Sport</span></p>
          <p className="mt-2 text-[11px] leading-snug text-[#4A5568]">Tienda oficial del deporte dominicano<br />Santo Domingo, República Dominicana</p>
        </div>
        <div className="text-right">
          <p className="font-display text-[26px] font-bold uppercase leading-none text-[#0A0F1C]">Factura</p>
          <p className="mt-2 font-mono text-[13px] font-bold text-[#0A0F1C]">{order.id}</p>
          <p className="text-[11px] text-[#4A5568]">{fullDate(order.createdAt)}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 py-5 text-[12px] leading-relaxed text-[#1A202C]">
        <div>
          <p className="mb-1 font-mono text-[10px] font-bold tracking-[1.5px] text-[#E63946]">FACTURADO A</p>
          <p className="font-semibold">{order.contact.name}</p>
          <p>{order.contact.email}</p>
          <p>{order.contact.phone}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] font-bold tracking-[1.5px] text-[#E63946]">ENTREGA Y PAGO</p>
          <p>{MODE[order.delivery.mode]?.(order.delivery)}</p>
          <p>{paid}</p>
        </div>
      </section>

      <table className="w-full border-collapse text-[12px] text-[#1A202C]">
        <thead>
          <tr className="bg-[#0A0F1C] text-left font-mono text-[10px] tracking-[1px] text-white">
            <th className="px-3 py-2 font-bold">DESCRIPCIÓN</th>
            <th className="px-3 py-2 text-right font-bold">CANT.</th>
            <th className="px-3 py-2 text-right font-bold">PRECIO</th>
            <th className="px-3 py-2 text-right font-bold">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l) => (
            <tr key={`${l.id}-${l.size}`} className="break-inside-avoid border-b border-[#E2E8F0]">
              <td className="px-3 py-2.5">
                <span className="font-semibold">{l.name}</span>
                {l.size && <span className="block text-[11px] text-[#4A5568]">{l.size}</span>}
              </td>
              <td className="px-3 py-2.5 text-right font-mono">{l.qty}</td>
              <td className="px-3 py-2.5 text-right font-mono">{money(l.price)}</td>
              <td className="px-3 py-2.5 text-right font-mono">{money(l.qty * l.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="ml-auto mt-4 w-[300px] break-inside-avoid font-mono text-[12px] text-[#1A202C]">
        <div className="flex justify-between py-1"><span>Subtotal</span><span>{money(q.subtotal)}</span></div>
        {q.discount > 0 && <div className="flex justify-between py-1"><span>Descuento VIP 10%</span><span>−{money(q.discount)}</span></div>}
        <div className="flex justify-between py-1"><span>Entrega</span><span>{q.shipping ? money(q.shipping) : 'Gratis'}</span></div>
        <div className="mt-1 flex justify-between border-t border-[#E2E8F0] py-1 text-[#4A5568]"><span>Base imponible</span><span>{money(base)}</span></div>
        <div className="flex justify-between py-1 text-[#4A5568]"><span>ITBIS 18%</span><span>{money(q.itbis)}</span></div>
        <div className="mt-1 flex justify-between border-t-2 border-[#0A0F1C] pt-2 text-[16px] font-bold"><span>Total</span><span>{money(q.total)}</span></div>
      </section>

      <footer className="mt-10 border-t border-[#E2E8F0] pt-4 text-[10px] leading-relaxed text-[#4A5568]">
        <p>Presenta el código <b className="font-mono text-[#0A0F1C]">{order.id}</b> al retirar tu pedido o en la entrada del estadio.</p>
        <p>Documento de demostración generado por Quisqueya Sport. No es un comprobante fiscal (NCF) válido ante la DGII.</p>
      </footer>
    </article>
  );
}
