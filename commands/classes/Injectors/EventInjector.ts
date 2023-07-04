import { RenderEventBeat } from '../../interfaces/DisplayData/RenderEventBeat';
import { EventArc } from '../../interfaces/ObsidianData/StoryArc';
import { EventBeat } from '../../interfaces/ObsidianData/StoryBeat';
import { DataBaseLookUp } from '../Lookup/DataBaseLookUp';
import { HtmlInjector } from './HtmlInjector';
import { InjectorContext } from './InjectorContext';

export class EventInjector implements HtmlInjector {
    constructor() {}

    getIndicator(): string {
        return 'event';
    }

    inject(text: string[], injectorContext: InjectorContext): string {
        const arcs: EventArc[] = DataBaseLookUp.getAs<EventArc>(DataBaseLookUp.eventsDataName).data;

        switch (text[1]) {
            case 'continue': {
                return this.injectContinue(injectorContext.eventBeat, arcs);
            }
            case 'name': {
                return this.injectName(text, arcs);
            }
            default: {
                return '';
            }
        }
    }

    private injectContinue(renderEventBeat: RenderEventBeat | undefined, arcs: EventArc[]): string {
        if (renderEventBeat == undefined) {
            return '';
        }
        const foundArc: EventArc | undefined = arcs.find((x) => x.name === renderEventBeat.eventArcName);
        if (foundArc === undefined) {
            return '';
        }

        const eventIndex = foundArc.eventBeats.findIndex((beat) => beat.name === renderEventBeat.name);
        if (eventIndex === -1 || eventIndex === foundArc.eventBeats.length - 1) {
            return '';
        }

        const nextEventBeat: EventBeat = foundArc.eventBeats[eventIndex + 1];

        return nextEventBeat.name + ' (Event ' + nextEventBeat.index + ')';
    }

    private injectName(partials: string[], arcs: EventArc[]): string {
        if (partials.length < 2) {
            return '';
        }

        const eventArc: EventArc | undefined = arcs.find((arc) => arc.name === partials[2]);
        if (eventArc === undefined) {
            return '';
        }

        return eventArc.name + ' (Event ' + eventArc.eventBeats[0].index + ')';
    }
}
