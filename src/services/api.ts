import axios from 'axios'
import {parseCookies} from 'nookies'

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)

  const {'incorporae.token': token} = cookies

  const api = axios.create({
    baseURL:   `http://localhost:3333/api`,
    headers: {
      Authorization: `${token ? 'Bearer ' + token : ''}`,
    },
    withCredentials: true,
  })

  return api
}
