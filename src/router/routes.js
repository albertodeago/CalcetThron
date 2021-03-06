const routes = [{
    path: '/',
    component: () =>
        import ('layouts/MyLayout.vue'),
    children: [
        {
            path: '',
            redirect: 'games',
            component: () => import ('pages/SeasonView.vue')
        },
        {
            path: 'season-view',
            redirect: 'games',
            component: () => import ('pages/SeasonView.vue')
        },
        {
            path: "games",
            component: () => import("pages/SeasonView.vue")
        },
        {
            path: "statistics",
            component: () => import("pages/SeasonView.vue")
        },
        {
            path: "elo",
            component: () => import("pages/SeasonView.vue")
        },
        {
            path: "awards",
            component: () => import("pages/SeasonView.vue")
        },
        {
            path: 'login',
            component: () => import ('pages/Login.vue')
        },
        {
            path: 'settings',
            component: () => import ('pages/Settings.vue')
        },
        {
            path: 'user/:id',
            component: () => import ('pages/User.vue')
        },
    ]
}]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () =>
            import ('pages/Error404.vue')
    })
}

export default routes