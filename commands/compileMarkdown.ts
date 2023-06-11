import * as fs from 'fs'
import { CardParser } from './classes/Parsers/CardParser'
import { DirectoryToData } from './classes/Utils/DirectoryToData'
import { StatBlockParser } from './classes/Parsers/StatBlockParser'
import { HtmlParser } from './interfaces/HtmlParser'

async function compileAll() {
    const cardDirectory = './World Ideas/Cards';
    await createFiles(cardDirectory, 'card', new CardParser());

    const statBlockDirectory = './World Ideas/Stat Blocks'
    await createFiles(statBlockDirectory, 'statBlock', new StatBlockParser())
}

async function createFiles<T>(sourceDirectory: string, dataName: string, htmlParser: HtmlParser<T>) {
    const dataDirectory = './data/' + dataName

    const dataFile = './data/' + dataName + '/' + dataName + 'Data.json'
    const toIndexFile = './data/' + dataName + '/' + dataName + 'ToIndex.json'
    const fromIndexFile = './data/' + dataName + '/' + dataName + 'FromIndex.json'
    const fromNameFile = './data/' + dataName + '/' + dataName + 'FromName.json'

    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory)
    }

    const markdownParser: DirectoryToData = new DirectoryToData()
    await markdownParser.parse(sourceDirectory, dataFile, htmlParser)

    await createFromIndexData(dataFile, fromIndexFile)
    await createToIndexData(dataFile, toIndexFile)
    await createFromNameData(dataFile, fromNameFile)
}

async function createFromIndexData(inputFile: string, outputFile: string) {
    const text: string = fs.readFileSync(inputFile, 'utf-8')
    const json: any[] = JSON.parse(text)

    const data: any = {}
    for (let i = 0; i < json.length; i++) {
        data[i] = json[i]
    }

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true })
    }
    await fs.writeFileSync(outputFile, JSON.stringify(data))
}

async function createToIndexData(inputFile: string, outputFile: string) {
    const text: string = fs.readFileSync(inputFile, 'utf-8')
    const json: any[] = JSON.parse(text)

    const data: any = {}
    for (let i = 0; i < json.length; i++) {
        data[json[i]['name']] = i
    }

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true })
    }
    await fs.writeFileSync(outputFile, JSON.stringify(data))
}

async function createFromNameData(inputFile: string, outputFile: string) {
    const text: string = fs.readFileSync(inputFile, 'utf-8')
    const json: any[] = JSON.parse(text)

    const data: any = {}
    for (let i = 0; i < json.length; i++) {
        data[json[i]['name']] = json[i]
    }

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true })
    }
    await fs.writeFileSync(outputFile, JSON.stringify(data))
}

export { compileAll }
