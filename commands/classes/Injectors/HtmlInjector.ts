export interface HtmlInjector
{
    inject(text: string[]): string;
    getIndicator(): string
}