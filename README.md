[![NPM](https://nodei.co/npm/mapzen-search.png)](https://npmjs.org/package/mapzen-search)

[![CircleCI](https://circleci.com/gh/Lighthouse-io/mapzen-search.svg?style=svg)](https://circleci.com/gh/Lighthouse-io/mapzen-search)

# Mapzen Search

JavaScript wrapper for the Mapzen Search API

## Install

```
npm install --save mapzen-search
```

## Getting started

Import module and pass required options...

```
import mapzenSearch from 'mapzen-search'
const mz = mapzenSearch({
  apiKey: 'your-mapzen-api-key',
  fetch: window.fetch, // or any compliant ponyfill (e.g. https://github.com/developit/unfetch)
})
```

The following methods are available. See [Mapzen Documentation](https://mapzen.com/documentation/search/) for available options.

## Search

```
mz.search({
  text: 'Melbourne, Australia'
}).then(response => {
  // handle result
})
```

## Reverse Geocoding

```
mz.reverse({
  point.lat: 48.858268,
  point.lon: 2.294471,
}).then(response => {
  // handle result
})
```

## Autocomplete

```
mz.autocomplete({
  text: 'New Yo',
}).then(response => {
  // handle result
})
```

## Structured Search

```
mz.structuredSearch({
  locality: 'London'
}).then(response => {
  // handle result
})
```

## Pass custom host

If you're self hosting your own Mapzen services (e.g. Pelias) then you'll need to pass in a custom host, e.g.

```
import mapzenSearch from 'mapzen-search'
const mz = mapzenSearch({
  apiKey: 'your-mapzen-api-key',
  searchHost: 'https://your-self-hosted-address.com,
  fetch: window.fetch, // or any compliant ponyfill (e.g. https://github.com/developit/unfetch)
})
```

The possible host parameters are `searchHost`, `structuredSearchHost`, `autocompleteHost` and `reverseHost`.
