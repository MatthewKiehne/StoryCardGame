import express from 'express'
import { CardData } from './commands/interfaces/ObsidianData/Card'
import { RenderCardData } from './commands/interfaces/DisplayData/RenderCardData'
import { compileAll } from './commands/compileMarkdown'
import * as fs from 'fs'

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

const startCustomBracket: string = '&lt;';
const endCustomBracket: string = '&gt;';

app.get('/', (req, res) => {
    const pageSize: number = 9
    let pageIndex: number = 0
    let pages: RenderCardData[][] = []

    const text: string = fs.readFileSync('./data/cardData.json', 'utf-8')
    let cardList: CardData[] = JSON.parse(text)
    cardList = cardList.sort((a, b) => a.name.localeCompare(b.name))

    let currentPage: RenderCardData[] = []
    for (let c = 0; c < cardList.length; c++) {
        const cardData = cardList[c]

        let cardQuantity = cardData.quantity
        if (cardQuantity < 1) {
            cardQuantity = 1
        } else if (cardQuantity > 4) {
            cardQuantity = 4
        }
        cardData.quantity = cardQuantity

        for (let q = 0; q < cardQuantity; q++) {
            const renderCardData: RenderCardData = generateRenderCardData(cardData, q + 1, c + 1, cardList.length)
            currentPage.push(renderCardData)

            if (currentPage.length == pageSize) {
                pages.push(currentPage)
                currentPage = []
            }
        }
    }

    if (currentPage.length != 0) {
        pages.push(currentPage)
    }

    res.render('cards', { data: pages })
})

app.get('/orbCards', (req, res) => {
    const pageSize = 9
    let pageIndex = 0
    let pages: any[] = []

    let linkCardList: any[] = []

    for (let top = 0; top < 3; top++) {
        for (let right = 0; right < 3; right++) {
            for (let bottom = 0; bottom < 3; bottom++) {
                for (let left = 0; left < 3; left++) {
                    linkCardList.push({
                        orbs: [top, right, bottom, left],
                    })
                }
            }
        }
    }

    while (pageSize * pageIndex < linkCardList.length) {
        let pageCardCount = pageSize
        if (pageSize * pageIndex + pageSize > linkCardList.length) {
            pageCardCount = linkCardList.length % pageSize
        }

        let page: any = []
        for (let i = 0; i < pageCardCount; i++) {
            const ordCardData = linkCardList[pageSize * pageIndex + i]

            let orbLinks: string[] = []
            for (let c = 0; c < ordCardData.orbs.length; c++) {
                orbLinks[c] = intToColorLink(ordCardData.orbs[c])
            }

            ordCardData.orbLinks = orbLinks

            page[i] = ordCardData
        }

        pages[pageIndex] = page
        pageIndex++
    }

    res.render('backs', { data: pages })
})

app.listen(3000, async () => {
    await compileAll()
    console.log('Server started on port 3000')
})

function generateRenderCardData(cardData: CardData, quantityIndex: number, cardIndex: number, setQuantity: number): RenderCardData {
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
        quantityIndex: quantityIndex,
        setAbbreviation: 'bsc',
        cardIndex: cardIndex,
        setQuantity: setQuantity,
    }

    if (cardData.orbs == null || cardData.orbs.length == 0) {
        for (let c = 0; c < 4; c++) {
            renderCardData.orbLinks.push(intToColorLink(3))
        }
    } else {
        for (let c = 0; c < cardData.orbs.length; c++) {
            renderCardData.orbLinks.push(intToColorLink(cardData.orbs[c]))
        }
    }

    for (let cardTextIndex = 0; cardTextIndex < cardData.textBlocks.length; cardTextIndex++) {
        renderCardData.htmlTexts.push(textToHtmlText(cardData.textBlocks[cardTextIndex]))
    }

    return renderCardData
}

function intToColorLink(value: number): string {
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

function textToHtmlText(text: string): string {
    let stringToParse: string = text
    if (text == null || text == '') {
        return ''
    }

    let result: string = ''
    let parseStart: number = stringToParse.indexOf(startCustomBracket)

    if (parseStart === -1) {
        return text
    }

    while (parseStart != -1) {
        result = result + stringToParse.substring(0, parseStart)
        const parseEnd: number = stringToParse.indexOf(endCustomBracket)

        const parseIconValue = stringToParse.substring(parseStart + startCustomBracket.length, parseEnd)
        result = result + parseIcon(parseIconValue)

        stringToParse = stringToParse.substring(parseEnd + endCustomBracket.length)
        parseStart = stringToParse.indexOf(startCustomBracket)
        
        // if (parseStart != -1) {
        //     parseStart += '&lt;'.length
        // }
    }

    return result
}

function parseIcon(stringValue: string) {
    if (stringValue == null) {
        return ''
    }

    const valueParts = stringValue.split('|')
    let result = '<i class="icon-' + valueParts[0] + '"'

    let styleString = ''

    for (let i = 1; i < valueParts.length; i++) {
        styleString = styleString + parseIconDescriptor(valueParts[i]) + ';'
    }

    if (styleString.length != 0) {
        result += 'style="' + styleString + '"'
    }

    result = result + '></i>'
    return result
}

function parseIconDescriptor(descriptor: string) {
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
