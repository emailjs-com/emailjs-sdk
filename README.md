# Official EmailJS SDK for Browsers
SDK for [EmailJS.com](https://www.emailjs.com) users.
\
Use you EmailJS account for sending emails.

[![codecov](https://codecov.io/gh/emailjs-com/emailjs-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/emailjs-com/emailjs-sdk)
[![npm version](https://img.shields.io/npm/v/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)

## Disclaimer
This is a browser-only version, otherwise use the [REST API](https://www.emailjs.com/docs/rest-api/send/).

## Links
* [Official SDK Docs](https://www.emailjs.com/docs)

## Intro
EmailJS helps sending emails using client side technologies only. No server is required – just connect EmailJS to one of the supported email services, create an email template, and use our Javascript library to trigger an email.

## Usage

Install EmailJS SDK using [npm](https://www.npmjs.com/):

``` bash
$ npm install @emailjs/browser
```

Or manually: 

``` html
<script type='text/javascript' src='https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'></script>
<script type='text/javascript'>
   (function(){
      emailjs.init('<YOUR USER ID>');
   })();
</script>
```

## Examples

__send email__

``` js
var templateParams = {
    name: 'James',
    notes: 'Check this out!'
};

emailjs.send('<YOUR SERVICE ID>','<YOUR TEMPLATE ID>', templateParams)
	.then(function(response) {
	   console.log('SUCCESS!', response.status, response.text);
	}, function(err) {
	   console.log('FAILED...', err);
	});
```

__send form__

``` js
emailjs.sendForm('<YOUR SERVICE ID>','<YOUR TEMPLATE ID>', '#myForm')
	.then(function(response) {
	   console.log('SUCCESS!', response.status, response.text);
	}, function(err) {
	   console.log('FAILED...', err);
	});
```

__Angular X / VueJS / ReactJS__
``` js
import emailjs from '@emailjs/browser';

const templateParams = {
    name: 'James',
    notes: 'Check this out!'
};

emailjs.send('<YOUR SERVICE ID>','<YOUR TEMPLATE ID>', templateParams, '<YOUR USER ID>')
	.then((response) => {
	   console.log('SUCCESS!', response.status, response.text);
	}, (err) => {
	   console.log('FAILED...', err);
	});
```
