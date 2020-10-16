# rubik-contesta
Esputnik's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-contesta
```

### yarn
```bash
yarn add rubik-esputnik
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const Contesta = require('rubik-esputnik');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const contesta = new Contesta();

app.add([ config, contesta ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`Contesta.js` config example

module.exports = {
  host: 'https://consenta.ru',
  login: 'login',
  password: 'password',
  supplierId: 'supplierId'
};

```

## Call

```js
...
const response = await app.contesta.makeReq({ path: 'account/info' });
...
const createResponse = await app.contesta.addContact({
  contacts: [{
    channels: [{
      type: 'email',
      value: 'example@example.com',
    }],
    fields: {
      test: 'test',
      gender: 'м',
      birthday: '1990-10-10'
    }
  }]
});
````

## Extensions
Contesta kubik doesn't has any extension.
