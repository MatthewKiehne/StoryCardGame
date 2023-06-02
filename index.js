const express = require('express');
const cardList = require('./cardData.json');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const pageSize = 9;
    let pageIndex = 0;
    let pages = [];

    while (pageSize * pageIndex < cardList.length) {
        let pageCardCount = pageSize
        if ((pageSize * pageIndex) + pageSize > cardList.length) {
            pageCardCount = cardList.length % pageSize
        }

        let page = [];
        for (let i = 0; i < pageCardCount; i++) {
            const cardData = cardList[(pageSize * pageIndex) + i];

            let orbLinks = [];
            if (cardData.orbs == null || cardData.orbs.length == 0) {
                for (let c = 0; c < 4; c++) {
                    orbLinks[c] = intToColorLink(3);
                }
            }
            else {
                for (let c = 0; c < cardData.orbs.length; c++) {
                    orbLinks[c] = intToColorLink(cardData.orbs[c]);
                }
            }

            cardData.orbLinks = orbLinks;

            let htmlBlocks = [];
            for (let cardTextIndex = 0; cardTextIndex < cardData.textBlocks.length; cardTextIndex++) {
                htmlBlocks[cardTextIndex] = textToHtmlText(cardData.textBlocks[cardTextIndex]);
            }
            cardData.htmlTexts = htmlBlocks;

            page[i] = cardData;
        }

        pages[pageIndex] = page;
        pageIndex++;
    }

    res.render('home', { data: pages });
});

app.get('/orbCards', (req, res) => {
    const pageSize = 9;
    let pageIndex = 0;
    let pages = [];

    let linkCardList = [];

    for (let top = 0; top < 3; top++) {
        for (let right = 0; right < 3; right++) {
            for (let bottom = 0; bottom < 3; bottom++) {
                for (let left = 0; left < 3; left++) {
                    linkCardList.push({
                        orbs: [top, right, bottom, left]
                    })
                }
            }
        }
    }

    while (pageSize * pageIndex < linkCardList.length) {
        let pageCardCount = pageSize
        if ((pageSize * pageIndex) + pageSize > linkCardList.length) {
            pageCardCount = linkCardList.length % pageSize
        }

        let page = [];
        for (let i = 0; i < pageCardCount; i++) {

            const ordCardData = linkCardList[(pageSize * pageIndex) + i];

            let orbLinks = [];
            for (let c = 0; c < ordCardData.orbs.length; c++) {
                orbLinks[c] = intToColorLink(ordCardData.orbs[c]);
            }

            ordCardData.orbLinks = orbLinks;

            page[i] = ordCardData;
        }

        pages[pageIndex] = page;
        pageIndex++;
    }

    res.render('backs', { data: pages });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
    lsExample(); 
});

function intToColorLink(value) {
    if (value === 0) {
        return "pictures/CircleBlue.png"
    }
    else if (value === 1) {
        return "pictures/CircleRed.png"
    }
    else if (value === 2) {
        return "pictures/CircleGreen.png"
    }
    else if (value === 3) {
        return "pictures/CircleWhite.png"
    }

    return "pictures/CircleWhite.png"
}

function textToHtmlText(text) {
    let stringToParse = text;
    if (text == null || text == "") {
        return ""
    }

    let result = "";
    let parseStart = stringToParse.indexOf("<");

    if (parseStart === -1) {
        return text;
    }

    while (parseStart != -1) {
        result = result + stringToParse.substring(0, parseStart);
        parseEnd = stringToParse.indexOf(">");

        const parseIconValue = stringToParse.substring(parseStart + 1, parseEnd);
        result = result + parseIcon(parseIconValue);

        stringToParse = stringToParse.substring(parseEnd + 1);
        parseStart = stringToParse.indexOf("<");
    }

    return result;
}

function parseIcon(stringValue) {
    if (stringValue == null) {
        return "";
    }

    const valueParts = stringValue.split("|")
    let result = "<i class=\"icon-" + valueParts[0] + "\"";

    let styleString = "";

    for (let i = 1; i < valueParts.length; i++) {
        styleString = styleString + parseIconDescriptor(valueParts[i]) + ";";
    }

    if (styleString.length != 0) {
        result += "style=\"" + styleString + "\""
    }

    result = result + "></i>";
    return result;
}

function parseIconDescriptor(descriptor) {
    if (descriptor == null) {
        return "";
    }

    switch (descriptor.trim()) {
        case "black":
            return "color:black";
        case "white":
            return "color:white";
        case "blue":
            return "color:blue";
        case "green":
            return "color:green";
        case "red":
            return "color:red";
        default:
            return "";
    }
}


async function lsExample() {
    const { stdout, stderr } = await exec('dir');
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    console.log("ran");

    const dom = new JSDOM(`<ul>
    <li>Title: Brass Chest Piece</li>
    <li>Cost: 50</li>
    <li>Tags: Item, Armor, Chest, Metal</li>
    <li>Text:
      <ul>
        <li>This card gains +1 Shied for each &lt;plain-circle|green&gt;&lt;plain-circle|green&gt;</li>
        <li>Some more text here</li>
      </ul>
    </li>
  </ul>`);

    const firstList = dom.window.document.querySelector("ul");
    console.log(firstList);
    console.log(firstList.children);
    console.log(firstList.children.length)
    for(let c = 0; c < firstList.children.length; c++)
    {
        console.log(firstList.children[c]);
        const content = firstList.children[c].textContent;
        console.log(content);
        if(content.startsWith("Title:"))
        {
            console.log("found the title!");
        } else if(content.startsWith("Text:"))
        {
            const texts = firstList.children[c].querySelector("ul");
            for(let t = 0; t < texts.children.length; t++)
            {
                console.log("line: " + texts.children[t].textContent);
            }
            console.log("found the text!");
        }
    }
}