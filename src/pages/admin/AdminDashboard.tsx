import React from 'react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '../../store/productsStore';

export const AdminDashboard: React.FC = () => {
  const productsStore = useProductsStore() as any;
  const products: any[] = productsStore.products || [];

  const metrics = [
    { code: 'M-01', label: 'GROSS ARCHIVE VALUATION', value: '$48,920.00', delta: '+14.2% LOT AW26' },
    { code: 'M-02', label: 'ACTIVE WAYBILL DISPATCHES', value: '142', delta: '18 AWAITING SEAL' },
    { code: 'M-03', label: 'INDEXED SPECIMENS', value: String(products.length || 12), delta: '3 LOW STOCK LOTS' },
    { code: 'M-04', label: 'AVERAGE REQUISITION', value: '$540.00', delta: '+6.8% VS SS26' },
  ];

  const formatAuditPrice = (price: any) => {
    if (typeof price === 'number') {
      return (price > 1000 ? Math.round(price * 0.0104) : price).toFixed(2);
    }
    const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    return (isNaN(parsed) ? 380 : parsed > 1000 ? Math.round(parsed * 0.0104) : parsed).toFixed(2);
  };

  return (
    <div className="space-y-10">
      <div className="pb-6 hairline-b flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-ledger text-xs uppercase text-[var(--accent-stamp)]">
            // MILAN & KYOTO OPERATIONS
          </span>
          <h1 className="font-grotesk font-extrabold text-3xl uppercase mt-1">
            Atelier Ledger Overview
          </h1>
        </div>
        <Link
          to="/admin/products/new"
          className="px-5 py-3 bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-ledger text-xs uppercase tracking-widest hover:bg-[var(--accent-stamp)] font-medium"
        >
          + INDEX NEW GARMENT SPECIMEN
        </Link>
      </div>

      {/* KPI Ledger Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 hairline-t hairline-l">
        {metrics.map((m) => (
          <div key={m.code} className="p-6 bg-[var(--bg-elevated)] hairline-r hairline-b font-ledger">
            <div className="flex justify-between text-[10px] text-[var(--ink-muted)] mb-3">
              <span>[{m.code}]</span>
              <span className="text-[var(--accent-stamp)]">{m.delta}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight">{m.value}</div>
            <div className="text-[11px] text-[var(--ink-secondary)] mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Specimen Inventory Audit Table */}
      <div className="bg-[var(--bg-elevated)] hairline-box">
        <div className="px-6 py-4 hairline-b flex items-center justify-between font-ledger text-xs uppercase">
          <span className="font-bold">CURRENT ARCHIVE STOCK AUDIT</span>
          <Link to="/admin/products" className="underline">
            MANAGE ALL SPECIMENS →
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-hairline)] font-ledger text-xs">
          {products.slice(0, 6).map((p, idx) => (
            <div key={p.id || idx} className="grid grid-cols-12 items-center px-6 py-3.5">
              <span className="col-span-2 text-[var(--ink-muted)]">AS-{idx + 101}</span>
              <span className="col-span-5 font-grotesk font-bold uppercase">
                {p.name || p.title}
              </span>
              <span className="col-span-3 uppercase text-[var(--ink-secondary)]">
                {p.category || 'OUTERWEAR'}
              </span>
              <span className="col-span-2 text-right font-semibold">
                ${formatAuditPrice(p.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
