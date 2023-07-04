import { EventBeat } from "../ObsidianData/StoryBeat";


export interface RenderEventBeat extends EventBeat{
    eventArcName: string,
    displayText: string,
    index: number
}