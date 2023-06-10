interface HtmlParser<T>
{
    ParseFromString(htmlString: string): Promise<T>
}

export {HtmlParser}