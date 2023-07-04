import { NamedData } from '../NamedData';
import { EventBeat } from './StoryBeat';

export interface EventArc extends NamedData {
    eventBeats: EventBeat[];
    startingIndex: number;
}
