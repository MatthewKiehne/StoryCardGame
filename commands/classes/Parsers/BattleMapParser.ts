import { HtmlParser } from "../../interfaces/HtmlParser";
import { BattleMap } from "../../interfaces/ObsidianData/BattleMap";
import * as jsdom from "jsdom";

const { JSDOM } = jsdom;

export class BattleMapParser implements HtmlParser<BattleMap>{
    async ParseFromString(htmlString: string): Promise<BattleMap> {
        const result: BattleMap = {
            name: "",
            width: 1,
            height: 1,
            url: "",
            statBlocks: "",
            behavior: ""
        }

        const dom = new JSDOM(htmlString);
        const firstList = dom.window.document.querySelector("ul");

        if (firstList == null)
            return result;

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent;
            if (context == null)
                continue;

            if (context.startsWith("Name:")) {
                result.name = context.substring("Name:".length).trim();
            }
            else if (context.startsWith("Width:")) 
            {
                result.width = parseInt(context.substring("Width:".length).trim());
            }
            else if (context.startsWith("Height:")) 
            {
                result.height = parseInt(context.substring("Height:".length).trim());
            }
            else if (context.startsWith("Url:")) 
            {
                result.url = context.substring("Url:".length).trim();;
            }
            else if (context.startsWith("StatBlocks:")) 
            {
                result.statBlocks = context.substring("StatBlocks:".length).trim();;
            }
            else if (context.startsWith("Behavior:")) 
            {
                result.behavior = context.substring("Behavior:".length).trim();;
            }
        }

        return result;
    }
}