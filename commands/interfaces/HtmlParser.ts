interface HtmlParser<T>
{
    Parse(): Promise<T[]>
}

export {HtmlParser}