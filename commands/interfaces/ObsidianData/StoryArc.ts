import { NamedData } from "../NamedData";
import { EventBeat } from "./StoryBeat";

export interface EventArc extends NamedData
{
    storyBeats: EventBeat[],
    startingIndex: number
}