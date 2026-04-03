import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import API from "../services/api";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    subject: "",
    type: "PDF",
    title: "",
    content: ""
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await API.get("/materials");
      setMaterials(res.data);
    } catch (err) {
      console.log("Error fetching materials", err);
    }
  };

  const isFileType =
    formData.type === "PDF" ||
    formData.type === "Video" ||
    formData.type === "Document";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData({
        ...formData,
        type: value,
        content: ""
      });
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      type: "PDF",
      title: "",
      content: ""
    });
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("subject", formData.subject);
      data.append("type", formData.type);
      data.append("title", formData.title);

      if (isFileType) {
        if (!file) {
          alert(`Please upload a ${formData.type.toLowerCase()} file`);
          return;
        }
        data.append("file", file);
      } else {
        if (!formData.content.trim()) {
          alert(`Please enter ${formData.type === "Link" ? "a link" : "notes"}`);
          return;
        }
        data.append("content", formData.content);
      }

      await API.post("/materials", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      resetForm();
      setShowForm(false);
      fetchMaterials();
    } catch (err) {
      console.log("SAVE MATERIAL ERROR:", err.response?.data || err.message);
      alert("Failed to save material");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.log("Error deleting material", err);
    }
  };

  const openFileViewer = (url, type) => {
    setSelectedFileUrl(`http://localhost:5000${url}`);
    setSelectedFileType(type);
  };

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Materials</h1>
          <p>Add notes, PDFs, videos, and links for your subjects</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              resetForm();
            }
          }}
        >
          <Plus size={18} />
          Add Material
        </button>
      </div>

      {showForm && (
        <div className="panel" style={{ marginBottom: "24px" }}>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter subject name"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <label>Material Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="PDF">PDF</option>
              <option value="Link">Link</option>
              <option value="Notes">Notes</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
            </select>

            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter material title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {isFileType ? (
              <>
                <label>
                  Upload {formData.type}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    formData.type === "PDF"
                      ? ".pdf,application/pdf"
                      : formData.type === "Video"
                      ? "video/*"
                      : ".doc,.docx,.ppt,.pptx,.txt,.pdf"
                  }
                  onChange={handleFileChange}
                  required
                />
              </>
            ) : (
              <>
                <label>
                  {formData.type === "Link" ? "Paste Link" : "Write Notes"}
                </label>
                <textarea
                  name="content"
                  placeholder={
                    formData.type === "Link"
                      ? "Paste link here"
                      : "Write notes here"
                  }
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="material-textarea"
                ></textarea>
              </>
            )}

            <button type="submit" className="primary-btn full-btn">
              Save Material
            </button>
          </form>
        </div>
      )}

      <div className="panel">
        {materials.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <h2 style={{ marginBottom: "10px" }}>No materials yet</h2>
            <p className="empty-text">
              Add notes, PDFs, videos, and links to organize your study materials.
            </p>
          </div>
        ) : (
          <div className="materials-grid">
            {materials.map((item) => (
              <div className="material-card" key={item._id}>
                <div className="material-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subject}</p>
                  </div>

                  <button
                    className="icon-action-btn delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <span className="material-badge">{item.type}</span>

                {item.type === "PDF" && item.fileUrl ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => openFileViewer(item.fileUrl, "PDF")}
                  >
                    Open PDF
                  </button>
                ) : item.type === "Video" && item.fileUrl ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => openFileViewer(item.fileUrl, "Video")}
                  >
                    Open Video
                  </button>
                ) : item.type === "Document" && item.fileUrl ? (
                  <a
                    href={`http://localhost:5000${item.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="primary-btn"
                    style={{ textDecoration: "none", display: "inline-block" }}
                  >
                    Open Document
                  </a>
                ) : item.type === "Link" ? (
                  <a
                    href={item.content}
                    target="_blank"
                    rel="noreferrer"
                    className="material-link"
                  >
                    Open Link
                  </a>
                ) : (
                  <p className="material-content">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFileUrl && (
        <div className="modal-overlay">
          <div className="pdf-viewer-modal">
            <div className="modal-header">
              <h2>
                {selectedFileType === "Video" ? "Video Viewer" : "PDF Viewer"}
              </h2>
              <button
                className="close-btn"
                onClick={() => {
                  setSelectedFileUrl("");
                  setSelectedFileType("");
                }}
              >
                <X size={22} />
              </button>
            </div>

            {selectedFileType === "Video" ? (
              <video controls className="pdf-frame" style={{ background: "#000" }}>
                <source src={selectedFileUrl} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={selectedFileUrl}
                title="PDF Viewer"
                className="pdf-frame"
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;