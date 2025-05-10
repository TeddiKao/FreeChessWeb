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
                icon: "/play-vs-bot-icon.svg",
                path: "/select-bot"
            },

            {
                name: "Play vs Human",
                icon: "/play-vs-human-icon.svg",
                path: "/game-setup"
            },

            {
                name: "Game History",
                icon: "/game-history-icon.svg",
                path: "/game-history"
            }
        ]
    }
]

export { dashboardNavLinks }