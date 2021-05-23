import JSZip from 'jszip';
import { v4 } from 'uuid';
import { MAX_AVUS } from '../avu-helper';
import { convertToLatest } from './document-converter';
import { validateV3Document } from './document-validation';

export default class FileSystemAccessDocumentManager {
  async openDocuments() {
    const handles = await window.showOpenFilePicker({ multiple: true });
    return await Promise.all(handles.map(x => this.loadFileData(x)));
  }

  async loadFileData(handle) {
    const file = await handle.getFile();
    const blob = await file.slice();
    const loadedZip = await JSZip.loadAsync(blob);
    const convertedZip = await convertToLatest(loadedZip);
    const filePromises = [];
    convertedZip.forEach((relativePath, file) => {
      filePromises.push({ relativePath, file });
    });
    const resolvedFiles = await Promise.all(filePromises.map(async p => {
      return {
        name: p.relativePath,
        content: await p.file.async(p.relativePath === 'anavis.json' ? 'text' : 'blob')
      };
    }));
    const doc = {
      id: v4(),
      name: handle.name,
      handle: handle,
      work: JSON.parse(resolvedFiles.find(f => f.name === 'anavis.json').content),
      files: Object.fromEntries(resolvedFiles.filter(f => f.name !== 'anavis.json').map(f => [f.name, f.content]))
    };
    validateV3Document(doc);
    return doc;
  }

  async saveDocument(doc) {
    validateV3Document(doc);
    const zip = new JSZip();
    zip.file('anavis.json', JSON.stringify(doc.work));
    Object.entries(doc.files).forEach(([name, content]) => {
      zip.file(name, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const writable = await doc.handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }

  createDocument() {
    const doc = {
      id: v4(),
      work: {
        version: '3',
        parts: [
          {
            id: v4(),
            name: 'Unbekannt',
            color: '#4582b4',
            length: MAX_AVUS
          }
        ],
        annotations: [],
        media: []
      },
      files: {}
    };
    validateV3Document(doc);
    return doc;
  }
}
