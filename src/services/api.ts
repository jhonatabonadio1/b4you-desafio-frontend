import axios from 'axios'
import {parseCookies} from 'nookies'

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)

  const {'incorporae.token': token} = cookies

  const api = axios.create({
    baseURL:   `https://incorporae-f47969ed39cb.herokuapp.com/api`,
    headers: {
      Authorization: `${token ? 'Bearer ' + token : ''}`,
    },
    withCredentials: true,
  })

  return api
}
