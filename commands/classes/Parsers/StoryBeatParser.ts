import { HtmlParser } from "../../interfaces/HtmlParser";
import { StoryBeat } from "../../interfaces/ObsidianData/StoryBeat";

import * as jsdom from 'jsdom'
const { JSDOM } = jsdom

export class StoryBeatParser implements HtmlParser<StoryBeat>{
    async ParseFromString(htmlString: string): Promise<StoryBeat> {
        const dom = new JSDOM(htmlString)
        const result: StoryBeat = {
            name: '',
            text: "",
            index: 0
        }

        const text = dom.window.document.querySelector("li") as HTMLElement;
        result.text = text.innerHTML;

        return result;
    }
}