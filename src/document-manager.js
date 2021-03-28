import JSZip from 'jszip';

// TODO Convert v1 -> v2 -> v3

export default class DocumentManager {
  async openDocuments() {
    const handles = await window.showOpenFilePicker({ multiple: true });
    return await Promise.all(handles.map(x => this.loadFileData(x)));
  }

  async loadFileData(handle) {
    const file = await handle.getFile();
    const blob = await file.slice();
    const zip = await JSZip.loadAsync(blob);
    const filePromises = [];
    zip.forEach((relativePath, file) => {
      filePromises.push({ relativePath, file });
    });
    const resolvedFiles = await Promise.all(filePromises.map(async p => {
      return {
        name: p.relativePath,
        content: await p.file.async(p.relativePath === 'anavis.json' ? 'text' : 'arraybuffer')
      };
    }));
    return {
      name: handle.name,
      handle: handle,
      work: JSON.parse(resolvedFiles.find(f => f.name === 'anavis.json').content),
      files: Object.fromEntries(resolvedFiles.filter(f => f.name !== 'anavis.json').map(f => [f.name, f.content]))
    };
  }
}
