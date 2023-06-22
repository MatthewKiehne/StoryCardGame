import { EventBeat } from "../ObsidianData/StoryBeat";


export interface RenderEventBeat extends EventBeat{
    storyArcName: string,
    displayText: string
}