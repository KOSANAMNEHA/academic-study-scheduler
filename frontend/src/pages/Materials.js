import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import API from "../services/api";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

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
      console.log("Error fetching materials");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("subject", formData.subject);
      data.append("type", formData.type);
      data.append("title", formData.title);
      data.append("content", formData.content);

      if (file) {
        data.append("file", file);
      }

      await API.post("/materials", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setFormData({
        subject: "",
        type: "PDF",
        title: "",
        content: ""
      });
      setFile(null);
      setShowForm(false);
      fetchMaterials();
    } catch (err) {
      console.log("Error adding material");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.log("Error deleting material");
    }
  };

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Materials</h1>
          <p>Add notes, PDFs, videos, and links for your subjects</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
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

            {formData.type === "PDF" ? (
              <>
                <label>Upload PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </>
            ) : (
              <>
                <label>Content / Link / Notes</label>
                <textarea
                  name="content"
                  placeholder="Paste link or write notes"
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
                    className="primary-btn"
                    onClick={() => setSelectedPdf(`http://localhost:5000${item.fileUrl}`)}
                  >
                    Open PDF
                  </button>
                ) : item.type === "Link" || item.type === "Video" ? (
                  <a
                    href={item.content}
                    target="_blank"
                    rel="noreferrer"
                    className="material-link"
                  >
                    Open Material
                  </a>
                ) : (
                  <p className="material-content">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPdf && (
        <div className="modal-overlay">
          <div className="pdf-viewer-modal">
            <div className="modal-header">
              <h2>PDF Viewer</h2>
              <button className="close-btn" onClick={() => setSelectedPdf("")}>
                <X size={22} />
              </button>
            </div>

            <iframe
              src={selectedPdf}
              title="PDF Viewer"
              className="pdf-frame"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;