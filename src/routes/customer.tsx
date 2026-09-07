import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Calculator, ClipboardList, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/customer")({
  head: () => ({
    meta: [
      { title: "在线报价下单 · 顺捷物流" },
      { name: "description", content: "输入收货地址与重量体积，秒出零担运费报价并在线下单。" },
      { property: "og:title", content: "在线报价下单 · 顺捷物流" },
      { property: "og:description", content: "输入地址与重量体积，秒出运费报价并在线下单。" },
    ],
  }),
  component: CustomerLayout,
});

const TITLES: Record<string, string> = {
  "/customer": "运费报价",
  "/customer/result": "报价结果",
  "/customer/confirm": "确认下单",
  "/customer/pay": "收银台",
  "/customer/success": "支付成功",
  "/customer/orders": "我的订单",
};

function CustomerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "订单详情";
  const showBack = pathname !== "/customer" && pathname !== "/customer/orders";
  const tab = pathname.startsWith("/customer/order") ? "orders" : "quote";

  return (
    <div className="min-h-screen bg-neutral-200/60 py-0 sm:py-8">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-page shadow-card sm:min-h-[820px] sm:rounded-3xl sm:overflow-hidden">
        <header className="relative flex h-12 shrink-0 items-center justify-center border-b border-black/5 bg-card">
          {showBack ? (
            <button
              onClick={() => window.history.back()}
              className="absolute left-2 flex items-center p-1 text-muted-foreground"
              aria-label="返回"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <Link to="/" className="absolute left-3 text-xs text-muted-foreground">
              退出
            </Link>
          )}
          <span className="text-[15px] font-medium text-foreground">{title}</span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          <Outlet />
        </main>

        <nav className="sticky bottom-0 grid grid-cols-2 border-t border-black/5 bg-card">
          <TabItem to="/customer" active={tab === "quote"} icon={<Calculator className="h-5 w-5" />} label="报价" />
          <TabItem
            to="/customer/orders"
            active={tab === "orders"}
            icon={<ClipboardList className="h-5 w-5" />}
            label="我的订单"
          />
        </nav>
      </div>
    </div>
  );
}

function TabItem({
  to,
  active,
  icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
        active ? "text-brand" : "text-muted-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
