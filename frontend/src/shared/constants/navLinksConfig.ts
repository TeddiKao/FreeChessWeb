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

            {
                name: "Play online",
                path: "/game-setup",
                icon: "/icons/dashboard/navbar/siteLinks/play-online.svg"
            },

            {
                name: "Game history",
                path: "/game-history",
                icon: "/icons/dashboard/navbar/siteLinks/game-history.svg"
            },
        ]
    }
]

export { dashboardNavLinks }