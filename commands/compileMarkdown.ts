
import * as fs from 'fs';
import { CardData } from './interfaces/CardData';
import { CardParser } from './classes/CardParser';


async function createAllCards() {

    const cardParser: CardParser = new CardParser();
    const cardData: CardData[] = await cardParser.Parse();
    await createNewFile("./data/cardData.json", JSON.stringify(cardData));

    const cardToIndexData: Map<string, number> = cardNameToIndex(cardData);
    await createNewFile("./data/cardToIndex.json", JSON.stringify(cardToIndexData));
}

function cardNameToIndex(cardData: CardData[]): Map<string, number> {
    const result = new Map<string, number>();

    for (let i = 0; i < cardData.length; i++) {
        result.set(cardData[i].name, i + 1);
    }

    return result;
}

async function createNewFile(path: string, data: any)
{
    if ((await fs).existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true });
    }
    await fs.writeFileSync(path, data);
}

createAllCards();