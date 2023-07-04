import { HtmlParser } from '../../interfaces/HtmlParser';

import * as jsdom from 'jsdom';
import { EventBeat } from '../../interfaces/ObsidianData/StoryBeat';
import { HtmlInjector } from '../Injectors/HtmlInjector';
const { JSDOM } = jsdom;

export class StoryBeatParser implements HtmlParser<EventBeat> {
    async ParseFromString(htmlString: string): Promise<EventBeat> {
        const dom = new JSDOM(htmlString);
        const result: EventBeat = {
            name: '',
            text: [],
            index: 0,
        };

        const titleElement = dom.window.document.querySelector('li');
        const name = titleElement?.textContent;
        const b = titleElement?.innerHTML;
        const c = titleElement?.outerHTML;
        const d = titleElement?.outerText;
        const e = titleElement?.innerText;

        if (titleElement !== null && titleElement?.textContent !== null) {
            const context = titleElement.textContent.substring('Title:'.length);
            const parts: string[] = context.split('\n');
            result.name = parts[0].trim();
        }

        const firstList = dom.window.document.querySelector('ul');

        if (firstList == null) return result;

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent;

            if (this.isBlank(context)) continue;

            const e = firstList.childNodes[c] as HTMLElement;
            result.text.push(e.innerHTML);
        }

        return result;
    }

    private isBlank(value: string | undefined | null): boolean {
        if (value === null || value === undefined) {
            return true;
        }

        const trimmed: string = value.trim();

        return trimmed === '' || trimmed === '\n';
    }
}
