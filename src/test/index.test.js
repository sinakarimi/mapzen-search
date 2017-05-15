import 'isomorphic-unfetch'
import nock from 'nock'
import omit from 'lodash/fp/omit'
import mapzenSearch from '../'
import {
  autocompleteResponses,
  reverseResponses,
  searchResponses,
  structuredSearchResponses,
} from './fixtures'

const scope = nock('https://search.mapzen.com/v1')

describe('mapzen-search', () => {
  it('should validate apiKey', () => {
    expect(() => {
      mapzenSearch()
    }).toThrowError('API Key not specified')
  })

  it('should return object of available methods', () => {
    const mz = mapzenSearch('api-key')
    expect(mz).toHaveProperty('autocomplete')
    expect(mz).toHaveProperty('search')
    expect(mz).toHaveProperty('structuredSearch')
    expect(mz).toHaveProperty('reverse')
  })
})

describe('search', () => {
  it('should error if missing `text` option', () => {
    expect.assertions(1)
    const mz = mapzenSearch('api-key')
    return mz.search({}).catch(e => {
      expect(e.message).toMatch('`text` option not specified for search')
    })
  })

  validatesOptions('search', {
    text: 'Melbourne, Australia',
  })

  it('should handle successful response', () => {
    expect.assertions(1)
    const text = 'Melbourne'
    const response = searchResponses[text]

    scope
      .get('/search')
      .query({
        api_key: 'api-key',
        text,
      })
      .reply(200, response)

    const mz = mapzenSearch('api-key')
    return mz.search({
      text,
    }).then(data => {
      expect(data).toMatchObject(response)
    })
  })

  it('should handle error response', () => {
    expect.assertions(1)
    const text = 'Melbourne'
    const response = searchResponses[text]

    scope
      .get('/search')
      .query({
        api_key: 'api-key',
        text,
      })
      .replyWithError({
        message: 'OMG, bad things happened!',
      })

    const mz = mapzenSearch('api-key')
    return mz.search({
      text,
    }).catch(e => {
      expect(e.message).toMatch('OMG, bad things happened!')
    })
  })
})

describe('searchStructured', () => {
  const validOpts = {
    locality: 'London'
  }
  it('should error if missing all options', () => {
    expect.assertions(1)
    const mz = mapzenSearch('api-key')
    return mz.structuredSearch({}).catch(e => {
      expect(e.message).toMatch('at least one structured search parameter is required')
    })
  })

  validatesOptions('structuredSearch', validOpts)

  it('should handle successful response', () => {
    expect.assertions(1)
    const matchQuery = Object.assign(
      {},
      validOpts,
      {
        api_key: 'api-key',
      }
    )
    const response = structuredSearchResponses['London']

    scope
      .get('/search/structured')
      .query(matchQuery)
      .reply(200, response)

    const mz = mapzenSearch('api-key')
    return mz.structuredSearch(validOpts).then(data => {
      expect(data).toMatchObject(response)
    })
  })

  it('should handle error response', () => {
    expect.assertions(1)
    const matchQuery = Object.assign(
      {},
      validOpts,
      {
        api_key: 'api-key',
      }
    )
    const response = structuredSearchResponses['London']

    scope
      .get('/search/structured')
      .query(matchQuery)
      .replyWithError({
        message: 'OMG, bad things happened!',
      })

    const mz = mapzenSearch('api-key')
    return mz.structuredSearch(validOpts).catch(e => {
      expect(e.message).toMatch('OMG, bad things happened!')
    })
  })
})

describe('autocomplete', () => {
  it('should error if missing `text` option', () => {
    expect.assertions(1)
    const mz = mapzenSearch('api-key')
    return mz.autocomplete({}).catch(e => {
      expect(e.message).toMatch('`text` option not specified for autocomplete')
    })
  })

  validatesOptions('autocomplete', {
    text: 'Coll',
  })

  it('should handle successful response', () => {
    expect.assertions(1)
    const text = 'Coll'
    const response = autocompleteResponses[text]

    scope
      .get('/autocomplete')
      .query({
        api_key: 'api-key',
        text,
      })
      .reply(200, response)

    const mz = mapzenSearch('api-key')
    return mz.autocomplete({
      text,
    }).then(data => {
      expect(data).toMatchObject(response)
    })
  })

  it('should handle error response', () => {
    expect.assertions(1)
    const text = 'Melbourne'
    const response = autocompleteResponses[text]

    scope
      .get('/autocomplete')
      .query({
        api_key: 'api-key',
        text,
      })
      .replyWithError({
        message: 'OMG, bad things happened!',
      })

    const mz = mapzenSearch('api-key')
    return mz.autocomplete({
      text,
    }).catch(e => {
      expect(e.message).toMatch('OMG, bad things happened!')
    })
  })

})

describe('reverse', () => {
  const validOpts = {
    'point.lat': 48.858268,
    'point.lon': 2.294471,
  }

  it('should error if missing `point.lat` option', () => {
    expect.assertions(1)
    const mz = mapzenSearch('api-key')
    const opts = omit('point.lat')(validOpts)
    return mz.reverse(opts).catch(e => {
      expect(e.message).toMatch('`point.lat` and/or `point.lon` values not specified for reverse')
    })
  })

  it('should error if missing `point.lon` option', () => {
    expect.assertions(1)
    const mz = mapzenSearch('api-key')
    const opts = omit('point.lon')(validOpts)
    return mz.reverse(opts).catch(e => {
      expect(e.message).toMatch('`point.lat` and/or `point.lon` values not specified for reverse')
    })
  })

  validatesOptions('reverse', validOpts)

  it('should handle successful response', () => {
    expect.assertions(1)
    const matchQuery = Object.assign(
      {},
      validOpts,
      {
        api_key: 'api-key',
      }
    )
    const response = reverseResponses[`${validOpts['point.lat']}-${validOpts['point.lon']}`]

    scope
      .get('/reverse')
      .query(matchQuery)
      .reply(200, response)

    const mz = mapzenSearch('api-key')
    return mz.reverse(validOpts).then(data => {
      expect(data).toMatchObject(response)
    })
  })

  it('should handle error response', () => {
    expect.assertions(1)
    const matchQuery = Object.assign(
      {},
      validOpts,
      {
        api_key: 'api-key',
      }
    )
    const response = reverseResponses[`${validOpts['point.lat']}-${validOpts['point.lon']}`]

    scope
      .get('/reverse')
      .query(matchQuery)
      .replyWithError({
        message: 'OMG, bad things happened!',
      })

    const mz = mapzenSearch('api-key')
    return mz.reverse(validOpts).catch(e => {
      expect(e.message).toMatch('OMG, bad things happened!')
    })
  })
})

function validatesOptions(method, defaultOpts, errorMessage) {
  it(`should error for invalid options on ${method}`, () => {
    expect.assertions(1)
    const mz = mapzenSearch('api-key')
    const options = Object.assign(
      {},
      defaultOpts,
      {
        foo: 'bar',
      },
    )
    return mz[method](options).catch(e => {
      expect(e.message).toMatch(/Invalid option \'foo\' supplied to/)
    })
  })
}
