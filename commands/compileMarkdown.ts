import * as util from 'node:util';
import * as h from 'node:child_process';
import * as fs from 'fs';
import * as jsdom from "jsdom";

const exec = util.promisify(h.exec);
const { JSDOM } = jsdom;

async function createAllCards() {
  const tempOutputCardDirectory = './tempOutput';
  const cardBasePath = './World Ideas/Cards';

  await markdownToHtmlFile(cardBasePath, tempOutputCardDirectory);

  const cardData: CardData[] = await convertFromHtmlToCardData(tempOutputCardDirectory);
  if ((await fs).existsSync("./data/cardData.json")) {
    fs.rmSync("./data/cardData.json", { recursive: true, force: true });
  }
  await fs.writeFileSync("./data/cardData.json", JSON.stringify(cardData));

  const cardToIndexData = cardNameToIndex(cardData);
  if (fs.existsSync("./data/cardToIndex.json")) {
    fs.rmSync("./data/cardToIndex.json", { recursive: true, force: true });
  }
  await fs.writeFileSync("./data/cardToIndex.json", JSON.stringify(cardToIndexData));

  fs.rmSync(tempOutputCardDirectory, { recursive: true, force: true });
}

async function markdownToHtmlFile(sourceDirectory: string, outputDirectory: string) {
  if (fs.existsSync(outputDirectory)) {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }

  fs.mkdirSync(outputDirectory)

  await convertMarkdownToHtml(sourceDirectory, outputDirectory);
}

function cardNameToIndex(cardData: CardData[]) : Map<string, number> {
  const result = new Map<string, number>();

  for (let i = 0; i < cardData.length; i++) {
    result.set(cardData[i].name, i + 1);
  }

  return result;
}

async function convertMarkdownToHtml(currentPath: string, outputDirectory: string) {
  var files = fs.readdirSync(currentPath);

  for (let i = 0; i < files.length; i++) {
    const newPath = currentPath + "/" + files[i];
    const status = fs.lstatSync(newPath);

    if (status.isDirectory()) {
      await convertMarkdownToHtml(newPath, outputDirectory);
    }
    else if (status.isFile()) {
      if (newPath.endsWith(".md")) {
        await runMarkdownToHtmlCommand(newPath, files[i], outputDirectory);
      }
    }
  }
}

async function runMarkdownToHtmlCommand(cardPath: string, fileName: string, outputDirectory: string) : Promise<void> {
  const fileParts = fileName.split("\.");
  const { stdout, stderr } = await exec("pandoc -f markdown -t html \"" + cardPath + "\" -o \"" + outputDirectory + "\\" + fileParts[0] + ".html\"");
}

async function convertFromHtmlToCardData(outputDirectory: string) : Promise<CardData[]> {
  const result: CardData[] = [];

  var files = fs.readdirSync(outputDirectory);

  for (let i = 0; i < files.length; i++) {
    const data = await fs.promises.readFile(outputDirectory + "/" + files[i]);
    const htmlString = String(data)
    const cardData: CardData = convertHtmlStringToCardData(htmlString);
    result.push(cardData);
  }

  return result;
}

function convertHtmlStringToCardData(htmlString: string) : CardData {
  const dom = new JSDOM(htmlString);
  const result: CardData = {
    name: "",
    textBlocks: []
  };

  const firstList = dom.window.document.querySelector("ul");

  if (firstList == null)
    return result;

  for (let c = 0; c < firstList.childNodes.length; c++) {
    const context: string | null = firstList.childNodes[c].textContent;
    if (context == null)
      continue;

    if (context.startsWith("Title:")) {
      const data: string = context.substring("Title:".length).trim();
      result.name = data;
    }
    else if (context.startsWith("Text:")) {
      const textBlocks: string[] = [];
      const nodes = firstList.childNodes[c].childNodes;

      for (let t = 0; t < nodes.length; t++) {
        const lineData: string | null = nodes[t].textContent;
        if (lineData != null && lineData !== "\n") {
          textBlocks.push(lineData.trim().replace("\n", " "));
        }
      }

      result.textBlocks = textBlocks;
    }

  }

  return result;
}

createAllCards();


interface CardData {
  name: string,
  textBlocks: string[]
}
