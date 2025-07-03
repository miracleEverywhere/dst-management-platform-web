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

export const timestamp2timeWithoutDate = (timestamp) => {
  const date = new Date(timestamp);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return hours + ':' + minutes + ':' + seconds;
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

export const saveFile = (base64Data, fileName) => {
  // 解码 Base64 数据
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // 创建 Blob 对象
  const blob = new Blob([byteArray], { type: 'application/octet-stream' });

  // 适用于其他现代浏览器
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const formatBytes = (bytes, num=2) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(num)) + ' ' + sizes[i];
}

// PKCS7Padding 填充数据
function PKCS7Padding(data, blockSize) {
  const padding = blockSize - (data.length % blockSize);
  const padText = new Array(padding).fill(padding).map(x => x);
  return data.concat(padText);
}

// PKCS7UnPadding 去除填充
function PKCS7UnPadding(data) {
  if (data.length === 0) {
    throw new Error("非法 ciphertext");
  }
  const padding = data[data.length - 1];
  if (padding > data.length) {
    throw new Error("非法 padding");
  }
  return data.slice(0, data.length - padding);
}

// 字符串转字节数组
function stringToBytes(str) {
  return Array.from(new TextEncoder().encode(str));
}

// 字节数组转字符串
function bytesToString(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// AesEncrypt AES加密函数
// key: 密钥字符串，长度必须为16(AES-128)、24(AES-192)或32(AES-256)字节
// plaintext: 要加密的明文字符串
// 返回: base64编码的加密结果
export function AesEncrypt(key, plaintext) {
  // 转换字符串为字节数组
  const keyBytes = stringToBytes(key);
  const plaintextBytes = stringToBytes(plaintext);

  // 转换key为CryptoJS格式
  const keyHex = CryptoJS.enc.Hex.parse(keyBytes.map(b => b.toString(16).padStart(2, '0')).join(''));

  // 生成随机IV (16字节)
  const iv = CryptoJS.lib.WordArray.random(16);

  // 填充原始数据
  const blockSize = 16; // AES块大小固定为16字节
  const paddedData = PKCS7Padding(plaintextBytes, blockSize);

  // 转换数据为CryptoJS格式
  const dataWordArray = CryptoJS.lib.WordArray.create(paddedData);

  // 加密
  const encrypted = CryptoJS.AES.encrypt(dataWordArray, keyHex, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding
  });

  // 合并IV和密文
  const ivAndCiphertext = iv.concat(encrypted.ciphertext);

  // 返回base64编码的字符串
  return ivAndCiphertext.toString(CryptoJS.enc.Base64);
}

// AesDecrypt AES解密函数
// key: 密钥字符串，必须与加密时使用的相同
// ciphertextBase64: base64编码的加密字符串
// 返回: 解密后的明文字符串
export function AesDecrypt(key, ciphertextBase64) {
  // 转换key为字节数组
  const keyBytes = stringToBytes(key);

  // 转换key为CryptoJS格式
  const keyHex = CryptoJS.enc.Hex.parse(keyBytes.map(b => b.toString(16).padStart(2, '0')).join(''));

  // 解码base64
  const ivAndCiphertext = CryptoJS.enc.Base64.parse(ciphertextBase64);

  // 提取IV (前16字节)和密文
  const blockSize = 16; // AES块大小固定为16字节
  if (ivAndCiphertext.sigBytes < blockSize) {
    throw new Error("ciphertext 太短");
  }

  const iv = CryptoJS.lib.WordArray.create(ivAndCiphertext.words.slice(0, 4), blockSize);
  const ciphertext = CryptoJS.lib.WordArray.create(ivAndCiphertext.words.slice(4), ivAndCiphertext.sigBytes - blockSize);

  // 解密
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext },
    keyHex,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    }
  );

  // 转换解密结果为字节数组
  const decryptedHex = decrypted.toString(CryptoJS.enc.Hex);
  const decryptedBytes = decryptedHex ?
    decryptedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)) : [];

  // 去除填充
  const unpaddedBytes = PKCS7UnPadding(decryptedBytes);

  // 转换为字符串
  return bytesToString(unpaddedBytes);
}
