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
    title: 'HackerSavanna Web Application Security Assessment',
    category: 'Web Security',
    skills: ['OWASP Top 10', 'Firebase Security', 'SQL Injection', 'SSRF', 'Authentication Testing', 'API Security'],
    description: 'Comprehensive web application security assessment of HackerSavanna platform identifying critical vulnerabilities including Firebase API exposure, unrestricted user registration, password reset flaws, SQL injection, and email security misconfigurations.',
    technologies: ['Burp Suite', 'Postman', 'SQLMap', 'Python', 'Firebase Analysis Tools'],
    date: 'Jun 2026',
    pdfReport: '/CY-projects/HackerSavannaSecurityAssessment_Report.pdf',
    evidence: {
      methodology: 'Applied OWASP Testing Guide v4.2 methodology with focus on authentication, authorization, and API security testing. Conducted both automated scanning and manual verification of security controls.',
      findings: 'Identified 6 critical findings: (1) Firebase API key exposure allowing unauthorized database access, (2) Unrestricted user registration enabling account enumeration, (3) Password reset bypass vulnerability, (4) SQL injection in search parameters, (5) Sensitive API endpoint disclosure, (6) Missing DMARC/SPF email authentication records.',
      recommendations: 'Implement Firebase Security Rules with strict authentication requirements, add rate limiting and CAPTCHA to registration endpoints, enforce secure password reset tokens with expiration, use parameterized queries for all database operations, implement API authentication with OAuth 2.0, and configure DMARC policy for email domain.',
      remediation: 'All findings documented with CVSS v3.1 scores, proof-of-concept evidence, exploitation steps, and prioritized remediation roadmap. Complete professional security assessment report delivered to stakeholders.',
    },
  },
  {
    id: 'ws-002',
    title: 'Beetlebug Mobile Application Security CTF',
    category: 'Web Security',
    skills: ['Android Security', 'APK Static Analysis', 'Frida Instrumentation', 'Binary Patching', 'SQLite Forensics', 'WebView Security'],
    description: 'Comprehensive mobile security assessment demonstrating advanced Android penetration testing skills through Beetlebug CTF challenges covering hardcoded secrets, insecure data storage, WebView vulnerabilities, database security, and binary exploitation.',
    technologies: ['JADX', 'ADB', 'Frida', 'APKTool', 'SQLite Browser', 'Burp Suite', 'MobSF'],
    date: 'Feb 2026',
    pdfReport: '/CY-projects/Squad1_MOBILE_SECURITY.pdf',
    evidence: {
      methodology: 'Applied OWASP Mobile Security Testing Guide (MSTG) methodology. Conducted static APK decompilation using JADX, dynamic runtime analysis with Frida, database forensics, WebView security testing, and binary patching for protection bypass.',
      findings: 'Successfully exploited 6 mobile security challenges: (1) Extracted hardcoded API keys from decompiled APK source code, (2) Recovered sensitive data from insecure SharedPreferences storage, (3) Exploited WebView JavaScript interface vulnerabilities, (4) Performed SQLite database forensics to extract hidden flags, (5) Bypassed binary protections through reverse engineering, (6) Identified insecure data transmission over cleartext channels.',
      recommendations: 'Never hardcode secrets in APK - use Android Keystore, implement certificate pinning for network security, enable WebView security flags (setAllowFileAccess(false), setJavaScriptEnabled carefully), encrypt SQLite databases using SQLCipher, implement root detection and binary integrity checks, and enforce TLS 1.3 for all network communications.',
      remediation: 'Complete mobile security assessment report with code-level recommendations, secure coding examples for Android developers, and OWASP Mobile Top 10 compliance checklist.',
    },
  },
  {
    id: 'cs-001',
    title: 'flaws.cloud AWS Security CTF Walkthrough',
    category: 'Cloud Security',
    skills: ['AWS Security', 'S3 Misconfiguration', 'IAM Enumeration', 'EC2 Metadata SSRF', 'EBS Snapshot Forensics', 'Git Secrets'],
    description: 'Practical AWS cloud security assessment covering S3 bucket enumeration, EBS snapshot analysis, Git repository credential extraction, EC2 instance metadata SSRF exploitation, IAM policy enumeration, and AWS security best practices.',
    technologies: ['AWS CLI', 'S3 Browser', 'Git', 'AWS IAM', 'EC2 Metadata API', 'AWS Security Tools'],
    date: 'Apr 2026',
    pdfReport: '/CY-projects/flaws_cloud_Lab.pdf',
    evidence: {
      methodology: 'Completed flaws.cloud security challenges demonstrating cloud security assessment skills. Systematically identified and exploited common AWS misconfigurations across S3, EC2, IAM, and storage services following AWS security best practices framework.',
      findings: 'Successfully exploited 6 AWS security misconfigurations: (1) Level 1: Discovered publicly accessible S3 bucket through DNS enumeration, (2) Level 2: Analyzed public EBS snapshots to extract sensitive data, (3) Level 3: Found AWS credentials in exposed Git repository history, (4) Level 4: Exploited SSRF to access EC2 instance metadata and steal IAM credentials, (5) Level 5: Performed IAM policy enumeration to identify privilege escalation paths, (6) Level 6: Leveraged security group misconfigurations for unauthorized access.',
      recommendations: 'Enable S3 Block Public Access at account level, encrypt EBS volumes and restrict snapshot sharing, implement Git-secrets pre-commit hooks to prevent credential leaks, disable IMDSv1 and enforce IMDSv2 with hop limit, apply least-privilege IAM policies using Permission Boundaries, and implement AWS GuardDuty for continuous threat detection.',
      remediation: 'AWS security hardening guide with Terraform/CloudFormation templates for automated remediation, CIS AWS Foundations Benchmark compliance checklist, and continuous monitoring strategy using AWS Security Hub.',
    },
  },
  {
    id: 'ws-003',
    title: 'Completely Ridiculous API (crAPI) Security Assessment',
    category: 'Web Security',
    skills: ['API Security', 'OWASP API Top 10', 'IDOR', 'Mass Assignment', 'JWT Analysis', 'Rate Limiting Bypass'],
    description: 'In-depth API security testing of OWASP crAPI vulnerable application demonstrating exploitation of common API vulnerabilities including broken authentication, excessive data exposure, lack of resource limiting, and business logic flaws.',
    technologies: ['Burp Suite', 'Postman', 'JWT.io', 'Python', 'cURL', 'OWASP ZAP'],
    date: 'Feb 2026',
    pdfReport: '/CY-projects/Squad 1 Completely Ridiculous API.pdf',
    evidence: {
      methodology: 'Applied OWASP API Security Top 10 testing methodology covering broken object level authorization, broken authentication, excessive data exposure, lack of resources and rate limiting, broken function level authorization, mass assignment, security misconfiguration, injection, improper assets management, and insufficient logging.',
      findings: 'Successfully identified and exploited multiple API security vulnerabilities including IDOR allowing unauthorized access to user data, JWT manipulation for privilege escalation, mass assignment enabling unauthorized field updates, lack of rate limiting on sensitive endpoints, excessive data exposure in API responses, and broken authentication mechanisms.',
      recommendations: 'Implement object-level authorization checks on all API endpoints, use strong JWT signing algorithms (RS256) with proper validation, whitelist allowed fields for mass assignment protection, enforce rate limiting on all endpoints especially authentication, minimize data exposure in API responses, and implement comprehensive API activity logging with SIEM integration.',
      remediation: 'Complete API security assessment report with prioritized findings, proof-of-concept evidence for each vulnerability, remediation guidance aligned with OWASP API Security Top 10, and secure API development checklist.',
    },
  },
  {
    id: 'ws-004',
    title: 'HTB FortySeven1 Machine Walkthrough',
    category: 'Web Security',
    skills: ['Web Application Testing', 'Vulnerability Scanning', 'Exploitation', 'Privilege Escalation', 'Post-Exploitation'],
    description: 'HackTheBox penetration testing walkthrough demonstrating systematic reconnaissance, vulnerability identification, exploitation, and privilege escalation techniques against a Linux target system.',
    technologies: ['Nmap', 'Burp Suite', 'Metasploit', 'Gobuster', 'LinPEAS', 'GTFOBins'],
    date: 'Apr 2026',
    pdfReport: '/CY-projects/HTB-FortySeven1-Walkthrough.pdf',
    evidence: {
      methodology: 'Applied Penetration Testing Execution Standard (PTES) methodology: reconnaissance with Nmap port scanning, vulnerability analysis through manual testing, exploitation of identified vulnerabilities, privilege escalation using misconfigurations, and post-exploitation enumeration.',
      findings: 'Successfully compromised target system through web application vulnerability, established initial foothold, enumerated system for privilege escalation vectors, exploited misconfigured SUID binaries and kernel vulnerabilities to gain root access.',
      recommendations: 'Keep all software patched and updated, implement principle of least privilege for system permissions, remove unnecessary SUID/SGID binaries, harden web applications following OWASP guidelines, implement defense-in-depth with network segmentation and monitoring.',
      remediation: 'Penetration test report documenting complete attack chain from reconnaissance to root access, including technical details of exploited vulnerabilities, proof-of-concept screenshots, and prioritized remediation steps.',
    },
  },
  {
    id: 'ns-001',
    title: 'Wireless Network Auditing & Penetration Testing',
    category: 'Network Security',
    skills: ['Wireless Security', '802.11 Protocol Analysis', 'WPA2/WPA3 Testing', 'Rogue AP Detection', 'Packet Capture Analysis'],
    description: 'Comprehensive wireless network security assessment covering 802.11 protocol analysis, encryption security testing, rogue access point detection, wireless packet capture analysis, and wireless attack vector demonstration.',
    technologies: ['Aircrack-ng', 'Wireshark', 'Kismet', 'Reaver', 'Wifite', 'hcxdumptool'],
    date: 'Jun 2026',
    pdfReport: '/CY-projects/_C2A_ Wireless network auditing and pentesting,.docx.pdf',
    evidence: {
      methodology: 'Conducted wireless security assessment following industry best practices for 802.11 wireless penetration testing. Performed passive reconnaissance, active scanning, encryption analysis, and demonstrated attack techniques against weak wireless configurations.',
      findings: 'Identified wireless security weaknesses including weak WPA2-PSK passphrases susceptible to dictionary attacks, WPS PIN vulnerabilities, insecure wireless configuration allowing client isolation bypass, presence of rogue access points, and cleartext data transmission over wireless networks.',
      recommendations: 'Upgrade to WPA3 encryption or WPA2-Enterprise with 802.1X authentication, disable WPS on all access points, implement strong wireless passphrase policies (minimum 20 characters), enable wireless client isolation, deploy wireless intrusion detection systems (WIDS), and enforce certificate-based authentication for enterprise networks.',
      remediation: 'Wireless security hardening guide with configuration templates for enterprise wireless controllers, wireless security monitoring implementation plan, and ongoing wireless security audit procedures.',
    },
  },
  {
    id: 'ns-002',
    title: 'Network Traffic Analysis - Wireshark & Snort',
    category: 'Network Security',
    skills: ['Packet Analysis', 'Wireshark Proficiency', 'IDS/IPS Configuration', 'Snort Rule Writing', 'Network Forensics'],
    description: 'Hands-on network traffic analysis and intrusion detection covering packet capture techniques, Wireshark analysis methodology, Snort IDS rule development, attack signature identification, and network forensics procedures.',
    technologies: ['Wireshark', 'Snort', 'tcpdump', 'NetworkMiner', 'Zeek'],
    date: 'Jun 2026',
    pdfReport: '/CY-projects/C1A_ Wireshark & Snort.pdf',
    evidence: {
      methodology: 'Practiced network traffic analysis using Wireshark for deep packet inspection and protocol analysis. Configured Snort IDS with custom rule development, analyzed network traffic patterns to identify malicious activity, and performed network forensics investigations.',
      findings: 'Successfully identified various network-based attacks in packet captures including port scanning signatures, SQL injection attempts, credential stuffing traffic patterns, malware C2 beaconing, and data exfiltration attempts. Developed custom Snort rules for attack detection.',
      recommendations: 'Deploy network intrusion detection/prevention systems (IDS/IPS) at network boundaries and critical segments, implement full packet capture for forensic investigations, develop custom detection signatures for organization-specific threats, tune alert thresholds to reduce false positives, and integrate IDS alerts with SIEM platform.',
      remediation: 'Network security monitoring implementation guide with Snort/Suricata deployment architecture, custom detection rule library, packet capture retention policy, and SOC analyst training materials.',
    },
  },
  {
    id: 'ns-003',
    title: 'Linux CLI & File System Navigation',
    category: 'Network Security',
    skills: ['Linux Command Line', 'Bash Scripting', 'File System Analysis', 'System Administration', 'Log Analysis'],
    description: 'Fundamental Linux command-line interface proficiency covering navigation, file manipulation, process management, permissions, shell scripting, and essential administrative tasks critical for security operations.',
    technologies: ['Linux (Ubuntu/Kali)', 'Bash', 'Vim', 'grep/awk/sed', 'find', 'systemctl'],
    date: 'Oct 2025',
    pdfReport: '/CY-projects/C1A_ Linux CLI & File System Navigation .pdf',
    evidence: {
      methodology: 'Completed hands-on Linux CLI exercises covering essential commands for file system navigation, text processing, process management, user administration, and basic security hardening. Developed Bash scripting skills for security automation tasks.',
      findings: 'Demonstrated proficiency in Linux command-line operations including directory traversal, file searching with find/grep, log analysis with awk/sed, permission management, service administration, and bash scripting for security automation.',
      recommendations: 'Maintain strong Linux command-line proficiency as foundational skill for security operations, practice regular log analysis using CLI tools, develop security automation scripts for common tasks, and understand Linux file system structure for incident response and forensics.',
      remediation: 'Linux fundamentals competency achieved. Continued practice recommended with advanced topics including advanced bash scripting, system hardening, and security automation.',
    },
  },
  {
    id: 'ws-005',
    title: 'OSINT & Reconnaissance Operations',
    category: 'Web Security',
    skills: ['OSINT', 'Subdomain Enumeration', 'Google Dorking', 'DNS Reconnaissance', 'Passive Information Gathering'],
    description: 'Open-source intelligence gathering and reconnaissance operations covering passive and active information collection, subdomain enumeration, DNS analysis, metadata extraction, and attack surface mapping.',
    technologies: ['theHarvester', 'Sublist3r', 'Amass', 'Shodan', 'Maltego', 'Google Dorks', 'DNSdumpster'],
    date: 'Jun 2026',
    pdfReport: '/CY-projects/Recon Assignment.pdf',
    evidence: {
      methodology: 'Conducted systematic reconnaissance using OSINT techniques and tools for passive information gathering. Performed subdomain enumeration, DNS zone analysis, Google dorking for sensitive information exposure, metadata analysis, and compiled comprehensive target intelligence profile.',
      findings: 'Successfully identified exposed subdomains and hidden assets, discovered sensitive information through Google dorking including exposed configuration files and credentials, enumerated email addresses and personnel through passive sources, identified technology stack and infrastructure details, and mapped organizational attack surface.',
      recommendations: 'Implement data loss prevention (DLP) policies to prevent sensitive information leakage, monitor public-facing assets for exposed configuration files and credentials, secure DNS configurations against zone transfers, implement proper robots.txt and metadata sanitization, and maintain inventory of internet-facing assets.',
      remediation: 'OSINT findings report with identified information leakage, exposed assets inventory, attack surface map, and recommendations for reducing organizational footprint on public internet.',
    },
  },
  {
    id: 'bt-001',
    title: 'Windows Exploitation & Security Fundamentals',
    category: 'Blue Team Operations',
    skills: ['Windows Security', 'Privilege Escalation', 'Active Directory', 'PowerShell', 'Event Log Analysis'],
    description: 'Windows operating system security fundamentals covering common exploitation techniques, privilege escalation methods, Active Directory security, PowerShell security features, and defensive hardening measures.',
    technologies: ['Windows Server', 'PowerShell', 'Metasploit', 'Mimikatz', 'BloodHound', 'Sysinternals'],
    date: 'Dec 2025',
    pdfReport: '/CY-projects/Windows Exploitation Assignments & Resources.pdf',
    evidence: {
      methodology: 'Studied Windows security architecture, common exploitation techniques, privilege escalation paths, Active Directory attack vectors, and defensive security controls. Practiced both offensive and defensive Windows security techniques.',
      findings: 'Demonstrated understanding of Windows privilege escalation techniques including unquoted service paths, weak permissions, registry manipulation, token impersonation, Active Directory attack paths via Kerberoasting and AS-REP roasting, and PowerShell security bypass methods.',
      recommendations: 'Implement Windows hardening following CIS Benchmarks and Microsoft Security Baselines, deploy LAPS for local admin password management, enable PowerShell logging and constrained language mode, configure Advanced Audit Policy for security monitoring, implement tiered administrative model for AD, and deploy EDR with behavioral detection.',
      remediation: 'Windows security fundamentals completed with understanding of both attack and defense perspectives. Recommended next steps include hands-on Active Directory security lab and advanced Windows forensics training.',
    },
  },
  {
    id: 'bt-002',
    title: 'Secure Coding & MySQL Integration',
    category: 'Blue Team Operations',
    skills: ['Secure Coding', 'SQL Injection Prevention', 'Input Validation', 'MySQL Security', 'Parameterized Queries'],
    description: 'Secure coding practices for database integration covering SQL injection prevention, input validation techniques, parameterized queries, MySQL security hardening, and secure application development lifecycle.',
    technologies: ['Python', 'MySQL', 'PHP', 'Prepared Statements', 'Input Validation Libraries'],
    date: 'Jun 2026',
    pdfReport: '/CY-projects/_C1A_ Coding & MySQL Integration.docx.pdf',
    evidence: {
      methodology: 'Studied secure coding practices for database integration with focus on OWASP guidelines for injection prevention. Implemented parameterized queries, input validation, output encoding, and MySQL security configurations.',
      findings: 'Demonstrated secure coding techniques including use of prepared statements for SQL injection prevention, proper input validation and sanitization, implementation of least-privilege database accounts, secure session management, and proper error handling without information disclosure.',
      recommendations: 'Always use parameterized queries/prepared statements for database operations, implement server-side input validation with whitelist approach, apply principle of least privilege for database accounts, enable MySQL query logging for security monitoring, implement web application firewalls (WAF) as defense-in-depth, and conduct regular secure code reviews.',
      remediation: 'Secure coding fundamentals achieved with emphasis on injection prevention. Continued practice recommended with advanced topics including OAuth implementation, cryptographic best practices, and security testing integration in CI/CD.',
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
  {
    title: "Cybersecurity Professional Certificate",
    issuer: "Africa Hackon",
    date: "Jun 2025",
    link: "/certificates/Swara20260617-31-q7ke1m.pdf",
    image: "/certificate-images/africahackon-cyber-security-swara.png",
    credlyUrl: "https://www.credly.com/badges/27f75fc7-a30c-493f-b174-f32d5b26a3ec/public_url",
    description: "Professional Cybersecurity Certification verified by Credly"
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-sm sm:text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5"
                >
                  <FaEye className="text-sm sm:text-base" />
                  <span className="hidden xs:inline">View Evidence</span>
                  <span className="xs:hidden">View</span>
                </a>
                <a
                  href={project.pdfReport}
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 dark:bg-slate-700 bg-slate-200 dark:hover:bg-slate-600 hover:bg-slate-300 dark:text-white text-slate-700 text-sm sm:text-base font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <FaDownload className="text-sm sm:text-base" />
                  <span className="hidden xs:inline">Download PDF</span>
                  <span className="xs:hidden">Download</span>
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

        {/* Certificate Display */}
        <div className="w-full md:w-3/5 relative min-h-[300px] md:min-h-[500px] dark:bg-slate-900 bg-slate-100 flex items-center justify-center">
          <img src={certificate.image} alt={certificate.title} className="absolute inset-0 w-full h-full object-contain p-4 bg-slate-950/50" />
        </div>

        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center dark:bg-slate-900/50 bg-white">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider mb-4">
              {certificate.issuer}
            </div>
            <h2 className="text-xl md:text-2xl font-bold dark:text-white text-slate-900 mb-2 leading-tight">{certificate.title}</h2>
            <p className="dark:text-slate-400 text-slate-600 font-mono text-sm">{certificate.date}</p>
          </div>

          {certificate.description && (
            <p className="text-sm dark:text-slate-400 text-slate-600 mb-6 leading-relaxed">
              {certificate.description}
            </p>
          )}

          <div className="space-y-3 mt-auto">
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 md:px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm md:text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group"
            >
              <FaDownload className="group-hover:scale-110 transition-transform" />
              <span>Download Certificate</span>
            </a>

            {certificate.credlyUrl && (
              <a
                href={certificate.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 md:px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm md:text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 group"
              >
                <FaEye className="group-hover:scale-110 transition-transform" />
                <span>Verify on Credly</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 md:px-6 py-3 dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-slate-300 text-slate-700 text-sm md:text-base font-semibold rounded-xl transition-all duration-300"
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
                              link: cert.credential_url || cert.certificate_url || '#',
                              image: cert.image_url || '',
                              credlyUrl: cert.credly_url || null,
                              description: cert.description || ''
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
