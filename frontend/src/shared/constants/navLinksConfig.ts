type DashboardNavLinks = Array<{
    name: string,
    icon: string
    subLinks?: Array<{ name: string, path: string, icon: string }>,
    path?: string
}>

const dashboardNavLinks: DashboardNavLinks = [
    {
        name: "Home",
        icon: "/icons/dashboar/navbar/siteLinks/home.svg",
        path: "/home"
    }
]

export { dashboardNavLinks }