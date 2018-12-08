# react-with-media

Watch media queries in React components.
A hook, A HOC and a render prop component are provided so that you can use whatever flavor you prefer.

Typescript typings are included.

## Install

```
yarn add react-with-media
npm install --save react-with-media
```

## Usage

### Hook

```typescript
const ShowMessage = () => {
  const matches = useMedia('(max-width: 500px)')

  return matches ? <span>Is mobile</span> : <span>Is desktop</span>
}
```

### HOC

```typescript
const ShowMessage = withMedia('(max-width: 500px)')(({matches}) =>
  matches ? <span>Is mobile</span> : <span>Is desktop</span>,
)
```

Optionally, the property name can be changed:

```typescript
const ShowMessage = withMedia('(max-width: 500px)', {name: 'isMobile'})(
  ({isMobile}) => (isMobile ? <span>Is mobile</span> : <span>Is desktop</span>),
)
```

### Render props

```typescript
const ShowMessage = () => (
  <WithMedia query="(max-width: 500px)">
    {matches => (matches ? <span>Is mobile</span> : <span>Is desktop</span>)}
  </WithMedia>
)
```

## License

react-with-media is dual-licensed under Apache 2.0 and MIT
terms.
