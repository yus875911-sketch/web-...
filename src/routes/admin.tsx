import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { LayoutDashboard, Package, Tags, Settings, Truck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "管理后台 · 顺捷物流" },
      { name: "description", content: "维护地区公斤段价格表、查看订单并补录运单号。" },
      { property: "og:title", content: "管理后台 · 顺捷物流" },
      { property: "og:description", content: "维护价格表、查看订单并补录运单号。" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "概览", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "订单管理", icon: Package },
  { to: "/admin/prices", label: "价格管理", icon: Tags },
  { to: "/admin/settings", label: "设置", icon: Settings },
] as const;

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-page">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-black/5 bg-card md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Truck className="h-5 w-5 text-brand" />
          <span className="font-semibold text-foreground">顺捷物流后台</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: "exact" in n }}
              activeProps={{ className: "bg-brand/10 text-brand" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-page" }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="px-5 py-4 text-xs text-muted-foreground hover:text-foreground">
          返回演示首页
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <nav className="flex gap-1 overflow-x-auto border-b border-black/5 bg-card px-3 py-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: "exact" in n }}
              activeProps={{ className: "bg-brand/10 text-brand" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
