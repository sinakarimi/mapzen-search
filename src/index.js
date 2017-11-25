import qs from 'query-string'
import find from 'lodash/fp/find'
import includes from 'lodash/fp/includes'
import intersection from 'lodash/fp/intersection'
import keys from 'lodash/fp/keys'
import omit from 'lodash/fp/omit'
import assign from 'lodash/assign'

const DEFAULT_HOST = 'https://search.mapzen.com/v1'
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
  'size'
]
const REQUIRED_OPTS = ['apiKey', 'text', 'point.lat', 'point.lon']
const STRUCTURED_SEARCH_OPTS = [
  'address',
  'neighbourhood',
  'borough',
  'locality',
  'county',
  'region',
  'postalcode',
  'country',
]

const optionValidator = buildOptionValidator(VALID_OPTIONS)

export default function mapzenSearch(options) {
  if (!options.fetch) {
    throw new Error('`fetch` ponyfill option not specified')
  }

  if (!options.apiKey) {
    throw new Error('`apiKey` option not specified')
  }

  return {
    autocomplete: autocomplete(options),
    search: search(options),
    structuredSearch: structuredSearch(options),
    reverse: reverse(options),
  }
}

function autocomplete({ fetch, apiKey, autocompleteHost }) {
  return options => {
    if (!options.text) {
      return Promise.reject(
        new Error('`text` option not specified for autocomplete')
      )
    }

    const restOptions = omit(REQUIRED_OPTS)(options)
    const invalidOption = findInvalidOption(restOptions)

    if (invalidOption) {
      return Promise.reject(
        new Error(`Invalid option '${invalidOption}' supplied to autocomplete`)
      )
    }

    const reqOptions = assign(
      {},
      options,
      {
        api_key: apiKey,
      },
    )
    const host = autocompleteHost || DEFAULT_HOST
    const endpoint = getAutocompleteEndpoint(host)
    const url = buildUrl(endpoint, reqOptions)
    return fetch(url)
      .then(checkStatus)
      .then(response => response.json())
  }
}

function search({ fetch, apiKey, searchHost }) {
  return options => {
    if (!options.text) {
      return Promise.reject(
        new Error('`text` option not specified for search')
      )
    }

    const restOptions = omit(REQUIRED_OPTS)(options)
    const invalidOption = findInvalidOption(restOptions)

    if (invalidOption) {
      return Promise.reject(
        new Error(`Invalid option '${invalidOption}' supplied to search`)
      )
    }

    const reqOptions = assign(
      {},
      options,
      {
        api_key: apiKey,
      },
    )
    const host = searchHost || DEFAULT_HOST
    const endpoint = getSearchEndpoint(host)
    const url = buildUrl(endpoint, reqOptions)
    return fetch(url)
      .then(checkStatus)
      .then(response => response.json())
  }
}

function structuredSearch({ fetch, apiKey, structuredSearchHost }) {
  return options => {
    const optionKeys = keys(options)
    const validOptions = intersection(optionKeys)(STRUCTURED_SEARCH_OPTS)
    const hasSomeOptions = validOptions.length > 0
    if (!hasSomeOptions) {
      return Promise.reject(
        new Error('at least one structured search parameter is required')
      )
    }

    const omitList = REQUIRED_OPTS.concat(STRUCTURED_SEARCH_OPTS)
    const restOptions = omit(omitList)(options)
    const invalidOption = findInvalidOption(restOptions)

    if (invalidOption) {
      return Promise.reject(
        new Error(`Invalid option '${invalidOption}' supplied to search`)
      )
    }

    const reqOptions = assign(
      {},
      options,
      {
        api_key: apiKey,
      },
    )
    const host = structuredSearchHost || DEFAULT_HOST
    const endpoint = getStructuredSearchEndpoint(host)
    const url = buildUrl(endpoint, reqOptions)
    return fetch(url)
      .then(checkStatus)
      .then(response => response.json())
  }
}

function reverse({ fetch, apiKey, reverseHost }) {
  return options => {
    if (!options['point.lat'] || !options['point.lon']) {
      return Promise.reject(
        new Error('`point.lat` and/or `point.lon` values not specified for reverse')
      )
    }

    const restOptions = omit(REQUIRED_OPTS)(options)
    const invalidOption = findInvalidOption(restOptions)

    if (invalidOption) {
      return Promise.reject(
        new Error(`Invalid option '${invalidOption}' supplied to reverse`)
      )
    }

    const reqOptions = assign(
      {},
      options,
      {
        api_key: apiKey,
      },
    )
    const host = reverseHost || DEFAULT_HOST
    const endpoint = getReverseEndpoint(host)
    const url = buildUrl(endpoint, reqOptions)
    return fetch(url)
      .then(checkStatus)
      .then(response => response.json())
  }
}

function getSearchEndpoint(host) {
  return `${host}/search`
}

function getStructuredSearchEndpoint(host) {
  return `${host}/search/structured`
}

function getAutocompleteEndpoint(host) {
  return `${host}/autocomplete`
}

function getReverseEndpoint(host) {
  return `${host}/reverse`
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
    const validOption = includes(option)(validOptions)
    return !validOption
  }
}
