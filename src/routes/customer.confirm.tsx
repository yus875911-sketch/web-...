import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/confirm")({
  component: ConfirmPage,
});

function ConfirmPage() {
  const [draft] = useStoreValue(store.draft);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!draft) navigate({ to: "/customer" });
  }, [draft, navigate]);

  if (!draft) return null;

  const submit = () => {
    if (!name.trim()) return setError("请填写寄件人姓名");
    if (!/^1\d{10}$/.test(phone)) return setError("请填写有效的手机号");
    store.setDraft({ ...draft, customerName: name, phone });
    navigate({ to: "/customer/pay" });
  };

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-medium text-foreground">寄件人信息</h2>
        <Input label="姓名" value={name} onChange={setName} placeholder="请输入姓名" />
        <div className="my-3 h-px bg-black/5" />
        <Input label="手机号" value={phone} onChange={setPhone} placeholder="11 位手机号" />
      </section>

      <section className="rounded-xl bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-medium text-foreground">货物信息</h2>
        <Row label="收货地址" value={draft.address} />
        <Row label="目的地区" value={draft.region} />
        <Row label="重量 / 体积" value={`${draft.weight}kg / ${draft.volume || 0}m³`} />
        <Row label="计费重量" value={`${draft.quotedWeight}kg`} />
      </section>

      {error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

      <div className="flex items-center justify-between rounded-xl bg-card p-4 shadow-card">
        <span className="text-sm text-muted-foreground">应付金额</span>
        <span className="text-2xl font-bold text-brand">¥{draft.amount.toFixed(2)}</span>
      </div>

      <button
        onClick={submit}
        className="w-full rounded-xl bg-brand py-3 text-[15px] font-medium text-brand-foreground shadow-card active:opacity-90"
      >
        提交订单并支付
      </button>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-sm text-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}
