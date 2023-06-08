import { CardData } from "../ObsidianData/Card";

export interface RenderCardData extends CardData {
    orbLinks: string[]
    htmlTexts: string[]
}