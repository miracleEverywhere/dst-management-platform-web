/**
 * 玩家角色头像：复用地图页已有的角色立绘资源（src/views/tools/images）。
 * 未知角色退回 undefined.png，避免地图上出现空白标记。
 */
const modules = import.meta.glob('../images/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const fallbackKey = '../images/undefined.png'

/** 角色名 → 头像 URL。 */
export function playerImageUrl(prefab) {
  if (prefab) {
    const key = `../images/${prefab}.png`

    if (modules[key]) {
      return modules[key]
    }
  }

  return modules[fallbackKey] || ''
}
