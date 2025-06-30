import HomeView from '../views/HomeView.vue';

const routes = [{
    path: '/',
    redirect: '/home'
}, {
    path: '/home',
    name: 'home',
    component: HomeView
}, {
    path: '/disaster-recovery',
    name: 'disaster-recovery',
    component: () => import(/* webpackChunkName: "disaster-recovery" */ '../views/DisasterRecovery.vue')
}];

export default routes;
