const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

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

// In-memory folder storage (for simplicity)
let folders = []; // { _id, name, parentFolderId, owner }
let folderIdCounter = 1;

// ====================== ROUTES ======================

// Basic route
app.get("/", (req, res) => res.json({ message: "API Server is running!" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Create or list folders
app.get("/api/folders", checkJwt, (req, res) => {
  const userId = req.auth?.sub;
  const parentFolderId = req.query.parent || null;

  const userFolders = folders.filter(
    (f) => f.owner === userId && f.parentFolderId === parentFolderId
  );
  res.json(userFolders);
});

app.post("/api/folders", checkJwt, (req, res) => {
  const userId = req.auth?.sub;
  const { name, parentFolderId } = req.body;
  if (!name) return res.status(400).json({ error: "Folder name is required" });

  const newFolder = {
    _id: `${folderIdCounter++}`,
    name,
    parentFolderId: parentFolderId || null,
    owner: userId,
  };
  folders.push(newFolder);
  res.json(newFolder);
});

// List files for user & folder
app.get("/api/files", checkJwt, async (req, res) => {
  const userId = req.auth?.sub;
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
  const userId = req.auth?.sub;
  const folderId = req.body.folderId || "root";

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const key = `${userId}/${folderId}/${req.file.originalname}`;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
