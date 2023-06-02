const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
  for(let childNode in firstList.childNodes)
  {
    console.log(childNode.textContent);
  }
}


lsExample(); 