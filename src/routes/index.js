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
}, {
    path: '/disaster-switch',
    name: 'disaster-switch',
    component: () => import(/* webpackChunkName: "disaster-switch" */ '../views/DisasterSwitch.vue')
}];

export default routes;
