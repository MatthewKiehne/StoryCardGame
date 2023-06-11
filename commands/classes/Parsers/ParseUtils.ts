import { HtmlParser } from '../../interfaces/HtmlParser'

function getChildrenAsStrings(node: ChildNode): string[] {
    const result: string[] = []
    // const nodes = node.childNodes;

    const e: HTMLElement = node as HTMLElement
    const nodes = e.querySelector('ul')?.childNodes

    if (nodes != undefined) {
        for (let t = 0; t < nodes.length; t++) {
            const lineData: string | null = nodes[t].textContent
            if (lineData != null && lineData !== '\n') {
                const currentNode = nodes[t] as HTMLElement;
                result.push(currentNode.innerHTML)
            }
        }
    }

    return result
}

async function parseChildren<T>(node: ChildNode, htmlParser: HtmlParser<T>): Promise<T[]> {
    const result: T[] = []
    const nodes = node.childNodes

    for (let t = 0; t < nodes.length; t++) {
        const lineData: string | null = nodes[t].textContent
        if (lineData != null && lineData !== '\n') {
            result.push(await htmlParser.ParseFromString(String(nodes[t].textContent)))
        }
    }

    return result
}

export { getChildrenAsStrings, parseChildren }
