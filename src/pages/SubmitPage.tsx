import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { User } from "../types";

function SubmitPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [assignmentId, setAssignmentId] = useState("1"); // 예시 과제 ID
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 컴포넌트가 로드될 때 로그인한 사용자 정보를 가져옴
    apiClient
      .get("/api/user/me")
      .then((response) => setCurrentUser(response.data.data))
      .catch(() => (window.location.href = "/login")); // 실패 시 로그인 페이지로
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    setMessage("제출 중입니다...");
    const formData = new FormData();
    formData.append("studentId", String(currentUser.id));
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

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{currentUser.name}님, 안녕하세요!</h2>
      <h1>과제 제출</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>과제 선택: </label>
          <select
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
          >
            <option value="1">과제 1: CNN 모델 구현</option>
            {/* 나중에 과제 API 연동 */}
          </select>
        </div>
        <br />
        <div>
          <label>코드 파일 (zip): </label>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            required
          />
        </div>
        <br />
        <button type="submit">제출하기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SubmitPage;
