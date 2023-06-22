import { HtmlInjector } from "./HtmlInjector";

export class IconInjector implements HtmlInjector
{
    getIndicator(): string {
        return "icon"
    }

    inject(text: string[]): string {
        return this.parseIcon(text);
    }

    private parseIcon(partials: string[]): string {
        if (partials == null) {
            return ''
        }

        let result = '<i class="icon-' + partials[1] + '"'

        let styleString = ''

        for (let i = 2; i < partials.length; i++) {
            styleString = styleString + this.parseIconDescriptor(partials[i]) + ';'
        }

        if (styleString.length != 0) {
            result += 'style="' + styleString + '"'
        }

        result = result + '></i>'
        return result
    }

    private parseIconDescriptor(descriptor: string) {
        if (descriptor == null) {
            return ''
        }

        switch (descriptor.trim()) {
            case 'black':
                return 'color:black'
            case 'white':
                return 'color:white'
            case 'blue':
                return 'color:blue'
            case 'green':
                return 'color:green'
            case 'red':
                return 'color:red'
            default:
                return ''
        }
    }
}