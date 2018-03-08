# react-with-media
[![npm version](https://badge.fury.io/js/react-with-media.svg)](https://badge.fury.io/js/react-with-media)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

React HOC for watching media queries.

## Install
```
yarn add react-with-media
npm install --save react-with-media
```

## Usage
```typescript
const ShowMessage = withMedia('(max-width: 500px)')(({matches}) =>
  matches
    ? <span>Is mobile</span>
    : <span>Is desktop</span>
  )
```

## API Docs
Documentation can be found [here](https://beanloop.github.io/react-with-media/).

## License
react-with-media is dual-licensed under Apache 2.0 and MIT
terms.
