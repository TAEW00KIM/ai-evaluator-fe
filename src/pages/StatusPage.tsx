import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { Submission } from "../types";

function StatusPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트가 로드될 때 내 제출 목록을 가져옴
    apiClient
      .get("/api/submissions/me")
      .then((response) => {
        setSubmissions(response.data.data);
        setIsLoading(false);
      })
      .catch(() => (window.location.href = "/login")); // 실패 시 로그인 페이지로
  }, []);

  return (
    <div>
      <h1>나의 제출 현황</h1>
      {isLoading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>제출 ID</th>
              <th>제출 시간</th>
              <th>상태</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{new Date(sub.submissionTime).toLocaleString()}</td>
                <td>{sub.status}</td>
                <td>{sub.score ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StatusPage;
