import { NamedData } from '../NamedData';

export interface BattleMap extends NamedData {
    width: number;
    height: number;
    url: string;
    statBlocks: string;
    behavior: string;
}
