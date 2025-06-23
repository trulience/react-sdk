# 🧩 `@trulience/react-sdk` — Local Development Guide

This package contains the Trulience React SDK component used to embed avatars in your React applications.

---

### 📦 1. Clone and Setup the SDK

```bash
git clone https://github.com/trulience/react-sdk.git
cd trulience-react-sdk

pnpm install
```

---

### 🛠️ 2. Build the SDK

Before linking, make sure the SDK is built and outputs both ESM and CJS modules:

```bash
pnpm build
pnpm run dev
```

> This should generate files inside the `dist/` folder such as `index.js`, `index.cjs`, and `index.d.ts`.

---

### 🔗 3. Link the SDK Globally

```bash
pnpm link --global
```

---

### 📥 4. Link the SDK in Your Consumer App

Go to your React app that will use the SDK:

```bash
cd ../your-react-app
pnpm link --global @trulience/react-sdk
```

---

### 🚀 5. Use the SDK

```tsx
import { TrulienceAvatar } from '@trulience/react-sdk';

function App() {
  return <TrulienceAvatar avatarId="AVATAR-ID" />;
}
```

---

### 📦 Publish Locally Without Linking

If linking causes issues (e.g., ESM/CJS mismatch), use `pnpm pack`:

```bash
pnpm pack
```

This creates a `.tgz` file. Then install it manually in your consumer app:

```bash
pnpm add ../trulience-react-sdk/trulience-react-sdk-1.0.0.tgz
```
