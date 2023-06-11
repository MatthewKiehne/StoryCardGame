import * as fs from 'fs';
import * as h from 'node:child_process';
import * as util from 'node:util';
import { HtmlParser } from '../../interfaces/HtmlParser';

const exec = util.promisify(h.exec);

class DirectoryToData {
    async parse<T>(inputDirectory: string, outputFile: string, parser: HtmlParser<T>) {
        const tempOutputCardDirectory = './tempOutput';

        await this.markdownToHtmlFile(inputDirectory, tempOutputCardDirectory);

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

    private async markdownToHtmlFile(sourceDirectory: string, outputDirectory: string) {
        if (fs.existsSync(outputDirectory)) {
            fs.rmSync(outputDirectory, { recursive: true, force: true });
        }

        fs.mkdirSync(outputDirectory)

        await this.convertMarkdownToHtml(sourceDirectory, outputDirectory);
    }

    private async convertMarkdownToHtml(currentPath: string, outputDirectory: string) {
        var files = fs.readdirSync(currentPath);

        for (let i = 0; i < files.length; i++) {
            const newPath = currentPath + "/" + files[i];
            const status = fs.lstatSync(newPath);

            if (status.isDirectory()) {
                await this.convertMarkdownToHtml(newPath, outputDirectory);
            }
            else if (status.isFile()) {
                if (newPath.endsWith(".md")) {
                    await this.runMarkdownToHtmlCommand(newPath, files[i], outputDirectory);
                }
            }
        }
    }

    private async runMarkdownToHtmlCommand(cardPath: string, fileName: string, outputDirectory: string): Promise<void> {
        const fileParts = fileName.split("\.");
        const { stdout, stderr } = await exec("pandoc -f markdown -t html \"" + cardPath + "\" -o \"" + outputDirectory + "\\" + fileParts[0] + ".html\"");
    }
}

export { DirectoryToData }