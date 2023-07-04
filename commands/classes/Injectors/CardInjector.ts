import { RenderCardData } from '../../interfaces/DisplayData/RenderCardData'
import { HtmlInjector } from './HtmlInjector'
import { InjectorContext } from './InjectorContext'

export class CardInjector implements HtmlInjector {
    private cards: RenderCardData[] = []

    getIndicator(): string {
        return 'card'
    }

    inject(text: string[], injectorContext: InjectorContext): string {
        
        switch (text[1]) {
            case 'name': {
                return this.injectName(text)
            }
            default: {
                return ''
            }
        }
    }

    private injectName(partials: string[]): string {
        if (partials.length < 2) {
            return ''
        }

        const card: RenderCardData | undefined = this.cards.find((c) => c.name === partials[2])
        if (card === undefined) {
            return ''
        }


        return card.name + "(" + card.index + ")";
    }
}
