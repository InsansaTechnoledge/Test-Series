import React, { useEffect, useMemo, useState } from 'react';
import { getUsersAndStudentLogs } from '../../../../../utils/services/logsService';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';

const LogComponent = () => {
  const [logs, setLogs] = useState([]);
  const { batchMap } = useCachedBatches();

  useEffect(() => {
    const getLogs = async () => {
      const data = await getUsersAndStudentLogs();
      setLogs(data?.data || []);
    };
    getLogs();
  }, []);

  const students = useMemo(() => {
    return logs.filter((entry) => entry.role === 'student');
  }, [logs]);

  const users = useMemo(() => {
    return logs.filter((entry) => entry.role === 'user');
  }, [logs]);

  const studentBatchInfo = useMemo(() => {
    return students.map((student) => {
      const batchId = student?.batch?.currentBatch;
      return {
        ...student,
        batch: batchMap?.[batchId]?.name || 'Unknown Batch'
      };
    });
  }, [students, batchMap]);

  // Converts UTC to IST (for optional display)
  const formatISTTime = (utcTime) => {
    return new Date(utcTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true
    });
  };

  // Returns "x minutes ago" etc.
  const timeAgo = (updatedAtUTC) => {
    if (!updatedAtUTC) return "N/A";

    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const updatedIST = new Date(new Date(updatedAtUTC).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const diffMs = nowIST - updatedIST;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;
    return `${diffMonth} months ago`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      {users.map((user) => (
        <div key={user.id} className="mb-2">
          <p>
            {user.name} ({user.email}) -{" "}
            {user.online ? "🟢 Online" : "⚪ Offline"} - Last login:{" "}
            {timeAgo(user.lastLogin)}
          </p>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-4">Students</h2>
      {studentBatchInfo.map((student) => (
        <div key={student.id} className="mb-2">
          <p>
            {student.name} ({student.email}) - {student.batch} -{" "}
            {student.online ? "🟢 Online" : "⚪ Offline"} - Last login:{" "}
            {timeAgo(student.lastLogin) } || {formatISTTime(student.lastLogin)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LogComponent;
