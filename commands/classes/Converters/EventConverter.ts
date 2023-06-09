import { RenderEventBeat } from '../../interfaces/DisplayData/RenderEventBeat';
import { EventArc } from '../../interfaces/ObsidianData/StoryArc';
import { EventBeat } from '../../interfaces/ObsidianData/StoryBeat';
import { CardInjector } from '../Injectors/CardInjector';
import { EventInjector } from '../Injectors/EventInjector';
import { HtmlInjector } from '../Injectors/HtmlInjector';
import { IconInjector } from '../Injectors/IconInjector';
import { InjectorContext } from '../Injectors/InjectorContext';
import { InjectorUtils } from '../Injectors/InjectorUtils';
import { DataConverter } from './DataConverter';

export class EventBeatConverter implements DataConverter<EventBeat, RenderEventBeat> {
    constructor() {}

    convert(data: EventBeat, additionalData: any): RenderEventBeat {
        const result: RenderEventBeat = {
            name: data.name,
            index: data.index,
            text: data.text,
            eventArcName: additionalData.eventArcName,
            displayText: [],
        };

        const injectors: HtmlInjector[] = [new IconInjector(), new EventInjector(), new CardInjector()];

        const injectorContext: InjectorContext = {
            eventBeat: result,
        };

        result.displayText = result.text.map(text => InjectorUtils.textToHtmlText(text, injectors, injectorContext));

        return result;
    }
}
