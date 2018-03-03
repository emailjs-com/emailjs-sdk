# EMAILJS-COM

NodeJS library for [EmailJS.com](http://www.emailjs.com?src=npmjs) users.\
Use you EmailJS account for sending emails.

## Quick Start

Install it with NPM or add it to your package.json:

``` bash
$ npm install emailjs-com
```

Then:

``` js
var emailjs = require('emailjs-com');

```

## Documentation

Documentation is available at https://www.emailjs.com/docs

## Examples

__send email:__

``` js
var emailjs = require('emailjs-com');

emailjs.init(<YOUR EmailJS User ID>);

emailjs.send("<YOUR SERVICE ID>","<YOUR TEMPLATE ID>",{name: "James", notes: "Check this out!"})
	.then(function(response) {
	   console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
	}, function(err) {
	   console.log("FAILED. error=", err);
	});
```
\
\
__send with attachment:__

``` js
var emailjs = require('emailjs-com');

emailjs.init(<YOUR EmailJS User ID>);

var data = fs.readFileSync(<YOUR FILE PATH i.e. path.join(__dirname + "/test.jpg")>, {encoding: 'base64'});

emailjs.send("<YOUR SERVICE ID>","<YOUR TEMPLATE ID>",{filename: "test.jpg", attachment: data})
	.then(function(response) {
	   console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
	}, function(err) {
	   console.log("FAILED. error=", JSON.stringify(err));
	});
```

## License

[MIT](./LICENSE)