import { RenderEventBeat } from "../../interfaces/DisplayData/RenderEventBeat";
import { EventArc } from "../../interfaces/ObsidianData/StoryArc";
import { EventBeat } from "../../interfaces/ObsidianData/StoryBeat";
import { HtmlInjector } from "./HtmlInjector";
import { InjectorContext } from "./InjectorContext";

export class EventInjector implements HtmlInjector
{
    private arcs: EventArc[] = []
    
    constructor(arcs: EventArc[]){
        this.arcs = arcs;
    }
    
    getIndicator(): string {
        return "event";
    }

    inject(text: string[], injectorContext: InjectorContext): string {
        switch(text[1])
        {
            case "continue": {
                return this.injectContinue(injectorContext.eventBeat);
            }
            default: {
                return "";
            }
        }
    }

    private injectContinue(renderEventBeat: RenderEventBeat | undefined): string
    {
        if(renderEventBeat == undefined)
        {
            return "";
        }
        
        const foundArc: EventArc | undefined = this.arcs.find(x => x.name === renderEventBeat.eventArcName);
        if(foundArc === undefined)
        {
            return "";
        }

        const eventIndex = foundArc.eventBeats.findIndex(beat => beat.index === renderEventBeat.index);
        if(eventIndex === -1 || eventIndex === foundArc.eventBeats.length - 1)
        {
            return "";
        }
        
        const nextEventBeat: EventBeat = foundArc.eventBeats[eventIndex + 1];

        return nextEventBeat.name + "(" + nextEventBeat.index + ")";
    }
}