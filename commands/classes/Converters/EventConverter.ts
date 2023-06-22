import { RenderEventBeat } from "../../interfaces/DisplayData/RenderEventBeat";
import { EventBeat } from "../../interfaces/ObsidianData/StoryBeat";
import { DataConverter } from "./DataConverter";

export class EventBeatConverter implements DataConverter<EventBeat, RenderEventBeat>{
    convert(data: EventBeat, additionalData: any): RenderEventBeat {
        const result: RenderEventBeat = {
            name: data.name,
            index: data.index,
            text: data.text,
            storyArcName: additionalData.storyArcName,
            displayText: ""
        }
        return result;
    }
}