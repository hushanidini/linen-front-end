import Dashboard from "../pages/admin/Dashboard";
import Branch from "../pages/admin/Branch";
import Service from "../pages/admin/Service";
import Shift from "../pages/admin/Shift";
import ServiceDetails from "../pages/admin/ServiceDetails";
import BranchDetails from "../pages/admin/BranchDetails";
import Managers from "../pages/admin/Managers";
import Membership from "../pages/admin/Memberships";
import Coupon from "../pages/admin/Coupon";
import Booking from "../pages/admin/Booking";
import Invoice from "../pages/Invoice";
import InvoiceDetails from "../pages/InvoiceDetails";
import UserProfile from "../pages/UserProfile";
import BookingDetails from "../pages/admin/BookingDetails";

const privateRoute = [
    {
        path: '/dashboard',
        component: Dashboard,
        exact: true,
    },
    {
        path: '/location',
        component: Branch,
        exact: true,
    },
    {
        path: '/branch/details/:branchId',
        component: BranchDetails,
        exact: true,
    },
    {
        path: '/service',
        component: Service,
        exact: true,
    },
    {
        path: '/shift',
        component: Shift,
        exact: true,
    },
    {
        path: '/service/details/:serviceId',
        component: ServiceDetails,
        exact: true,
    },
    {
        path: '/managers',
        component: Managers,
        exact: true,
    },
    {
        path: '/membership',
        component: Membership,
        exact: true,
    },
    {
        path: '/coupon',
        component: Coupon,
        exact: true,
    },
    {
        path: '/booking-slots',
        component: Booking,
        exact: true,
    },
    {
        path: '/invoices',
        component: Invoice,
        exact: true,
    },
    {
        path: '/invoices/:invoiceId',
        component: InvoiceDetails,
        exact: true,
    },
    {
        path: '/profile',
        component: UserProfile,
        exact: true,
    },
    {
        path: '/booking-details',
        component: BookingDetails,
        exact: true,
    },
]
export default privateRoute;
