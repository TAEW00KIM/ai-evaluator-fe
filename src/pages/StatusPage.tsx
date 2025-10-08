import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { Submission } from "../types";

function StatusPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = () => {
    apiClient
      .get("/api/submissions/me")
      .then((response) => {
        setSubmissions(response.data.data);
      })
      .catch(() => (window.location.href = "/login"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSubmissions(); // 처음 한 번 데이터를 불러옴

    // 5초마다 Polling을 위한 인터벌 설정
    const intervalId = setInterval(() => {
      // '채점 중'인 항목이 있을 때만 데이터를 다시 불러옴
      setSubmissions((prev) => {
        const isPending = prev.some(
          (s) => s.status === "PENDING" || s.status === "RUNNING"
        );
        if (isPending) {
          fetchSubmissions();
        }
        return prev;
      });
    }, 5000); // 5000ms = 5초
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>나의 제출 현황</h1>
      {isLoading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <div className="table-wrapper">
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
                  <td>
                    <span className={`status status-${sub.status}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>{sub.score ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StatusPage;
