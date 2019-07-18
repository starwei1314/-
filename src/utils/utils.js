/**
 * 存储localStorage
 */
const setStore = (name,content) => {
  if(!name) return;
  if(typeof content !== 'string'){
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name,content);
}

/**
 * 获取localStorage
 */
const getStore = name => {
  let data = window.localStorage.getItem(name);
  if(!data){
    return false;
  }else{
    return data;
  }
}

/**
 * 删除localStorage
 */
const removeStore = name => {
  if(!name) return;
  window.localStorage.removeItem(name);
}

/**
 * 存储sessionStorage
 */
const setSession = (name,content) => {
  if(!name) return;
  if(typeof content !== 'string'){
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name,content);
}

/**
 * 获取sessionStorage
 */
const getSession = name => {
  let data = window.sessionStorage.getItem(name);
  if(!data){
    return false;
  }else{
    return data;
  }
}

/**
 * 删除sessionStorage
 */
const removeSession = name => {
  if(!name) return;
  window.sessionStorage.removeItem(name);
}



export {
  setStore,
  getStore,
  removeStore,
  setSession,
  getSession,
  removeSession
}