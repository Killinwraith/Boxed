const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");
const connectDB = require("./config/database");
const Folder = require("./models/Folder");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer config
const upload = multer({ storage: multer.memoryStorage() });

// Auth0 JWT middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

// R2 credentials
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

// Connect to MongoDB
connectDB();

// ====================== ROUTES ======================

// Basic route
app.get("/", (req, res) => res.json({ message: "API Server is running!" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// List folders
app.get("/api/folders", checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;
    const parentFolderId = req.query.parent || null;

    const query = { owner: userId };
    if (parentFolderId) {
      query.parentFolderId = parentFolderId;
    } else {
      query.parentFolderId = null;
    }

    const userFolders = await Folder.find(query).sort({ name: 1 });
    res.json(userFolders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

app.post("/api/folders", checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;
    const { name, parentFolderId } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "User ID not found" });
    }

    // Set the path based on parent folder
    let path = name;
    if (parentFolderId) {
      const parentFolder = await Folder.findOne({
        _id: parentFolderId,
        owner: userId,
      });
      if (!parentFolder) {
        return res.status(404).json({ error: "Parent folder not found" });
      }
      path = `${parentFolder.path}/${name}`;
    }

    const newFolder = new Folder({
      name,
      parentFolderId: parentFolderId || null,
      owner: userId,
      path: path,
    });

    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    if (error.code === 11000) {
      res.status(400).json({
        error: "A folder with this name already exists in this location",
      });
    } else {
      res.status(500).json({ error: "Failed to create folder" });
    }
  }
});

// Get folder tree for user
app.get("/api/folders/tree", checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;
    const folderTree = await Folder.getFolderTree(userId);
    res.json(folderTree);
  } catch (error) {
    console.error("Error fetching folder tree:", error);
    res.status(500).json({ error: "Failed to fetch folder tree" });
  }
});

// Get specific folder
app.get("/api/folders/:id", checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: userId,
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ error: "Failed to fetch folder" });
  }
});

// Update folder
app.put("/api/folders/:id", checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: userId },
      { name },
      { new: true, runValidators: true }
    );

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.json(folder);
  } catch (error) {
    console.error("Error updating folder:", error);
    if (error.code === 11000) {
      res.status(400).json({
        error: "A folder with this name already exists in this location",
      });
    } else {
      res.status(500).json({ error: "Failed to update folder" });
    }
  }
});

// Delete folder
app.delete("/api/folders/:id", checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: userId,
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Check if folder has children
    const hasChildren = await folder.hasChildren();
    if (hasChildren) {
      return res.status(400).json({
        error:
          "Cannot delete folder with subfolders. Please delete subfolders first.",
      });
    }

    await Folder.deleteOne({ _id: req.params.id, owner: userId });
    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
});

// List files for user & folder
app.get("/api/files", checkJwt, async (req, res) => {
  const userId = req.auth?.payload?.sub;
  const folderId = req.query.folderId || "root";

  try {
    const prefix = `${userId}/${folderId}/`; // User-specific folder
    const data = await s3.send(
      new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix })
    );

    const files = (data.Contents || []).map((f) => ({
      _id: f.Key,
      name: f.Key.split("/").pop(),
      folderId,
      size: f.Size,
      type: f.Key.split(".").pop(),
    }));

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Upload file
app.post("/api/upload", checkJwt, upload.single("file"), async (req, res) => {
  const userId = req.auth?.payload?.sub;
  const folderId = req.body.folderId || null;

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const key = folderId
    ? `${userId}/${folderId}/${req.file.originalname}`
    : `${userId}/root/${req.file.originalname}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    res.json({ status: "success", fileName: req.file.originalname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Download file
app.get("/api/files/:fileName", checkJwt, async (req, res) => {
  const userId = req.auth?.payload?.sub;
  const fileName = req.params.fileName;
  const folderId = req.query.folderId || "root";

  const key = `${userId}/${folderId}/${fileName}`;

  try {
    const { Body } = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    Body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "File not found" });
  }
});

// Delete file
app.delete("/api/files/:fileName", checkJwt, async (req, res) => {
  const userId = req.auth?.payload?.sub;
  const fileName = req.params.fileName;
  const folderId = req.query.folderId || "root";

  const key = `${userId}/${folderId}/${fileName}`;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
