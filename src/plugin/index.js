import Vue from 'vue'
import api from '@/utils/http'
let OSS = require('ali-oss');
let ossconfig=(params)=>{
  return api.fetch('/get/sts', params)
}
let v = new Vue();
const MyPlugin = {
  install () {
    // 添加全局方法和属性  全局方法调用 Vue.GlobalMethod()
    // Vue.GlobalMethod = () => {
    //   alert('global')
    // }

    // Vue.prototype添加实例方法  实例方法调用 this.$setLocal()
    /*
    * 将字符串转成base64，中文转base64需要通过encodeURIComponent(str) 转码一下，才可以用btoa
    */ 
    Vue.prototype.$b64Encode = (value) => {
      return btoa(encodeURIComponent(value))
    }
    /*
    * 将base64解码成字符串，用atob，如果涉及中文就再用decodeURIComponent(atob(str))转换一下
    */ 
    Vue.prototype.$b64Decode = (value) => {
      return decodeURIComponent(atob(value))
    }
    /** 
    * $setLocal是浏览器设置本地存储
    */ 
    Vue.prototype.$setLocal = (key, value) => {
      if (typeof value == 'object') value = JSON.stringify(value)
      localStorage.setItem(key, v.$b64Encode(value))
    }
    /** 
    * $getLocal是获取浏览器本地存储
    */
    Vue.prototype.$getLocal = (key) => {
      return localStorage.getItem(key) ? v.$b64Decode(localStorage.getItem(key)) : localStorage.getItem(key)
    }
    /** 
    * $removeLocal是删除浏览器本地存储
    */
    Vue.prototype.$removeLocal = (key) => {
      localStorage.removeItem(key)
    }
    /** 
    * $setSession是浏览器设置session存储
    */ 
    Vue.prototype.$setSession = (key, value) => {
      if (typeof value == 'object') value = JSON.stringify(value)
      sessionStorage.setItem(key, v.$b64Encode(value))
    }
    /** 
    * $getSession是获取浏览器session存储
    */
    Vue.prototype.$getSession = (key) => {
      return sessionStorage.getItem(key) ? v.$b64Decode(sessionStorage.getItem(key)) : sessionStorage.getItem(key)
    }
    
    /** 
    * $removeLocal是删除浏览器session存储
    */
    Vue.prototype.$removeSession = (key) => {
      sessionStorage.removeItem(key)
    }
    /** 
     * $guid 不重复字符串 
     */ 
    Vue.prototype.$guid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    }
    /*
    * 阿里云oss配置
    * 读取文件的调用方法 - 原图
    * this.$oss((client) => {
    *   let result = client.signatureUrl('wechat_message/8961790004/cb3f58db-d403-41a0-a94c-33418220a9c1')
    *   console.log(result)
    * })
    * 读取文件的调用方法 - 缩略图
    * this.$oss((client) => {
    *  // 带process选项是 对图片进行压缩处理 参考网址https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.1280.213735a8Beacff
    *  let result = client.signatureUrl('wechat_message/8961790004/cb3f58db-d403-41a0-a94c-33418220a9c1', {'process' : 'image/resize,h_100'})
    *  console.log(result)
    * })
    * 上传文件的方法
    * uploadFile (ev) {
    *  let file = ev.target.files[0];
    *  this.$oss((client, path) => {
    *    let fileName = path+'/'+'上传文件的路径'+this.$guid()+'.'+file.name.split('.')[1];
    *    // fileName表示上传的文件名 , file表示上传的文件
    *    client.multipartUpload(fileName, file).then((res) => {
    *      console.log(res)
    *    }).catch(err => {
    *      console.log(err)
    *    })
    *  });
    *}
    */
   Vue.prototype.$oss = (callback) => {
    let v = new Vue();
    let currentTime = new Date().getTime();
    let scrmkfOss = JSON.parse(v.$getLocal('scrmkfOss'));
    let idenNumber=v.$getLocal('idenNumber')||''
    // console.log(idenNumber)
    if (scrmkfOss && new Date(scrmkfOss.expiration) - currentTime > 0) {
      let client = new OSS({
        accessKeyId: scrmkfOss.accessKeyId,
        accessKeySecret: scrmkfOss.accessKeySecret,
        stsToken: scrmkfOss.securityToken,
        region: scrmkfOss.region,
        bucket: scrmkfOss.bucketName
      })
      callback && callback(client,scrmkfOss.path)
    } else {
      ossconfig({"idenNumber":idenNumber}).then(res => {
        // console.log(res)
        let { data } = res;
        if (data.code === '0000') {
          v.$setLocal('scrmkfOss', data.result)
          let client = new OSS({
            accessKeyId: data.result.accessKeyId,
            accessKeySecret: data.result.accessKeySecret,
            stsToken: data.result.securityToken,
            region: data.result.region,
            bucket: data.result.bucketName
          })
          callback && callback(client,data.result.path)
        }
      })
    }
   } 
  }
}

export default MyPlugin;