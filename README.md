# 项目背景 为一家国内零担物流公司做一个 物流报价下单 的 Web 可交互原型 业务 客户输入收货地址 重量 体积后 系统根据 地区 公斤段 价格表自动报价 客户满意即可下单 模拟支付...

# 项目背景

为一家国内零担物流公司做一个"物流报价下单"的 Web 可交互原型。

业务：客户输入收货地址、重量、体积后，系统根据"地区 × 公斤段"价格表自动报价，客户满意即可下单（模拟支付）。同时提供管理后台：维护价格表、查看订单、补录运单号。

# 总体要求

- 技术栈：React + Tailwind CSS + TypeScript；原型阶段全部用前端本地状态 / localStorage 模拟数据，不接真实后端、不接支付 SDK。

- 界面语言：全部简体中文。

- 两个部分，用路由区分：

  1. 客户报价下单端（路径 /customer）：移动端优先、微信小程序风格，窄屏布局，底部 Tab 导航，页面最大宽度 480px 居中模拟手机。

  2. 管理后台（路径 /admin）：桌面端，左侧边栏导航，表格为主。

- 首页 / 提供演示入口：两个大卡片"进入客户小程序"与"进入管理后台"。

# 设计规范

- 风格：简洁现代的微信小程序风格。页面背景浅灰 #F5F6F7，内容用白色卡片、圆角 12px、轻阴影、无重边框。

- 主色：微信绿 #07C160（价格、按钮、选中态使用）；状态色：橙 #F59E0B（待处理）、蓝 #3B82F6（已支付）、绿 #10B981（已完成）、红 #EF4444（警示/取消）。

- 金额类信息用主色、加粗、大字号展示；重要提示文案简洁克制。

- 字体：系统默认字体栈（PingFang SC / 微软雅黑）。

# 示例数据（原型用，后台可改）

- 价格表按"地区 ×（公斤段基础价 + 续重单价）"组织，seed 以下示例（元）：

  广东省：0-1kg 6，1-3kg 8，3-5kg 12，5-10kg 18，10kg以上 续重每kg +1.5

  江浙沪：0-1kg 5，1-3kg 7，3-5kg 10，5-10kg 15，10kg以上 续重每kg +1.2

  新疆：0-1kg 15，1-3kg 22，3-5kg 35，5-10kg 55，10kg以上 续重每kg +6

- 计价规则：按重量所在公斤段取"基础价"，超出上限部分按"续重单价"逐公斤累加。

  示例：广东 12kg = 18（5-10kg 段基础价）+ 2 × 1.5 = 21 元。

- 管理后台提供"体积重"开关（默认关）：开启后 体积重 = 长(cm)×宽×高÷6000，计费重量取 max(实际重量, 体积重)。体积按立方米输入，界面给出换算提示即可。

- 订单 seed 4 条：覆盖"已支付 / 已补单号 / 已完成"三种状态。

- 未被价格表覆盖的地区，报价时提示"暂不支持该地区，请联系客服"。示例中可覆盖：广东省、江浙沪、新疆。

# 数据模型（前端 mock，存 localStorage）

- RegionPrice: { id, region, bracketMin, bracketMax, basePrice, extraPerKg }

- Order: { id, customerName, phone, address, weight, volume, quotedWeight, amount, status: "已支付"|"已补单号"|"已完成", trackingNo?, createdAt }

# 总体页面清单（先搭框架，后续逐屏细化）

- 客户端：报价首页（地址+重量/体积输入）、报价结果页、下单确认页、模拟支付页、支付成功页、我的订单列表、订单详情。

- 管理端：概览、订单管理（补录运单号）、价格管理（增删改价格表）、设置（体积重开关、保价规则占位）。

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2fb02547-0e63-4f39-bd9e-241e888ca439).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
