import CryptoJS from 'crypto-js';

export const SHA512 = (data) => {
  return CryptoJS.SHA512(data).toString()
}

export const timestamp2time = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

export function seconds2Time(totalSeconds, language) {
  const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
  totalSeconds %= (365 * 24 * 60 * 60);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= (24 * 60 * 60);
  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= (60 * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const timeParts = [];

  if (language === 'zh') {
    if (years > 0) timeParts.push(`${years}年`);
    if (days > 0) timeParts.push(`${days}天`);
    if (hours > 0) timeParts.push(`${hours}时`);
    if (minutes > 0) timeParts.push(`${minutes}分`);
    if (seconds > 0) timeParts.push(`${seconds}秒`);
  } else if (language === 'en') {
    if (years > 0) timeParts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (days > 0) timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) timeParts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) timeParts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) timeParts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  }

  return timeParts.length > 0 ? timeParts.join(' ') : (language === 'zh' ? '0秒' : '0 seconds');
}

export const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const roleMap = [
  {
    label: '访客',
    value: '访客'
  },
  {
    label: '管理员',
    value: '管理员'
  },
]

export const deepCopy = (target, myMap = new WeakMap()) => {
  //1. 保证传入的target为引用类型
  if (typeof target !== "object" || target === null) {
    return target;
  }
  //6. 判断当前对象是否被拷贝过
  if(myMap.get(target)) {
    return myMap.get(target);
  }
  //7. 判断是否Date或者RegExp，这里面还有很多判断没有写出比如String，Number等
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);
  //2. 判断传入的target是对象还是数组，在创建新的copyTarget
  const copyTarget = Array.isArray(target) ? [] : {};
  //3. 将它的拷贝的对象保存到myMap，也就是哈希表
  myMap.set(target, copyTarget);
  for (let item in target) {
    //4. 是自身的而不是原型链上的
    if (target.hasOwnProperty(item)) {
      //5.进行下一次递归，不是引用类型会直接返回
      copyTarget[item] = deepCopy(target[item], myMap);
    }
  }
  return copyTarget;
}

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const validateRegExp = (string) => {
  try {
    new RegExp(string);
    return true;  // 正则表达式合法
  } catch (e) {
    return false; // 正则表达式非法
  }
}