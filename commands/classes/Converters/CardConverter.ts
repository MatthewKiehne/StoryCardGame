import { RenderCardData } from '../../interfaces/DisplayData/RenderCardData'
import { CardData } from '../../interfaces/ObsidianData/CardData'
import { HtmlInjector } from '../Injectors/HtmlInjector'
import { IconInjector } from '../Injectors/IconInjector'
import { InjectorContext } from '../Injectors/InjectorContext'
import { InjectorUtils } from '../Injectors/InjectorUtils'
import { DataConverter } from './DataConverter'

export class CardConverter implements DataConverter<CardData, RenderCardData> {
    
    convert(cardData: CardData, additionalData: any): RenderCardData {
        const renderCardData: RenderCardData = {
            name: cardData.name,
            orbs: cardData.orbs,
            textBlocks: cardData.textBlocks,
            tags: cardData.tags,
            cost: cardData.cost,
            quantity: cardData.quantity,
            rarity: cardData.rarity,
            orbLinks: [],
            htmlTexts: [],
            quantityIndex: additionalData.quantityIndex,
            setAbbreviation: 'bsc',
            cardIndex: additionalData.cardIndex,
            setQuantity: additionalData.setQuantity,
        }

        if (cardData.orbs == null || cardData.orbs.length == 0) {
            for (let c = 0; c < 4; c++) {
                renderCardData.orbLinks.push(this.intToColorLink(3))
            }
        } else {
            for (let c = 0; c < cardData.orbs.length; c++) {
                renderCardData.orbLinks.push(this.intToColorLink(cardData.orbs[c]))
            }
        }

        const injectors: HtmlInjector[] = [
            new IconInjector()
        ];

        const injectorContext: InjectorContext = {
            card: renderCardData
        }

        for (let cardTextIndex = 0; cardTextIndex < cardData.textBlocks.length; cardTextIndex++) {
            const html: string = InjectorUtils.textToHtmlText(cardData.textBlocks[cardTextIndex], injectors, injectorContext);
            renderCardData.htmlTexts.push(html);
        }

        return renderCardData
    }

    public intToColorLink(value: number): string {
        if (value === 0) {
            return 'pictures/CircleBlue.png'
        } else if (value === 1) {
            return 'pictures/CircleRed.png'
        } else if (value === 2) {
            return 'pictures/CircleGreen.png'
        } else if (value === 3) {
            return 'pictures/CircleWhite.png'
        }

        return 'pictures/CircleWhite.png'
    }

    public intToColorSquareLink(value: number): string {
        if (value === 0) {
            return 'pictures/SquareBlue.png'
        } else if (value === 1) {
            return 'pictures/SquareRed.png'
        } else if (value === 2) {
            return 'pictures/SquareGreen.png'
        } else if (value === 3) {
            return 'pictures/SquareWhite.png'
        }

        return 'pictures/SquareWhite.png'
    }
}
