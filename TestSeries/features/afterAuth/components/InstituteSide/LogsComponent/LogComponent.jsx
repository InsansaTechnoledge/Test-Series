import React, { useEffect, useMemo, useState } from "react";
import { getUsersAndStudentLogs } from "../../../../../utils/services/logsService";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import LogsHeader from "./components/LogsHeader";
import LogsInTable from "./components/LogsInTable";

const LogComponent = () => {
  const [logs, setLogs] = useState([]);
  const { batchMap } = useCachedBatches();

  useEffect(() => {
    const getLogs = async () => {
      const data = await getUsersAndStudentLogs();
      setLogs(data?.data || []);
    };
    getLogs();
    console.log("Logs fetched:", logs);
  }, []);

  const students = useMemo(() => {
    return logs.filter((entry) => entry.role === "student");
  }, [logs]);

  const users = useMemo(() => {
    return logs.filter((entry) => entry.role === "user");
  }, [logs]);

  const studentBatchInfo = useMemo(() => {
    return students.map((student) => {
      const batchId = student?.batch?.currentBatch;
      return {
        ...student,
        batch: batchMap?.[batchId]?.name || "Unknown Batch",
      };
    });
  }, [students, batchMap]);

  const OnlineStudentCount = students.filter((s) => s.online).length;
  const OnlineFacultyCount = users.filter((f) => f.online).length;

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
        {logs}
      </div>
      <LogsHeader
        OnlineStudentCount={OnlineStudentCount}
        TotalStudentCount={students.length}
        OnlineFacultyCount={OnlineFacultyCount}
        TotalFacultyCount={users.length}
      />

      <LogsInTable users={users} students={studentBatchInfo} />
    </div>
  );
};

export default LogComponent;
