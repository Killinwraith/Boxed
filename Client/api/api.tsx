import { useAuth0 } from "@auth0/auth0-react";

export const useApi = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();

  const request = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  };

  const uploadFile = async (file: File, folderId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId);

    return request("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  const downloadFile = async (fileName: string) => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    const res = await fetch(`${API_BASE_URL}/api/files/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Download error: ${res.status}`);

    const blob = await res.blob();
    return blob;
  };

  const deleteFile = async (fileName: string) => {
    return request(`/api/files/${fileName}`, {
      method: "DELETE",
    });
  };

  const listFolders = async (parentFolderId?: string) => {
    const endpoint = parentFolderId
      ? `/api/folders?parent=${parentFolderId}`
      : "/api/folders";
    return request(endpoint);
  };

  const getFolderTree = async () => {
    return request("/api/folders/tree");
  };

  const getFolder = async (folderId: string) => {
    return request(`/api/folders/${folderId}`);
  };

  const updateFolder = async (folderId: string, name: string) => {
    return request(`/api/folders/${folderId}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const deleteFolder = async (folderId: string) => {
    return request(`/api/folders/${folderId}`, {
      method: "DELETE",
    });
  };

  const listFiles = async (folderId?: string) => {
    const endpoint = folderId
      ? `/api/files?folderId=${folderId}`
      : "/api/files";
    return request(endpoint);
  };

  const createFolder = async (name: string, parentFolderId?: string) => {
    return request("/api/folders", {
      method: "POST",
      body: JSON.stringify({ name, parentFolderId }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return {
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
    listFolders,
    getFolderTree,
    getFolder,
    updateFolder,
    deleteFolder,
    createFolder,
  };
};
