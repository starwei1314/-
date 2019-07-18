let host = ''
let baseUrl = ''
if (process.env.NODE_ENV == 'development') {
  host = 'http://172.16.6.142:8081/official'
  baseUrl = 'http://172.16.6.142:8081/official'
  
}else if (process.env.NODE_ENV == 'production') {
 
  host = 'http://scrm.easy.echosite.cn/official/api'
  baseUrl = 'http://scrm.easy.echosite.cn/official/api'
}
export {
  host,
  baseUrl
}