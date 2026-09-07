import { createFileRoute, Link } from "@tanstack/react-router";
import { Smartphone, LayoutDashboard, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "顺捷物流 · 零担报价下单原型" },
      {
        name: "description",
        content: "零担物流报价下单交互原型：客户端在线报价、下单支付，管理后台维护价格表与订单。",
      },
      { property: "og:title", content: "顺捷物流 · 零担报价下单原型" },
      {
        property: "og:description",
        content: "客户端在线报价下单，管理后台维护地区公斤段价格表与运单号。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-page px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-brand">顺捷物流 · 交互原型</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          零担物流报价下单系统
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          按「地区 × 公斤段」自动报价，客户在线下单并模拟支付；管理后台维护价格表、查看订单、补录运单号。
          原型数据保存在浏览器本地。
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <DemoCard
            to="/customer"
            icon={<Smartphone className="h-6 w-6" />}
            title="进入客户小程序"
            desc="移动端报价、下单、模拟支付与订单查询"
          />
          <DemoCard
            to="/admin"
            icon={<LayoutDashboard className="h-6 w-6" />}
            title="进入管理后台"
            desc="概览、订单管理、价格管理与系统设置"
          />
        </div>
      </div>
    </main>
  );
}

function DemoCard({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-xl bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
        立即体验 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
