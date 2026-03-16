import logging
from typing import List, Dict, Any
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def get_latest_threat_intel() -> List[Dict[str, Any]]:
    """
    Simulates fetching the latest internet-scale threat intelligence from NVD, Rapid7, and MITRE feeds.
    In a full production environment, this would hit the NVD API 2.0 stream and parse STIX/TAXII feeds.
    """
    now = datetime.utcnow()
    
    return [
        {
            "cve_id": "CVE-2024-3094",
            "title": "XZ Utils Backdoor",
            "description": "Malicious code discovered in the upstream tarballs of xz, starting with version 5.6.0. The backdoor intercepts execution path through dlsym(), potentially allowing remote code execution under certain conditions (like sshd).",
            "severity": "critical",
            "cvss_score": 10.0,
            "published_date": (now - timedelta(hours=14)).isoformat(),
            "source": "NVD Data Feed",
            "mitre_tactic": "Execution",
            "mitre_technique": "T1059 Command and Scripting Interpreter"
        },
        {
            "cve_id": "CVE-2023-46805",
            "title": "Ivanti Connect Secure Authentication Bypass",
            "description": "An authentication bypass vulnerability in the web component of Ivanti Connect Secure allows a remote attacker to access restricted resources by bypassing control checks.",
            "severity": "critical",
            "cvss_score": 9.8,
            "published_date": (now - timedelta(days=2)).isoformat(),
            "source": "Rapid7 Threat Feed",
            "mitre_tactic": "Initial Access",
            "mitre_technique": "T1190 Exploit Public-Facing Application"
        },
        {
            "cve_id": "CVE-2024-21412",
            "title": "Windows SmartScreen Security Feature Bypass",
            "description": "An attacker can send a targeted user a specially crafted file that is designed to bypass displayed security checks. The attacker would have to convince the user to click on the crafted file.",
            "severity": "high",
            "cvss_score": 8.1,
            "published_date": (now - timedelta(days=4)).isoformat(),
            "source": "MITRE CVE List",
            "mitre_tactic": "Defense Evasion",
            "mitre_technique": "T1562.001 Disable or Modify Tools"
        },
        {
            "cve_id": "CVE-2023-4966",
            "title": "Citrix NetScaler Information Disclosure (Citrix Bleed)",
            "description": "Sensitive information disclosure in NetScaler ADC and NetScaler Gateway when configured as a Gateway (VPN virtual server, ICA Proxy, CVPN, RDP Proxy) or AAA virtual server.",
            "severity": "critical",
            "cvss_score": 9.4,
            "published_date": (now - timedelta(days=12)).isoformat(),
            "source": "NVD Data Feed",
            "mitre_tactic": "Credential Access",
            "mitre_technique": "T1552 Unsecured Credentials"
        },
        {
            "cve_id": "CVE-2024-23897",
            "title": "Jenkins Arbitrary File Read",
            "description": "Jenkins 2.441 and earlier, LTS 2.426.2 and earlier does not disable a feature of its CLI command parser that replaces an '@' character followed by a file path in an argument with the file's contents, allowing unauthenticated attackers to read arbitrary files on the Jenkins controller file system.",
            "severity": "high",
            "cvss_score": 8.5,
            "published_date": (now - timedelta(days=20)).isoformat(),
            "source": "Rapid7 Threat Feed",
            "mitre_tactic": "Collection",
            "mitre_technique": "T1005 Data from Local System"
        }
    ]
