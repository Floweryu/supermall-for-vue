import Axios from "axios";

export function request(config) {
  const instance1 = Axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 10000
  })

  instance1.interceptors.request.use(config => {
    return config
  }, err => {

  })

  instance1.interceptors.response.use(res => {
    return res
  }, err => {

  })

  return instance1(config)
}
