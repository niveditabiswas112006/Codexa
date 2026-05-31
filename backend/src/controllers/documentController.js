const Document = require("../models/Document");

const createDocument = async (req, res) => {
  try {
    const document = await Document.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ success: true, document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDocument, getDocuments, updateDocument, deleteDocument };
