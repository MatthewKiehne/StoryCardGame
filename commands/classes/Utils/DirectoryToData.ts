import * as fs from 'fs';
import { HtmlParser } from "../../interfaces/HtmlParser";
import { MarkdownToHtml } from './MarkdownToHtml';

async function parseDirectoryToData<T>(inputDirectory: string, outputFile: string, parser: HtmlParser<T>) {

    const tempOutputCardDirectory = './tempOutput';

    const toHtml: MarkdownToHtml = new MarkdownToHtml();
    await toHtml.markdownToHtmlFile(inputDirectory, tempOutputCardDirectory);

    const data: T[] = [];

    var files = fs.readdirSync(tempOutputCardDirectory);

    for (let i = 0; i < files.length; i++) {
        const text = await fs.promises.readFile(tempOutputCardDirectory + "/" + files[i]);
        const htmlString = String(text)
        const parsedData: T = await parser.ParseFromString(htmlString);
        data.push(parsedData);
    }

    fs.rmSync(tempOutputCardDirectory, { recursive: true, force: true });

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true });
    }
    await fs.writeFileSync(outputFile, JSON.stringify(data));
}

export { parseDirectoryToData }