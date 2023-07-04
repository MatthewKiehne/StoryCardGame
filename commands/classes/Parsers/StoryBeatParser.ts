import { HtmlParser } from '../../interfaces/HtmlParser';

import * as jsdom from 'jsdom';
import { EventBeat } from '../../interfaces/ObsidianData/StoryBeat';
const { JSDOM } = jsdom;

export class StoryBeatParser implements HtmlParser<EventBeat> {
    async ParseFromString(htmlString: string): Promise<EventBeat> {
        const dom = new JSDOM(htmlString);
        const result: EventBeat = {
            name: '',
            text: '',
            index: 0,
        };

        const text = dom.window.document.querySelector('li') as HTMLElement;
        result.text = text.innerHTML;

        return result;
    }
}
