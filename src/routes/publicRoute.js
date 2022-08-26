import About from "../pages/About";
import Studios from "../pages/Studios";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Activation from "../pages/Activation";

const publicRoute = [
    {
        path: '/about',
        component: About,
        exact: true,
    },
    {
        path: '/studios',
        component: Studios,
        exact: true,
    },
    {
        path: '/login',
        component: Login,
        exact: true,
    },
    {
        path: '/register',
        component: Register,
        exact: true,
    },
    {
        path: '/activation/:email',
        component: Activation,
        exact: true,
    },
]
export default publicRoute;
