type DashboardNavLinks = Array<{
    name: string,
    icon: string
    subLinks?: Array<{ name: string, path: string, icon: string }>
}>

const dashboardNavLinks: DashboardNavLinks = [
    {
        name: "Home",
        icon: "/home-page-icon.svg"
    }
]

export { dashboardNavLinks }