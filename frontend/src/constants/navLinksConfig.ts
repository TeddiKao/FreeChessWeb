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
                icon: "/pass-and-play-icon.svg",
                path: "/pass-and-play"
            },

            {
                name: "Play vs Bot",
                icon: "/play-vs-bot.svg",
                path: "/select-bot"
            }
        ]
    }
]

export { dashboardNavLinks }