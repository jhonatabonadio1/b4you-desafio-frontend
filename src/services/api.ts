import axios from 'axios'
import {parseCookies} from 'nookies'

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)

  const {'incorporae.token': token} = cookies

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: `${token ? 'Bearer ' + token : ''}`,
    },
    withCredentials: true,
  })

  return api
}
