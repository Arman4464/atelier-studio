import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

export const AdminCustomerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = useAuthStore((s) => (id ? s.getCustomer(id) : undefined));
  const deleteCustomer = useAuthStore((s) => s.deleteCustomer);
  const currency = useCartStore((s) => s.currency);
  const showToast = useUIStore((s) => s.showToast);

  if (!customer) {
    return (
      <div className="py-12 text-center glass-card rounded-[28px] p-8">
        <p className="mb-4 font-display text-2xl text-[var(--ink-secondary)]">Client record not found.</p>
        <Link to="/admin/customers" className="glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
          Back to Client Directory
        </Link>
      </div>
    );
  }

  const lifetimeSpend = customer.orders.reduce((s, o) => s + o.total, 0);

  const remove = () => {
    if (!confirm(`Remove ${customer.name}'s account? This action cannot be reversed.`)) return;
    deleteCustomer(customer.id);
    showToast("Customer removed");
    navigate("/admin/customers");
  };

  return (
    <div className="space-y-8">
      <Link
        to="/admin/customers"
        className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
      >
        <ArrowLeft size={14} /> Back to Client Directory
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Client Dossier
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">{customer.name}</h1>
          <p className="mt-1 text-xs font-mono text-[var(--ink-muted)]">
            {customer.email}{customer.phone ? ` • ${customer.phone}` : ""}
          </p>
        </div>
        <button
          onClick={remove}
          className="flex items-center gap-2 rounded-2xl border border-rose-500/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
        >
          <Trash2 size={13} /> Terminate Account
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass-card rounded-[24px] p-5">
          <div className="font-display text-3xl font-light text-[var(--ink-primary)]">{customer.orders.length}</div>
          <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">Total Orders</div>
        </div>
        <div className="glass-card rounded-[24px] p-5">
          <div className="font-display text-3xl font-light text-[var(--ink-primary)]">{formatPrice(lifetimeSpend, currency)}</div>
          <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">Lifetime Value</div>
        </div>
        <div className="glass-card rounded-[24px] p-5">
          <div className="font-display text-3xl font-light text-[var(--ink-primary)]">{customer.addresses.length}</div>
          <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">Saved Addresses</div>
        </div>
        <div className="glass-card rounded-[24px] p-5">
          <div className="font-display text-xl font-light text-[var(--ink-primary)]">
            {new Date(customer.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
          </div>
          <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">Member Since</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Acquisition Log</h2>
          {customer.orders.length === 0 ? (
            <div className="glass-card rounded-[24px] p-6 text-sm text-[var(--ink-muted)]">No orders registered.</div>
          ) : (
            <div className="glass-card rounded-[28px] overflow-hidden divide-y divide-black/5 dark:divide-white/10">
              {customer.orders.map((o) => (
                <Link
                  key={o.id}
                  to={`/admin/orders/${customer.id}/${o.id}`}
                  className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-white/40 dark:hover:bg-white/5"
                >
                  <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">{o.id}</span>
                  <span className="text-xs font-mono text-[var(--ink-muted)]">{new Date(o.date).toLocaleDateString()}</span>
                  <OrderStatusBadge status={o.status} />
                  <span className="ml-auto font-mono text-sm font-medium text-[var(--ink-primary)]">{formatPrice(o.total, currency)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Dispatch Locations</h2>
          {customer.addresses.length === 0 ? (
            <div className="glass-card rounded-[24px] p-6 text-sm text-[var(--ink-muted)]">No saved addresses on file.</div>
          ) : (
            <div className="space-y-3">
              {customer.addresses.map((a) => (
                <div key={a.id} className="glass-card rounded-[22px] p-5 text-sm">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400">{a.label}</span>
                  <p className="mt-1 font-semibold text-[var(--ink-primary)]">{a.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--ink-secondary)] leading-relaxed">{a.street}, {a.city} {a.zip}, {a.country}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
