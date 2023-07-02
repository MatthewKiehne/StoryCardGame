import { CardData } from "../ObsidianData/CardData";

export interface RenderCardData extends CardData {
    orbLinks: string[],
    htmlTexts: string[],
    quantityIndex: number,
    setAbbreviation: string,
    cardIndex: number,
    setQuantity: number
}