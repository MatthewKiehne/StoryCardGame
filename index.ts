import express from 'express';
import { CardData } from './commands/interfaces/ObsidianData/CardData';
import { RenderCardData } from './commands/interfaces/DisplayData/RenderCardData';
import { DataBaseLookUp, compileAll } from './commands/compileMarkdown';
import * as fs from 'fs';
import { CardConverter } from './commands/classes/Converters/CardConverter';
import { BattleMapConverter } from './commands/classes/Converters/BattleMapConverter';
import { BattleMap } from './commands/interfaces/ObsidianData/BattleMap';
import { RenderBattleMap } from './commands/interfaces/DisplayData/RenderBattleMap';
import { EventBeatConverter } from './commands/classes/Converters/EventConverter';
import { RenderEventBeat } from './commands/interfaces/DisplayData/RenderEventBeat';
import { EventArc } from './commands/interfaces/ObsidianData/StoryArc';
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const pageSize: number = 9;
    let pageIndex: number = 0;
    let pages: RenderCardData[][] = [];

    const text: string = fs.readFileSync('./data/card/cardData.json', 'utf-8');
    let cardList: CardData[] = JSON.parse(text);
    cardList = cardList.sort((a, b) => a.name.localeCompare(b.name));

    const cardConverter: CardConverter = new CardConverter();

    let currentPage: RenderCardData[] = [];
    for (let c = 0; c < cardList.length; c++) {
        const cardData = cardList[c];

        let cardQuantity = cardData.quantity;
        if (cardQuantity < 1) {
            cardQuantity = 1;
        } else if (cardQuantity > 4) {
            cardQuantity = 4;
        }
        cardData.quantity = cardQuantity;

        for (let q = 0; q < cardQuantity; q++) {
            const additionalData = {
                quantityIndex: q + 1,
                cardIndex: c + 1,
                setQuantity: cardList.length,
            };
            const renderCardData: RenderCardData = cardConverter.convert(cardData, additionalData);
            currentPage.push(renderCardData);

            if (currentPage.length == pageSize) {
                pages.push(currentPage);
                currentPage = [];
            }
        }
    }

    if (currentPage.length != 0) {
        pages.push(currentPage);
    }

    res.render('cards', { data: pages });
});

app.get('/backs', (req, res) => {
    let linkCardList: any[] = [];

    const cardConverter: CardConverter = new CardConverter();

    for (let top = 0; top < 3; top++) {
        for (let right = 0; right < 3; right++) {
            for (let bottom = 0; bottom < 3; bottom++) {
                for (let left = 0; left < 3; left++) {
                    linkCardList.push({
                        orbLinks: [
                            cardConverter.intToColorSquareLink(top),
                            cardConverter.intToColorSquareLink(right),
                            cardConverter.intToColorSquareLink(bottom),
                            cardConverter.intToColorSquareLink(left),
                        ],
                    });
                }
            }
        }
    }

    res.render('backs', { data: linkCardList });
});

app.get('/battleMaps', (req, res) => {
    const text: string = fs.readFileSync('./data/battleMaps/battleMapsData.json', 'utf-8');
    let battleMaps: BattleMap[] = JSON.parse(text);
    battleMaps = battleMaps.sort((a, b) => a.name.localeCompare(b.name));

    const battleMapConverter: BattleMapConverter = new BattleMapConverter();

    const data: RenderBattleMap[] = [];
    for (let i = 0; i < battleMaps.length; i++) {
        data.push(battleMapConverter.convert(battleMaps[i], {}));
    }

    res.render('battleMaps', { data: data });
});

app.get('/events', (req, res) => {

    const events: EventArc[] = DataBaseLookUp.getAs<EventArc>(DataBaseLookUp.eventsDataName).data;

    const converter: EventBeatConverter = new EventBeatConverter();

    const data: RenderEventBeat[] = [];
    for (let a = 0; a < events.length; a++) {
        for (let b = 0; b < events[a].eventBeats.length; b++) {
            const renderData: RenderEventBeat = converter.convert(events[a].eventBeats[b], { eventArcName: events[a].name });
            data[renderData.index] = renderData;
        }
    }

    res.render('eventsGrid', { data: data });
});

app.listen(3000, async () => {
    await compileAll();
    console.log('Server started on port 3000');
});
