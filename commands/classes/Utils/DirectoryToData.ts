import * as fs from 'fs'
import * as h from 'node:child_process'
import * as util from 'node:util'
import { HtmlParser } from '../../interfaces/HtmlParser'
import { NamedData } from '../../interfaces/NamedData'

const exec = util.promisify(h.exec)

class DirectoryToData {
    async parse(inputDirectory: string, outputFile: string, parser: HtmlParser<NamedData>, callback: (data: NamedData[]) => void): Promise<NamedData[]> {
        const tempOutputCardDirectory = './tempOutput'

        await this.markdownToHtmlFile(inputDirectory, tempOutputCardDirectory)

        const data: NamedData[] = []

        var files = fs.readdirSync(tempOutputCardDirectory)

        for (let i = 0; i < files.length; i++) {
            const text = await fs.promises.readFile(tempOutputCardDirectory + '/' + files[i])
            const htmlString = String(text)
            const parsedData: NamedData = await parser.ParseFromString(htmlString)
            data.push(parsedData)
        }

        if (callback !== undefined) {
            callback(data)
        }

        const randomizedData = this.randomizeIndexes(data)

        fs.rmSync(tempOutputCardDirectory, { recursive: true, force: true })

        if ((await fs).existsSync(outputFile)) {
            fs.rmSync(outputFile, { recursive: true, force: true })
        }
        await fs.writeFileSync(outputFile, JSON.stringify(randomizedData))

        return randomizedData
    }

    private async markdownToHtmlFile(sourceDirectory: string, outputDirectory: string) {
        if (fs.existsSync(outputDirectory)) {
            fs.rmSync(outputDirectory, { recursive: true, force: true })
        }

        fs.mkdirSync(outputDirectory)

        await this.convertMarkdownToHtml(sourceDirectory, outputDirectory)
    }

    private async convertMarkdownToHtml(currentPath: string, outputDirectory: string) {
        var files = fs.readdirSync(currentPath)

        for (let i = 0; i < files.length; i++) {
            const newPath = currentPath + '/' + files[i]
            const status = fs.lstatSync(newPath)

            if (status.isDirectory()) {
                await this.convertMarkdownToHtml(newPath, outputDirectory)
            } else if (status.isFile()) {
                if (newPath.endsWith('.md')) {
                    await this.runMarkdownToHtmlCommand(newPath, files[i], outputDirectory)
                }
            }
        }
    }

    private async runMarkdownToHtmlCommand(cardPath: string, fileName: string, outputDirectory: string): Promise<void> {
        const fileParts = fileName.split('.')
        const { stdout, stderr } = await exec('pandoc -f markdown -t html "' + cardPath + '" -o "' + outputDirectory + '\\' + fileParts[0] + '.html"')
    }

    private randomizeIndexes(data: NamedData[]): NamedData[] {
        const positions: number[] = []
        for (let a = 0; a < data.length; a++) {
            positions.push(positions.length)
        }

        for (let i = 0; i < positions.length * 7; i++) {
            const first = this.getRandomInt(positions.length)
            const second = this.getRandomInt(positions.length)

            const temp = positions[first];
            positions[first] = positions[second];
            positions[second] = temp;
        }

        for (let i = 0; i < data.length; i++) {
            data[i].index = positions[i]
        }

        return data
    }

    private getRandomInt(max: number) {
        return Math.floor(Math.random() * max)
    }
}

export { DirectoryToData }
