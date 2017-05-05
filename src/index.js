import fetch from 'isomorphic-unfetch'
import qs from 'query-string'
import find from 'lodash/fp/find'
import keys from 'lodash/fp/keys'
import omit from 'lodash/fp/omit'

const HOST = 'https://search.mapzen.com/v1'
const SEARCH_ENDPOINT = `${HOST}/search`
const AUTOCOMPLETE_ENDPOINT = `${HOST}/autocomplete`
const VALID_OPTIONS = [
  'focus.point.lat',
  'focus.point.lon',
  'boundary.rect.min_lon',
  'boundary.rect.max_lon',
  'boundary.rect.min_lat',
  'boundary.rect.max_lat',
  'boundary.circle.lat',
  'boundary.circle.lon',
  'boundary.circle.radius',
  'sources',
  'layers',
  'boundary.country',
  'size',
]

const optionValidator = buildOptionValidator(VALID_OPTIONS)

export default function mapzenSearch(apiKey) {

  if (!apiKey) {
    throw new Error('API Key not specified')
  }

  return {
    autocomplete: autocomplete(apiKey),
    search: search(apiKey),
    reverse: reverse(apiKey),
  }
}

function autocomplete(apiKey) {
  return options => {
    if (!options.text) {
      return Promise.reject(
        new Error('`text` option not specified for autocomplete')
      )
    }

    const restOptions = omit(['apiKey', 'text'])(options)
    const invalidOption = findInvalidOption(restOptions)

    if (invalidOption) {
      return Promise.reject(
        new Error(`Invalid option '${invalidOption}' supplied to autocomplete`)
      )
    }

    const reqOptions = Object.assign(
      {},
      options,
      {
        api_key: apiKey,
      },
    )
    const url = buildUrl(AUTOCOMPLETE_ENDPOINT, reqOptions)
    return fetch(url)
      .then(checkStatus)
      .then(response => response.json())
      .then(data => Promise.resolve(data))
  }
}

function search(apiKey) {
  return options => {
    if (!options.text) {
      return Promise.reject(
        new Error('`text` option not specified for search')
      )
    }

    const restOptions = omit(['apiKey', 'text'])(options)
    const invalidOption = findInvalidOption(restOptions)

    if (invalidOption) {
      return Promise.reject(
        new Error(`Invalid option '${invalidOption}' supplied to search`)
      )
    }

    const reqOptions = Object.assign(
      {},
      options,
      {
        api_key: apiKey,
      },
    )
    const url = buildUrl(SEARCH_ENDPOINT, reqOptions)
    return fetch(url)
      .then(checkStatus)
      .then(response => response.json())
      .then(data => Promise.resolve(data))
  }
}

function reverse(apiKey) {
  return options => {
  }
}

function buildUrl(base, query) {
  const querystring = qs.stringify(query)
  return `${base}?${querystring}`
}

// https://github.com/developit/unfetch
function checkStatus(response) {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    return Promise.reject(error)
  }
}

function findInvalidOption(options) {
  const optionKeys = keys(options)
  const invalidOption = find(optionValidator)(optionKeys)
  return invalidOption
}

function buildOptionValidator(validOptions) {
  return option => {
    const validOption = find(option)(validOptions)
    return !validOption
  }
}
