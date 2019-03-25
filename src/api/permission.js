import request from '@/utils/request'

// 根据权限id获取权限树
export function getpermissionlist(id) {
  return request({
    url: `/permission/${id}/permissions`,
    method: 'get'
  })
}
// 查询角色的所有权限
export function getpermissionsbyrole(id) {
  return request({
    url: `/role/${id}/permissions`,
    method: 'get'
  })
}
// 查询单个权限
export function getpermission(id) {
  return request({
    url: `/permission/${id}`,
    method: 'get'
  })
}
// 为角色分配权限
export function assignpermission(id, permissionIds) {
  return request({
    url: `/role/${id}/permissions`,
    method: 'post',
    data: permissionIds
  })
}
// 更新权限
export function updatepermission(data) {
  return request({
    url: '/permission',
    method: 'put',
    data
  })
}
