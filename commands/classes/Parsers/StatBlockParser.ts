import { HtmlParser } from '../../interfaces/HtmlParser';
import * as jsdom from 'jsdom';
import { StatBlock } from '../../interfaces/ObsidianData/StatBlock';
import { getChildrenAsStrings, parseChildren } from './ParseUtils';
import { AbilityParser } from './AbilityParser';

const { JSDOM } = jsdom;

export class StatBlockParser implements HtmlParser<StatBlock> {
    async ParseFromString(htmlString: string): Promise<StatBlock> {
        const dom = new JSDOM(htmlString);
        const result: StatBlock = {
            name: '',
            traits: '',
            behaviors: [],
            abilities: [],
            woundSlots: [],
            index: 0,
        };

        const firstList = dom.window.document.querySelector('ul');

        if (firstList == null) return result;

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent;
            if (context == null) continue;

            if (context.startsWith('Name:')) {
                result.name = context.substring('Name:'.length).trim();
            } else if (context.startsWith('Traits:')) {
                result.traits = context.substring('Traits:'.length).trim();
            } else if (context.startsWith('Behavior:')) {
                result.behaviors = getChildrenAsStrings(firstList.childNodes[c]);
            } else if (context.startsWith('Wound Slots:')) {
                result.woundSlots = getChildrenAsStrings(firstList.childNodes[c]);
            } else if (context.startsWith('Abilities:')) {
                result.abilities = await parseChildren(firstList.childNodes[c], new AbilityParser());
            }
        }

        return result;
    }
}
