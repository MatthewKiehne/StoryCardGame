import { RenderBattleMap } from '../../interfaces/DisplayData/RenderBattleMap';
import { BattleMap } from '../../interfaces/ObsidianData/BattleMap';
import { DataConverter } from './DataConverter';
import * as fs from 'fs';
import { StatBlockConverter } from './StatBlockConverter';
import { StatBlock } from '../../interfaces/ObsidianData/StatBlock';
import { RenderStatBlock } from '../../interfaces/DisplayData/RenderStatBlock';

export class BattleMapConverter implements DataConverter<BattleMap, RenderBattleMap> {
    convert(data: BattleMap, additionalData: any): RenderBattleMap {
        const text: string = fs.readFileSync('./data/statBlock/statBlockFromName.json', 'utf-8');
        let statBlocks: any = JSON.parse(text);

        const result: RenderBattleMap = {
            name: data.name,
            width: data.width,
            height: data.height,
            url: data.url,
            behavior: data.behavior,
            statBlocks: data.statBlocks,
            renderStatBlocks: [],
            index: 0,
        };

        const statBlockConverter: StatBlockConverter = new StatBlockConverter();

        const blocks: string[] = data.statBlocks.split(',');
        for (let b = 0; b < blocks.length; b++) {
            const parts: string[] = blocks[b].split('|');

            const statBlockName: string = parts[0].replace('[[', '').replace(']]', '').trim();
            const quantity: number = parseInt(parts[1].trim());

            const statBlock: StatBlock = statBlocks[statBlockName];

            const a: RenderStatBlock = statBlockConverter.convert(statBlock, { quantity: quantity });
            result.renderStatBlocks.push(a);
        }

        return result;
    }
}
