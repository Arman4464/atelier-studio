import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface ConfirmationProps {
  shipping?: any;
  orderNumber?: string;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  shipping,
  orderNumber: propOrderNumber,
}) => {
  const receipt = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('last_atelier_order');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const orderRef = propOrderNumber || receipt?.orderRef || 'AS-884920';
  const dateStr = receipt?.date || new Date().toISOString().slice(0, 10);
  const consignee =
    shipping?.name || receipt?.consignee || 'REGISTERED CLIENT';
  const address = shipping
    ? `${shipping.address}, ${shipping.city} ${shipping.zip || shipping.postalCode || ''}`
    : receipt?.address;

  return (
    <main className="min-h-[82vh] bg-[var(--bg-canvas)] py-16 px-4 sm:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[var(--bg-elevated)] hairline-box p-8 sm:p-12 font-ledger text-xs relative">
        {/* Wax Stamp Badge */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 perforated-b">
          <div>
            <span className="text-[10px] text-[var(--ink-muted)] block">
              ATELIER STUDIO // MILAN DISPATCH OFFICE
            </span>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl uppercase mt-1">
              Waybill Receipt
            </h1>
          </div>
          <div className="border-2 border-[var(--accent-stamp)] text-[var(--accent-stamp)] px-3 py-1 font-bold uppercase rotate-[-2deg]">
            STAMPED & CLEARED
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 perforated-b">
          <div>
            <span className="text-[10px] text-[var(--ink-muted)] block">WAYBILL REF N°</span>
            <span className="font-bold text-sm">{orderRef}</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--ink-muted)] block">DATE STAMP</span>
            <span className="font-bold text-sm">{dateStr}</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--ink-muted)] block">CONSIGNEE</span>
            <span className="font-bold text-sm uppercase">
              {consignee}
            </span>
          </div>
        </div>

        {/* Summary Notes */}
        <div className="py-6 space-y-3 text-[var(--ink-secondary)] leading-relaxed">
          <p>
            Your garment requisition has been logged at our cutting & packing table. Each specimen undergoes a final seam and measurement inspection prior to courier sealing.
          </p>
          {address && (
            <p className="text-[var(--ink-primary)]">
              DESTINATION: <span className="uppercase">{address}</span>
            </p>
          )}
        </div>

        <div className="pt-6 hairline-t flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/shop"
            className="px-6 py-4 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors uppercase tracking-widest font-medium"
          >
            RETURN TO ARCHIVE →
          </Link>
          <button
            onClick={() => window.print()}
            className="px-5 py-4 hairline-box uppercase hover:bg-[var(--bg-sub)]"
          >
            [ PRINT WAYBILL ]
          </button>
        </div>
      </div>
    </main>
  );
};

export default Confirmation;
