import Vue from "vue";
import VueRouter from "vue-router";
import qsList from '@/components/QS-list'

Vue.use(VueRouter);

const routes = [{
		path: "/",
		name: "qsList",
		component: qsList
	},
	{
		path: '/fill/:num',
		name: 'qsFill',
		component: () =>
			import( /* webpackChunkName: "about" */ "../components/QS-fill.vue")
	},
	{
		path: '/edit/:num',
		name: 'qsEdit',
		component: () =>
			import( /* webpackChunkName: "about" */ "../components/QS-edit.vue")
	}, {
		path: '/data/:num',
		name: 'qsData',
		component: () =>
			import( /* webpackChunkName: "about" */ "../components/QS-data.vue")
	}
];

const router = new VueRouter({
	routes
});

export default router;
