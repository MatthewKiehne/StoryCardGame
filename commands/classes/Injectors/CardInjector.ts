import { RenderCardData } from '../../interfaces/DisplayData/RenderCardData';
import { CardData } from '../../interfaces/ObsidianData/CardData';
import { DataBaseLookUp } from '../Lookup/DataBaseLookUp';
import { HtmlInjector } from './HtmlInjector';
import { InjectorContext } from './InjectorContext';

export class CardInjector implements HtmlInjector {
    getIndicator(): string {
        return 'card';
    }

    inject(text: string[], injectorContext: InjectorContext): string {
        const cards: CardData[] = DataBaseLookUp.getAs<CardData>(DataBaseLookUp.cardDataName).data;

        switch (text[1]) {
            case 'name': {
                return this.injectName(text, cards);
            }
            default: {
                return '';
            }
        }
    }

    private injectName(partials: string[], cards: CardData[]): string {
        if (partials.length < 2) {
            return '';
        }

        const fixedName: string = this.fixNames(partials[2]).toLowerCase();
        const card: CardData | undefined = cards.find((c) => c.name.toLowerCase() === fixedName);
        if (card === undefined) {
            return '';
        }

        return card.name + ' (card ' + card.index + ')';
    }

    private fixNames(name: string): string {
        return name.replace('\n', ' ').replace('\\n', ' ').trim();
    }
}
