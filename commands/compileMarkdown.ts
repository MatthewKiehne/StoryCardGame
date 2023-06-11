
import * as fs from 'fs';
import { CardData } from './interfaces/ObsidianData/Card';
import { CardParser } from './classes/Parsers/CardParser';
import { DirectoryToData } from './classes/Utils/DirectoryToData';
import { StatBlockParser } from './classes/Parsers/StatBlockParser';


async function compileAll() {

    const cardDirectory = './World Ideas/Cards';
    const cardOutputFile = './data/cardData.json';
    const cardIndexOutput = './data/cardToIndex.json';

    const statBlockDirectory = './World Ideas/Stat Blocks';
    const statBlockOutputFile = "./data/statBlock.json";
    const BattleMapDirectory = './World Ideas/BattleMaps';

    const markdownParser: DirectoryToData = new DirectoryToData();

    await markdownParser.parse(cardDirectory, cardOutputFile, new CardParser());
    await markdownParser.parse(statBlockDirectory, statBlockOutputFile, new StatBlockParser());

    // const cardParser: CardParser = new CardParser();
    // await createNewFile("./data/cardData.json", JSON.stringify(cardData));

    // const cardToIndexData: Map<string, number> = cardNameToIndex(cardData);
    // await createNewFile(, JSON.stringify(cardToIndexData));
}

function cardNameToIndex(cardData: CardData[]): Map<string, number> {
    const result = new Map<string, number>();

    for (let i = 0; i < cardData.length; i++) {
        result.set(cardData[i].name, i + 1);
    }

    return result;
}

async function createNewFile(path: string, data: any) {
    if ((await fs).existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true });
    }
    await fs.writeFileSync(path, data);
}

export { compileAll }