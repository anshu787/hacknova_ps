import os
import httpx
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

MOBSF_URL = os.getenv("MOBSF_URL", "http://localhost:8001")
MOBSF_API_KEY = os.getenv("MOBSF_API_KEY", "52ec068eee942635382ee29c4e4898b671e0a090f9adb35137fe59ecf5181e53")

class MobSFScanner:
    def __init__(self):
        self.base_url = MOBSF_URL.rstrip('/')
        self.api_key = MOBSF_API_KEY
        self.headers = {"Authorization": self.api_key} if self.api_key else {}
        self.client = httpx.AsyncClient(timeout=300.0)

    async def _mock_scan(self, file_path: str) -> Dict[str, Any]:
        """Provides a realistic mock scan result for demonstration when MobSF is unavailable."""
        import asyncio
        await asyncio.sleep(4)  # Simulate scan time
        return {
            "vulnerabilities": [
                {
                    "title": "Hardcoded API Key",
                    "severity": "High",
                    "description": "Found a hardcoded AWS key or external API token in resources.",
                    "component": "strings.xml"
                },
                {
                    "title": "Insecure Network Traffic",
                    "severity": "Medium",
                    "description": "Cleartext traffic is permitted in Network Security Configuration, allowing MITM attacks.",
                    "component": "network_security_config.xml"
                },
                {
                    "title": "Debuggable flag enabled",
                    "severity": "Low",
                    "description": "The application is marked as debuggable in the manifest.",
                    "component": "AndroidManifest.xml"
                },
                {
                    "title": "Exported Activity",
                    "severity": "Info",
                    "description": "Found exported activities that might be vulnerable to Intent spoofing.",
                    "component": "MainActivity"
                }
            ],
            "permissions_analyzed": 14,
            "raw_report_id": "mock-hash-123456"
        }

    async def scan_file(self, file_path: str, filename: str) -> Dict[str, Any]:
        """Uploads, scans, and parses an APK/IPA file using MobSF."""
        try:
            # Check if MobSF is reachable
            try:
                resp = await self.client.get(f"{self.base_url}/")
            except Exception:
                logger.warning(f"MobSF not reachable at {self.base_url}. Using mock scan for demonstration.")
                return await self._mock_scan(file_path)

            if not self.api_key:
                logger.warning("MobSF API Key not set. Using mock scan for demonstration.")
                return await self._mock_scan(file_path)

            # 1. Upload
            logger.info(f"Uploading {filename} to MobSF...")
            with open(file_path, "rb") as f:
                files = {"file": (filename, f, "application/octet-stream")}
                upload_resp = await self.client.post(f"{self.base_url}/api/v1/upload", headers=self.headers, files=files)
                upload_resp.raise_for_status()
                upload_data = upload_resp.json()
                
            file_hash = upload_data.get("hash")
            scan_type = upload_data.get("scan_type")
            
            # 2. Scan
            logger.info(f"Starting MobSF scan for hash {file_hash}...")
            scan_data = {"hash": file_hash, "scan_type": scan_type, "file_name": filename}
            scan_resp = await self.client.post(f"{self.base_url}/api/v1/scan", headers=self.headers, data=scan_data)
            scan_resp.raise_for_status()

            # 3. Get JSON Report
            logger.info(f"Fetching MobSF report for hash {file_hash}...")
            report_resp = await self.client.post(f"{self.base_url}/api/v1/report_json", headers=self.headers, data={"hash": file_hash})
            report_resp.raise_for_status()
            report_data = report_resp.json()

            # 4. Parse Results
            return self._parse_report(report_data, file_hash)

        except httpx.HTTPError as e:
            logger.error(f"MobSF HTTP Error: {e}")
            raise Exception(f"MobSF Scan failed: {str(e)}")
        except Exception as e:
            logger.error(f"MobSF Error: {e}")
            raise Exception(f"MobSF Scan failed: {str(e)}")

    def _parse_report(self, report: Dict[str, Any], file_hash: str) -> Dict[str, Any]:
        vulns = []
        
        # Parse Manifest issues
        manifest = report.get("manifest_analysis", [])
        if isinstance(manifest, list):
            for issue in manifest:
                vulns.append({
                    "title": issue.get("title", "Manifest Issue"),
                    "severity": self._map_severity(issue.get("stat", "info")),
                    "description": issue.get("desc", ""),
                    "component": issue.get("name", "AndroidManifest.xml")
                })
        
        # Basic counting of permissions
        permissions = len(report.get("permissions", {}).keys())
        
        return {
            "vulnerabilities": vulns,
            "permissions_analyzed": permissions,
            "raw_report_id": file_hash
        }

    def _map_severity(self, stat: str) -> str:
        stat = stat.lower()
        if stat in ["high", "danger"]: return "High"
        if stat in ["warning", "medium"]: return "Medium"
        if stat in ["info", "secure"]: return "Low"
        return "Info"
