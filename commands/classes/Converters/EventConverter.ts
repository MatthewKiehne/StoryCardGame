import { RenderEventBeat } from "../../interfaces/DisplayData/RenderEventBeat";
import { StoryBeat } from "../../interfaces/ObsidianData/StoryBeat";
import { DataConverter } from "./DataConverter";

export class EventBeatConverter implements DataConverter<StoryBeat, RenderEventBeat>{
    convert(data: StoryBeat, additionalData: any): RenderEventBeat {
        const result: RenderEventBeat = {
            name: data.name,
            index: data.index,
            text: data.text,
            storyArcName: additionalData.storyArcName
        }
        return result;
    }
}