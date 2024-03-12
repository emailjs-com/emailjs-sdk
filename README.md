# Official EmailJS SDK for Browsers

SDK for [EmailJS.com](https://www.emailjs.com) customers.
\
Use your EmailJS account for sending emails.

[![codecov](https://codecov.io/gh/emailjs-com/emailjs-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/emailjs-com/emailjs-sdk)
[![npm version](https://img.shields.io/npm/v/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)

## Disclaimer

This is a browser platform, otherwise use

- [Node.js](https://www.npmjs.com/package/@emailjs/nodejs)
- [React Native](https://www.npmjs.com/package/@emailjs/react-native)
- [Flutter](https://pub.dev/packages/emailjs)
- [REST API](https://www.emailjs.com/docs/rest-api/send/)

## Links

[Official SDK Docs](https://www.emailjs.com/docs)

## Intro

EmailJS helps you send emails directly from code with one command.
No server is required – just connect EmailJS to one of the supported
email services, create an email template, and use our SDK
to trigger an email.

## Usage

Install EmailJS SDK using [npm](https://www.npmjs.com/):

```bash
$ npm install @emailjs/browser
```

Or manually:

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
</script>
<script type="text/javascript">
  (function () {
    emailjs.init({
      publicKey: 'YOUR_PUBLIC_KEY',
    });
  })();
</script>
```

## Examples

**Send the email using the customized send method**

```js
var templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams).then(
  function (response) {
    console.log('SUCCESS!', response.status, response.text);
  },
  function (err) {
    console.log('FAILED...', err);
  },
);
```

**Send the email from a form using the sendForm method**

```js
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#myForm').then(
  function (response) {
    console.log('SUCCESS!', response.status, response.text);
  },
  function (err) {
    console.log('FAILED...', err);
  },
);
```

**Using Angular / VueJS / ReactJS / Svelte / any other modern framework**

```js
import emailjs from '@emailjs/browser';

const templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

emailjs
  .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
    publicKey: 'YOUR_PUBLIC_KEY',
  })
  .then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    },
  );
```

**await/async with EmailJS error handler**

```js
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

try {
  await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    {},
    {
      publicKey: 'YOUR_PUBLIC_KEY',
    },
  );
  console.log('SUCCESS!');
} catch (err) {
  if (err instanceof EmailJSResponseStatus) {
    console.log('EMAILJS FAILED...', err);
    return;
  }

  console.log('ERROR', err);
}
```

## Configuration

**Options**

Options can be declared globally using the **init** method or locally as the fourth parameter of a function.
\
The local parameter will have higher priority than the global one.

| Name            | Type            | Default | Description                                              |
| --------------- | --------------- | ------- | -------------------------------------------------------- |
| publicKey       | String          |         | The public key is required to invoke the method.         |
| blockHeadless   | Boolean         | False   | Method will return error 451 if the browser is headless. |
| blockList       | BlockList       |         | Block list settings.                                     |
| limitRate       | LimitRate       |         | Limit rate configuration.                                |
| storageProvider | StorageProvider |         | Provider for a custom key-value storage.                 |

**BlockList**

Allows to ignore a method call if the watched variable contains a value from the block list.
\
The method will return the error 403 if the request is blocked.

| Name          | Type     | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| list          | String[] | The array of strings contains values for blocking. |
| watchVariable | String   | A name of the variable to be watched.              |

**LimitRate**

Allows to set the limit rate for calling a method.
\
If the request hits the limit rate, the method will return the error 429.

| Name     | Type   | Default   | Description                                                                                                                              |
| -------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| id       | String | page path | The limit rate is per page by default. To override the behavior, set the ID. It can be a custom ID for each page, group, or application. |
| throttle | Number |           | _(ms)_ After how many milliseconds a next request is allowed.                                                                            |

**StorageProvider**

Allows to provide a custom key value storage. By default, localStorage is used if available.
\
The custom provider must match the interface.

```ts
interface StorageProvider {
  get: (key: string) => Promise<string | null | undefined>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}
```

**Declare global settings**

```js
import emailjs from '@emailjs/browser';

emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  blockHeadless: true,
  blockList: {
    list: ['foo@emailjs.com', 'bar@emailjs.com'],
  },
  limitRate: {
    throttle: 10000, // 10s
  },
});
```

**Overwrite settings locally**

```js
import emailjs from '@emailjs/browser';

const templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

emailjs
  .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
    publicKey: 'YOUR_PUBLIC_KEY',
    blockList: {
      watchVariable: 'userEmail',
    },
    limitRate: {
      throttle: 0, // turn off the limit rate for these requests
    },
  })
  .then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    },
  );
```
