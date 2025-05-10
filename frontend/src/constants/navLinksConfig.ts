type DashboardNavLinks = Array<{
    name: string,
    icon: string
    subLinks?: Array<{ name: string, path: string, icon: string }>
}>

const dashboardNavLinks: DashboardNavLinks = [
    {
        name: "Home",
        icon: "/home-page-icon.svg"
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