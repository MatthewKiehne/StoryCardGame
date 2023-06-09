import { HtmlParser } from '../../interfaces/HtmlParser';
import { CardData } from '../../interfaces/ObsidianData/CardData';
import * as jsdom from 'jsdom';
import { getChildrenAsStrings } from './ParseUtils';

const { JSDOM } = jsdom;

export class CardParser implements HtmlParser<CardData> {
    async ParseFromString(htmlString: string): Promise<CardData> {
        const dom = new JSDOM(htmlString);
        const result: CardData = {
            name: '',
            textBlocks: [],
            orbs: null,
            cost: '',
            tags: '',
            rarity: 'C',
            quantity: 1,
            index: 0,
        };

        const firstList = dom.window.document.querySelector('ul');

        if (firstList == null) return result;

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent;
            if (context == null) continue;

            if (context.startsWith('Title:')) {
                result.name = context.substring('Title:'.length).trim();
            } else if (context.startsWith('Text:')) {
                result.textBlocks = getChildrenAsStrings(firstList.childNodes[c]);
            } else if (context.startsWith('Tags:')) {
                result.tags = context.substring('Tags:'.length).trim();
            } else if (context.startsWith('Cost:')) {
                result.cost = context.substring('Cost:'.length).trim();
            } else if (context.startsWith('Rarity:')) {
                result.rarity = context.substring('Rarity:'.length).trim();
            } else if (context.startsWith('Quantity:')) {
                result.quantity = parseInt(context.substring('Quantity:'.length).trim());
            }
        }

        return result;
    }
}
