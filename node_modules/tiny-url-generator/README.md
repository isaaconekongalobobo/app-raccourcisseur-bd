<!-- Write a readme file -->
# tiny-url-generator [![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/tiny-url-generator.svg?style=flat-square
[npm]: https://www.npmjs.com/package/tiny-url-generator

A simple URL shortener written in node.js using [tiny.piedevelopers.com](https://tiny.piedevelopers.com/) as the API.

## Installation

```bash
npm install tiny-url-generator
```

## Usage

```javascript
const ls = require('tiny-url-generator');

ls.generate({
  url: "https://piedevelopers.com",
  title: "PieDeveloper"
})
  .then((res) => {
    console.log("Response: ", res);
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
```

### sample output

```json
{
  "message": "OK",
  "status": true,
  "data": {
    "link": "https://tiny.piedevelopers.com/go/YnLg9Q",
    "title": "PieDeveloper",
    "timestamp": 1690042585,
    "expiry": 0,
    "isAnalyticsEnabled": 0
  }
}
```

## API Reference

### generate()

    Generates a short URL 

#### Parameters

* `title`<br/>
    The title of the URL.
* `url`<br/>
    The URL to shorten.
* `expiry` (optional)<br/>
    The expiry time of the URL. (0 = never)
* `analytics_password` (Optional)<br/>
    The password for the analytics page (optional). if not provided, analytics will be disabled.

#### Response

The response is a JSON object with the following properties:

* `link`<br/>
    The shortened URL.
* `title`<br/>
    The title of the URL.
* `expiry`<br/>
    The expiry time of the URL.
* `analytics_link`<br/>
    The URL to the analytics page (optional)

# Rate Limiting

The API has a rate limit of 40 requests per minute. If you exceed this limit, you will receive a 429 Too Many Requests response.

# Contributing

Pull requests are welcome. For major changes, please open an issue.

# License

[MIT](https://choosealicense.com/licenses/mit/)
