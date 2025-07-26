import { FaHome, FaInbox, FaMotorcycle, FaStar, FaUser } from "react-icons/fa";

export const adminLinks = [
    {
        name: "Dashboard",
        path: '/',
        icon: FaHome,
    },
    {
        name: "Products",
        path: '/products',
        icon: FaStar,
    },
    {
        name: "Renters",
        path: '/renters',
        icon: FaUser,
    },
    {
        name: "Reservations",
        path: '/reservations',
        icon: FaInbox,
    },
]
