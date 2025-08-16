import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "./../../../api/api";
import styles from "./styles/Dashboard.module.css";
import { File } from "./../../../../Shared/Models/File";
import { Folder } from "./../../../../Shared/Models/Folder";
import ErrorBoundary from "../../components/ErrorBoundary";
import Layout from "./Layout";

const Dashboard = () => {
  const {
    uploadFile,
    listFiles,
    listFolders,
    createFolder,
    deleteFolder,
    updateFolder,
    getFolderTree,
  } = useApi();

  const { isAuthenticated, isLoading: authLoading, user } = useAuth0();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);

  const fetchData = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping API calls");
      return;
    }

    setLoading(true);
    try {
      console.log("User authenticated:", user?.email);
      const [folderData, fileData] = await Promise.all([
        listFolders(currentFolderId || undefined),
        listFiles(currentFolderId || undefined),
      ]);

      setFolders(folderData || []);
      setFiles(fileData || []);

      // Update breadcrumbs
      if (currentFolderId) {
        // For now, we'll just show the current folder
        // In a full implementation, you'd fetch the full path
        setBreadcrumbs([
          { _id: currentFolderId, name: "Current Folder" } as Folder,
        ]);
      } else {
        setBreadcrumbs([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty arrays to prevent undefined errors
      setFolders([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [currentFolderId, isAuthenticated, authLoading]);

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
    try {
      await createFolder(newFolderName, currentFolderId || undefined);
      setNewFolderName("");
      fetchData();
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder. Please try again.");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder?")) return;
    try {
      await deleteFolder(folderId);
      fetchData();
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder. Please try again.");
    }
  };

  const handleNavigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleNavigateToParent = () => {
    if (currentFolder && currentFolder.parentFolderId) {
      setCurrentFolderId(currentFolder.parentFolderId);
    } else {
      setCurrentFolderId(null); // Go to root
    }
  };

  return (
    <Layout>
      <ErrorBoundary>
        <div className={styles.dashboard}>
          <h2>My Drive</h2>

          {authLoading && (
            <div className={styles.loading}>Loading authentication...</div>
          )}

          {!isAuthenticated && !authLoading && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3>Please log in to access your files</h3>
              <p>You need to be authenticated to use this application.</p>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Go to Login
              </button>
            </div>
          )}

          {isAuthenticated && (
            <>
              {/* Breadcrumb Navigation */}
              <div className={styles.breadcrumbs}>
                <button
                  onClick={handleNavigateToParent}
                  className={styles.breadcrumbItem}
                >
                  🏠 Root
                </button>
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb._id} className={styles.breadcrumbItem}>
                    {index > 0 && " > "}
                    {crumb.name}
                  </span>
                ))}
              </div>

              <div className={styles.toolbar}>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
                />
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  Create Folder
                </button>
                <input
                  type="file"
                  multiple
                  onChange={handleUpload}
                  disabled={uploading}
                />
                {uploading && <span>Uploading...</span>}
              </div>

              {loading ? (
                <div className={styles.loading}>Loading...</div>
              ) : (
                <div className={styles.content}>
                  <h3>Folders ({folders?.length || 0})</h3>
                  <div className={styles.folders}>
                    {!folders || folders.length === 0 ? (
                      <div className={styles.emptyState}>
                        No folders in this location
                      </div>
                    ) : (
                      folders.map((folder) => (
                        <div key={folder._id} className={styles.folderItem}>
                          <div
                            className={styles.folderName}
                            onClick={() => handleNavigateToFolder(folder._id)}
                          >
                            📁 {folder.name}
                          </div>
                          <button
                            onClick={() => handleDeleteFolder(folder._id)}
                            className={styles.deleteButton}
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <h3>Files ({files?.length || 0})</h3>
                  <div className={styles.files}>
                    {!files || files.length === 0 ? (
                      <div className={styles.emptyState}>
                        No files in this location
                      </div>
                    ) : (
                      files.map((file) => (
                        <div key={file._id} className={styles.fileItem}>
                          📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default Dashboard;
