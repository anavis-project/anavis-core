const path = require('path');
const { EOL } = require('os');
const fs = require('fs').promises;
const hareNiemeyer = require('hare-niemeyer');

const MAX_AVUS = 1000000000;

(async () => {

  const fileName = path.join(__dirname, '../src/docs/03.json');
  const content = JSON.parse(await fs.readFile(fileName, 'utf8'));
  v2tov3(content);
  await fs.writeFile(fileName, JSON.stringify(content, null, 2) + EOL, 'utf8');

})();

function v2tov3(doc) {
  const lengths = doc.parts.map(p => p.length);
  const newLengths = bringToMaxAvus(lengths);
  doc.parts.forEach((p, i) => {
    p.length = newLengths[i];
  });
}

function bringToMaxAvus(lengths) {
  return obj2arr(hareNiemeyer(arr2obj(lengths), MAX_AVUS));
}

function arr2obj(arr) {
  return arr.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

function obj2arr(obj) {
  return Object.keys(obj).reduce((result, key) => {
    result[Number(key)] = obj[key];
    return result;
  }, []);
}
