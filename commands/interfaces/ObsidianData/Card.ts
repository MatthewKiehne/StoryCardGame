import { NamedData } from "../NamedData"

interface CardData extends NamedData {
    textBlocks: string[],
    orbs: number[] | null
}

export { CardData }