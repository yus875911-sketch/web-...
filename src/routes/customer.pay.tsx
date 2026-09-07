import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wallet, CreditCard, Loader2 } from "lucide-react";
import { store, type Order } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/pay")({
  component: PayPage,
});

function PayPage() {
  const [draft] = useStoreValue(store.draft);
  const navigate = useNavigate();
  const [method, setMethod] = useState("wechat");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!draft) navigate({ to: "/customer" });
  }, [draft, navigate]);

  if (!draft) return null;

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      const order: Order = {
        id: store.newId(),
        customerName: draft.customerName ?? "匿名客户",
        phone: draft.phone ?? "",
        address: draft.address,
        region: draft.region,
        weight: draft.weight,
        volume: draft.volume,
        quotedWeight: draft.quotedWeight,
        amount: draft.amount,
        status: "已支付",
        createdAt: new Date().toISOString(),
      };
      store.setOrders([order, ...store.orders()]);
      store.setDraft({ ...draft });
      localStorage.setItem("lg_last_order", order.id);
      setPaying(false);
      navigate({ to: "/customer/success" });
    }, 1200);
  };

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-card p-6 text-center shadow-card">
        <p className="text-sm text-muted-foreground">支付金额</p>
        <p className="mt-2 text-4xl font-bold text-brand">¥{draft.amount.toFixed(2)}</p>
        <p className="mt-2 text-xs text-muted-foreground">顺捷物流 · 零担运费</p>
      </section>

      <section className="rounded-xl bg-card p-2 shadow-card">
        <PayOption
          active={method === "wechat"}
          onClick={() => setMethod("wechat")}
          icon={<Wallet className="h-5 w-5 text-brand" />}
          title="微信支付"
          desc="推荐使用，模拟支付"
        />
        <PayOption
          active={method === "card"}
          onClick={() => setMethod("card")}
          icon={<CreditCard className="h-5 w-5 text-paid" />}
          title="银行卡支付"
          desc="模拟支付通道"
        />
      </section>

      <button
        disabled={paying}
        onClick={pay}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-[15px] font-medium text-brand-foreground shadow-card disabled:opacity-70"
      >
        {paying && <Loader2 className="h-4 w-4 animate-spin" />}
        {paying ? "支付处理中…" : `确认支付 ¥${draft.amount.toFixed(2)}`}
      </button>
      <p className="px-1 text-xs text-muted-foreground">原型演示：不会产生真实扣款。</p>
    </div>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <span
        className={`h-4 w-4 shrink-0 rounded-full border ${
          active ? "border-brand bg-brand" : "border-black/20"
        }`}
      />
    </button>
  );
}
