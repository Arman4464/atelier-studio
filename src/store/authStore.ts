import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingName: string;
  shippingAddress: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: string;
  newsletter: boolean;
  isAdmin: boolean;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
}

interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

const demoAccount: Account = {
  id: "demo-user",
  name: "Isabel Marques",
  email: "demo@atelier.com",
  password: "demo1234",
  phone: "+351 912 345 678",
  createdAt: "2024-11-02T00:00:00.000Z",
  newsletter: true,
  isAdmin: false,
  addresses: [
    {
      id: "addr-1",
      label: "Home",
      name: "Isabel Marques",
      street: "Rua das Flores 12",
      city: "Lisboa",
      zip: "1200-192",
      country: "Portugal",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Studio",
      name: "Isabel Marques",
      street: "Avenida da Liberdade 45, 3\u00ba",
      city: "Lisboa",
      zip: "1250-096",
      country: "Portugal",
      isDefault: false,
    },
  ],
  paymentMethods: [
    { id: "pm-1", brand: "Visa", last4: "4242", expiry: "09/28", isDefault: true },
    { id: "pm-2", brand: "Mastercard", last4: "5556", expiry: "03/27", isDefault: false },
  ],
  orders: [
    {
      id: "ATL-482913",
      date: "2026-06-14T10:00:00.000Z",
      status: "Delivered",
      items: [
        { productId: 1, name: "Structured Wool Trench", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop", price: 74900, qty: 1 },
      ],
      total: 74900,
      shippingName: "Isabel Marques",
      shippingAddress: "Rua das Flores 12, Lisboa 1200-192, Portugal",
    },
    {
      id: "ATL-471820",
      date: "2026-04-02T10:00:00.000Z",
      status: "Delivered",
      items: [
        { productId: 3, name: "Minimalist Ceramic Vessel", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop", price: 13900, qty: 2 },
        { productId: 5, name: "Hand-Poured Brass Lamp", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=400&auto=format&fit=crop", price: 26900, qty: 1 },
      ],
      total: 54700,
      shippingName: "Isabel Marques",
      shippingAddress: "Rua das Flores 12, Lisboa 1200-192, Portugal",
    },
    {
      id: "ATL-459104",
      date: "2026-07-20T10:00:00.000Z",
      status: "Processing",
      items: [
        { productId: 2, name: "Roll-Neck Cashmere", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&auto=format&fit=crop", price: 35900, qty: 1 },
      ],
      total: 35900,
      shippingName: "Isabel Marques",
      shippingAddress: "Rua das Flores 12, Lisboa 1200-192, Portugal",
    },
  ],
};

const seedCustomers: Account[] = [
  {
    id: "cust-thomas",
    name: "Thomas Eldridge",
    email: "thomas.eldridge@example.com",
    password: "password123",
    phone: "+44 7700 900123",
    createdAt: "2025-08-14T00:00:00.000Z",
    newsletter: false,
    isAdmin: false,
    addresses: [
      { id: "addr-t1", label: "Home", name: "Thomas Eldridge", street: "14 Camden Row", city: "London", zip: "SE3 0QR", country: "United Kingdom", isDefault: true },
    ],
    paymentMethods: [{ id: "pm-t1", brand: "Visa", last4: "1881", expiry: "05/27", isDefault: true }],
    orders: [
      {
        id: "ATL-503112",
        date: "2026-07-22T09:00:00.000Z",
        status: "Processing",
        items: [{ productId: 4, name: "Asymmetric Wrap Coat", image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=400&auto=format&fit=crop", price: 62900, qty: 1 }],
        total: 62900,
        shippingName: "Thomas Eldridge",
        shippingAddress: "14 Camden Row, London SE3 0QR, United Kingdom",
      },
      {
        id: "ATL-488210",
        date: "2026-06-30T09:00:00.000Z",
        status: "Delivered",
        items: [{ productId: 7, name: "Structured Leather Sling", image: "https://images.unsplash.com/photo-1585488433963-2e35fb083e52?q=80&w=400&auto=format&fit=crop", price: 20900, qty: 1 }],
        total: 20900,
        shippingName: "Thomas Eldridge",
        shippingAddress: "14 Camden Row, London SE3 0QR, United Kingdom",
      },
      {
        id: "ATL-460330",
        date: "2026-05-11T09:00:00.000Z",
        status: "Delivered",
        items: [{ productId: 1, name: "Structured Wool Trench", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop", price: 74900, qty: 1 }],
        total: 74900,
        shippingName: "Thomas Eldridge",
        shippingAddress: "14 Camden Row, London SE3 0QR, United Kingdom",
      },
    ],
  },
  {
    id: "cust-priya",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    password: "password123",
    phone: "+1 415 555 0139",
    createdAt: "2025-12-03T00:00:00.000Z",
    newsletter: true,
    isAdmin: false,
    addresses: [
      { id: "addr-p1", label: "Home", name: "Priya Nair", street: "88 Fillmore St, Apt 4", city: "San Francisco", zip: "94117", country: "United States", isDefault: true },
    ],
    paymentMethods: [{ id: "pm-p1", brand: "Amex", last4: "1005", expiry: "11/28", isDefault: true }],
    orders: [
      {
        id: "ATL-499921",
        date: "2026-07-18T09:00:00.000Z",
        status: "Shipped",
        items: [
          { productId: 2, name: "Roll-Neck Cashmere", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&auto=format&fit=crop", price: 35900, qty: 1 },
          { productId: 6, name: "Ribbed Alpaca Cardigan", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop", price: 32900, qty: 1 },
        ],
        total: 68800,
        shippingName: "Priya Nair",
        shippingAddress: "88 Fillmore St, Apt 4, San Francisco 94117, United States",
      },
      {
        id: "ATL-475008",
        date: "2026-06-05T09:00:00.000Z",
        status: "Delivered",
        items: [{ productId: 3, name: "Minimalist Ceramic Vessel", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop", price: 13900, qty: 1 }],
        total: 13900,
        shippingName: "Priya Nair",
        shippingAddress: "88 Fillmore St, Apt 4, San Francisco 94117, United States",
      },
    ],
  },
  {
    id: "cust-marco",
    name: "Marco Silva",
    email: "marco.silva@example.com",
    password: "password123",
    phone: "+351 913 224 771",
    createdAt: "2026-02-20T00:00:00.000Z",
    newsletter: true,
    isAdmin: false,
    addresses: [
      { id: "addr-m1", label: "Home", name: "Marco Silva", street: "Rua do Carmo 22", city: "Porto", zip: "4050-011", country: "Portugal", isDefault: true },
    ],
    paymentMethods: [],
    orders: [
      {
        id: "ATL-467715",
        date: "2026-05-27T09:00:00.000Z",
        status: "Delivered",
        items: [{ productId: 5, name: "Hand-Poured Brass Lamp", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=400&auto=format&fit=crop", price: 26900, qty: 2 }],
        total: 53800,
        shippingName: "Marco Silva",
        shippingAddress: "Rua do Carmo 22, Porto 4050-011, Portugal",
      },
    ],
  },
  {
    id: "cust-hannah",
    name: "Hannah Weiss",
    email: "hannah.weiss@example.com",
    password: "password123",
    phone: "+49 151 23456789",
    createdAt: "2026-04-09T00:00:00.000Z",
    newsletter: false,
    isAdmin: false,
    addresses: [
      { id: "addr-h1", label: "Home", name: "Hannah Weiss", street: "Torstra\u00dfe 91", city: "Berlin", zip: "10119", country: "Germany", isDefault: true },
    ],
    paymentMethods: [{ id: "pm-h1", brand: "Mastercard", last4: "7712", expiry: "02/29", isDefault: true }],
    orders: [
      {
        id: "ATL-501442",
        date: "2026-07-25T09:00:00.000Z",
        status: "Processing",
        items: [{ productId: 6, name: "Ribbed Alpaca Cardigan", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop", price: 32900, qty: 1 }],
        total: 32900,
        shippingName: "Hannah Weiss",
        shippingAddress: "Torstra\u00dfe 91, Berlin 10119, Germany",
      },
    ],
  },
];

const adminAccount: Account = {
  id: "admin-user",
  name: "Store Admin",
  email: "admin@atelier.com",
  password: "admin1234",
  phone: "",
  createdAt: "2024-01-01T00:00:00.000Z",
  newsletter: false,
  isAdmin: true,
  addresses: [],
  paymentMethods: [],
  orders: [],
};

interface AuthState {
  accounts: Account[];
  currentUserId: string | null;
  resetTokens: ResetToken[];

  currentUser: () => Account | null;
  isAuthenticated: () => boolean;
  isAdminUser: () => boolean;

  signUp: (name: string, email: string, password: string) => { ok: true } | { ok: false; error: string };
  logIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logOut: () => void;
  loginAsDemo: () => void;
  loginAsAdmin: () => void;

  requestPasswordReset: (email: string) => { token: string } | null;
  resetPassword: (token: string, newPassword: string) => { ok: true } | { ok: false; error: string };

  updateProfile: (fields: Partial<Pick<Account, "name" | "email" | "phone" | "newsletter">>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { ok: true } | { ok: false; error: string };

  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, fields: Partial<Omit<Address, "id">>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  addPaymentMethod: (pm: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Order;

  // --- Admin ---
  allCustomers: () => Account[];
  getCustomer: (id: string) => Account | undefined;
  allOrders: () => Array<Order & { customerId: string; customerName: string; customerEmail: string }>;
  updateOrderStatus: (customerId: string, orderId: string, status: OrderStatus) => void;
  deleteCustomer: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: [demoAccount, ...seedCustomers, adminAccount],
      currentUserId: null,
      resetTokens: [],

      currentUser: () => {
        const { accounts, currentUserId } = get();
        return accounts.find((a) => a.id === currentUserId) ?? null;
      },
      isAuthenticated: () => get().currentUserId !== null,
      isAdminUser: () => get().currentUser()?.isAdmin === true,

      signUp: (name, email, password) => {
        const normalized = email.trim().toLowerCase();
        if (get().accounts.some((a) => a.email.toLowerCase() === normalized)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const account: Account = {
          id: uid("user"),
          name: name.trim(),
          email: normalized,
          password,
          phone: "",
          createdAt: new Date().toISOString(),
          newsletter: true,
          isAdmin: false,
          addresses: [],
          paymentMethods: [],
          orders: [],
        };
        set((state) => ({ accounts: [...state.accounts, account], currentUserId: account.id }));
        return { ok: true };
      },

      logIn: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const account = get().accounts.find((a) => a.email.toLowerCase() === normalized);
        if (!account) return { ok: false, error: "No account found for that email." };
        if (account.password !== password) return { ok: false, error: "That password doesn't match this account." };
        set({ currentUserId: account.id });
        return { ok: true };
      },

      logOut: () => set({ currentUserId: null }),

      loginAsDemo: () => set({ currentUserId: demoAccount.id }),
      loginAsAdmin: () => set({ currentUserId: adminAccount.id }),

      requestPasswordReset: (email) => {
        const normalized = email.trim().toLowerCase();
        const account = get().accounts.find((a) => a.email.toLowerCase() === normalized);
        if (!account) return null;
        const token = uid("reset");
        const entry: ResetToken = { token, email: account.email, expiresAt: Date.now() + 1000 * 60 * 30 };
        set((state) => ({ resetTokens: [...state.resetTokens.filter((t) => t.email !== account.email), entry] }));
        return { token };
      },

      resetPassword: (token, newPassword) => {
        const entry = get().resetTokens.find((t) => t.token === token);
        if (!entry || entry.expiresAt < Date.now()) {
          return { ok: false, error: "That reset link is invalid or has expired." };
        }
        set((state) => ({
          accounts: state.accounts.map((a) => (a.email === entry.email ? { ...a, password: newPassword } : a)),
          resetTokens: state.resetTokens.filter((t) => t.token !== token),
        }));
        return { ok: true };
      },

      updateProfile: (fields) => {
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === state.currentUserId ? { ...a, ...fields } : a)),
        }));
      },

      changePassword: (currentPassword, newPassword) => {
        const user = get().currentUser();
        if (!user) return { ok: false, error: "You're not signed in." };
        if (user.password !== currentPassword) return { ok: false, error: "Current password is incorrect." };
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === user.id ? { ...a, password: newPassword } : a)),
        }));
        return { ok: true };
      },

      addAddress: (address) => {
        set((state) => {
          const user = state.accounts.find((a) => a.id === state.currentUserId);
          if (!user) return state;
          const newAddress: Address = { ...address, id: uid("addr") };
          const makeDefault = newAddress.isDefault || user.addresses.length === 0;
          const addresses = makeDefault
            ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), { ...newAddress, isDefault: true }]
            : [...user.addresses, newAddress];
          return { accounts: state.accounts.map((a) => (a.id === user.id ? { ...a, addresses } : a)) };
        });
      },

      updateAddress: (id, fields) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === state.currentUserId
              ? { ...a, addresses: a.addresses.map((addr) => (addr.id === id ? { ...addr, ...fields } : addr)) }
              : a
          ),
        }));
      },

      removeAddress: (id) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === state.currentUserId ? { ...a, addresses: a.addresses.filter((addr) => addr.id !== id) } : a
          ),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === state.currentUserId
              ? { ...a, addresses: a.addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })) }
              : a
          ),
        }));
      },

      addPaymentMethod: (pm) => {
        set((state) => {
          const user = state.accounts.find((a) => a.id === state.currentUserId);
          if (!user) return state;
          const newPm: PaymentMethod = { ...pm, id: uid("pm") };
          const makeDefault = newPm.isDefault || user.paymentMethods.length === 0;
          const paymentMethods = makeDefault
            ? [...user.paymentMethods.map((p) => ({ ...p, isDefault: false })), { ...newPm, isDefault: true }]
            : [...user.paymentMethods, newPm];
          return { accounts: state.accounts.map((a) => (a.id === user.id ? { ...a, paymentMethods } : a)) };
        });
      },

      removePaymentMethod: (id) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === state.currentUserId ? { ...a, paymentMethods: a.paymentMethods.filter((p) => p.id !== id) } : a
          ),
        }));
      },

      setDefaultPaymentMethod: (id) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === state.currentUserId
              ? { ...a, paymentMethods: a.paymentMethods.map((p) => ({ ...p, isDefault: p.id === id })) }
              : a
          ),
        }));
      },

      addOrder: (order) => {
        const newOrder: Order = { ...order, id: `ATL-${Math.floor(100000 + Math.random() * 900000)}`, date: new Date().toISOString(), status: "Processing" };
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === state.currentUserId ? { ...a, orders: [newOrder, ...a.orders] } : a)),
        }));
        return newOrder;
      },

      // --- Admin ---
      allCustomers: () => computeAllCustomers(get().accounts),

      getCustomer: (id) => get().accounts.find((a) => a.id === id),

      allOrders: () => computeAllOrders(get().accounts),

      updateOrderStatus: (customerId, orderId, status) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === customerId
              ? { ...a, orders: a.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) }
              : a
          ),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
          currentUserId: state.currentUserId === id ? null : state.currentUserId,
        }));
      },
    }),
    {
      name: "atelier-auth-v2",
      version: 1,
      partialize: (state) => ({ accounts: state.accounts, currentUserId: state.currentUserId, resetTokens: state.resetTokens }),
    }
  )
);

export function userInitials(name: string): string {
  return initials(name) || "A";
}

/**
 * Pure derivations kept outside the store so components can memoize them
 * (`useMemo(() => computeAllOrders(accounts), [accounts])`) instead of
 * calling `.allOrders()` directly inside a zustand selector — that would
 * return a fresh array on every snapshot check and infinite-loop React's
 * useSyncExternalStore.
 */
export function computeAllCustomers(accounts: Account[]): Account[] {
  return accounts.filter((a) => !a.isAdmin);
}

export function computeAllOrders(
  accounts: Account[]
): Array<Order & { customerId: string; customerName: string; customerEmail: string }> {
  return accounts
    .filter((a) => !a.isAdmin)
    .flatMap((a) => a.orders.map((o) => ({ ...o, customerId: a.id, customerName: a.name, customerEmail: a.email })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
