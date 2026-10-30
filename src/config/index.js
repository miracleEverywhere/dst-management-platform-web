export const PiniaPrefix = "dmp-"

export const Version = "v3.2.2"

export const ApiVersion = "v3"

// 应用形态：standard 为主版本，lite 为精简版
// lite 通过 vite --mode lite 读取 .env.lite 中的 VITE_APP_MODE
export const AppMode = import.meta.env.VITE_APP_MODE || "standard"

export const IsLite = AppMode === "lite"

export const GamePortFactor = {
  serverPort: 11000,
  masterPort: 21000,
  masterServerPort: 31000,
  authenticationPort: 41000,
}

export const Darwin = "darwin"

