import api from '@/api'
import { basePermissions } from '@/settings'

export async function getUserInfo() {
  const res = await api.getUser()
  const { username, role, status, createTime } = res.data || {}
  return {
    username,
    role,
    status,
    createTime
  }
}

export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}
