type DashboardNavLinks = Array<{
    name: string,
    icon: string
    subLinks?: Array<{ name: string, path: string, icon: string }>,
    path?: string
}>

const dashboardNavLinks: DashboardNavLinks = [
    {
        name: "Home",
        icon: "/icons/dashboard/navbar/siteLinks/home.svg",
        path: "/home"
    },

    {
        name: "Play",
        icon: "/icons/dashboard/navbar/siteLinks/play.svg",

        subLinks: [
            {
                name: "Play vs bot",
                path: "/select-bot",
                icon: "/icons/dashboard/navbar/siteLinks/play-vs-bot.svg"
            },
        ]
    }
]

export { dashboardNavLinks }