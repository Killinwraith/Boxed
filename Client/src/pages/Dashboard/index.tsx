import { useState, useEffect } from "react";
import { useApi } from "./../../../api/api";
import styles from "./styles/Dashboard.module.css";
import { File } from "./../../../../Shared/Models/File";
import { Folder } from "./../../../../Shared/Models/Folder";

const Dashboard = () => {
  const { uploadFile, listFiles, listFolders, createFolder } = useApi();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>("root");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [folderData, fileData] = await Promise.all([
      listFolders(currentFolderId || undefined),
      listFiles(currentFolderId || undefined),
    ]);
    setFolders(folderData);
    setFiles(fileData);
  };

  useEffect(() => {
    fetchData();
  }, [currentFolderId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    for (let file of Array.from(e.target.files)) {
      await uploadFile(file);
    }
    setUploading(false);
    fetchData();
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolder(newFolderName, currentFolderId || undefined);
    setNewFolderName("");
    fetchData();
  };

  return (
    <div className={styles.dashboard}>
      <h2>My Drive</h2>

      <div className={styles.toolbar}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
        />
        <button onClick={handleCreateFolder}>Create Folder</button>
        <input
          type="file"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>

      <div className={styles.content}>
        <h3>Folders</h3>
        <div className={styles.folders}>
          {folders.map((folder) => (
            <div
              key={folder._id}
              className={styles.folderItem}
              onClick={() => setCurrentFolderId(folder._id)}
            >
              📁 {folder.name}
            </div>
          ))}
        </div>

        <h3>Files</h3>
        <div className={styles.files}>
          {files.map((file) => (
            <div key={file._id} className={styles.fileItem}>
              📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
