import { useEffect, useState } from "react";

type DiaryLog = {
  entryId: string;
  text: string;
  response_text: string;
  timestamp: number;
};


function Logs() {
  const [logs, setLogs] = useState<DiaryLog[]>([]);

  useEffect(() => {
    fetch("http://localhost:5174/api/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []));
  }, []);

  return (
    <div className="logs-container">
      <h2 className="logs-title">Diary Logs</h2>
      <div className="logs-list">
        {logs.length === 0 && <h1 className="logsNotFound">No Logs yet!</h1>}
        {logs.map((log) => (
          <div key={log.entryId} className="log-item">
            <div>
              <b>{new Date(log.timestamp).toLocaleString()}</b>
            </div>
            <div>
              <b>Input:</b> {log.text}
            </div>
            <div>
              <b>AI:</b> {log.response_text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Logs;
