interface HtmlParser<NamedData>
{
    ParseFromString(htmlString: string): Promise<NamedData>
}

export {HtmlParser}