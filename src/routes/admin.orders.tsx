import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { fmtDate, statusColor, store, type Order, type OrderStatus } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const FILTERS: (OrderStatus | "全部")[] = ["全部", "已支付", "已补单号", "已完成"];

function AdminOrders() {
  const [orders] = useStoreValue(store.orders);
  const [filter, setFilter] = useState<OrderStatus | "全部">("全部");
  const [editing, setEditing] = useState<Order | null>(null);
  const [tracking, setTracking] = useState("");

  const list = orders.filter((o) => filter === "全部" || o.status === filter);

  const save = () => {
    if (!editing || !tracking.trim()) return;
    store.setOrders(
      store
        .orders()
        .map((o) =>
          o.id === editing.id
            ? { ...o, trackingNo: tracking.trim(), status: "已补单号" as OrderStatus }
            : o,
        ),
    );
    setEditing(null);
    setTracking("");
  };

  const complete = (id: string) => {
    store.setOrders(
      store.orders().map((o) => (o.id === id ? { ...o, status: "已完成" as OrderStatus } : o)),
    );
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">订单管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">查看订单、补录运单号并更新状态</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              filter === f ? "bg-brand text-brand-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="overflow-x-auto rounded-xl bg-card p-5 shadow-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="pb-2 font-normal">订单号</th>
              <th className="pb-2 font-normal">客户 / 电话</th>
              <th className="pb-2 font-normal">收货地址</th>
              <th className="pb-2 font-normal">计费重量</th>
              <th className="pb-2 font-normal">金额</th>
              <th className="pb-2 font-normal">状态</th>
              <th className="pb-2 font-normal">运单号</th>
              <th className="pb-2 font-normal">时间</th>
              <th className="pb-2 font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-black/5 align-top">
                <td className="py-3 text-foreground">{o.id}</td>
                <td className="py-3 text-muted-foreground">
                  {o.customerName}
                  <br />
                  {o.phone}
                </td>
                <td className="max-w-[220px] py-3 text-muted-foreground">{o.address}</td>
                <td className="py-3 text-muted-foreground">{o.quotedWeight}kg</td>
                <td className="py-3 font-semibold text-brand">¥{o.amount.toFixed(2)}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">{o.trackingNo ?? "—"}</td>
                <td className="py-3 text-muted-foreground">{fmtDate(o.createdAt)}</td>
                <td className="space-x-3 whitespace-nowrap py-3">
                  <button
                    onClick={() => {
                      setEditing(o);
                      setTracking(o.trackingNo ?? "");
                    }}
                    className="text-brand"
                  >
                    补录单号
                  </button>
                  {o.status !== "已完成" && (
                    <button onClick={() => complete(o.id)} className="text-paid">
                      标记完成
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">暂无订单</p>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-5 shadow-card">
            <h2 className="text-base font-semibold text-foreground">补录运单号</h2>
            <p className="mt-1 text-xs text-muted-foreground">订单 {editing.id}</p>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="请输入承运商运单号"
              className="mt-4 w-full rounded-lg bg-page px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg px-4 py-2 text-sm text-muted-foreground"
              >
                取消
              </button>
              <button
                onClick={save}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
