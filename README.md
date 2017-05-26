[![CircleCI](https://circleci.com/gh/Lighthouse-io/mapzen-search.svg?style=svg)](https://circleci.com/gh/Lighthouse-io/mapzen-search)

# Mapzen Search

JavaScript wrapper for the Mapzen Search API

## Install

```
npm install --save mapzen-search

## Getting started

Import module and set API Key

```
import mapzenSearch from 'mapzen-search'
const mz = mapzenSearch('your-mapzen-api-key')
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
