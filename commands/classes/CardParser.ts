import { HtmlParser } from '../interfaces/HtmlParser'
import { CardData } from '../interfaces/CardData'
import { MarkdownToHtml } from './MarkdownToHtml';
import * as jsdom from "jsdom";
import * as fs from 'fs';

const { JSDOM } = jsdom;

export class CardParser implements HtmlParser<CardData> {

    private readonly tempOutputCardDirectory = './tempOutput';
    private readonly cardBasePath = './World Ideas/Cards';

    async Parse(): Promise<CardData[]> {
        
        const toHtml: MarkdownToHtml = new MarkdownToHtml();
        await toHtml.markdownToHtmlFile(this.cardBasePath, this.tempOutputCardDirectory);

        const result: CardData[] = await this.convertFromHtmlToCardData(this.tempOutputCardDirectory);

        fs.rmSync(this.tempOutputCardDirectory, { recursive: true, force: true });

        return result;
    }

    private async convertFromHtmlToCardData(outputDirectory: string): Promise<CardData[]> {
        const result: CardData[] = [];

        var files = fs.readdirSync(outputDirectory);

        for (let i = 0; i < files.length; i++) {
            const data = await fs.promises.readFile(outputDirectory + "/" + files[i]);
            const htmlString = String(data)
            const cardData: CardData = this.convertHtmlStringToCardData(htmlString);
            result.push(cardData);
        }

        return result;
    }

    private convertHtmlStringToCardData(htmlString: string): CardData {
        const dom = new JSDOM(htmlString);
        const result: CardData = {
            name: "",
            textBlocks: []
        };

        const firstList = dom.window.document.querySelector("ul");

        if (firstList == null)
            return result;

        for (let c = 0; c < firstList.childNodes.length; c++) {
            const context: string | null = firstList.childNodes[c].textContent;
            if (context == null)
                continue;

            if (context.startsWith("Title:")) {
                const data: string = context.substring("Title:".length).trim();
                result.name = data;
            }
            else if (context.startsWith("Text:")) {
                const textBlocks: string[] = [];
                const nodes = firstList.childNodes[c].childNodes;

                for (let t = 0; t < nodes.length; t++) {
                    const lineData: string | null = nodes[t].textContent;
                    if (lineData != null && lineData !== "\n") {
                        textBlocks.push(lineData.trim().replace("\n", " "));
                    }
                }

                result.textBlocks = textBlocks;
            }

        }

        return result;
    }
}