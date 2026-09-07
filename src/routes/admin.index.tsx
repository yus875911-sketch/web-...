import { createFileRoute } from "@tanstack/react-router";
import { Package, Wallet, Truck, Tags } from "lucide-react";
import { fmtDate, statusColor, store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [orders] = useStoreValue(store.orders);
  const [prices] = useStoreValue(store.prices);

  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const pending = orders.filter((o) => o.status === "已支付").length;
  const regions = new Set(prices.map((p) => p.region)).size;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground">概览</h1>
        <p className="mt-1 text-sm text-muted-foreground">近期经营数据一览</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Package className="h-5 w-5" />} label="订单总数" value={String(orders.length)} />
        <Stat icon={<Wallet className="h-5 w-5" />} label="累计金额" value={`¥${revenue.toFixed(2)}`} highlight />
        <Stat icon={<Truck className="h-5 w-5" />} label="待补运单号" value={String(pending)} />
        <Stat icon={<Tags className="h-5 w-5" />} label="覆盖地区" value={String(regions)} />
      </div>

      <section className="rounded-xl bg-card p-5 shadow-card">
        <h2 className="mb-4 text-sm font-medium text-foreground">最近订单</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2 font-normal">订单号</th>
                <th className="pb-2 font-normal">客户</th>
                <th className="pb-2 font-normal">地区</th>
                <th className="pb-2 font-normal">金额</th>
                <th className="pb-2 font-normal">状态</th>
                <th className="pb-2 font-normal">时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t border-black/5">
                  <td className="py-2.5 text-foreground">{o.id}</td>
                  <td className="py-2.5 text-muted-foreground">{o.customerName}</td>
                  <td className="py-2.5 text-muted-foreground">{o.region}</td>
                  <td className="py-2.5 font-semibold text-brand">¥{o.amount.toFixed(2)}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p
        className={`mt-3 text-2xl font-bold ${highlight ? "text-brand" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}
