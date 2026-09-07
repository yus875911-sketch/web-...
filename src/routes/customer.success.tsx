import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const [orders] = useStoreValue(store.orders);
  const lastId = typeof window !== "undefined" ? localStorage.getItem("lg_last_order") : null;
  const order = orders.find((o) => o.id === lastId) ?? orders[0];

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-card px-4 py-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">支付成功</h2>
        <p className="mt-1 text-sm text-muted-foreground">我们将尽快安排上门取货</p>
        {order && (
          <p className="mt-4 text-2xl font-bold text-brand">¥{order.amount.toFixed(2)}</p>
        )}
      </section>

      {order && (
        <section className="rounded-xl bg-card p-4 shadow-card text-sm">
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">订单号</span>
            <span className="text-foreground">{order.id}</span>
          </div>
          <div className="flex justify-between gap-4 py-1.5">
            <span className="shrink-0 text-muted-foreground">收货地址</span>
            <span className="text-right text-foreground">{order.address}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">计费重量</span>
            <span className="text-foreground">{order.quotedWeight} kg</span>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/customer"
          className="rounded-xl bg-card py-3 text-center text-[15px] text-foreground shadow-card"
        >
          再寄一单
        </Link>
        <Link
          to="/customer/orders"
          className="rounded-xl bg-brand py-3 text-center text-[15px] font-medium text-brand-foreground shadow-card"
        >
          查看订单
        </Link>
      </div>
    </div>
  );
}
