// Real backend: files live in object storage (per `upload` module) and are
// fetched by URL. Until then we just keep the File objects in memory on the
// client, keyed by document id, so the PDF viewer can render them.
const files = new Map<string, File>();

export function setFile(id: string, file: File) {
  files.set(id, file);
}

export function getFile(id: string): File | undefined {
  return files.get(id);
}

export function removeFile(id: string) {
  files.delete(id);
}
