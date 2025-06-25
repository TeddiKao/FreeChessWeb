type BotInfo = {
    botId: string,
    botDisplayName: string,
    botRating: number,
    botDescription?: string,
    botImage?: string,
}

type BotCategoryInfo = {
    categoryId: string,
    categoryName: string,
    bots: Array<BotInfo>
}

type BotsTable = Array<BotCategoryInfo>

const bots: BotsTable = [
    {
        categoryId: "engines",
        categoryName: "Engines",
        bots: [
            {
                botId: "stockfish",
                botDisplayName: "Stockfish",
                botRating: 3642,
            }
        ]
    }
]

export { bots }
export type { BotInfo, BotCategoryInfo }