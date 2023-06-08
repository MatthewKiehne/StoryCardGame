import { NamedData } from "../NamedData";

interface Ability extends NamedData {
    range: number,
    tags: string[],
    description: string
}

export { Ability }