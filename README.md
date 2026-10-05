# Official EmailJS SDK for Web Browsers

The official client-side TypeScript and JavaScript SDK for [EmailJS.com](https://emailjs.com) customers.

Send emails directly from your code in the simplest and most secure way.

[![codecov](https://codecov.io/gh/emailjs-com/emailjs-sdk/branch/main/graph/badge.svg?token=4I0L59Z914)](https://codecov.io/gh/emailjs-com/emailjs-sdk)
[![npm version](https://img.shields.io/npm/v/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)

- **100% Code Coverage:** Every single line of code, condition, and error handler in this SDK is
  fully covered by automated test suites to ensure absolute production readiness and zero regression issues.
- **Zero External Dependencies:** Built with zero overhead to keep your bundle footprint as lightweight as possible.

## Target Environment Notice

This package is designed exclusively for web browsers and client-side web environments. If you are building for
a different platform, please use the corresponding dedicated SDK:

- [Node.js](https://www.npmjs.com/package/@emailjs/nodejs)
- [React Native](https://www.npmjs.com/package/@emailjs/react-native)
- [Flutter](https://pub.dev/packages/emailjs)
- [REST API](https://www.emailjs.com/docs/rest-api/send/)

## Why EmailJS?

### What is EmailJS?

EmailJS is an **Email Orchestration Layer** and a **Unified API hub**. We do not operate our own email delivery servers;
instead, we sit on top of your existing infrastructure.

You connect your preferred email services—whether it’s a personal Gmail account, a standard SMTP server, or
enterprise transactional providers like SendGrid, Resend, Mailgun, or AWS SES.

### Core Architectural Benefits

- **Instant Provider Hot-Swapping:** If your primary delivery service suffers an outage or an unexpected account block, your application remains online. With EmailJS, you can instantly route your production traffic to a fallback provider (e.g., from SendGrid to AWS SES) with a single click in your dashboard—requiring **zero code adjustments and zero re-deployments**. You can also route dynamically on the fly by passing a different `serviceID` directly in your API request.
- **Bypass the "Migration Tax":** If you ever need to change your email provider, you don't have to rewrite your integration logic, recreate HTML templates, or re-map variables. Integrate EmailJS once, and change underlying providers seamlessly.
- **Zero Backend Overhead:** Eliminate the need to build, maintain, and secure a custom backend service or proxy just to safely route outgoing emails.
- **Universal Ecosystem Support:** Works seamlessly across any stack. Use our official client/server SDKs—or connect any application on any platform using our universal REST API with Rust, Python, PHP, C#, Go, or any other language.

## Installation and Setup

### Modern Bundlers (Vite, Next.js, Webpack, Rollup)

Install the SDK using your preferred package manager:

```bash
npm install @emailjs/browser
# yarn add @emailjs/browser
# pnpm add @emailjs/browser
# bun add @emailjs/browser
```

### Browser Direct Script Integration (CDN)

For applications without a build step, websites running on CMS platforms (like WordPress, Webflow, Shopify),
or vanilla JavaScript environments, add the SDK directly via CDN:

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@5/dist/email.min.js"
></script>
```

## Code Examples

### 1. Modern Async/Await Workflow

Designed for components in React, Vue, Angular, Svelte, Next.js, Nuxt, etc.

```typescript
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

const templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

try {
  const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
    publicKey: 'YOUR_PUBLIC_KEY',
  });
  console.log('SUCCESS!', response.status, response.text);
} catch (error) {
  if (error instanceof EmailJSResponseStatus) {
    console.error('EmailJS Error:', error.status, error.text);
    return;
  }
  console.error('Unexpected Error:', error);
}
```

### 2. Form Submission (sendForm)

Automatically captures input fields from an HTML form element and delivers the payload securely.

```javascript
import emailjs from '@emailjs/browser';

emailjs
  .sendForm(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    document.querySelector('#myForm'), // Can be a direct form reference (preferred), or a string selector
    {
      publicKey: 'YOUR_PUBLIC_KEY',
    },
  )
  .then((response) => {
    console.log('SUCCESS!', response.status, response.text);
  })
  .catch((error) => {
    console.error('FAILED...', error);
  });
```

### 3. Vanilla JavaScript Website Integration Example

If you are loading the SDK via a `<script>` tag on a standard layout.

```html
<button id="sendBtn">Send Email</button>

<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@5/dist/email.min.js"
></script>
<script type="text/javascript">
  document.getElementById('sendBtn').addEventListener('click', function () {
    const templateParams = {
      name: 'James',
      message: 'Hello from vanilla JS!',
    };

    emailjs
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
        publicKey: 'YOUR_PUBLIC_KEY',
      })
      .then(
        function (response) {
          console.log('SUCCESS!', response.status, response.text);
        },
        function (error) {
          console.log('FAILED...', error);
        },
      );
  });
</script>
```

## Advanced Configuration

Options can be defined globally using the `init()` method or overridden locally as the fourth parameter of execution
functions (`send`, `sendForm`). Local options take higher priority over global configurations.

### Main Options

| Property          | Type              | Default | Description                                                                                                  |
| :---------------- | :---------------- | :------ | :----------------------------------------------------------------------------------------------------------- |
| `publicKey`       | `string`          | —       | Required. Your EmailJS account public credential.                                                            |
| `blockHeadless`   | `boolean`         | `false` | When true, automatically rejects execution with error 451 if the request originates from a headless browser. |
| `blockList`       | `BlockList`       | —       | Settings to evaluate and drop requests matching forbidden values.                                            |
| `limitRate`       | `LimitRate`       | —       | Throttling and rate-limiting rules.                                                                          |
| `storageProvider` | `StorageProvider` | —       | Custom key-value storage engine interface.                                                                   |

### BlockList Settings

Drops any method calls if a tracked variable contains or matches blocked strings. Returns error 403 when triggered.

| Property        | Type       | Description                                                         |
| :-------------- | :--------- | :------------------------------------------------------------------ |
| `list`          | `string[]` | Array of forbidden string terms or target values to block.          |
| `watchVariable` | `string`   | The object key or variable path name inside the payload to monitor. |

### LimitRate Settings

Enforces request rate limiting. Returns error 429 when limits are exceeded.

| Property   | Type     | Default     | Description                                                                            |
| :--------- | :------- | :---------- | :------------------------------------------------------------------------------------- |
| `id`       | `string` | `page path` | Scope identifier. Can be overridden with a custom ID per user, page, group, or system. |
| `throttle` | `number` | —           | Minimum time gap (in milliseconds) required between consecutive requests.              |

### Custom Storage Provider Interface

By default, the SDK uses native `localStorage` if available. You can supply a custom async engine matching the following contract:

```typescript
interface StorageProvider {
  get: (key: string) => Promise<string | null | undefined>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}
```

## Configuration Code Examples

### Setting Global Security and Rate Limits

```javascript
import emailjs from '@emailjs/browser';

emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  blockHeadless: true,
  blockList: {
    watchVariable: 'user_email',
    list: ['spam@malicious.com', 'bot@attack.com'],
  },
  limitRate: {
    throttle: 10000, // 10 seconds cooldown window
  },
});
```

### Overriding Settings Locally

```javascript
import emailjs from '@emailjs/browser';

const payload = {
  userEmail: 'vip@example.com',
  message: 'Hello!',
};

await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', payload, {
  publicKey: 'YOUR_PUBLIC_KEY',
  blockList: {
    watchVariable: 'userEmail', // Custom path evaluation for this request
  },
  limitRate: {
    throttle: 0, // Bypass global rate-limiting rules for this specific call
  },
});
```

## Useful Links

- [Official SDK Documentation](https://emailjs.com/docs)
- [EmailJS Dashboard](https://emailjs.com)
