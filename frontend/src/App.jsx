import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function App() {
  const [file, setFile] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef();

  // File selection
  const handleFile = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) setFile(uploaded);
  };

  // Drag-Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded) setFile(uploaded);
  };

  // Remove PDF
  const removeFile = () => setFile(null);

  // Add rule
  const addRule = () => setRules([...rules, ""]);

  // Update rule text
  const updateRule = (index, value) => {
    const updated = [...rules];
    updated[index] = value;
    setRules(updated);
  };

  // Submit to backend
  const handleSubmit = async () => {
    if (!file) return setError("Upload a PDF!");
    if (rules.some((r) => r.trim() === "")) return setError("Fill all rules!");

    setError("");
    setResults([]);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("rules", JSON.stringify(rules));

    try {
      const response = await fetch("https://assignment-wesourceu-backend.onrender.com/check-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setError("");
        setResults(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
      setResults([]);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" fontWeight="700" mb={3}>
        NIYAMR AI — PDF Rule Checker
      </Typography>

      {/* PDF Upload Box */}
      <Paper
        elevation={3}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed #9ca3af",
          borderRadius: 4,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { borderColor: "#6366f1", backgroundColor: "#f8f9ff" },
        }}
        onClick={() => inputRef.current.click()}
      >
        <CloudUploadIcon sx={{ fontSize: 60, color: "#6366f1", mb: 1 }} />
        <Typography variant="h6" fontWeight="600">
          Upload your PDF
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
          Drag & drop or browse from your device
        </Typography>
        <Button variant="contained" onClick={() => inputRef.current.click()}>
          Browse File
        </Button>
        <input
          type="file"
          hidden
          ref={inputRef}
          accept="application/pdf"
          onChange={handleFile}
        />
      </Paper>

      {/* File Preview */}
      {file && (
        <Paper
          elevation={2}
          sx={{
            mt: 3,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Typography>{file.name}</Typography>
          <IconButton color="error" onClick={removeFile}>
            <DeleteIcon />
          </IconButton>
        </Paper>
      )}

      {/* Rules Section */}
      <Typography variant="h6" fontWeight="700" mt={4} mb={2}>
        Enter Rules to Check:
      </Typography>
      {rules.map((rule, index) => (
        <TextField
          key={index}
          label={`Rule #${index + 1}`}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={rule}
          onChange={(e) => updateRule(index, e.target.value)}
        />
      ))}
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={addRule}
      >
        Add More Rule
      </Button>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ py: 1.2, fontSize: 16, fontWeight: "600" }}
        onClick={handleSubmit}
      >
        Check Document
      </Button>

      {/* Error message */}
      {error && (
        <Box mt={3} mb={1} sx={{ color: "red", fontWeight: 600 }}>
          {error}
        </Box>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Results
          </Typography>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Rule</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Reasoning</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.rule}</td>
                  <td>{r.status}</td>
                  <td>{r.evidence}</td>
                  <td>{r.reasoning}</td>
                  <td>{r.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </Box>
  );
}
