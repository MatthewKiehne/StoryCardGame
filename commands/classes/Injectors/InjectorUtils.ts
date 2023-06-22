import { resolveModuleName } from "typescript";
import { HtmlInjector } from "./HtmlInjector";

export class InjectorUtils {
    
    public static readonly startCustomBracket: string = '&lt;&lt;'
    public static readonly endCustomBracket: string = '&gt;&gt;'
    public static readonly customSeparator = "|";

    public static textToHtmlText(text: string, injectors: HtmlInjector[]): string {
        let stringToParse: string = text
        if (text == null || text == '') {
            return ''
        }

        let result: string = ''
        let parseStart: number = stringToParse.indexOf(InjectorUtils.startCustomBracket)

        if (parseStart === -1) {
            return text
        }

        while (parseStart != -1) {
            result = result + stringToParse.substring(0, parseStart)
            const parseEnd: number = stringToParse.indexOf(InjectorUtils.endCustomBracket)

            const parseIconValue = stringToParse.substring(parseStart + InjectorUtils.startCustomBracket.length, parseEnd)
            const partials: string[] = parseIconValue.split(InjectorUtils.customSeparator);

            const injector: HtmlInjector| null = this.getCustomInjector(partials[0], injectors);
            
            if(injector == null)
            {
                result += parseIconValue
            }
            else
            {
                result += injector.inject(partials);
            }

            stringToParse = stringToParse.substring(parseEnd + InjectorUtils.endCustomBracket.length)
            parseStart = stringToParse.indexOf(InjectorUtils.startCustomBracket)
        }

        return result
    }

    private static getCustomInjector(firstPartial: string, injectors: HtmlInjector[]): HtmlInjector | null
    {
        let result: HtmlInjector | null = null;
        let counter: number = 0;

        while(counter < injectors.length && result == null)
        {
            if(injectors[counter].getIndicator() === firstPartial)
            {
                result = injectors[counter];
            }

            counter++;
        }

        return result;
    }
}