import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProductsStore } from "../../store/productsStore";
import { useUIStore } from "../../store/uiStore";
import { CATEGORIES, type Category, type Product } from "../../data/products";
import FormField from "../../components/FormField";

type FormState = {
  name: string;
  category: Category;
  price: string;
  material: string;
  description: string;
  image1: string;
  image2: string;
  image3: string;
  stock: string;
  tagNew: boolean;
  tagBestseller: boolean;
  originMaterial: string;
  originMaker: string;
  originArrival: string;
  care: string;
  sustainability: string;
};

const emptyForm: FormState = {
  name: "",
  category: "Outerwear",
  price: "",
  material: "",
  description: "",
  image1: "",
  image2: "",
  image3: "",
  stock: "0",
  tagNew: true,
  tagBestseller: false,
  originMaterial: "",
  originMaker: "",
  originArrival: "3\u20135 days",
  care: "",
  sustainability: "",
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category,
    price: String(p.price),
    material: p.material,
    description: p.description,
    image1: p.images[0] ?? "",
    image2: p.images[1] ?? "",
    image3: p.images[2] ?? "",
    stock: String(p.stock),
    tagNew: p.tags.includes("New"),
    tagBestseller: p.tags.includes("Bestseller"),
    originMaterial: p.origin.material,
    originMaker: p.origin.maker,
    originArrival: p.origin.arrival,
    care: p.care,
    sustainability: p.sustainability,
  };
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const products = useProductsStore((s) => s.products);
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const showToast = useUIStore((s) => s.showToast);

  const existing = isEdit ? products.find((p) => p.id === Number(id)) : undefined;
  const [form, setForm] = useState<FormState>(existing ? productToForm(existing) : emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isEdit && !existing) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 font-display text-2xl text-ink-dim">Product not found.</p>
        <Link to="/admin/products" className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink">
          Back to Products
        </Link>
      </div>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter a product name";
    if (!form.price.trim() || Number(form.price) <= 0) next.price = "Enter a valid price";
    if (!form.material.trim()) next.material = "Enter the material";
    if (!form.description.trim()) next.description = "Enter a description";
    if (!form.image1.trim()) next.image1 = "At least one image URL is required";
    if (!form.stock.trim() || Number(form.stock) < 0) next.stock = "Enter a valid stock count";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags: string[] = [];
    if (form.tagNew) tags.push("New");
    if (form.tagBestseller) tags.push("Bestseller");

    const images = [form.image1, form.image2, form.image3].map((i) => i.trim()).filter(Boolean);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      material: form.material.trim(),
      description: form.description.trim(),
      images,
      stock: Number(form.stock),
      tags,
      origin: { material: form.originMaterial.trim(), maker: form.originMaker.trim(), arrival: form.originArrival.trim() },
      care: form.care.trim(),
      sustainability: form.sustainability.trim(),
    };

    if (isEdit && existing) {
      updateProduct(existing.id, payload);
      showToast(`${payload.name} updated`);
      navigate("/admin/products");
    } else {
      const created = addProduct({ ...payload, rating: 0, reviewCount: 0, reviews: [] });
      showToast(`${created.name} added to the catalog`);
      navigate("/admin/products");
    }
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-ink-dim hover:text-ink">
        <ArrowLeft size={14} /> Back to Products
      </Link>

      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
      <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Product Name" span2 value={form.name} onChange={(v) => set("name", v)} required error={errors.name} />

        <label className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-ink-dim">Category</span>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className="border border-line bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:border-indigo-glow"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-void">{c}</option>
            ))}
          </select>
        </label>

        <FormField label="Price (INR)" value={form.price} onChange={(v) => set("price", v)} required mono error={errors.price} />
        <FormField label="Material" span2 value={form.material} onChange={(v) => set("material", v)} required error={errors.material} />

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-ink-dim">
            Description <span className="text-flame">*</span>
          </span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={`border bg-transparent px-4 py-3 text-sm text-ink focus:outline-none ${errors.description ? "border-flame" : "border-line focus:border-indigo-glow"}`}
          />
          {errors.description && <span className="text-[11px] text-flame">{errors.description}</span>}
        </label>

        <FormField label="Image URL 1" span2 value={form.image1} onChange={(v) => set("image1", v)} required error={errors.image1} />
        <FormField label="Image URL 2 (optional)" span2 value={form.image2} onChange={(v) => set("image2", v)} />
        <FormField label="Image URL 3 (optional)" span2 value={form.image3} onChange={(v) => set("image3", v)} />

        <FormField label="Stock Quantity" value={form.stock} onChange={(v) => set("stock", v)} required mono error={errors.stock} />

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-ink-dim">Tags</span>
          <div className="flex items-center gap-5 py-3">
            <label className="flex items-center gap-2 text-xs text-ink">
              <input type="checkbox" checked={form.tagNew} onChange={(e) => set("tagNew", e.target.checked)} className="h-4 w-4 border-line accent-indigo" />
              New
            </label>
            <label className="flex items-center gap-2 text-xs text-ink">
              <input type="checkbox" checked={form.tagBestseller} onChange={(e) => set("tagBestseller", e.target.checked)} className="h-4 w-4 border-line accent-indigo" />
              Bestseller
            </label>
          </div>
        </div>

        <div className="border-t border-line pt-5 sm:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Provenance</h2>
        </div>
        <FormField label="Material Origin" value={form.originMaterial} onChange={(v) => set("originMaterial", v)} placeholder="e.g. Beira, Portugal" />
        <FormField label="Maker / Workshop" value={form.originMaker} onChange={(v) => set("originMaker", v)} placeholder="e.g. Workshop 01, Lisbon" />
        <FormField label="Arrival Estimate" value={form.originArrival} onChange={(v) => set("originArrival", v)} placeholder="e.g. 3\u20135 days" />

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-ink-dim">Material &amp; Care</span>
          <textarea
            value={form.care}
            onChange={(e) => set("care", e.target.value)}
            rows={2}
            className="border border-line bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:border-indigo-glow"
          />
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-ink-dim">Sustainability Note</span>
          <textarea
            value={form.sustainability}
            onChange={(e) => set("sustainability", e.target.value)}
            rows={2}
            className="border border-line bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:border-indigo-glow"
          />
        </label>

        <div className="flex gap-4 sm:col-span-2">
          <button type="button" onClick={() => navigate("/admin/products")} className="flex-1 border border-line py-4 text-xs font-semibold uppercase tracking-widest text-ink hover:border-ink">
            Cancel
          </button>
          <button type="submit" className="flex-[2] bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
