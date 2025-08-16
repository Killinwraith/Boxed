const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
      maxlength: [255, "Folder name cannot exceed 255 characters"],
    },
    parentFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    owner: {
      type: String,
      required: [true, "Owner is required"],
      index: true,
    },
    path: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
folderSchema.index({ owner: 1, parentFolderId: 1 });
folderSchema.index({ owner: 1, path: 1 });

// Prevent duplicate folder names within the same parent for the same user
folderSchema.index({ owner: 1, parentFolderId: 1, name: 1 }, { unique: true });

// Pre-save middleware to generate path (only if not already set)
folderSchema.pre("save", async function (next) {
  try {
    // Only generate path if it's not already set
    if (!this.path) {
      if (this.parentFolderId) {
        const parent = await this.constructor.findOne({
          _id: this.parentFolderId,
          owner: this.owner,
        });
        if (!parent) {
          throw new Error("Parent folder not found or access denied");
        }
        this.path = `${parent.path}/${this.name}`;
      } else {
        this.path = this.name;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get folder tree for a user
folderSchema.statics.getFolderTree = async function (userId) {
  const folders = await this.find({ owner: userId }).sort({ path: 1 });

  const buildTree = (items, parentId = null) => {
    return items
      .filter((item) => {
        if (parentId === null) {
          return item.parentFolderId === null;
        }
        return (
          item.parentFolderId &&
          item.parentFolderId.toString() === parentId.toString()
        );
      })
      .map((item) => ({
        ...item.toObject(),
        children: buildTree(items, item._id),
      }));
  };

  return buildTree(folders);
};

// Instance method to check if folder has children
folderSchema.methods.hasChildren = async function () {
  const count = await this.constructor.countDocuments({
    parentFolderId: this._id,
    owner: this.owner,
  });
  return count > 0;
};

// Instance method to get all descendants
folderSchema.methods.getDescendants = async function () {
  const descendants = [];

  const getChildren = async (parentId) => {
    const children = await this.constructor.find({
      parentFolderId: parentId,
      owner: this.owner,
    });

    for (const child of children) {
      descendants.push(child);
      await getChildren(child._id);
    }
  };

  await getChildren(this._id);
  return descendants;
};

module.exports = mongoose.model("Folder", folderSchema);
