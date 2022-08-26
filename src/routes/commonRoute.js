import ServiceBooking from "../pages/ServiceBooking";
import Home from "../pages/Home";

const commonRoute = [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/booking/:branchId/:serviceId',
        component: ServiceBooking,
        exact: true,
    },
]
export default commonRoute;
