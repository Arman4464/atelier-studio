import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = useAuthStore((s) => (id ? s.getCustomer(id) : undefined));
  const deleteCustomer = useAuthStore((s) => s.deleteCustomer);
  const currency = useCartStore((s) => s.currency);
  const showToast = useUIStore((s) => s.showToast);

  if (!customer) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 font-display text-2xl text-ink-dim">Customer not found.</p>
        <Link to="/admin/customers" className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink">
          Back to Customers
        </Link>
      </div>
    );
  }

  const lifetimeSpend = customer.orders.reduce((s, o) => s + o.total, 0);

  const remove = () => {
    if (!confirm(`Remove ${customer.name}'s account? This can't be undone.`)) return;
    deleteCustomer(customer.id);
    showToast("Customer removed");
    navigate("/admin/customers");
  };

  return (
    <div>
      <Link to="/admin/customers" className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-ink-dim hover:text-ink">
        <ArrowLeft size={14} /> Back to Customers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Customer</span>
          <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">{customer.name}</h1>
          <p className="mt-2 text-sm text-ink-dim">{customer.email}{customer.phone ? ` \u00b7 ${customer.phone}` : ""}</p>
        </div>
        <button onClick={remove} className="flex items-center gap-2 border border-flame px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-flame transition-colors hover:bg-flame hover:text-on-flame">
          <Trash2 size={13} /> Remove Customer
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{customer.orders.length}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Orders</div>
        </div>
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{formatPrice(lifetimeSpend, currency)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Lifetime Spend</div>
        </div>
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{customer.addresses.length}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Addresses</div>
        </div>
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-lg font-black text-ink">{new Date(customer.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Member Since</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">Order History</h2>
          {customer.orders.length === 0 ? (
            <p className="border border-line p-6 text-sm text-ink-dim">No orders yet.</p>
          ) : (
            <div className="divide-y divide-line border border-line">
              {customer.orders.map((o) => (
                <Link key={o.id} to={`/admin/orders/${customer.id}/${o.id}`} className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-void-2">
                  <span className="font-mono text-xs text-ink">{o.id}</span>
                  <span className="text-xs text-ink-dim">{new Date(o.date).toLocaleDateString()}</span>
                  <OrderStatusBadge status={o.status} />
                  <span className="ml-auto font-mono text-sm text-ink">{formatPrice(o.total, currency)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">Addresses</h2>
          {customer.addresses.length === 0 ? (
            <p className="border border-line p-6 text-sm text-ink-dim">No saved addresses.</p>
          ) : (
            <div className="space-y-3">
              {customer.addresses.map((a) => (
                <div key={a.id} className="border border-line p-4 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-glow">{a.label}</span>
                  <p className="mt-1 text-ink">{a.name}</p>
                  <p className="text-ink-dim">{a.street}, {a.city} {a.zip}, {a.country}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
