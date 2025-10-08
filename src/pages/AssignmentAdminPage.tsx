import React, { useState, useEffect } from "react";
import apiClient from "../api";
import { Assignment } from "../types";

function AssignmentAdminPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // 페이지 로딩 시 기존 과제 목록 불러오기
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    apiClient
      .get("/api/assignments")
      .then((response) => {
        setAssignments(response.data.data);
      })
      .catch((error) => {
        console.error("과제 목록 로딩 실패", error);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await apiClient.post("/api/admin/assignments", { title, description });
      setMessage("새로운 과제가 성공적으로 등록되었습니다.");
      // 등록 성공 후 입력 필드 초기화 및 목록 새로고침
      setTitle("");
      setDescription("");
      fetchAssignments();
    } catch (error) {
      setMessage("과제 등록에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    // 사용자에게 정말 삭제할 것인지 확인받음
    if (
      window.confirm(
        `정말로 '${
          assignments.find((a) => a.id === assignmentId)?.title
        }' 과제를 삭제하시겠습니까?`
      )
    ) {
      try {
        await apiClient.delete(`/api/admin/assignments/${assignmentId}`);
        setMessage("과제가 성공적으로 삭제되었습니다.");
        // 삭제 성공 후 목록 새로고침
        fetchAssignments();
      } catch (error) {
        setMessage(
          "과제 삭제에 실패했습니다. 해당 과제에 연결된 제출 기록이 있는지 확인해주세요."
        );
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>과제 관리</h1>

      <h2>새 과제 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>과제 제목: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "300px" }}
          />
        </div>
        <br />
        <div>
          <label>과제 설명: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "300px", height: "100px" }}
          />
        </div>
        <br />
        <button type="submit">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          과제 등록하기
        </button>
      </form>
      {message && <p>{message}</p>}

      <hr style={{ margin: "30px 0" }} />

      <h2>등록된 과제 목록</h2>
      <table>
        <thead>
          <tr>
            <th>과제 제목</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>
                <strong>{assignment.title}</strong> (ID: {assignment.id})
              </td>
              <td>
                <button
                  onClick={() => handleDelete(assignment.id)}
                  className="danger"
                >
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentAdminPage;
