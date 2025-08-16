export class File {
  _id: string;
  name: string;
  folderId: string;
  type: string;
  size: number;

  constructor(
    _id: string,
    name: string,
    folderId: string,
    type: string,
    size: number
  ) {
    this._id = _id;
    this.name = name;
    this.folderId = folderId;
    this.type = type;
    this.size = size;
  }
}
