import { host, baseUrl } from './common'
import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import QS from 'qs';
let v = new Vue();

axios.defaults.baseURL = host
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

//http request 请求拦截器
// axios.interceptors.request.use(
//   config => {
//     // let wxToken = v.$getSession('wxToken')
//     let openId=111111111
//     if(openId) {
//       config.headers['Auth-Token'] = openId;
//       // if(config.method == 'get') {
//       //   config.params['Auth-Token'] = wxToken
//       // }else if(config.method == 'post') {
//       //   config.data['Auth-Token'] = wxToken
//       // }
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )

// //http response 响应拦截器
// axios.interceptors.response.use(
//     response => {
//         if (response.status === 200) {  

//           if (!response.data) {
//             return Promise.resolve(response);  
//           }

//             if(response.data.code) {
//                 switch (response.data.code){
//                     case '9002'://登录超时
//                         v.$message({
//                             message: "登录超时，请重新登录",
//                             type: "warning"
//                         });
//                         setTimeout(() => {
//                             router.push('/Login')
//                             v.$removeSession('wxToken')   
//                         }, 2000);
//                     break;
//                     case '9000'://失败
//                         v.$message({
//                             message: response.data.remark,
//                             type: 'warning'
//                         });
//                     break;
//                     case '9001': //系统出错
//                         v.$message({
//                             message: response.data.remark,
//                             type: 'warning'
//                         });
//                     break;
//                     case '9003': //无权限
//                         v.$message({
//                             message: response.data.remark,
//                             type: 'warning'
//                         });
//                     break;
//                 }
//             }
//             return Promise.resolve(response);  
//         }else if(response.status <200&&response.status >300){
//             v.$message({
//                 message: '请求网络未知错误,请联系管理员',
//                 type: 'warning'
//             });
//             if(response.status===404){
//                 router.push('/NotFoundView')
//             }
//             return Promise.reject(response); 
//         } else { 
//             v.$message({
//                 message: response.status,
//                 type: 'warning'
//             });
//             return Promise.reject(response);  
//         } 
//     },
//     error => {
//         v.$message({
//             message: '服务器连接失败'+error,
//             type: 'error'
//         });
//         return Promise.reject(error)
//     }
// )


/*
*HttpService description
*fetch: get请求方法， post: post请求方法
 */

let HttpService = {
  fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
        withCredentials: true,
        responseType: 'json'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post(url, params = {}) {
    return new Promise((resolve, reject) => {
      //使用qs的写法↓
      axios.post(url,QS.stringify(params,{ arrayFormat: 'brackets'}))
      .then(response => {
        resolve(response);
      },err => {
        reject(err)
      })
      //使用qs的写法↑
    })
  },
  postJson(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: params,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}

export default HttpService