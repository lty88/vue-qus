import Vue from "vue";
import VueRouter from "vue-router";
import qsList from '../views/QS-list.vue'

Vue.use(VueRouter);

const routes = [{
	path: "/",
	name: "qsList",
	component: qsList,
	meta: {
		title: '问卷列表',
		keepAlive: true
	}
},
{
	path: '/AvailableQn',
	name: 'AvailableQn',
	meta: {
		title: '有效问卷',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/AvailableQn.vue")

},
{
	path: '/viewResults/:code',
	name: 'viewResults',
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/viewResults.vue"),
	meta: {
		title: '查看问卷结果',
		keepAlive: false
	}
},
{
	path: '/fill/:code',
	name: 'fill',
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/QS-fill.vue"),
	meta: {
		title: '填写问卷',
		keepAlive: false,
		requireAuth: true
	}
},
{
	path: '/Add-Qs',
	name: 'Add-Qs',
	meta: {
		title: '新增问卷',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/Add-Qs.vue")
},
{
	path: '/login',
	name: 'login',
	meta: {
		title: '登录',
		keepAlive: false
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/login.vue")
},
{
	path: '/userLoginPhone/:code',
	name: 'userLoginPhone',
	meta: {
		title: '用户登录',
		keepAlive: false
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/userLoginPhone.vue")
},

{
	path: '/edit/:code',
	name: 'qsEdit',
	meta: {
		title: '编辑问卷',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/QS-edit.vue")
}, {
	path: '/data/:code',
	name: 'qsData',
	meta: {
		title: '查看问卷结果',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/QS-data.vue")
},
{
	path: '/importUser/:code',
	name: 'importUser',
	meta: {
		title: '批量导入',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/import-user.vue")
},
{
	path: '/FlowControl/:code',
	name: 'FlowControl',
	meta: {
		title: "流程控制",
		keepAlive: true,
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/FlowControl.vue")
},
{
	path: '/test',
	name: 'test',
	meta: {
		title: "测试",
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/test.vue")
}
];

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
// router.onError((error) => {
// 	const pattern = /Loading chunk (\d)+ failed/g;
// 	const isChunkLoadFailed = error.message.match(pattern);
// 	const targetPath = router.history.pending.fullPath;
// 	if (isChunkLoadFailed) {
// 	  router.replace(targetPath);
// 	}
//   });
const router = new VueRouter({
	mode: 'history',
	routes
});

export default router;
