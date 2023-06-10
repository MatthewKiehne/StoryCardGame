import { Ability } from "./Ability";
import { NamedData } from "../NamedData";

interface StatBlock extends NamedData {
    traits: string[],
    behavior: string[],
    abilities: Ability[],
    woundSlots: string[]
}

export { StatBlock }