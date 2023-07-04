import { RenderBattleMap } from '../../interfaces/DisplayData/RenderBattleMap';
import { RenderCardData } from '../../interfaces/DisplayData/RenderCardData';
import { RenderEventBeat } from '../../interfaces/DisplayData/RenderEventBeat';

export interface InjectorContext {
    card?: RenderCardData;
    eventBeat?: RenderEventBeat;
    battleMap?: RenderBattleMap;
}
