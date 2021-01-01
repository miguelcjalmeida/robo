import { IRequester } from '../core/core'
import { JSDOM } from 'jsdom'
import * as request from 'request'

export class Requester implements IRequester {
  request(uri: string): Promise<Document> {
    return new Promise((resolve, reject) => {
      request(
        {
          uri,
          gzip: true,
          headers: {
            vary: 'Origin',
            'referrer-policy': 'no-referrer-when-downgrade',
            'user-agent':
              'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
          },
        },
        function (error, response, body) {
          console.log(response.statusCode)
          if (error || !response) return reject()
          resolve(new JSDOM(body).window.document)
        }
      )
    })
  }
}
