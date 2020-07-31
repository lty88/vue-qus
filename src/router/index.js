import Vue from "vue";
import VueRouter from "vue-router";
import qsList from '../views/QS-list.vue'

Vue.use(VueRouter);

const routes = [{
		path: "/",
		name: "qsList",
		component: qsList,
		meta:{
			title:'问卷列表'
		}
	},
	{
		path: '/fill/:num',
		name: 'qsFill',
		meta:{
			title:'填写问卷'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../views/QS-fill.vue")
	},
	{
		path: '/edit/:num',
		name: 'qsEdit',
		meta:{
			title:'编辑问卷'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../views/QS-edit.vue")
	}, {
		path: '/data/:num',
		name: 'qsData',
		meta:{
			title:'查看问卷结果'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../views/QS-data.vue")
	},
	{
		path: '/test',
		name: '	',
		meta:{
			title:'我是测试'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../views/Test.vue")
	},
	{
		path: '/test/import',
		name: '	',
		meta:{
			title:'我是批量导入'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../views/Test-import.vue")
	}
];


const router = new VueRouter({
	mode: 'history',
	routes
});

export default router;
