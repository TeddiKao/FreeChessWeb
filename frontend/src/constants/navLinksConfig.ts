type DashboardNavLinks = Array<{
    name: string,
    icon: string
    subLinks?: Array<{ name: string, path: string, icon: string }>,
    path?: string
}>

const dashboardNavLinks: DashboardNavLinks = [
    {
        name: "Home",
        icon: "/home-page-icon.svg",
        path: "/home"
    },

    {
        name: "Play",
        icon: "/play-links-icon.svg",
        subLinks: [
            {
                name: "Pass and Play",
                icon: "/play-links-icon.svg",
                path: "/pass-and-play"
            }
        ]
    }
]

export { dashboardNavLinks }