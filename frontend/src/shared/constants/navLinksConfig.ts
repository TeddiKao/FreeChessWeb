type DashboardNavLinks = Array<{
    name: string,
    icon: string
    subLinks?: Array<{ name: string, path: string, icon: string }>,
    path?: string
}>

const dashboardNavLinks: DashboardNavLinks = [
    {
        name: "Home",
        icon: "/icons/dashboard/navbar/mainLinks/home-page-icon.svg",
        path: "/home"
    },

    {
        name: "Play",
        icon: "/icons/dashboard/navbar/mainLinks/play-links-icon.svg",
        subLinks: [
            {
                name: "Pass and Play",
                icon: "/icons/dashboard/navbar/mainLinks/pass-and-play-icon.svg",
                path: "/pass-and-play"
            },

            {
                name: "Play vs Bot",
                icon: "/icons/dashboard/navbar/mainLinks/play-vs-bot-icon.svg",
                path: "/select-bot"
            },

            {
                name: "Play vs Human",
                icon: "/icons/dashboard/navbar/mainLinks/play-vs-human-icon.svg",
                path: "/game-setup"
            },

            {
                name: "Game History",
                icon: "/icons/dashboard/navbar/mainLinks/game-history-icon.svg",
                path: "/game-history"
            }
        ]
    }
]

export { dashboardNavLinks }