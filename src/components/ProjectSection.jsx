// src/components/ProjectSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaTools, FaFigma, FaGithub,
  FaTimes, FaDownload, FaServer, FaCloud, FaShieldAlt, FaBug, FaSearch,
  FaLock, FaCalendarAlt, FaCheck, FaGlobe, FaNetworkWired, FaFileAlt,
  FaEye, FaCode, FaClipboardList, FaLightbulb, FaWrench
} from 'react-icons/fa';
import {
  SiTailwindcss, SiNextdotjs, SiVercel, SiPostgresql, SiPython, SiFlask
} from 'react-icons/si';
import { PiCodeBold } from "react-icons/pi";
import { LuBadge } from "react-icons/lu";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { useNavbar } from '../contexts/NavbarContext';
import { supabase } from '../lib/supabase';

// ===================================
// CATEGORY CONFIG
// ===================================
const categoryConfig = {
  'Web Security': {
    badgeClass: 'dark:bg-cyan-900/30 bg-cyan-50 border-cyan-400/30 dark:text-cyan-300 text-cyan-700',
    barClass: 'from-cyan-500 to-cyan-600',
    icon: <FaGlobe />,
  },
  'Cloud Security': {
    badgeClass: 'dark:bg-sky-900/30 bg-sky-50 border-sky-400/30 dark:text-sky-300 text-sky-700',
    barClass: 'from-sky-500 to-sky-600',
    icon: <FaCloud />,
  },
  'Blue Team Operations': {
    badgeClass: 'dark:bg-indigo-900/30 bg-indigo-50 border-indigo-400/30 dark:text-indigo-300 text-indigo-600',
    barClass: 'from-indigo-500 to-indigo-600',
    icon: <FaShieldAlt />,
  },
  'Network Security': {
    badgeClass: 'dark:bg-emerald-900/30 bg-emerald-50 border-emerald-400/30 dark:text-emerald-300 text-emerald-700',
    barClass: 'from-emerald-500 to-emerald-600',
    icon: <FaNetworkWired />,
  },
  'Malware Analysis': {
    badgeClass: 'dark:bg-red-900/30 bg-red-50 border-red-400/30 dark:text-red-300 text-red-700',
    barClass: 'from-red-500 to-red-600',
    icon: <FaBug />,
  },
};

const PROJECT_CATEGORIES = ['All', 'Web Security', 'Cloud Security', 'Blue Team Operations', 'Network Security', 'Malware Analysis'];

// ===================================
// CYBERSECURITY PROJECTS DATA
// ===================================
const cyberProjects = [
  {
    id: 'ws-001',
    title: 'Web & API Security Assessment',
    category: 'Web Security',
    skills: ['OWASP Top 10', 'API Security Testing', 'SQL Injection', 'XSS', 'Authentication Bypass'],
    description: 'Comprehensive assessment of web application and API security vulnerabilities following the OWASP Testing Guide methodology, covering injection flaws, broken authentication, and API-specific vulnerabilities.',
    technologies: ['Burp Suite', 'OWASP ZAP', 'Postman', 'Python', 'cURL'],
    date: 'Mar 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Applied OWASP Testing Guide v4.2 methodology for both web application and API security testing. Used a combination of automated scanning and manual testing techniques to ensure comprehensive coverage.',
      findings: 'Identified critical OWASP Top 10 vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), Insecure Direct Object References (IDOR), and Broken Authentication mechanisms.',
      recommendations: 'Implement parameterized queries, Content Security Policy (CSP) headers, proper session management, and API authentication best practices (OAuth 2.0 / JWT with proper validation).',
      remediation: 'Documented remediation steps for each finding with CVSS v3.1 scores and prioritized fix timeline based on exploitability and impact.',
    },
  },
  {
    id: 'ws-002',
    title: 'Mobile Application Security Testing',
    category: 'Web Security',
    skills: ['Android Security', 'SSL Pinning Bypass', 'APK Static Analysis', 'OWASP Mobile Top 10', 'Runtime Instrumentation'],
    description: 'In-depth mobile application security assessment covering static APK analysis, dynamic runtime testing, root detection bypass, SSL pinning circumvention, and OWASP Mobile Top 10 vulnerability testing.',
    technologies: ['Frida', 'Objection', 'Burp Suite', 'ADB', 'JADX', 'MobSF', 'apktool'],
    date: 'Feb 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Used OWASP Mobile Security Testing Guide (MSTG) as the assessment framework. Conducted two-phase testing: static APK decompilation and analysis followed by dynamic runtime instrumentation.',
      findings: 'Discovered insecure data storage in SharedPreferences, insufficient SSL pinning implementation, exported Android components without permissions, and hardcoded API keys embedded in production APK.',
      recommendations: 'Implement certificate pinning using OkHttp CertificatePinner, encrypt sensitive data at rest using Android Keystore, restrict exported components with proper permissions, and remove all hardcoded secrets.',
      remediation: 'Provided detailed remediation guidance with code samples for each vulnerability. Verified fixes via retest after developer remediation.',
    },
  },
  {
    id: 'ws-003',
    title: 'Penetration Testing Assessment',
    category: 'Web Security',
    skills: ['Vulnerability Assessment', 'Exploitation', 'Privilege Escalation', 'Post-Exploitation', 'Professional Reporting'],
    description: 'Full-scope penetration testing engagement covering reconnaissance, scanning, exploitation, post-exploitation, and professional deliverable reporting following industry-standard PTES methodology.',
    technologies: ['Metasploit', 'Nmap', 'Burp Suite', 'Kali Linux', 'Hydra', 'SQLMap', 'John the Ripper'],
    date: 'Mar 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Followed PTES (Penetration Testing Execution Standard) across all phases: pre-engagement, intelligence gathering, threat modeling, vulnerability analysis, exploitation, post-exploitation, and professional reporting.',
      findings: 'Successfully identified and exploited multiple vulnerabilities including unpatched services (CVEs), weak credentials via brute-force, misconfigured access controls, and privilege escalation paths.',
      recommendations: 'Establish a patch management program, enforce strong password policies and MFA, implement network segmentation, apply principle of least privilege across all systems.',
      remediation: 'Comprehensive penetration test report with risk ratings (Critical/High/Medium/Low), proof-of-concept evidence, exploitation steps, and actionable remediation guidance with timelines.',
    },
  },
  {
    id: 'ws-004',
    title: 'OSINT & Reconnaissance Assessment',
    category: 'Web Security',
    skills: ['OSINT', 'Google Dorking', 'DNS Enumeration', 'Passive Reconnaissance', 'Attack Surface Mapping'],
    description: 'Systematic open-source intelligence gathering and reconnaissance exercise using advanced OSINT tools and techniques to map organizational attack surface and identify publicly exposed assets without direct target interaction.',
    technologies: ['Maltego', 'Shodan', 'theHarvester', 'Recon-ng', 'WHOIS', 'DNSdumpster', 'SpiderFoot'],
    date: 'Jan 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Passive and active reconnaissance using the OSINT Framework, advanced Google Dorking operators, and specialized reconnaissance tools to enumerate targets without triggering IDS alerts or leaving log traces.',
      findings: 'Discovered exposed subdomains and shadow IT assets, leaked credentials in public GitHub repositories, misconfigured cloud storage buckets with public read access, and identifiable organizational personnel via LinkedIn.',
      recommendations: 'Implement data loss prevention (DLP) policies, monitor public repositories for credential leaks via GitGuardian, configure proper DNS security (no zone transfers), and audit internet-facing asset inventory regularly.',
      remediation: 'Attack surface reduction roadmap with prioritized steps to minimize exposed organizational footprint.',
    },
  },
  {
    id: 'cs-001',
    title: 'AWS Cloud Security Assessment',
    category: 'Cloud Security',
    skills: ['AWS Security', 'IAM Policy Review', 'S3 Bucket Security', 'CloudTrail Analysis', 'CIS Benchmarks'],
    description: 'Comprehensive AWS cloud security assessment covering IAM configuration review, S3 bucket policies, security group analysis, CloudTrail logging gaps, and compliance evaluation against CIS AWS Foundations Benchmark v2.0.',
    technologies: ['AWS', 'CloudTrail', 'GuardDuty', 'Security Hub', 'IAM Access Analyzer', 'Prowler', 'ScoutSuite'],
    date: 'Apr 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Applied CIS AWS Foundations Benchmark v2.0 as the primary assessment framework. Systematically evaluated IAM configurations, S3 policies, network security controls, encryption settings, and monitoring coverage.',
      findings: 'Identified overly permissive wildcard IAM policies, publicly accessible S3 buckets, root account usage without MFA, disabled CloudTrail in multiple regions, and unrestricted security group rules (0.0.0.0/0).',
      recommendations: 'Enforce MFA on all privileged accounts, implement least-privilege IAM policies via Permission Boundaries, enable GuardDuty and Security Hub in all regions, block all S3 public access at account level, and configure AWS Config Rules for continuous compliance.',
      remediation: 'Cloud security hardening plan with Terraform templates for automated remediation and AWS Config Rules for drift detection.',
    },
  },
  {
    id: 'bt-001',
    title: 'Incident Response Investigation',
    category: 'Blue Team Operations',
    skills: ['Incident Response', 'Threat Hunting', 'Log Analysis', 'Memory Forensics', 'Attack Chain Reconstruction'],
    description: 'Hands-on incident response and threat hunting simulation covering a real-world breach scenario from initial detection through full containment, eradication, and recovery following the NIST IR lifecycle.',
    technologies: ['Splunk', 'Wireshark', 'Volatility', 'Autopsy', 'Elastic SIEM', 'Velociraptor'],
    date: 'May 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Applied NIST SP 800-61r2 Incident Response lifecycle (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned). Conducted memory forensics, log correlation, and network traffic analysis to reconstruct the full attack chain.',
      findings: 'Identified attacker persistence via registry run key modification, lateral movement through pass-the-hash technique, C2 communication over HTTPS to cloud provider, and staged data exfiltration via DNS tunneling.',
      recommendations: 'Deploy EDR solution with behavioral detection, improve SIEM alert tuning to reduce false negatives, implement network segmentation, establish formal IR playbooks per threat category, and enforce credential hygiene policies.',
      remediation: 'Post-incident report with lessons learned, detection engineering improvements (new SIEM correlation rules), and preventive control recommendations.',
    },
  },
  {
    id: 'bt-002',
    title: 'Blue Team Essentials Operations',
    category: 'Blue Team Operations',
    skills: ['Security Monitoring', 'Alert Triage', 'Threat Intelligence', 'MITRE ATT&CK Mapping', 'Detection Engineering'],
    description: 'Practical blue team operations training covering security monitoring, alert triage workflows, threat intelligence integration, and defensive detection techniques mapped to the MITRE ATT&CK framework.',
    technologies: ['Splunk', 'TheHive', 'MISP', 'OpenCTI', 'Suricata', 'Zeek', 'Sigma'],
    date: 'Apr 2025',
    pdfReport: null,
    evidence: {
      methodology: 'SOC simulation using industry-standard detection and response tools. Practiced alert triage workflows, threat intelligence consumption, and detection rule authoring using Sigma and Suricata rule formats.',
      findings: 'Successfully detected and triaged phishing campaigns, credential stuffing attempts, and malware C2 beaconing. Mapped all detected TTPs to corresponding MITRE ATT&CK techniques and sub-techniques.',
      recommendations: 'Integrate threat intelligence feeds (MISP), tune detection rules to reduce alert fatigue, implement structured threat hunting on a weekly cadence, and develop SOC runbooks for common attack patterns.',
      remediation: 'Detection improvement package with new Sigma rules, Suricata signatures, and updated alert triage playbooks.',
    },
  },
  {
    id: 'bt-003',
    title: 'Governance, Risk & Compliance Assessment',
    category: 'Blue Team Operations',
    skills: ['GRC Frameworks', 'Risk Assessment', 'ISO 27001', 'NIST CSF', 'Security Policy Development', 'Compliance Auditing'],
    description: 'Governance, Risk and Compliance framework assessment covering security policy development, risk management methodology, and compliance gap analysis against ISO 27001 and NIST Cybersecurity Framework standards.',
    technologies: ['NIST CSF', 'ISO 27001', 'GDPR Controls', 'Risk Matrices', 'GRC Platforms'],
    date: 'Mar 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Applied NIST Cybersecurity Framework five functions (Identify, Protect, Detect, Respond, Recover) and ISO 27001 control objectives as assessment baselines. Conducted structured gap analysis comparing current security posture against both frameworks.',
      findings: 'Identified gaps in security policy documentation coverage, absence of formal risk register, incomplete access control review processes, no business continuity test records, and insufficient security awareness training program.',
      recommendations: 'Develop an information security policy suite aligned to ISO 27001 Annex A controls, implement a formal risk management program with quarterly reviews, establish a continuous compliance monitoring dashboard.',
      remediation: 'GRC improvement roadmap with 90-day, 180-day, and 12-month milestones and KPIs for tracking compliance maturity progress.',
    },
  },
  {
    id: 'bt-004',
    title: 'Security Report Writing',
    category: 'Blue Team Operations',
    skills: ['Technical Writing', 'CVSS v3.1 Scoring', 'Executive Reporting', 'Vulnerability Documentation', 'Risk Communication'],
    description: 'Professional cybersecurity report writing covering vulnerability documentation standards, CVSS scoring methodology, executive summaries, and clear risk communication to both technical and non-technical stakeholders.',
    technologies: ['CVSS Calculator', 'LaTeX', 'Markdown', 'Professional Templates'],
    date: 'Feb 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Practiced structured penetration test report writing following industry templates from SANS, Offensive Security, and CREST. Applied CVSS v3.1 scoring for consistent vulnerability severity ratings across all findings.',
      findings: 'Produced complete penetration testing reports including an executive summary accessible to non-technical stakeholders, detailed technical findings with proof-of-concept evidence, risk ratings, and step-by-step remediation guidance.',
      recommendations: 'Use standardized CVE identifiers and CVSS scores for all findings, provide working proof-of-concept for each vulnerability, clearly separate executive and technical sections, and include a remediation priority matrix.',
      remediation: 'Deliverable: professionally formatted penetration test report demonstrating clear, actionable communication of security findings to both C-suite and engineering audiences.',
    },
  },
  {
    id: 'bt-005',
    title: 'Windows Security Fundamentals',
    category: 'Blue Team Operations',
    skills: ['Active Directory Security', 'Windows Event Log Analysis', 'Group Policy Hardening', 'PowerShell Security', 'Windows Defender'],
    description: 'Comprehensive Windows security fundamentals covering Active Directory architecture, Group Policy security configuration, Windows event log analysis for threat detection, and system hardening against CIS benchmarks.',
    technologies: ['Active Directory', 'PowerShell', 'Group Policy', 'Windows Event Viewer', 'Sysinternals Suite', 'LAPS'],
    date: 'Jan 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Hands-on Windows environment assessment applying CIS Windows Server Benchmark v2.0 and Microsoft Security Baseline configurations. Evaluated AD trust relationships, privilege assignments, and audit policy coverage.',
      findings: 'Identified excessive domain admin accounts, disabled Windows Defender on domain systems, insufficient Advanced Audit Policy configuration missing key event IDs, weak Group Policy password settings, and SYSVOL permissions allowing enumeration.',
      recommendations: 'Implement LAPS for local admin password management, enable Credential Guard and Windows Defender ATP, apply Microsoft Security Baselines via GPO, configure PowerShell Constrained Language Mode, and enable Protected Users security group for privileged accounts.',
      remediation: 'Windows hardening checklist with PowerShell automation scripts for CIS Benchmark compliance checking and automated baseline enforcement.',
    },
  },
  {
    id: 'ns-001',
    title: 'Network Security & Wireless Assessment',
    category: 'Network Security',
    skills: ['Network Vulnerability Scanning', 'Wireless Protocol Analysis', 'WPA2/WPA3 Security', 'Firewall Rule Review', 'IDS/IPS Analysis'],
    description: 'Comprehensive network security and wireless assessment covering network topology discovery, vulnerability scanning, 802.11 wireless protocol security analysis, encryption evaluation, and security control review.',
    technologies: ['Nmap', 'Wireshark', 'Aircrack-ng', 'Kismet', 'Nessus', 'OpenVAS', 'Hashcat'],
    date: 'Feb 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Systematic network reconnaissance and vulnerability scanning using industry-standard tools. Wireless assessment covered 802.11 protocol security analysis, encryption configuration audit, rogue AP detection, and client isolation verification.',
      findings: 'Discovered exposed management interfaces on internal ports, multiple systems running outdated software with known CVEs, weak WPA2-Personal configurations susceptible to PMKID capture attacks, and flat network topology enabling lateral movement.',
      recommendations: 'Implement network segmentation using VLANs with inter-VLAN firewall rules, upgrade wireless infrastructure to WPA3 or WPA2-Enterprise with 802.1X authentication, disable unnecessary management interfaces, and deploy IDS/IPS with signature updates.',
      remediation: 'Network security hardening guide with configuration templates for Cisco, Fortinet, and pfSense environments covering all identified vulnerabilities.',
    },
  },
  {
    id: 'ns-002',
    title: 'Networking Fundamentals Lab',
    category: 'Network Security',
    skills: ['TCP/IP Protocol Stack', 'Packet Analysis', 'Routing Protocols', 'Switching & VLANs', 'Network Troubleshooting'],
    description: 'Foundational networking lab covering the TCP/IP protocol stack, live packet capture and analysis, routing protocol behavior, switching technologies, and network troubleshooting methodologies essential for cybersecurity operations.',
    technologies: ['Wireshark', 'Cisco Packet Tracer', 'GNS3', 'tcpdump', 'Nmap', 'iproute2'],
    date: 'Nov 2024',
    pdfReport: null,
    evidence: {
      methodology: 'Hands-on lab exercises using network simulation tools (GNS3, Packet Tracer) and live packet captures. Analyzed network traffic patterns, protocol handshakes, and behavioral signatures relevant to security monitoring.',
      findings: 'Demonstrated understanding of TCP three-way handshakes, ARP poisoning indicators, DNS query patterns, ICMP-based reconnaissance signatures, and common network attack traffic patterns visible in packet captures.',
      recommendations: 'Deploy network security monitoring with Zeek/Bro or Suricata for passive detection, implement ARP inspection and DHCP snooping on switches, encrypt all management traffic (SSH over Telnet), and monitor DNS for anomalous query patterns.',
      remediation: 'Network monitoring implementation guide with detection signatures for common Layer 2-4 attacks and baseline traffic profiling methodology.',
    },
  },
  {
    id: 'ns-003',
    title: 'Linux Systems Administration',
    category: 'Network Security',
    skills: ['Linux Administration', 'System Hardening', 'Audit Log Analysis', 'File Permission Management', 'Service Security Configuration'],
    description: 'Comprehensive Linux systems administration covering command-line proficiency, user and group management, system hardening procedures, audit log analysis, and secure service configuration for security operations environments.',
    technologies: ['Linux (Ubuntu/Debian)', 'Bash', 'SSH', 'iptables/nftables', 'Auditd', 'rsyslog', 'fail2ban'],
    date: 'Nov 2024',
    pdfReport: null,
    evidence: {
      methodology: 'Practical Linux administration exercises applying CIS Linux Benchmark Level 1 and Level 2 hardening requirements. Configured secure services, implemented comprehensive audit logging, and reduced the attack surface through service minimization.',
      findings: 'Applied 85% of CIS Benchmark controls including SSH hardening (disabled root login, key-only auth), configured auditd for privilege escalation monitoring, removed unnecessary SUID/SGID binaries, and implemented iptables rules.',
      recommendations: 'Enable automatic security updates, configure fail2ban for SSH brute-force protection, implement PAM password policies, enable SELinux or AppArmor mandatory access controls, and centralize log forwarding to SIEM.',
      remediation: 'Linux hardening Bash script with automated CIS Benchmark compliance checks and a scoring report showing percentage compliance before and after hardening.',
    },
  },
  {
    id: 'ma-001',
    title: 'Malware Analysis Lab',
    category: 'Malware Analysis',
    skills: ['Static Malware Analysis', 'Dynamic Sandbox Analysis', 'Reverse Engineering', 'IOC Extraction', 'YARA Rule Writing'],
    description: 'Comprehensive malware analysis covering both static and dynamic analysis techniques, including PE file analysis, disassembly, behavioral analysis in isolated sandbox environments, and actionable threat intelligence extraction.',
    technologies: ['Ghidra', 'Cuckoo Sandbox', 'IDA Pro Free', 'PEiD', 'PEStudio', 'VirusTotal', 'REMnux', 'FLARE VM'],
    date: 'May 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Two-phase analysis: Phase 1 (Static) used disassemblers and PE analysis tools to examine file structure, strings, imports, and code flow without execution. Phase 2 (Dynamic) executed samples in an isolated Cuckoo Sandbox to capture behavioral indicators.',
      findings: 'Successfully analyzed Ransomware, Remote Access Trojan (RAT), and Trojan downloader samples. Extracted IOCs including C2 server IP/domain addresses, mutex names, registry persistence keys, dropped file hashes, and network communication patterns.',
      recommendations: 'Deploy EDR with behavioral blocking on all endpoints, implement application whitelisting using AppLocker or Carbon Black, block identified IOCs at perimeter firewall and DNS sinkholes, and enhance email gateway with sandbox detonation.',
      remediation: 'Threat intelligence report with extracted IOCs in STIX/TAXII format, custom YARA detection rules for identified malware families, and endpoint hardening recommendations.',
    },
  },
  {
    id: 'bt-006',
    title: 'Security Scripting & Automation',
    category: 'Blue Team Operations',
    skills: ['Python Security Scripting', 'Bash Automation', 'Security Tool Development', 'Log Parsing', 'REST API Integration'],
    description: 'Development of security automation tools and scripts using Python and Bash for vulnerability scanning workflows, log parsing pipelines, threat detection automation, and security operations integration.',
    technologies: ['Python 3', 'Bash', 'Git', 'REST APIs', 'JSON/YAML', 'Requests', 'Scapy'],
    date: 'Jan 2025',
    pdfReport: null,
    evidence: {
      methodology: 'Developed security automation tools following secure coding practices (OWASP Secure Coding Guidelines). Built tools covering log analysis automation, port scanning utilities, IOC lookup integrations, and automated report generation.',
      findings: 'Created functional security tools including: automated log analyzer detecting common attack patterns, port scanner with service fingerprinting, VirusTotal API integration for hash reputation lookups, and a templated penetration test report generator.',
      recommendations: 'Apply secure coding principles (input validation, error handling, no hardcoded secrets), implement automated code scanning (Bandit for Python), use dependency vulnerability scanning (Safety), and document all tool capabilities and limitations.',
      remediation: 'Code security review report with remediation applied. Final tools published to private Git repository with README documentation and usage examples.',
    },
  },
];

// ===================================
// CERTIFICATE DATA (static fallback)
// ===================================
const userCertificates = [
  {
    title: "AI Certificate",
    issuer: "Your Institution",
    date: "Dec 2024",
    link: "/certificates/Elvis-mbugua_certificate_AI.pdf",
    image: "/certificate-images/Elvis_Mbugua_AI.jpeg",
  },
  {
    title: "Software Development Certificate",
    issuer: "Your Institution",
    date: "Nov 2024",
    link: "/certificates/Elvis _Software_Dev.jpeg",
    image: "/certificate-images/Elvis _Software_Dev.jpeg",
  },
];

// ===================================
// TECH STACK DATA
// ===================================
const techStack = {
  frontend: [
    { name: "React", icon: <FaReact className="text-[#61DAFB]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="dark:text-white text-slate-900" /> },
    { name: "JavaScript", icon: <FaJsSquare className="text-[#F7DF1E]" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#38B2AC]" /> },
    { name: "HTML5", icon: <FaHtml5 className="text-[#E34F26]" /> },
    { name: "CSS3", icon: <FaCss3Alt className="text-[#1572B6]" /> },
  ],
  backend: [
    { name: "Python", icon: <SiPython className="text-[#3776ab]" /> },
    { name: "Flask", icon: <SiFlask className="dark:text-white text-slate-900" /> },
  ],
  database: [
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
  ],
  tools: [
    { name: "Git & GitHub", icon: <FaGithub className="dark:text-white text-slate-900" /> },
    { name: "AWS", icon: <FaServer className="text-[#FF9900]" /> },
    { name: "Digital Ocean", icon: <FaCloud className="text-[#0080FF]" /> },
    { name: "Linux", icon: <FaTools className="text-[#FCC624]" /> },
    { name: "Figma", icon: <FaFigma className="text-[#F24E1E]" /> },
    { name: "Vercel", icon: <SiVercel className="dark:text-white text-slate-900" /> },
  ],
};

// ===================================
// HELPER
// ===================================
const LineShadowText = ({ children, className, shadowColor = "#4079ff", ...props }) => {
  return (
    <motion.span
      style={{ "--shadow-color": shadowColor }}
      className={`relative z-0 line-shadow-effect ${className}`}
      data-text={children}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// ===================================
// CYBER PROJECT CARD
// ===================================
const CyberProjectCard = ({ project, onClick }) => {
  const config = categoryConfig[project.category] || categoryConfig['Web Security'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group cursor-pointer h-full"
      whileHover={{ y: -6 }}
      onClick={() => onClick(project)}
    >
      <div className="h-full flex flex-col rounded-2xl dark:bg-slate-900/90 bg-white border dark:border-slate-700/50 border-slate-200 hover:border-cyan-400/50 transition-all duration-500 dark:shadow-none shadow-lg hover:shadow-xl dark:hover:shadow-cyan-500/20 overflow-hidden">
        {/* Category color bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${config.barClass}`} />

        <div className="p-5 flex flex-col flex-1">
          {/* Category badge + date */}
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${config.badgeClass}`}>
              {config.icon}
              {project.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500 font-medium">
              <FaCalendarAlt className="text-xs" />
              {project.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2 group-hover:text-cyan-400 dark:group-hover:text-cyan-300 transition-colors leading-snug">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed mb-4 line-clamp-2 flex-1">
            {project.description}
          </p>

          {/* Skills Demonstrated */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-xs dark:text-slate-500 text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
              <FaLock className="text-xs" />
              Skills Demonstrated
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600 border dark:border-slate-700 border-slate-200">
                  {skill}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500 border dark:border-slate-700 border-slate-200">
                  +{project.skills.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 dark:text-cyan-300 text-cyan-700 border border-cyan-500/20">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 dark:text-cyan-300 text-cyan-700 border border-cyan-500/20">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Footer action */}
          <div className="flex items-center justify-between pt-3 border-t dark:border-slate-800 border-slate-100">
            <span className="flex items-center gap-2 text-sm font-semibold text-cyan-500 dark:text-cyan-400 group-hover:gap-3 transition-all duration-300">
              <FaEye />
              View Evidence
            </span>
            {project.pdfReport ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <FaCheck />
                PDF Available
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs dark:text-slate-500 text-slate-400">
                <FaFileAlt />
                Report Pending
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ===================================
// EVIDENCE MODAL
// ===================================
const EvidenceModal = ({ project, onClose }) => {
  if (!project) return null;
  const config = categoryConfig[project.category] || categoryConfig['Web Security'];

  const evidenceSections = [
    { key: 'methodology', label: 'Methodology', icon: <FaSearch className="text-blue-400" /> },
    { key: 'findings', label: 'Findings', icon: <FaClipboardList className="text-red-400" /> },
    { key: 'recommendations', label: 'Recommendations', icon: <FaLightbulb className="text-yellow-400" /> },
    { key: 'remediation', label: 'Remediation', icon: <FaWrench className="text-emerald-400" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-3xl w-full dark:bg-slate-900/95 bg-white backdrop-blur-xl rounded-3xl border dark:border-white/10 border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 dark:bg-slate-900/98 bg-white border-b dark:border-slate-800 border-slate-100 p-6 flex items-start justify-between z-10 flex-shrink-0">
          <div className="flex-1 pr-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border mb-3 ${config.badgeClass}`}>
              {config.icon}
              {project.category}
            </span>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 leading-tight">{project.title}</h2>
            <div className="flex items-center gap-2 mt-2 text-sm dark:text-slate-400 text-slate-500">
              <FaCalendarAlt className="text-xs" />
              {project.date}
            </div>
          </div>
          <button
            onClick={onClose}
            className="dark:bg-black/40 bg-slate-100 hover:bg-red-500/20 backdrop-blur-md p-3 rounded-full border dark:border-white/10 border-slate-200 hover:border-red-500/30 transition-all duration-300 group flex-shrink-0"
          >
            <FaTimes className="dark:text-white/70 text-slate-600 group-hover:text-red-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Description */}
          <p className="dark:text-slate-300 text-slate-600 leading-relaxed">{project.description}</p>

          {/* Skills */}
          <div className="dark:bg-slate-800/50 bg-slate-50 rounded-2xl p-5 border dark:border-slate-700/50 border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <FaLock className="text-cyan-400" />
              <h3 className="font-bold dark:text-white text-slate-800">Skills Demonstrated</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, i) => (
                <span key={i} className="text-sm px-3 py-1.5 rounded-full dark:bg-slate-700 bg-white dark:text-slate-200 text-slate-700 border dark:border-slate-600 border-slate-200 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="dark:bg-slate-800/50 bg-slate-50 rounded-2xl p-5 border dark:border-slate-700/50 border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <FaCode className="text-cyan-400" />
              <h3 className="font-bold dark:text-white text-slate-800">Technologies Used</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-cyan-500/10 dark:text-cyan-300 text-cyan-700 border border-cyan-500/20 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Evidence sections */}
          {evidenceSections.map(({ key, label, icon }) => (
            <div key={key} className="dark:bg-slate-800/50 bg-slate-50 rounded-2xl p-5 border dark:border-slate-700/50 border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="font-bold dark:text-white text-slate-800">{label}</h3>
              </div>
              <p className="dark:text-slate-300 text-slate-600 leading-relaxed text-sm">{project.evidence[key]}</p>
            </div>
          ))}

          {/* PDF Evidence Report */}
          <div className="dark:bg-slate-800/50 bg-slate-50 rounded-2xl p-5 border dark:border-slate-700/50 border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <FaFileAlt className="text-cyan-400" />
              <h3 className="font-bold dark:text-white text-slate-800">PDF Evidence Report</h3>
            </div>
            {project.pdfReport ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={project.pdfReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5"
                >
                  <FaEye />
                  View Evidence
                </a>
                <a
                  href={project.pdfReport}
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 dark:bg-slate-700 bg-slate-200 dark:hover:bg-slate-600 hover:bg-slate-300 dark:text-white text-slate-700 font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <FaDownload />
                  Download PDF
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl dark:bg-slate-700/50 bg-slate-100 border dark:border-slate-600 border-slate-200 border-dashed">
                <FaFileAlt className="text-3xl dark:text-slate-500 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold dark:text-slate-300 text-slate-600">Evidence Report Pending</p>
                  <p className="text-sm dark:text-slate-500 text-slate-400 mt-0.5">PDF report will be attached upon project completion and review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===================================
// CERTIFICATE CARD
// ===================================
const CertificateCard = ({ cert, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative cursor-pointer"
      whileHover={{ y: -8 }}
      onClick={() => onClick(cert)}
    >
      <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden dark:shadow-lg shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-500">
        <div className="absolute inset-0">
          <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30 group-hover:from-slate-900/95 transition-all duration-500"></div>
        </div>
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex-1 flex items-start justify-between">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">{cert.issuer}</span>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-400/30">
              <span className="text-xs font-bold text-emerald-300">{cert.date}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-tight">{cert.title}</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <FaDownload className="text-sm" />
                <span className="text-sm font-medium">View Certificate</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-cyan-500/20 backdrop-blur-md p-2 rounded-full border border-cyan-400/30">
                  <FaEye className="text-cyan-300 text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-transparent to-emerald-500/0 group-hover:from-cyan-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
      </div>
    </motion.div>
  );
};

// ===================================
// CERTIFICATE PREVIEW MODAL
// ===================================
const CertificatePreviewModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-4xl w-full dark:bg-slate-900/90 bg-white/95 backdrop-blur-xl rounded-3xl border dark:border-white/10 border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-20">
          <button onClick={onClose} className="dark:bg-black/40 bg-slate-200/80 hover:bg-red-500/20 backdrop-blur-md p-2 rounded-full dark:border-white/10 border-slate-300 hover:border-red-500/30 transition-all duration-300 group">
            <FaTimes className="dark:text-white/70 text-slate-600 group-hover:text-red-500" />
          </button>
        </div>

        <div className="w-full md:w-3/5 relative min-h-[300px] md:min-h-[500px] bg-slate-900">
          <img src={certificate.image} alt={certificate.title} className="absolute inset-0 w-full h-full object-contain p-4 bg-slate-950/50" />
        </div>

        <div className="w-full md:w-2/5 p-8 flex flex-col justify-center dark:bg-slate-900/50 bg-white">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider mb-4">
              {certificate.issuer}
            </div>
            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-2 leading-tight">{certificate.title}</h2>
            <p className="text-slate-400 font-mono text-sm">{certificate.date}</p>
          </div>

          <div className="space-y-4 mt-auto">
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group"
            >
              <FaDownload className="group-hover:animate-bounce" />
              <span>Download / View PDF</span>
            </a>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-slate-300 text-slate-700 font-semibold rounded-xl transition-all duration-300"
            >
              Close Preview
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===================================
// MAIN SECTION
// ===================================
function ProjectSection() {
  const [activeTab, setActiveTab] = useState('Projects');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);
  const { hideNavbar, showNavbar } = useNavbar();

  // Certificate DB states
  const [certificatesFromDB, setCertificatesFromDB] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);

  const INITIAL_CERTIFICATES_TO_SHOW = 6;
  const [visibleCertificatesCount, setVisibleCertificatesCount] = useState(INITIAL_CERTIFICATES_TO_SHOW);

  // Fetch certificates from database
  useEffect(() => {
    async function fetchCertificates() {
      if (!supabase) {
        setLoadingCerts(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('issue_date', { ascending: false });

        if (!error && data && data.length > 0) {
          setCertificatesFromDB(data);
        }
      } catch (err) {
        // silently fall back to static data
      } finally {
        setLoadingCerts(false);
      }
    }
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (previewCertificate || previewProject) {
      hideNavbar();
    } else {
      showNavbar();
    }
  }, [previewCertificate, previewProject, hideNavbar, showNavbar]);

  useEffect(() => {
    return () => { showNavbar(); };
  }, [showNavbar]);

  const tabs = [
    { id: 'Projects', label: 'Projects', icon: <PiCodeBold className="text-[1.7em] mb-1" /> },
    { id: 'Certificate', label: 'Certificates', icon: <LuBadge className="text-[1.5em] mb-1" /> },
    { id: 'Tech Stack', label: 'Tech Stack', icon: <LiaLayerGroupSolid className="text-[1.5em] mb-1" /> },
  ];

  const activeCertificates = certificatesFromDB.length > 0 ? certificatesFromDB : userCertificates;

  const filteredProjects = categoryFilter === 'All'
    ? cyberProjects
    : cyberProjects.filter((p) => p.category === categoryFilter);

  const handleShowMore = () => setVisibleCertificatesCount(activeCertificates.length);
  const handleShowLess = () => setVisibleCertificatesCount(INITIAL_CERTIFICATES_TO_SHOW);

  return (
    <section id="project" className="py-20">
      <style>{`
        @keyframes line-shadow-anim { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        .line-shadow-effect::after { content: attr(data-text); position: absolute; z-index: -1; left: 0.04em; top: 0.04em; background-image: linear-gradient(45deg, transparent 45%, var(--shadow-color) 45%, var(--shadow-color) 55%, transparent 0); background-size: 0.06em 0.06em; -webkit-background-clip: text; background-clip: text; color: transparent; animation: line-shadow-anim 30s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl font-bold font-moderniz leading-tight">
          <span className="dark:text-[#00ffdc] text-cyan-600">
            <LineShadowText shadowColor="#00b3a4">CYBERSECURITY</LineShadowText>
          </span>
          <br />
          <span className="dark:text-white text-slate-800 text-2xl sm:text-3xl">
            <LineShadowText shadowColor="#bbbbbb">PROJECTS &amp; EVIDENCE REPOSITORY</LineShadowText>
          </span>
        </h2>
        <p className="mt-4 text-sm dark:text-cyan-200/60 text-slate-500 font-cascadia max-w-xl mx-auto">
          Documented assessments, investigations, and practical security work — built for recruiters who want evidence, not blog posts.
        </p>
      </motion.div>

      <div className="w-full">
        {/* Main Tabs */}
        <div className="flex justify-center mb-12">
          <motion.div
            layout
            className="inline-flex w-full max-w-4xl rounded-3xl p-2 shadow-lg border dark:border-slate-800 border-slate-200 dark:bg-gradient-to-r dark:from-[#101624] dark:via-[#0a1627] dark:to-[#0a223a] bg-white backdrop-blur-md"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 flex-col items-center justify-center px-2 py-7 rounded-2xl font-semibold text-base transition-colors duration-300 outline-none ${activeTab === tab.id ? "dark:text-white text-slate-900" : "text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300"}`}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ zIndex: 1, minWidth: 0 }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-0 dark:bg-gradient-to-br dark:from-[#0a223a] dark:to-[#101624] bg-slate-100 rounded-2xl border dark:border-transparent border-slate-200"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    style={{ zIndex: -1, opacity: 0.96 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2">
                  {tab.icon}
                  <span className="font-bold">{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div
          className="rounded-3xl p-0 md:p-6 shadow-xl border dark:border-slate-800/60 border-slate-100 mx-auto max-w-7xl bg-clip-padding dark:bg-slate-900/50 bg-white"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              {/* ── PROJECTS TAB ── */}
              {activeTab === 'Projects' && (
                <>
                  {/* Category filters */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {PROJECT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                          categoryFilter === cat
                            ? 'dark:bg-cyan-700/80 bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                            : 'dark:bg-slate-900/60 bg-slate-100 dark:text-cyan-200 text-slate-600 dark:border-slate-700 border-slate-200 hover:border-cyan-400/50 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Project count */}
                  <div className="text-center mb-6">
                    <span className="text-sm dark:text-slate-500 text-slate-400">
                      Showing <span className="dark:text-cyan-300 text-cyan-600 font-semibold">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
                      {categoryFilter !== 'All' && <span> in <span className="dark:text-white text-slate-700 font-semibold">{categoryFilter}</span></span>}
                    </span>
                  </div>

                  <AnimatePresence>
                    <motion.div
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredProjects.map((project, i) => (
                        <CyberProjectCard
                          key={project.id}
                          project={project}
                          onClick={setPreviewProject}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {filteredProjects.length === 0 && (
                    <div className="text-center text-slate-400 py-12">
                      No projects found for this category.
                    </div>
                  )}
                </>
              )}

              {/* ── CERTIFICATES TAB ── */}
              {activeTab === 'Certificate' && (
                <div className="space-y-8">
                  {loadingCerts ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <AnimatePresence>
                          {activeCertificates.slice(0, visibleCertificatesCount).map((cert, i) => {
                            const certData = cert.id ? {
                              title: cert.title,
                              issuer: cert.issuer,
                              date: cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
                              link: cert.credential_url || '#',
                              image: cert.image_url || '',
                            } : cert;
                            return <CertificateCard key={cert.id || i} cert={certData} onClick={setPreviewCertificate} />;
                          })}
                        </AnimatePresence>
                      </div>
                      {activeCertificates.length > INITIAL_CERTIFICATES_TO_SHOW && (
                        <div className="flex justify-center mt-12">
                          {visibleCertificatesCount < activeCertificates.length ? (
                            <motion.button
                              onClick={handleShowMore}
                              className="dark:bg-gradient-to-r dark:from-cyan-600 dark:to-emerald-600 dark:hover:from-cyan-500 dark:hover:to-emerald-500 bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Show More ({activeCertificates.length - visibleCertificatesCount} more)
                            </motion.button>
                          ) : (
                            <motion.button
                              onClick={handleShowLess}
                              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Show Less
                            </motion.button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── TECH STACK TAB ── */}
              {activeTab === 'Tech Stack' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  {Object.entries(techStack).map(([category, techs]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold dark:text-cyan-300 text-cyan-600 capitalize mb-4 border-b-2 dark:border-slate-800 border-slate-200 pb-2">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {techs.map((tech, i) => (
                          <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl dark:bg-slate-900/70 bg-white border dark:border-slate-800 border-slate-100 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-cyan-500/30 dark:shadow-none shadow-md hover:shadow-lg dark:hover:shadow-none">
                            <div className="text-4xl">{tech.icon}</div>
                            <p className="text-sm dark:text-slate-300 text-slate-600">{tech.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {previewCertificate && (
          <CertificatePreviewModal
            certificate={previewCertificate}
            onClose={() => setPreviewCertificate(null)}
          />
        )}
        {previewProject && (
          <EvidenceModal
            project={previewProject}
            onClose={() => setPreviewProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProjectSection;
