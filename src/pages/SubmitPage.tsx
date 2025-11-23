import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { useAuth } from "../context/AuthContext";
import type { Assignment } from "../types";

function SubmitPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [message, setMessage] = useState("");
  // 현재 선택된 과제 및 마감 여부
  const selected = assignments.find((a) => String(a.id) === assignmentId);
  const closed = !!selected?.submissionsClosed;

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
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // 2번 프로젝트를 위한 파일명 검사
      if (
        selectedFile.name !== "z_best.pt" &&
        selectedFile.name.endsWith(".pt")
      ) {
        setMessage(
          "경고: 제출 파일명이 'z_best.pt'가 아닙니다. 2번 프로젝트 제출 시 파일명을 'z_best.pt'로 맞춰주세요."
        );
      } else if (
        !selectedFile.name.endsWith(".pt") &&
        !selectedFile.name.endsWith(".zip")
      ) {
        setMessage(
          "경고: .zip 또는 .pt 파일만 제출할 수 있습니다. 과제 유형을 확인하세요."
        );
      } else {
        setMessage(""); // 유효한 파일이거나 zip 파일이면 메시지 초기화
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (closed) {
      setMessage("이 과제는 현재 제출이 마감되었습니다.");
      return;
    }
    if (!file || !user || !assignmentId) {
      setMessage("과제를 선택하고 파일을 첨부해주세요.");
      return;
    }

    // 2번 프로젝트(pt) 파일명 강제 검사
    if (file.name.endsWith(".pt") && file.name !== "z_best.pt") {
      if (
        !window.confirm(
          "파일 이름이 'z_best.pt'가 아닙니다. 그래도 제출하시겠습니까?"
        )
      ) {
        return;
      }
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
      {closed && (
        <div
          style={{
            padding: "12px",
            marginBottom: "12px",
            background: "#fff3cd",
            border: "1px solid #ffeeba",
          }}
        >
          이 과제는 현재 <b>제출 마감</b> 상태입니다. 관리자에게 문의하세요.
        </div>
      )}
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
          <label htmlFor="file-upload">제출 파일 (.zip 또는 .pt)</label>
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
            파일 선택 (z_best.pt 또는 .zip)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".zip,.pt"
            onChange={handleFileChange}
            required
            disabled={closed}
          />
          {file && <span className="file-name">{file.name}</span>}
        </div>
        <button
          type="submit"
          className="accent"
          disabled={closed}
          title={closed ? "제출이 마감되었습니다" : "제출"}
        >
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
