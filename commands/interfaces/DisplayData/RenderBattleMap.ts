import { BattleMap } from "../ObsidianData/BattleMap";
import { RenderStatBlock } from "./RenderStatBlock";

export interface RenderBattleMap extends BattleMap
{
    renderStatBlocks: RenderStatBlock[]
}