import express from 'express'
import * as cardList from './data/cardData.json';
import { CardData } from './commands/interfaces/ObsidianData/Card';
import { RenderCardData } from './commands/interfaces/DisplayData/RenderCardData';
import { compileAll } from './commands/compileMarkdown';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const pageSize: number = 9;
    let pageIndex: number = 0;
    let pages: RenderCardData[][] = [];

    while (pageSize * pageIndex < cardList.length) {
        let pageCardCount = pageSize
        if ((pageSize * pageIndex) + pageSize > cardList.length) {
            pageCardCount = cardList.length % pageSize
        }

        let page: RenderCardData[] = [];
        for (let i = 0; i < pageCardCount; i++) {
            const cardData: CardData = cardList[(pageSize * pageIndex) + i];

            const renderCardData: RenderCardData = 
            {
                name: cardData.name,
                orbs: cardData.orbs,
                textBlocks: cardData.textBlocks,
                orbLinks: [],
                htmlTexts: []
            };

            if (cardData.orbs == null || cardData.orbs.length == 0) {
                for (let c = 0; c < 4; c++) {
                    renderCardData.orbLinks.push(intToColorLink(3));
                }
            }
            else {
                for (let c = 0; c < cardData.orbs.length; c++) {
                    renderCardData.orbLinks.push(intToColorLink(cardData.orbs[c]));
                }
            }

            for (let cardTextIndex = 0; cardTextIndex < cardData.textBlocks.length; cardTextIndex++) {
                renderCardData.htmlTexts.push(textToHtmlText(cardData.textBlocks[cardTextIndex]));
            }

            page[i] = renderCardData;
        }

        pages[pageIndex] = page;
        pageIndex++;
    }

    res.render('home', { data: pages });
});

app.get('/orbCards', (req, res) => {
    const pageSize = 9;
    let pageIndex = 0;
    let pages: any[] = [];

    let linkCardList: any[] = [];

    for (let top = 0; top < 3; top++) {
        for (let right = 0; right < 3; right++) {
            for (let bottom = 0; bottom < 3; bottom++) {
                for (let left = 0; left < 3; left++) {
                    linkCardList.push({
                        orbs: [top, right, bottom, left]
                    })
                }
            }
        }
    }

    while (pageSize * pageIndex < linkCardList.length) {
        let pageCardCount = pageSize
        if ((pageSize * pageIndex) + pageSize > linkCardList.length) {
            pageCardCount = linkCardList.length % pageSize
        }

        let page: any = [];
        for (let i = 0; i < pageCardCount; i++) {

            const ordCardData = linkCardList[(pageSize * pageIndex) + i];

            let orbLinks: string[] = [];
            for (let c = 0; c < ordCardData.orbs.length; c++) {
                orbLinks[c] = intToColorLink(ordCardData.orbs[c]);
            }

            ordCardData.orbLinks = orbLinks;

            page[i] = ordCardData;
        }

        pages[pageIndex] = page;
        pageIndex++;
    }

    res.render('backs', { data: pages });
});

app.listen(3000, async () => {
    await compileAll();
    console.log('Server started on port 3000');
});

function intToColorLink(value: number) : string {
    if (value === 0) {
        return "pictures/CircleBlue.png"
    }
    else if (value === 1) {
        return "pictures/CircleRed.png"
    }
    else if (value === 2) {
        return "pictures/CircleGreen.png"
    }
    else if (value === 3) {
        return "pictures/CircleWhite.png"
    }

    return "pictures/CircleWhite.png"
}

function textToHtmlText(text: string): string {
    let stringToParse: string = text;
    if (text == null || text == "") {
        return ""
    }

    let result: string = "";
    let parseStart: number = stringToParse.indexOf("<");

    if (parseStart === -1) {
        return text;
    }

    while (parseStart != -1) {
        result = result + stringToParse.substring(0, parseStart);
        const parseEnd: number= stringToParse.indexOf(">");

        const parseIconValue = stringToParse.substring(parseStart + 1, parseEnd);
        result = result + parseIcon(parseIconValue);

        stringToParse = stringToParse.substring(parseEnd + 1);
        parseStart = stringToParse.indexOf("<");
    }

    return result;
}

function parseIcon(stringValue: string) {
    if (stringValue == null) {
        return "";
    }

    const valueParts = stringValue.split("|")
    let result = "<i class=\"icon-" + valueParts[0] + "\"";

    let styleString = "";

    for (let i = 1; i < valueParts.length; i++) {
        styleString = styleString + parseIconDescriptor(valueParts[i]) + ";";
    }

    if (styleString.length != 0) {
        result += "style=\"" + styleString + "\""
    }

    result = result + "></i>";
    return result;
}

function parseIconDescriptor(descriptor: string) {
    if (descriptor == null) {
        return "";
    }

    switch (descriptor.trim()) {
        case "black":
            return "color:black";
        case "white":
            return "color:white";
        case "blue":
            return "color:blue";
        case "green":
            return "color:green";
        case "red":
            return "color:red";
        default:
            return "";
    }
}