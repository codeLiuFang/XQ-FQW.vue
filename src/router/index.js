import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    meta: { title: '机构管理', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/admin/components/HealthCare'),
        name: 'dashboard',
        meta: { title: '医疗机构管理', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'HealthCareCompany',
        component: () => import('@/views/dashboard/admin/components/HealthCareCompany'),
        name: 'HealthCareCompany',
        meta: { title: '管理单位', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'HealthWaste',
        component: () => import('@/views/dashboard/admin/components/HealthWaste'),
        name: 'HealthWaste',
        meta: { title: '处理单位', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  {
    path: '/WasteProtocol',
    component: Layout,
    redirect: '/WasteProtocol',
    meta: { title: '协议管理', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'WasteProtocol',
        component: () => import('@/views/dashboard/admin/components/WasteProtocol'),
        name: 'WasteProtocol',
        meta: { title: '处置协议管理', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'WasteEndDate',
        component: () => import('@/views/dashboard/admin/components/WasteEndDate'),
        name: 'WasteEndDate',
        meta: { title: '协议到期提醒', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  {
    path: '/ProcessPerson',
    component: Layout,
    redirect: '/ProcessPerson',
    meta: { title: '信息管理', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'ProcessPerson',
        component: () => import('@/views/dashboard/admin/components/ProcessPerson'),
        name: 'ProcessPerson',
        meta: { title: '处理人员管理', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'TrainInfo',
        component: () => import('@/views/dashboard/admin/components/TrainInfo'),
        name: 'TrainInfo',
        meta: { title: '培训信息管理', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  {
    path: '/CustomizedQuery',
    component: Layout,
    redirect: '/CustomizedQuery',
    meta: { title: '信息查询', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'CustomizedQuery',
        component: () => import('@/views/dashboard/admin/components/CustomizedQuery'),
        name: 'CustomizedQuery',
        meta: { title: '定制查询', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'OrgMangement',
        component: () => import('@/views/dashboard/admin/components/OrgMangement'),
        name: 'OrgMangement',
        meta: { title: '机构统计', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'ProtocolMangement',
        component: () => import('@/views/dashboard/admin/components/ProtocolMangement'),
        name: 'ProtocolMangement',
        meta: { title: '协议统计', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'PeopleMangement',
        component: () => import('@/views/dashboard/admin/components/PeopleMangement'),
        name: 'PeopleMangement',
        meta: { title: '人员统计', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'BackUp',
        component: () => import('@/views/dashboard/admin/components/BackUp'),
        name: 'BackUp',
        meta: { title: '备份提示', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/org',
    alwaysShow: true,
    meta: { title: 'systemmanage', icon: 'component' },
    children: [
      {
        path: 'org',
        component: () => import('@/views/org/index'),
        name: 'org',
        meta: { title: 'org', icon: 'edit', noCache: true }
      },
      {
        path: 'dict',
        component: () => import('@/views/dict/index'),
        name: 'dict',
        meta: { title: 'dict', icon: 'edit', noCache: true }
      },
      {
        path: 'actor',
        component: () => import('@/views/actor/index'),
        name: 'actor',
        meta: { title: 'actor', icon: 'edit', noCache: true }
      },
      {
        path: 'user',
        component: () => import('@/views/user/index'),
        name: 'user',
        meta: { title: 'user', icon: 'edit', noCache: true }
      }
    ]
  }
]

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
  /* {
    path: '',
    component: Layout,
    redirect: '/HealthCare',
    meta: { title: '机构管理', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'company',
        component: () => import('@/views/dashboard/admin/components/HealthCare'),
        name: 'company',
        meta: { title: '医疗机构管理', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  } */
  /*  {
    path: 'company',
    component: () => import('@/views/dashboard/admin/components/HealthCare'),
    name: 'company',
    meta: { title: '医疗机构管理', icon: 'edit', noCache: true, role: ['管理员'] }
  } */
  /* {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  } */
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
