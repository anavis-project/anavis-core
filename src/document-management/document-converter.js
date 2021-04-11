import { MAX_AVUS } from '../avu-helper';

async function v1ToV2(zip) {
  // TODO: Check if it is v1, if yes, convert
  return zip;
}

async function v2ToV3(zip) {
  const docFile = zip.file('anavis.json');
  if (!docFile) {
    return zip;
  }

  const doc = JSON.parse(await docFile.async('string'));
  if (doc.version !== '2') {
    return zip;
  }

  doc.version = '3';
  delete doc.id;

  const totalLength = doc.parts.reduce((len, part) => len + part.length, 0);
  const factor = MAX_AVUS / totalLength;
  let usedAvus = 0;
  for (let index = 0; index < doc.parts.length; index++) {
    const part = doc.parts[index];
    if (index < doc.parts.length - 1) {
      part.length = part.length * factor;
      usedAvus += part.length;
    } else {
      part.length = MAX_AVUS - usedAvus;
    }
  }

  doc.sounds = doc.sounds.filter(s => s.embedded).map(s => ({
    type: 'embedded',
    fileName: s.path
  }));

  zip.file('anavis.json', JSON.stringify(doc));
  return zip;
}

export function convertToLatest(zip) {
  return Promise.resolve(zip)
    .then(v1ToV2)
    .then(v2ToV3);
}
