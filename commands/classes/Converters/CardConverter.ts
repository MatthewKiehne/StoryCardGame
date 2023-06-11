import { RenderCardData } from '../../interfaces/DisplayData/RenderCardData'
import { CardData } from '../../interfaces/ObsidianData/Card'
import { DataConverter } from './DataConverter'

export class CardConverter implements DataConverter<CardData, RenderCardData> {
    private readonly startCustomBracket: string = '&lt;'
    private readonly endCustomBracket: string = '&gt;'

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

        for (let cardTextIndex = 0; cardTextIndex < cardData.textBlocks.length; cardTextIndex++) {
            renderCardData.htmlTexts.push(this.textToHtmlText(cardData.textBlocks[cardTextIndex]))
        }

        return renderCardData
    }

    private intToColorLink(value: number): string {
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

    private textToHtmlText(text: string): string {
        let stringToParse: string = text
        if (text == null || text == '') {
            return ''
        }

        let result: string = ''
        let parseStart: number = stringToParse.indexOf(this.startCustomBracket)

        if (parseStart === -1) {
            return text
        }

        while (parseStart != -1) {
            result = result + stringToParse.substring(0, parseStart)
            const parseEnd: number = stringToParse.indexOf(this.endCustomBracket)

            const parseIconValue = stringToParse.substring(parseStart + this.startCustomBracket.length, parseEnd)
            result = result + this.parseIcon(parseIconValue)

            stringToParse = stringToParse.substring(parseEnd + this.endCustomBracket.length)
            parseStart = stringToParse.indexOf(this.startCustomBracket)
        }

        return result
    }

    private parseIcon(stringValue: string) {
        if (stringValue == null) {
            return ''
        }

        const valueParts = stringValue.split('|')
        let result = '<i class="icon-' + valueParts[0] + '"'

        let styleString = ''

        for (let i = 1; i < valueParts.length; i++) {
            styleString = styleString + this.parseIconDescriptor(valueParts[i]) + ';'
        }

        if (styleString.length != 0) {
            result += 'style="' + styleString + '"'
        }

        result = result + '></i>'
        return result
    }

    private parseIconDescriptor(descriptor: string) {
        if (descriptor == null) {
            return ''
        }

        switch (descriptor.trim()) {
            case 'black':
                return 'color:black'
            case 'white':
                return 'color:white'
            case 'blue':
                return 'color:blue'
            case 'green':
                return 'color:green'
            case 'red':
                return 'color:red'
            default:
                return ''
        }
    }
}
