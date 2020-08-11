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
	path: '/fill/:code',
	name: 'qsFill',
	meta: {
		title: '填写问卷',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/QS-fill.vue")
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
	path: '/test',
	name: '	',
	meta: {
		title: '我是测试',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/Test.vue")
},
{
	path: '/import',
	name: '	',
	meta: {
		title: '我是批量导入',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../views/Test-import.vue")
},
{
	path: '/upload',
	name: 'upload',
	meta: {
		title: '我是批量导入',
		keepAlive: true
	},
	component: () =>
		import( /* webpackChunkName: "about" */ "../components/Upload.vue")
}
];


const router = new VueRouter({
	mode: 'history',
	routes
});

export default router;
