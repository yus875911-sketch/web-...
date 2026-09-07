import { createFileRoute, Link } from "@tanstack/react-router";
import { fmtDate, statusColor, store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/order/$id")({
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const [orders] = useStoreValue(store.orders);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        未找到该订单
        <div className="mt-4">
          <Link to="/customer/orders" className="text-brand">
            返回订单列表
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "已支付", done: true },
    { label: "已补单号", done: order.status !== "已支付" },
    { label: "已完成", done: order.status === "已完成" },
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[order.status]}`}>
            {order.status}
          </span>
          <span className="text-2xl font-bold text-brand">¥{order.amount.toFixed(2)}</span>
        </div>
        <div className="mt-5 flex items-center">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${s.done ? "bg-brand" : "bg-black/15"}`}
                />
                <span
                  className={`mt-1.5 text-[11px] ${s.done ? "text-brand" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1 -mt-4 h-0.5 flex-1 ${
                    steps[i + 1]!.done ? "bg-brand" : "bg-black/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-card">
        <Row label="订单号" value={order.id} />
        <Row label="运单号" value={order.trackingNo ?? "待补录"} />
        <Row label="下单时间" value={fmtDate(order.createdAt)} />
      </section>

      <section className="rounded-xl bg-card p-4 shadow-card">
        <Row label="寄件人" value={`${order.customerName} ${order.phone}`} />
        <Row label="收货地址" value={order.address} />
        <Row label="目的地区" value={order.region} />
        <Row label="重量 / 体积" value={`${order.weight}kg / ${order.volume || 0}m³`} />
        <Row label="计费重量" value={`${order.quotedWeight}kg`} />
      </section>
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
