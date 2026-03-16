import { useState, useEffect } from "react";
import * as api from "../api.js";

export default function ReportsPage() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        api.listScans(50).then(r => {
            const done = (r.scans || []).filter(s => s.status === "completed");
            setScans(done);
        });
    }, []);

    async function handleDownload(scanId, target) {
        setError(""); setSuccess("");
        setDownloading(scanId);
        try {
            const blob = await api.downloadReport(scanId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `cyberguard_report_${scanId.slice(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up with a small delay
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
            
            setSuccess(`✅ Report downloaded for ${target}`);
        } catch (err) {
            setError(`Failed to download report: ${err.message}`);
        } finally {
            setDownloading(null);
        }
    }

    const sevMap = { critical: "var(--red)", high: "var(--orange)", medium: "var(--yellow)", low: "var(--green)", info: "var(--cyan)" };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <div className="page-title"><span>📄</span> Reports</div>
                    <div className="page-subtitle">Download PDF vulnerability reports for completed scans</div>
                </div>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {scans.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📄</div>
                    <div className="empty-state-title">No completed scans</div>
                    <div className="empty-state-desc">Complete a scan to generate a downloadable PDF report</div>
                </div>
            ) : (
                <div style={{ display: "grid", gap: 16 }}>
                    {scans.map(scan => (
                        <div key={scan.scan_id} className="card" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 24 }}>
                            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                {/* Icon */}
                                <div style={{
                                    width: 56, height: 56, borderRadius: "var(--radius)", flexShrink: 0,
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))",
                                    border: "1px solid var(--border)",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                                }}>📋</div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 4 }}>
                                        {scan.target}
                                    </div>
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                                            ID: {scan.scan_id?.slice(0, 12)}...
                                        </span>
                                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            📅 {scan.completed_at ? new Date(scan.completed_at).toLocaleString() : "—"}
                                        </span>
                                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            🔍 {scan.scan_types?.join(", ")}
                                        </span>
                                    </div>

                                    {/* Vulnerability summary */}
                                    <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 13, color: "var(--accent-light)", fontWeight: 600 }}>
                                            {scan.vuln_count} findings
                                        </span>
                                        {scan.description && (
                                            <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
                                                — {scan.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 10, flexDirection: "column", alignItems: "flex-end" }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDownload(scan.scan_id, scan.target)}
                                    disabled={downloading === scan.scan_id}
                                >
                                    {downloading === scan.scan_id ? (
                                        <><div className="spinner" style={{ width: 16, height: 16 }} /> Generating...</>
                                    ) : (
                                        "⬇️ Download PDF"
                                    )}
                                </button>
                                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Includes vulnerabilities, CVEs, attack graph & mitigations</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Report contents legend */}
            {scans.length > 0 && (
                <div className="card" style={{ marginTop: 24 }}>
                    <div className="card-title">📋 Report Contents</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                        {[
                            { icon: "🎯", label: "Target Info" },
                            { icon: "🔍", label: "Executive Summary" },
                            { icon: "📊", label: "Vulnerability Table" },
                            { icon: "🐛", label: "Detailed Findings" },
                            { icon: "🕸️", label: "Attack Graph Analysis" },
                            { icon: "💊", label: "Remediation Advice" },
                            { icon: "📚", label: "CVE References" },
                            { icon: "🔒", label: "Security Recommendations" },
                        ].map(({ icon, label }) => (
                            <div key={label} style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                                background: "rgba(99,102,241,0.06)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)"
                            }}>
                                <span>{icon}</span>
                                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
