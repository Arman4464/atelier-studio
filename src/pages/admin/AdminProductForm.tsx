import React, { useState } from "react";
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
  originArrival: "3–5 days",
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

export const AdminProductForm: React.FC = () => {
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
      <div className="py-12 text-center glass-card rounded-[28px] p-8">
        <p className="mb-4 font-display text-2xl text-[var(--ink-secondary)]">Garment not found in archive.</p>
        <Link to="/admin/products" className="glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
          Back to Catalogue
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
    <div className="max-w-3xl space-y-8">
      <Link
        to="/admin/products"
        className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
      >
        <ArrowLeft size={14} /> Back to Catalogue
      </Link>

      <div className="pb-6 border-b border-black/5 dark:border-white/10">
        <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Archive Registry
        </span>
        <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
          {isEdit ? "Edit Garment Specification" : "Index New Garment"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="glass-card rounded-[32px] p-8 sm:p-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Garment Title" span2 value={form.name} onChange={(v) => set("name", v)} required error={errors.name} />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className="glass-input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-void dark:bg-zinc-900">{c}</option>
            ))}
          </select>
        </div>

        <FormField label="Valuation ($)" value={form.price} onChange={(v) => set("price", v)} required mono error={errors.price} />
        <FormField label="Textile Composition" span2 value={form.material} onChange={(v) => set("material", v)} required error={errors.material} />

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">
            Editorial Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={`glass-input ${errors.description ? "border-rose-400" : ""}`}
          />
          {errors.description && <span className="text-[11px] text-rose-500 font-medium pl-1">{errors.description}</span>}
        </div>

        <FormField label="Primary Plate URL (Image 1)" span2 value={form.image1} onChange={(v) => set("image1", v)} required error={errors.image1} />
        <FormField label="Plate 2 URL (optional)" span2 value={form.image2} onChange={(v) => set("image2", v)} />
        <FormField label="Plate 3 URL (optional)" span2 value={form.image3} onChange={(v) => set("image3", v)} />

        <FormField label="Stock Allocation" value={form.stock} onChange={(v) => set("stock", v)} required mono error={errors.stock} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">Exhibition Badges</span>
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 text-xs text-[var(--ink-primary)] cursor-pointer">
              <input type="checkbox" checked={form.tagNew} onChange={(e) => set("tagNew", e.target.checked)} className="h-4 w-4 rounded-md border-black/10 dark:border-white/10 accent-purple-600" />
              New Release
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--ink-primary)] cursor-pointer">
              <input type="checkbox" checked={form.tagBestseller} onChange={(e) => set("tagBestseller", e.target.checked)} className="h-4 w-4 rounded-md border-black/10 dark:border-white/10 accent-purple-600" />
              Bestseller
            </label>
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/10 pt-5 sm:col-span-2">
          <h2 className="font-display text-xl font-light text-[var(--ink-primary)]">Material Provenance</h2>
        </div>
        <FormField label="Textile Origin" value={form.originMaterial} onChange={(v) => set("originMaterial", v)} placeholder="e.g. Biella, Italy" />
        <FormField label="Atelier / Workshop" value={form.originMaker} onChange={(v) => set("originMaker", v)} placeholder="e.g. Workshop 02, Florence" />
        <FormField label="Fulfillment Window" value={form.originArrival} onChange={(v) => set("originArrival", v)} placeholder="e.g. 3–5 days" />

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">Care Specifications</span>
          <textarea
            value={form.care}
            onChange={(e) => set("care", e.target.value)}
            rows={2}
            className="glass-input"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">Environmental &amp; Traceability Note</span>
          <textarea
            value={form.sustainability}
            onChange={(e) => set("sustainability", e.target.value)}
            rows={2}
            className="glass-input"
          />
        </div>

        <div className="flex gap-4 sm:col-span-2 pt-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="glass-pill flex-1 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-prism flex-[2] py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider"
          >
            {isEdit ? "Update Garment Specification" : "Commit to Archive"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
