import Vue from "vue";
import VueRouter from "vue-router";
import qsList from '@/components/QS-list'

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
			import( /* webpackChunkName: "about" */ "../components/QS-fill.vue")
	},
	{
		path: '/edit/:num',
		name: 'qsEdit',
		meta:{
			title:'编辑问卷'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../components/QS-edit.vue")
	}, {
		path: '/data/:num',
		name: 'qsData',
		meta:{
			title:'查看问卷结果'
		},
		component: () =>
			import( /* webpackChunkName: "about" */ "../components/QS-data.vue")
	}
];


const router = new VueRouter({
	routes
});

export default router;
