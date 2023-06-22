import { HtmlInjector } from "./HtmlInjector";

export class EventInjector implements HtmlInjector
{
    
    getIndicator(): string {
        return "event"; 
    }

    inject(text: string[]): string {
        return "";
    }
}