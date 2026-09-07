import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/result")({
  component: ResultPage,
});

function ResultPage() {
  const [draft] = useStoreValue(store.draft);
  const navigate = useNavigate();

  useEffect(() => {
    if (!draft) navigate({ to: "/customer" });
  }, [draft, navigate]);

  if (!draft) return null;

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-card p-6 text-center shadow-card">
        <p className="text-sm text-muted-foreground">预估运费</p>
        <p className="mt-2 text-4xl font-bold text-brand">
          ¥{draft.amount.toFixed(2)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          计费重量 {draft.quotedWeight}kg · {draft.region}
        </p>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-card">
        <Row label="目的地区" value={draft.region} />
        <Row label="收货地址" value={draft.address} />
        <Row label="实际重量" value={`${draft.weight} kg`} />
        <Row label="货物体积" value={`${draft.volume || 0} m³`} />
        <Row label="计费重量" value={`${draft.quotedWeight} kg`} />
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/customer"
          className="rounded-xl bg-card py-3 text-center text-[15px] text-foreground shadow-card"
        >
          重新报价
        </Link>
        <Link
          to="/customer/confirm"
          className="rounded-xl bg-brand py-3 text-center text-[15px] font-medium text-brand-foreground shadow-card"
        >
          立即下单
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}
