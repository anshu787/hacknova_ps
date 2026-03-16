import React, { useState, useEffect, useRef } from "react";
import * as api from "../api.js";

const AgentWorkflow = () => {
    const [target, setTarget] = useState("");
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const terminalEndRef = useRef(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        let interval;
        if (selectedJob && selectedJob.status === "running") {
            interval = setInterval(() => {
                fetchJobDetails(selectedJob.job_id);
            }, 2000);
        } else if (selectedJob && selectedJob.status !== "running") {
            // Fetch one last time to ensure we have final events
            fetchJobDetails(selectedJob.job_id);
        }
        return () => clearInterval(interval);
    }, [selectedJob]);

    useEffect(() => {
        // Auto-scroll to bottom of terminal
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [events]);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/agent/jobs");
            setJobs(res.data.jobs);
        } catch (err) {
            console.error("Failed to fetch agent jobs", err);
        }
    };

    const fetchJobDetails = async (jobId) => {
        try {
            const res = await api.get(`/agent/job/${jobId}`);
            setEvents(res.data.job.events || []);
            // Update the selected job in the list so status updates locally
            setSelectedJob(res.data.job);
            setJobs(prev => prev.map(j => j.job_id === jobId ? res.data.job : j));
        } catch (err) {
            console.error("Failed to fetch job details", err);
        }
    };

    const handleStartAgent = async (e) => {
        e.preventDefault();
        if (!target) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/agent/start", { target_domain: target });
            setTarget("");
            setTimeout(fetchJobs, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || "Agent deployment failed");
        } finally {
            setLoading(false);
        }
    };

    const getPhaseColor = (phase) => {
        switch (phase.toUpperCase()) {
            case "OBSERVE": return "var(--cyan)";
            case "ORIENT": return "var(--orange)";
            case "DECIDE": return "var(--purple)";
            case "ACT": return "var(--red)";
            case "SYSTEM": return "var(--green)";
            default: return "var(--text-muted)";
        }
    };

    return (
        <div className="fade-in" style={{ paddingBottom: 60 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, letterSpacing: -0.5 }}>
                        Autonomous Pentest Agent
                    </h1>
                    <p style={{ margin: "5px 0 0 0", color: "var(--text-muted)", fontSize: 14 }}>
                        LLM-driven OODA Loop (Observe, Orient, Decide, Act) orchestrator
                    </p>
                </div>
                <button onClick={fetchJobs} className="btn btn-outline" style={{ fontSize: 12 }}>🔄 Refresh List</button>
            </div>

            <div className="glass-card" style={{ padding: 24, marginBottom: 30, background: "rgba(0,163,255,0.05)", border: "1px solid rgba(0,163,255,0.2)" }}>
                <form onSubmit={handleStartAgent} style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Target designation (e.g. 10.0.0.1 or domain.com)"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            style={{ width: "100%", borderColor: "rgba(0,163,255,0.3)" }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160, background: "var(--cyan)" }}>
                        {loading ? "Deploying..." : "Deploy Agent"}
                    </button>
                </form>
                {error && <div style={{ marginTop: 15, color: "var(--red)", fontSize: 13, fontWeight: 600 }}>{error}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 30 }}>
                {/* Job List */}
                <div className="glass-card" style={{ padding: 20 }}>
                    <h3 style={{ marginTop: 0, marginBottom: 15, fontSize: 13, letterSpacing: 1, color: "var(--text-muted)", fontWeight: 800 }}>ACTIVE OPERATIONS</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {jobs.length === 0 && <div className="text-muted" style={{ fontSize: 13 }}>No active operations. Deploy an agent to begin.</div>}
                        {jobs.map((job) => (
                            <div
                                key={job.job_id}
                                onClick={() => { setSelectedJob(job); fetchJobDetails(job.job_id); }}
                                className={`glass-card ${selectedJob?.job_id === job.job_id ? 'active' : ''}`}
                                style={{
                                    padding: 12,
                                    cursor: "pointer",
                                    background: selectedJob?.job_id === job.job_id ? "rgba(0,163,255,0.1)" : "rgba(255,255,255,0.03)",
                                    border: selectedJob?.job_id === job.job_id ? "1px solid var(--cyan)" : "1px solid var(--border)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <div style={{ fontWeight: 800, fontSize: 14 }}>{job.target}</div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 11 }}>
                                    <span style={{ color: "var(--text-muted)" }}>{new Date(job.created_at).toLocaleString()}</span>
                                    <span style={{
                                        color: job.status === "completed" ? "var(--green)" : job.status === "running" ? "var(--cyan)" : "var(--red)",
                                        textTransform: "uppercase",
                                        fontWeight: 800
                                    }}>
                                        {job.status === "running" ? "⚡ RUNNING" : job.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terminal View */}
                <div className="glass-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "600px", border: "1px solid var(--cyan)" }}>
                    {/* Terminal Header */}
                    <div style={{ background: "rgba(0,0,0,0.5)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--red)" }}></div>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--yellow)" }}></div>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--green)" }}></div>
                            <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "var(--text-muted)", fontFamily: "monospace" }}>
                                {selectedJob ? `AGENT_ID_${selectedJob.job_id.split("-")[0].toUpperCase()}` : "AWAITING_DEPLOYMENT"}
                            </span>
                        </div>
                        {selectedJob?.status === "running" && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div className="spinner" style={{ width: 14, height: 14, borderLeftColor: "var(--cyan)" }}></div>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--cyan)", letterSpacing: 1 }}>OODA ACTIVE</span>
                            </div>
                        )}
                    </div>

                    {/* Terminal Body */}
                    <div style={{ padding: 20, flex: 1, overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: 13, background: "#050B14", color: "#A0B2C6", lineHeight: 1.6 }}>
                        {!selectedJob && (
                            <div style={{ textAlign: "center", marginTop: 100, opacity: 0.5 }}>
                                <div style={{ fontSize: 50, marginBottom: 20 }}>🤖</div>
                                <div>AGENT TERMINAL OFFLINE</div>
                                <div style={{ fontSize: 11, marginTop: 5 }}>Select a job or deploy a new agent to monitor telemetry.</div>
                            </div>
                        )}

                        {selectedJob && events.map((ev, idx) => (
                            <div key={idx} style={{ marginBottom: 15, display: "flex", gap: 15 }}>
                                <div style={{ color: "var(--text-muted)", flexShrink: 0, fontSize: 11 }}>
                                    {new Date(ev.timestamp).toISOString().split("T")[1].slice(0, 12)}
                                </div>
                                <div>
                                    <span style={{
                                        color: getPhaseColor(ev.phase),
                                        fontWeight: 800,
                                        marginRight: 10,
                                        display: "inline-block",
                                        minWidth: 70
                                    }}>
                                        [{ev.phase.toUpperCase()}]
                                    </span>
                                    <span style={{ color: ev.phase === "System" && ev.message.includes("fail") ? "var(--red)" : ev.phase === "System" ? "var(--green)" : "#fff" }}>
                                        {ev.message}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={terminalEndRef}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentWorkflow;
