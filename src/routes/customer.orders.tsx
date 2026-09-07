import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { fmtDate, statusColor, store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders] = useStoreValue(store.orders);

  if (!orders.length) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        <PackageSearch className="mx-auto mb-3 h-10 w-10 opacity-40" />
        暂无订单
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link
          key={o.id}
          to="/customer/order/$id"
          params={{ id: o.id }}
          className="block rounded-xl bg-card p-4 shadow-card"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-xs text-muted-foreground">{o.id}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusColor[o.status]}`}>
              {o.status}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-foreground">{o.address}</p>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-xs text-muted-foreground">
              {o.quotedWeight}kg · {fmtDate(o.createdAt)}
            </span>
            <span className="text-lg font-bold text-brand">¥{o.amount.toFixed(2)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
