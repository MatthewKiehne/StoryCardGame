import { NamedData } from "../NamedData";
import { StoryBeat } from "./StoryBeat";

export interface StoryArc extends NamedData
{
    storyBeats: StoryBeat[],
    startingIndex: number
}