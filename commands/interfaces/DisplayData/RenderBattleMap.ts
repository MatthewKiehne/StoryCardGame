import { BattleMap } from "../ObsidianData/BattleMap";
import { RenderStatBlock } from "./RenderStatBlock";

export interface renderBattleMap extends BattleMap
{
    renderStatBlocks: RenderStatBlock[]
}