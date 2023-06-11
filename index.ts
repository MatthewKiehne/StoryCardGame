import express from 'express'
import { CardData } from './commands/interfaces/ObsidianData/Card'
import { RenderCardData } from './commands/interfaces/DisplayData/RenderCardData'
import { compileAll } from './commands/compileMarkdown'
import * as fs from 'fs'
import { CardConverter } from './commands/classes/Converters/CardConverter'
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    const pageSize: number = 9
    let pageIndex: number = 0
    let pages: RenderCardData[][] = []

    const text: string = fs.readFileSync('./data/card/cardData.json', 'utf-8')
    let cardList: CardData[] = JSON.parse(text)
    cardList = cardList.sort((a, b) => a.name.localeCompare(b.name))

    const cardConverter: CardConverter = new CardConverter();

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
            const additionalData = {
                quantityIndex: q + 1,
                cardIndex: c + 1,
                setQuantity: cardList.length
            }
            const renderCardData: RenderCardData = cardConverter.convert(cardData, additionalData);
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
                // orbLinks[c] = intToColorLink(ordCardData.orbs[c])
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






