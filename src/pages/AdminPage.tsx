import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { Submission, User } from "../types"; // User 타입을 사용하진 않지만, 확장성을 위해 DTO에 포함될 수 있음

// 백엔드의 AdminSubmissionDto와 형식을 맞춥니다.
interface AdminSubmission extends Submission {
  studentName: string;
  studentEmail: string;
}

function AdminPage() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/api/admin/submissions")
      .then((response) => {
        setSubmissions(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setError(
            "이 페이지에 접근할 권한이 없습니다. 관리자 계정으로 로그인해주세요."
          );
        } else {
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
        }
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>관리자 데이터를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>관리자 대시보드 (전체 제출 현황)</h1>
      <table>
        <thead>
          <tr>
            <th>제출 ID</th>
            <th>학생 이름</th>
            <th>학생 이메일</th>
            <th>제출 시간</th>
            <th>상태</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.studentName}</td>
              <td>{sub.studentEmail}</td>
              <td>{new Date(sub.submissionTime).toLocaleString()}</td>
              <td>{sub.status}</td>
              <td>{sub.score ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
