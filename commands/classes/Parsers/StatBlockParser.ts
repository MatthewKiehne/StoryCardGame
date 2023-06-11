import { HtmlParser } from '../../interfaces/HtmlParser'
import * as jsdom from "jsdom";
import * as fs from 'fs';
import { StatBlock } from '../../interfaces/ObsidianData/StatBlock';

const { JSDOM } = jsdom;

export class CardParser implements HtmlParser<StatBlock> {
    
    private readonly tempOutputStatBlockDirectory = './tempStatBlockOutput';
    private readonly cardBasePath = './World Ideas/Stat Blocks';


    async ParseFromString(htmlString: string): Promise<StatBlock> {
        const dom = new JSDOM(htmlString);
        const result: StatBlock = {
            name: "",
            traits: [],
            behavior: [],
            abilities: [],
            woundSlots: []
        };

        const firstList = dom.window.document.querySelector("ul");

        if (firstList == null)
            return result;

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent;
            if (context == null)
                continue;

            if (context.startsWith("Name:")) {
                const data: string = context.substring("Title:".length).trim();
                result.name = data;
            }
            else if (context.startsWith("Abilities:")) {

                // result.textBlocks = getChildrenAsStrings(firstList.childNodes[c]);
            }

        }

        return result;
    }
}