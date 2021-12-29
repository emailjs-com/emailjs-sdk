# Official EmailJS SDK for Browsers
SDK for [EmailJS.com](https://www.emailjs.com) users.
\
Use you EmailJS account for sending emails.

[![npm version](https://img.shields.io/npm/v/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)
[![npm dm](https://img.shields.io/npm/dm/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)
[![npm dt](https://img.shields.io/npm/dt/@emailjs/browser.svg)](https://www.npmjs.com/package/@emailjs/browser)
[![uptimerobot](https://img.shields.io/uptimerobot/ratio/m789941869-52f6a408a7db592327b0c201)](https://stats.uptimerobot.com/x5GYyHLRlo)

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
import emailjs from 'emailjs-com';

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
