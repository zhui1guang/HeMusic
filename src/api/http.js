import axios from "axios";
import router from "../router";
axios.defaults.timeout = 5000;//超时时间5s
axios.defaults.withCredentials = true;//允许跨域
// Content-type响应头
axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 基础url（后端
axios.defaults.baseURL = 'http://localhost:8888'

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 访问到接口了
    if (response.status == 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status.status) {
        // 未登录
        case 401:
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;
        // 找不到
        case 404:
          break;
      }
      return Promise.reject(error.response)
    }
  }
);

/**
 * get方法
 */
export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params })
      // 成功返回数据
      .then(response => {
        resolve(response.data)
      })
      .catch(err => { reject(err) })
  })
}

/**
 * post
 */
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => { reject(err) })
  })
}