import { HtmlParser } from "../../interfaces/HtmlParser";
import { Ability } from "../../interfaces/ObsidianData/Ability";

import * as jsdom from 'jsdom'
import { getChildrenAsStrings, parseChildren } from './ParseUtils'

const { JSDOM } = jsdom

export class AbilityParser implements HtmlParser<Ability>
{
    async ParseFromString(htmlString: string): Promise<Ability> {
        const dom = new JSDOM(htmlString)
        const result: Ability = {
            name: '',
            description: ''
        }

        const firstList = dom.window.document.querySelector('ul')

        if (firstList == null) return result

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent
            if (context == null) continue

            if (context.startsWith('Name:')) {
                result.name = context.substring('Name:'.length).trim()
            } else if (context.startsWith('Description:')) {
                result.description = context.substring('Description:'.length).trim()
            }
        }

        return result
    }
}