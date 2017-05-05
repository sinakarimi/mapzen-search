import nock from 'nock'
import mapzenSearch from '../'
import {
  searchResponses,
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
