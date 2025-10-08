import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { useAuth } from "../context/AuthContext";
import { Assignment } from "../types";

function SubmitPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      apiClient
        .get("/api/assignments")
        .then((response) => {
          const fetchedAssignments: Assignment[] = response.data.data;
          setAssignments(fetchedAssignments);
          if (fetchedAssignments.length > 0) {
            setAssignmentId(String(fetchedAssignments[0].id));
          }
        })
        .catch((error) => {
          console.error("과제 목록을 불러오는 데 실패했습니다.", error);
        });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !assignmentId) {
      setMessage("과제를 선택하고 파일을 첨부해주세요.");
      return;
    }

    setMessage("제출 중입니다...");
    const formData = new FormData();
    formData.append("studentId", String(user.id));
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);

    try {
      const response = await apiClient.post("/api/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(`제출 성공! 제출 ID: ${response.data.data}`);
    } catch (error) {
      setMessage("제출에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{user.name}님, 안녕하세요!</h2>
      <h1>과제 제출</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>과제 선택:</label>
          <select
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            required
          >
            <option value="" disabled>
              과제를 선택하세요
            </option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file-upload">코드 파일 (zip)</label>
          <label htmlFor="file-upload" className="custom-file-upload">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            파일 선택
          </label>
          <input
            id="file-upload" // label과 연결
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            required
          />
          {file && <span className="file-name">{file.name}</span>}
        </div>
        <button type="submit" className="accent">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          제출하기
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SubmitPage;
