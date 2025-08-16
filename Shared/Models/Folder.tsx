export class Folder {
  _id: string;
  name: string;
  parentFolderId?: string;

  constructor(_id: string, name: string, parentFolderId?: string) {
    this._id = _id;
    this.name = name;
    this.parentFolderId = parentFolderId;
  }
}
