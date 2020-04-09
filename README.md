# MPA template

## install

```bash
$ npm install / yarn
```

## dev

```bash
$ npm run start / yarn start
```

## build

```bash
$ npm run build / yarn build
```

## router rule.

`src/pages/index` -> `localhost:7001/`

`src/pages/about` -> `localhost:7001/about.html`

`src/pages/dashboard` -> `localhost:7001/dashboard.html`

...


## html assets include (as a module)

```html
<img src="${require('./images/logo.png').default}" />
```

## static include (file in /static)

```html
<script src="./static/jquery.js"></script>
```

## include common htmltpl (use raw-loader)

```html
<head>
  ${require('raw-loader!./meta.html')}
</head>
```