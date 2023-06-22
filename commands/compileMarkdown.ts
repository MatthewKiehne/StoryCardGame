import * as fs from 'fs'
import { CardParser } from './classes/Parsers/CardParser'
import { DirectoryToData } from './classes/Utils/DirectoryToData'
import { StatBlockParser } from './classes/Parsers/StatBlockParser'
import { HtmlParser } from './interfaces/HtmlParser'
import { BattleMapParser } from './classes/Parsers/BattleMapParser'
import { StoryArcParser } from './classes/Parsers/StoryArcParser'
import { EventArc } from './interfaces/ObsidianData/StoryArc'

async function compileAll() {
    const cardDirectory = './World Ideas/Cards'
    await createFiles(cardDirectory, 'card', new CardParser())

    const statBlockDirectory = './World Ideas/Stat Blocks'
    await createFiles(statBlockDirectory, 'statBlock', new StatBlockParser())

    const battleMapDirectory = './World Ideas/BattleMaps'
    await createFiles(battleMapDirectory, 'battleMaps', new BattleMapParser())

    const storyBeatDirectory = './World Ideas/Events'
    await createFilesWithCallBack(storyBeatDirectory, 'events', new StoryArcParser(), randomizeStoryBeats)
}

async function randomizeStoryBeats(filePath: string) {
    const text: string = fs.readFileSync(filePath, 'utf-8')
    const storyArcs: EventArc[] = JSON.parse(text)

    const storyBeatPosition: number[] = []
    for (let a = 0; a < storyArcs.length; a++) {
        for (let b = 0; b < storyArcs[a].eventBeats.length; b++) {
            storyBeatPosition.push(storyBeatPosition.length)
        }
    }

    for (let i = 0; i < storyBeatPosition.length * 7; i++) {
        const first = getRandomInt(storyBeatPosition.length)
        const second = getRandomInt(storyBeatPosition.length)

        const tmp = storyBeatPosition[first]
        storyBeatPosition[first] = storyBeatPosition[second]
        storyBeatPosition[second] = tmp
    }

    let positionIndex = 0
    for (let a = 0; a < storyArcs.length; a++) {
        storyArcs[a].startingIndex = storyBeatPosition[positionIndex]

        for (let b = 0; b < storyArcs[a].eventBeats.length; b++) {
            storyArcs[a].eventBeats[b].index = storyBeatPosition[positionIndex]
            storyArcs[a].eventBeats[b].name = storyArcs[a].name + ', Part ' + (b + 1)

            positionIndex++
        }
    }

    if ((await fs).existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true })
    }
    await fs.writeFileSync(filePath, JSON.stringify(storyArcs))
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

async function createFiles<T>(sourceDirectory: string, dataName: string, htmlParser: HtmlParser<T>) {
    return await createFilesWithCallBack(sourceDirectory, dataName, htmlParser, async (s: string) => {})
}

async function createFilesWithCallBack<T>(sourceDirectory: string, dataName: string, htmlParser: HtmlParser<T>, afterDataGenerate: (filePath: string) => Promise<void>) {
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

    if (afterDataGenerate != undefined) {
        await afterDataGenerate(dataFile)
    }

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
