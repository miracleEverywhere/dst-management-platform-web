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

function getAesKey() {
  const s = [10*10, 7*11, 16*5, 95, 97, 34 << 1 | 1, 83, 95, 50, 0x70, 118, 118, 68, 95, 103, 79]
  let t = ""
  for (let i of s) {
    t += String.fromCharCode(i)
  }
  return t
}

export function EncryptAES(data) {
  const parsedKey = CryptoJS.enc.Utf8.parse(getAesKey())
  // key 和 iv 使用同一个值
  const encrypted = CryptoJS.AES.encrypt(data, parsedKey, {
    iv: parsedKey,
    mode: CryptoJS.mode.CBC, // CBC算法
    padding: CryptoJS.pad.Pkcs7, //使用pkcs7 进行padding 后端需要注意
  });

  return encrypted.toString();
}

export function DecryptAES(data) {
  const parsedKey = CryptoJS.enc.Utf8.parse(getAesKey())
  // key 和 iv 使用同一个值
  const decrypted = CryptoJS.AES.decrypt(data, parsedKey, {
    iv: parsedKey,
    mode: CryptoJS.mode.CBC, // CBC算法
    padding: CryptoJS.pad.Pkcs7, //使用pkcs7 进行padding 后端需要注意
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export const getDstRoleName = (name, lang="zh") => {
  const RoleMap = {
    "zh": {
      "wilson": "威尔逊",
      "willow": "薇洛",
      "wolfgang": "沃尔夫冈",
      "wendy": "温蒂",
      "wx78": "WX-78",
      "wickerbottom": "薇克巴顿",
      "woodie": "伍迪",
      "wes": "韦斯",
      "waxwell": "麦斯威尔",
      "wathgrithr": "薇格弗德",
      "webber": "韦伯",
      "winona": "薇诺娜",
      "warly": "沃利",
      "walter": "沃尔特",
      "wortox": "沃拓克斯",
      "wormwood": "沃姆伍德",
      "wurt": "沃特",
      "wanda": "旺达",
      "wonkey": "芜猴"
    },
    "en": {
      "wilson": "Wilson",
      "willow": "Willow",
      "wolfgang": "Wolfgang",
      "wendy": "Wendy",
      "wx78": "WX-78",
      "wickerbottom": "Wickerbottom",
      "woodie": "Woodie",
      "wes": "Wes",
      "waxwell": "Waxwell",
      "wathgrithr": "Wathgrithr",
      "webber": "Webber",
      "winona": "Winona",
      "warly": "Warly",
      "walter": "Walter",
      "wortox": "Wortox",
      "wormwood": "Wormwood",
      "wurt": "Wurt",
      "wanda": "Wanda",
      "wonkey": "Wonkey"
    }
  }

  const translations = RoleMap[lang]

  if (!translations) return name

  return translations[name] ?? name
}
