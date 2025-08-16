export class Folder {
  _id: string;
  name: string;
  parentFolderId?: string;
  owner?: string;
  path?: string;
  createdAt?: Date;
  updatedAt?: Date;
  children?: Folder[];

  constructor(
    _id: string,
    name: string,
    parentFolderId?: string,
    owner?: string,
    path?: string,
    createdAt?: Date,
    updatedAt?: Date,
    children?: Folder[]
  ) {
    this._id = _id;
    this.name = name;
    this.parentFolderId = parentFolderId;
    this.owner = owner;
    this.path = path;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.children = children;
  }
}
