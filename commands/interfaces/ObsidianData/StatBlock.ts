import { Ability } from "./Ability";
import { NamedData } from "../NamedData";

interface MonsterData extends NamedData {
    traits: string,
    behavior: string[],
    abilities: Ability[],
    woundSlots: string[]
}

export { MonsterData }