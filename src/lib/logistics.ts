export type OrderStatus = "已支付" | "已补单号" | "已完成";

export type RegionPrice = {
  id: string;
  region: string;
  bracketMin: number;
  bracketMax: number | null; // null = 无上限（续重段）
  basePrice: number;
  extraPerKg: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  region: string;
  weight: number;
  volume: number; // 立方米
  quotedWeight: number;
  amount: number;
  status: OrderStatus;
  trackingNo?: string;
  createdAt: string;
};

export type Settings = {
  volumetric: boolean; // 体积重开关
  insurance: boolean; // 保价规则占位
};

export const REGIONS = ["广东省", "江浙沪", "新疆"];

const KEY_PRICES = "lg_prices";
const KEY_ORDERS = "lg_orders";
const KEY_SETTINGS = "lg_settings";
const KEY_DRAFT = "lg_draft";

const rid = () => Math.random().toString(36).slice(2, 9);

function seedPrices(): RegionPrice[] {
  const table: [string, number[][], number][] = [
    ["广东省", [[0, 1, 6], [1, 3, 8], [3, 5, 12], [5, 10, 18]], 1.5],
    ["江浙沪", [[0, 1, 5], [1, 3, 7], [3, 5, 10], [5, 10, 15]], 1.2],
    ["新疆", [[0, 1, 15], [1, 3, 22], [3, 5, 35], [5, 10, 55]], 6],
  ];
  const rows: RegionPrice[] = [];
  for (const [region, brackets, extra] of table) {
    for (const [min, max, price] of brackets) {
      rows.push({
        id: rid(),
        region,
        bracketMin: min,
        bracketMax: max,
        basePrice: price,
        extraPerKg: 0,
      });
    }
    const last = brackets[brackets.length - 1];
    rows.push({
      id: rid(),
      region,
      bracketMin: 10,
      bracketMax: null,
      basePrice: last[2],
      extraPerKg: extra,
    });
  }
  return rows;
}

function seedOrders(): Order[] {
  const now = Date.now();
  const day = 86400000;
  return [
    {
      id: "LG20260901001",
      customerName: "张伟",
      phone: "13800138000",
      address: "广东省深圳市南山区科技园南路 88 号",
      region: "广东省",
      weight: 12,
      volume: 0.05,
      quotedWeight: 12,
      amount: 21,
      status: "已支付",
      createdAt: new Date(now - day * 1).toISOString(),
    },
    {
      id: "LG20260901002",
      customerName: "李娜",
      phone: "13900139001",
      address: "江浙沪上海市浦东新区世纪大道 100 号",
      region: "江浙沪",
      weight: 4.2,
      volume: 0.02,
      quotedWeight: 4.2,
      amount: 10,
      status: "已补单号",
      trackingNo: "SF1234567890",
      createdAt: new Date(now - day * 2).toISOString(),
    },
    {
      id: "LG20260901003",
      customerName: "王强",
      phone: "13700137002",
      address: "新疆乌鲁木齐市天山区人民路 20 号",
      region: "新疆",
      weight: 18,
      volume: 0.12,
      quotedWeight: 18,
      amount: 103,
      status: "已完成",
      trackingNo: "YT9988776655",
      createdAt: new Date(now - day * 5).toISOString(),
    },
    {
      id: "LG20260901004",
      customerName: "陈静",
      phone: "13600136003",
      address: "广东省广州市天河区天河北路 233 号",
      region: "广东省",
      weight: 2.5,
      volume: 0.01,
      quotedWeight: 2.5,
      amount: 8,
      status: "已完成",
      trackingNo: "JD5566778899",
      createdAt: new Date(now - day * 7).toISOString(),
    },
  ];
}

function read<T>(key: string, seed: () => T): T {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  const value = seed();
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("lg-store"));
}

export const store = {
  prices: () => read(KEY_PRICES, seedPrices),
  setPrices: (v: RegionPrice[]) => write(KEY_PRICES, v),
  orders: () => read(KEY_ORDERS, seedOrders),
  setOrders: (v: Order[]) => write(KEY_ORDERS, v),
  settings: () => read<Settings>(KEY_SETTINGS, () => ({ volumetric: false, insurance: false })),
  setSettings: (v: Settings) => write(KEY_SETTINGS, v),
  draft: () => read<Draft | null>(KEY_DRAFT, () => null),
  setDraft: (v: Draft | null) => write(KEY_DRAFT, v),
  newId: () =>
    "LG" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    Math.floor(100 + Math.random() * 900),
};

export type Draft = {
  region: string;
  address: string;
  weight: number;
  volume: number;
  quotedWeight: number;
  amount: number;
  customerName?: string;
  phone?: string;
};

export type QuoteResult =
  | { ok: true; amount: number; quotedWeight: number; volumetricWeight: number; detail: string }
  | { ok: false; message: string };

export function quote(
  region: string,
  weight: number,
  volumeM3: number,
  prices: RegionPrice[],
  settings: Settings,
): QuoteResult {
  const rows = prices
    .filter((p) => p.region === region)
    .sort((a, b) => a.bracketMin - b.bracketMin);
  if (!rows.length) return { ok: false, message: "暂不支持该地区，请联系客服" };

  // 体积重 = 体积(cm³) / 6000 = 立方米 × 1000000 / 6000
  const volumetricWeight = settings.volumetric ? (volumeM3 * 1000000) / 6000 : 0;
  const quotedWeight = Math.max(weight, volumetricWeight);
  if (!(quotedWeight > 0)) return { ok: false, message: "请填写有效的重量" };

  const row =
    rows.find(
      (r) =>
        quotedWeight > r.bracketMin &&
        (r.bracketMax === null || quotedWeight <= r.bracketMax),
    ) ??
    rows.find((r) => r.bracketMin === 0 && r.bracketMax !== null && quotedWeight <= r.bracketMax) ??
    rows[rows.length - 1];

  let amount = row.basePrice;
  let detail = `${row.bracketMin}-${row.bracketMax ?? "以上"}kg 基础价 ${row.basePrice} 元`;
  if (row.bracketMax === null && quotedWeight > row.bracketMin) {
    const extraKg = Math.ceil(quotedWeight - row.bracketMin);
    amount += extraKg * row.extraPerKg;
    detail += ` + 续重 ${extraKg}kg × ${row.extraPerKg} 元`;
  }
  amount = Math.round(amount * 100) / 100;
  return { ok: true, amount, quotedWeight: Math.round(quotedWeight * 100) / 100, volumetricWeight, detail };
}

export function detectRegion(address: string): string | null {
  if (!address.trim()) return null;
  if (/广东|深圳|广州|东莞|佛山|珠海/.test(address)) return "广东省";
  if (/江浙沪|上海|江苏|浙江|南京|杭州|苏州|宁波/.test(address)) return "江浙沪";
  if (/新疆|乌鲁木齐|喀什|伊犁/.test(address)) return "新疆";
  return null;
}

export const statusColor: Record<OrderStatus, string> = {
  已支付: "bg-paid/10 text-paid",
  已补单号: "bg-warn/10 text-warn",
  已完成: "bg-done/10 text-done",
};

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
