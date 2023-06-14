import { HtmlParser } from '../../interfaces/HtmlParser'
import { StoryArc } from '../../interfaces/ObsidianData/StoryArc'

import * as jsdom from 'jsdom'
import { parseChildren } from './ParseUtils'
import { StoryBeatParser } from './StoryBeatParser'
const { JSDOM } = jsdom

export class StoryArcParser implements HtmlParser<StoryArc> {
    async ParseFromString(htmlString: string): Promise<StoryArc> {
        const dom = new JSDOM(htmlString)
        const result: StoryArc = {
            name: '',
            storyBeats: [],
            startingIndex: 0
        }

        const firstList = dom.window.document.querySelector('ul')

        if (firstList == null) return result

        const storyBeatParser: StoryBeatParser = new StoryBeatParser()

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent
            if (context == null) continue

            if (context.startsWith('Name:')) {
                result.name = context.substring('Name:'.length).trim()
            } else if (context.startsWith('Story Beats:')) {
                result.storyBeats = await parseChildren(firstList.childNodes[c], storyBeatParser)
            }
        }

        return result
    }
}
