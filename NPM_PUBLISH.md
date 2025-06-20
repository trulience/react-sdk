# 📦 Publishing a Package to npm

Follow these steps to publish a package under the `@trulience` scope on npm.

## 🚀 Steps to Publish

### 1. Create an npm Account

If you don’t have an npm account already, create one here:
👉 [https://www.npmjs.com/signup](https://www.npmjs.com/signup)

### 2. Join the `@trulience` Organization

Ensure you are added as a member to the `@trulience` npm organization. You can request access from an existing admin if needed.

### 3. Log in to npm

Run the following command and enter your credentials:

```bash
npm login
```

### 4. Preview Before Publishing (Optional)

You can preview what files will be packed and published:

```bash
npm pack --dry-run
```

### 5. Publish the Package

To publish your package

```bash
npm publish --access public
```
