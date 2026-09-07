import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Info } from "lucide-react";
import { REGIONS, detectRegion, quote, store } from "@/lib/logistics";
import { useStoreValue } from "@/lib/use-store";

export const Route = createFileRoute("/customer/")({
  component: QuotePage,
});

function QuotePage() {
  const navigate = useNavigate();
  const [prices] = useStoreValue(store.prices);
  const [settings] = useStoreValue(store.settings);
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [error, setError] = useState("");

  const effectiveRegion = region || detectRegion(address) || "";

  const onSubmit = () => {
    setError("");
    if (!address.trim()) return setError("请填写收货地址");
    if (!effectiveRegion) return setError("暂不支持该地区，请联系客服");
    const w = Number(weight);
    const v = Number(volume || 0);
    if (!w || w <= 0) return setError("请填写有效的重量");

    const result = quote(effectiveRegion, w, v, prices, settings);
    if (!result.ok) return setError(result.message);

    store.setDraft({
      region: effectiveRegion,
      address,
      weight: w,
      volume: v,
      quotedWeight: result.quotedWeight,
      amount: result.amount,
    });
    navigate({ to: "/customer/result" });
  };

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-card p-4 shadow-card">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-brand" /> 收货地址
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="如：广东省深圳市南山区科技园南路 88 号"
          className="w-full resize-none rounded-lg bg-page px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-brand/30"
        />
        <div className="mt-3">
          <p className="mb-2 text-xs text-muted-foreground">目的地区（可手动选择）</p>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r === region ? "" : r)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  effectiveRegion === r
                    ? "bg-brand text-brand-foreground"
                    : "bg-page text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-card">
        <Field label="货物重量" unit="kg">
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputMode="decimal"
            placeholder="0.0"
            className="w-full bg-transparent text-right text-sm outline-none"
          />
        </Field>
        <div className="my-3 h-px bg-black/5" />
        <Field label="货物体积" unit="m³">
          <input
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            inputMode="decimal"
            placeholder="0.00"
            className="w-full bg-transparent text-right text-sm outline-none"
          />
        </Field>
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {settings.volumetric
            ? "已启用体积重：体积重 = 长×宽×高(cm)÷6000，即 1 m³ ≈ 166.7kg，计费重量取较大值。"
            : "当前按实际重量计费，体积仅作参考。"}
        </p>
      </section>

      {error && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
      )}

      <button
        onClick={onSubmit}
        className="w-full rounded-xl bg-brand py-3 text-[15px] font-medium text-brand-foreground shadow-card active:opacity-90"
      >
        立即报价
      </button>

      <p className="px-1 pt-1 text-xs text-muted-foreground">
        当前支持地区：{REGIONS.join("、")}，其他地区请联系客服。
      </p>
    </div>
  );
}

function Field({
  label,
  unit,
  children,
}: {
  label: string;
  unit: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-sm text-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
      <span className="shrink-0 text-sm text-muted-foreground">{unit}</span>
    </div>
  );
}
