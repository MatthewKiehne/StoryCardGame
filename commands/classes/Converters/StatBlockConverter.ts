import { RenderStatBlock } from '../../interfaces/DisplayData/RenderStatBlock';
import { StatBlock } from '../../interfaces/ObsidianData/StatBlock';
import { DataConverter } from './DataConverter';

export class StatBlockConverter implements DataConverter<StatBlock, RenderStatBlock> {
    convert(data: StatBlock, additionalData: any): RenderStatBlock {
        const result: RenderStatBlock = {
            name: data.name,
            traits: data.traits,
            behaviors: data.behaviors,
            abilities: data.abilities,
            woundSlots: data.woundSlots,
            quantity: additionalData.quantity,
            index: 0,
        };

        return result;
    }
}
