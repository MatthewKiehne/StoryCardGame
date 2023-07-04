import * as fs from 'fs'
import { CardParser } from './classes/Parsers/CardParser'
import { DirectoryToData } from './classes/Utils/DirectoryToData'
import { StatBlockParser } from './classes/Parsers/StatBlockParser'
import { HtmlParser } from './interfaces/HtmlParser'
import { BattleMapParser } from './classes/Parsers/BattleMapParser'
import { StoryArcParser } from './classes/Parsers/StoryArcParser'
import { NamedData } from './interfaces/NamedData'
import { DataBaseCollection, DataBaseLookUp } from './classes/Lookup/DataBaseLookUp'

async function compileAll() {
    DataBaseLookUp.Collections = new Map<string, DataBaseCollection<any>>()

    const cardDirectory = './World Ideas/Cards'
    await createFiles(cardDirectory, DataBaseLookUp.cardDataName, new CardParser())

    const statBlockDirectory = './World Ideas/Stat Blocks'
    await createFiles(statBlockDirectory, DataBaseLookUp.statBlockDataName, new StatBlockParser())

    const battleMapDirectory = './World Ideas/BattleMaps'
    await createFiles(battleMapDirectory, DataBaseLookUp.battleMapDataName, new BattleMapParser())

    const storyBeatDirectory = './World Ideas/Events'
    await createFiles(storyBeatDirectory, DataBaseLookUp.eventsDataName, new StoryArcParser())
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
    const data: T[] = await markdownParser.parse(sourceDirectory, dataFile, htmlParser)

    const collection: DataBaseCollection<T> = {
        data: data,
        indexedData: await createFromIndexData(data, fromIndexFile),
        nameToIndex: await createToIndexData(data, toIndexFile),
        nameToData: await createFromNameData(data, fromNameFile),
    }

    DataBaseLookUp.Collections.set(dataName, collection)
}

async function createFromIndexData<T>(parsedData: T[], outputFile: string): Promise<Map<number, T>> {
    const data: Map<number, T> = new Map<number, T>()
    const fileData: any = {}

    for (let i = 0; i < parsedData.length; i++) {
        data.set(i, parsedData[i])
        fileData[i] = parsedData[i]
    }

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true })
    }

    await fs.writeFileSync(outputFile, JSON.stringify(fileData))
    return data
}

async function createToIndexData<T>(parsedData: T[], outputFile: string): Promise<Map<string, number>> {
    const data: Map<string, number> = new Map<string, number>()
    const fileData: any = {}

    if (parsedData === undefined) {
        return data
    }

    for (let i = 0; i < parsedData.length; i++) {
        const a = parsedData.at(i) as NamedData | undefined
        if (a !== undefined && a.name !== undefined) {
            data.set(a.name, i)
            fileData[a.name] = i
        }
    }

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true })
    }

    await fs.writeFileSync(outputFile, JSON.stringify(fileData))
    return data
}

async function createFromNameData<T>(parsedData: T[], outputFile: string): Promise<Map<string, T>> {
    const data: Map<string, T> = new Map<string, T>()
    const fileData: any = {}
    for (let i = 0; i < parsedData.length; i++) {
        const a = parsedData.at(i) as undefined | NamedData
        if (a !== undefined) {
            const b = a as T
            data.set(a.name as string, b)
            fileData[a.name] = b
        }
    }

    if ((await fs).existsSync(outputFile)) {
        fs.rmSync(outputFile, { recursive: true, force: true })
    }

    await fs.writeFileSync(outputFile, JSON.stringify(fileData))
    return data
}

export { compileAll, DataBaseLookUp }
