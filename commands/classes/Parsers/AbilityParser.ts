import { HtmlParser } from "../../interfaces/HtmlParser";
import { Ability } from "../../interfaces/ObsidianData/Ability";

export class AbilityParser implements HtmlParser<Ability>
{
    ParseFromString(htmlString: string): Promise<Ability> {
        throw new Error("Method not implemented.");
    }
}