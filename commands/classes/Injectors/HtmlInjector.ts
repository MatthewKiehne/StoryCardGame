import { InjectorContext } from "./InjectorContext";

export interface HtmlInjector
{
    inject(text: string[], injectorContext: InjectorContext ): string;
    getIndicator(): string
}