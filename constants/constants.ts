import { FaHome, FaInbox, FaMotorcycle, FaStar, FaUser } from "react-icons/fa";

export const adminLinks = [
    {
        name: "Dashboard",
        path: '/admin',
        icon: FaHome,
    },
    {
        name: "Reservations",
        path: '/admin/reservations',
        icon: FaInbox,
    },
    {
        name: "Renters",
        path: '/admin/renters',
        icon: FaUser,
    },
    {
        name: "Reviews",
        path: '/admin/reviews',
        icon: FaStar,
    },
    {
        name: "Scooters",
        path: '/admin/scooters',
        icon: FaMotorcycle,
    },
]
