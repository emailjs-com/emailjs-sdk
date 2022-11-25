# Official EmailJS SDK for Browsers

SDK for [EmailJS.com](https://www.emailjs.com) customers.
\
Use you EmailJS account for sending emails.

[![codecov](https://codecov.io/gh/emailjs-com/emailjs-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/emailjs-com/emailjs-sdk)
[![npm version](https://img.shields.io/npm/v/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)

## Disclaimer

This is a browser-only version, otherwise use
- [Node.js SDK](https://www.npmjs.com/package/@emailjs/nodejs)
- [Flutter SDK](https://pub.dev/packages/emailjs)
- [REST API](https://www.emailjs.com/docs/rest-api/send/)

## Links

[Official SDK Docs](https://www.emailjs.com/docs)

## Intro

EmailJS helps to send emails using client-side technologies only.
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
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js">
</script>
<script type="text/javascript">
  (function () {
    emailjs.init('<YOUR_PUBLIC_KEY>');
  })();
</script>
```

## Examples

**send email**

```js 
var templateParams = {
    name: 'James',
    notes: 'Check this out!'
};

emailjs.send('<YOUR_SERVICE_ID>','<YOUR_TEMPLATE_ID>', templateParams)
	.then(function(response) {
	   console.log('SUCCESS!', response.status, response.text);
	}, function(err) {
	   console.log('FAILED...', err);
	});
```

**send form**

```js 
emailjs.sendForm('<YOUR_SERVICE_ID>','<YOUR_TEMPLATE_ID>', '#myForm')
	.then(function(response) {
	   console.log('SUCCESS!', response.status, response.text);
	}, function(err) {
	   console.log('FAILED...', err);
	});
```

**Angular X / VueJS / ReactJS**

```js 
import emailjs from '@emailjs/browser';

const templateParams = {
    name: 'James',
    notes: 'Check this out!'
};

emailjs.send('<YOUR_SERVICE_ID>','<YOUR_TEMPLATE_ID>', templateParams, '<YOUR_PUBLIC_KEY>')
	.then((response) => {
	   console.log('SUCCESS!', response.status, response.text);
	}, (err) => {
	   console.log('FAILED...', err);
	});
```
