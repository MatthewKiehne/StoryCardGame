import { NamedData } from "../NamedData"

interface CardData extends NamedData {
    textBlocks: string[],
    orbs: number[] | null,
    tags: string,
    cost: string,
    rarity: string,
    quantity: number
}

export { CardData }