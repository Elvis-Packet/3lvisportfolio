import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaTags, FaArrowRight, FaShieldAlt, FaTimes } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Blogs = () => {
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Full article content
  const fallbackBlogs = [
    {
      id: 1,
      title: "OWASP crAPI Walkthrough: Complete API Penetration Testing Guide",
      excerpt: "Complete guide to exploiting OWASP crAPI - a deliberately vulnerable API for learning real-world security vulnerabilities.",
      category: "Web Penetration Testing",
      date: "March 2024",
      readTime: "45 min read",
      tags: ["API Security", "crAPI", "Penetration Testing"],
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      content: `# OWASP crAPI Walkthrough: Complete API Penetration Testing Guide

crAPI ("completely ridiculous API") is an intentionally vulnerable application that demonstrates real-world API security problems and vulnerabilities found in production systems.

## Challenge 1: BOLA - Access Another User's Vehicle Data

**Vulnerability:** Broken Object-Level Authorization

1. After logging in, navigate to "Add Vehicle" and add a vehicle
2. Click "Refresh Location" and intercept the request in Burp Suite
3. Identify the vehicle ID parameter in the API endpoint
4. Navigate to the Community page to find vehicle IDs of other users through their posts
5. Modify the vehicle_id parameter to access another user's data
6. Gain access to location data (latitude, longitude), email, and full name

**Key Takeaway:** Always validate that users can only access their own data.

---

## Challenge 2: Broken Authentication - Access Mechanic Reports

**Vulnerability:** Insecure Direct Object References (IDOR)

1. Fill out the "Contact Mechanic" form to generate a service request
2. Intercept the response and locate the report_link with report_id parameter
3. Change the report_id value (e.g., from id=11 to id=3)
4. Successfully access another user's mechanic report with sensitive information

**Exploitation:**
\`\`\`
GET /api/mechanic/receive_report?report_id=3
\`\`\`

---

## Challenge 3: Reset Another User's Password

**Vulnerability:** Weak Authentication Flow & OTP Bypass

1. Obtain email addresses from the Community page
2. Initiate password reset for another user's email
3. Access MailHog (localhost:8025) to retrieve the OTP
4. Use the JWT token from the login POST request in GET requests
5. Successfully reset password for an arbitrary user account

---

## Challenge 4: Excessive Data Exposure

**Vulnerability:** Sensitive Information Leakage

1. Navigate to the Shop page and view orders
2. Notice that order_id=9 exposes sensitive user information
3. API returns full personal details unnecessarily
4. Extracting data by incrementing order IDs reveals information for multiple users

---

## Challenge 5: Extract Internal Video Properties

**Vulnerability:** Excessive Data Exposure with Internal Metadata

1. Upload a video to the platform
2. Use "Change Video Name" feature (PUT request)
3. In the response, discover "conversion_params" internal property
4. This reveals backend processing information not intended for users

---

## Challenge 6: Layer 7 DoS Attack

**Vulnerability:** Rate Limiting Bypass & Logic Exploitation

1. Use the "Contact Mechanic" feature and intercept the request
2. Locate "repeat_request_if_failed" and "number_of_repeats" parameters
3. Modify: "repeat_request_if_failed": true, "number_of_repeats": 1000
4. Send the request to overwhelm the API infrastructure
5. Receive: "Service unavailable. Like we made a Layer 7 DoS :)"

---

## Challenge 7: Delete Another User's Video (BFLA)

**Vulnerability:** Broken Function Level Authorization

1. Use "Change Video Name" (PUT request) to explore available methods
2. Send OPTIONS request to discover allowed HTTP methods
3. Discover DELETE method is available
4. Send DELETE request with admin user manipulation
5. Modify the video_id to target another user's video
6. Successfully delete video from different user account

---

## Challenge 8: Get Items for Free

**Vulnerability:** Mass Assignment & Business Logic Flaw

1. Go to Shop page (initial balance: $100)
2. Add item to cart and intercept the POST request
3. Examine the order response for potential manipulation
4. View past orders and intercept order details
5. Modify the "status" field from "pending" to "returned"
6. Successfully refund without actually returning the item

**Payload:**
\`\`\`json
{
  "order_id": 1,
  "status": "returned",
  "quantity": 1
}
\`\`\`

---

## Challenge 9: Massive Refund Exploitation

**Vulnerability:** Insufficient Business Logic Validation

1. Place a new order for a Seat ($10 balance: $90)
2. Intercept the order request
3. Modify: "quantity": 100, "status": "returned"
4. Trigger refund for 100 items ($1000) instead of 1
5. New balance: $1040 (successfully exploited for $1000+ refund)

---

## Challenge 10: Manipulate Internal Video Properties

**Vulnerability:** Insecure Direct Object Properties Modification

1. Upload video and use "Change Video Name" (PUT)
2. Capture the response with "conversion_params"
3. Modify the conversion_params in subsequent requests
4. Example payload: \`"conversion_params": "-v codec h264"\`
5. Successfully modify internal video encoding parameters

---

## Challenge 11: Server-Side Request Forgery (SSRF)

**Vulnerability:** Unsafe URL Handling

1. Intercept the "Contact Mechanic" form request
2. Identify the "mechanic_api" parameter with a backend URL
3. Replace with external URL: https://www.google.com
4. Server makes HTTP request to google.com and returns the response
5. Successfully performs SSRF to external internet resource

---

## Challenge 12: NoSQL Injection - Free Coupons

**Vulnerability:** NoSQL Injection in Coupon Validation

1. Navigate to Shop and attempt coupon validation
2. Intercept the validate-coupon POST request
3. Inject NoSQL payload in coupon_code field
4. Payload: \`{"$ne": null}\` or similar NoSQL injection
5. Bypass coupon code validation and receive free coupons

---

## Challenge 13: SQL Injection - Redeem Claimed Coupons

**Vulnerability:** SQL Injection in Coupon Redemption

1. Intercept coupon redemption request
2. Inject SQL payload: \`0' or '0'='0\`
3. Successfully redeem already-claimed coupons
4. Detect SQL version using: \`0'; select version() -- +\`

---

## Challenge 14: Unauthenticated Access

**Vulnerability:** Missing Authentication Checks

1. Send GET request to order endpoints WITH valid JWT token
2. Receive successful response with user details (200 OK)
3. Send SAME request WITHOUT authentication token
4. Still receive 200 OK with full order details exposed
5. No authentication validation performed

---

## Challenge 15: JWT Token Forgery

**Vulnerability:** Weak JWT Validation & Algorithm Downgrade

1. Login as any user and capture JWT token
2. Decode JWT at jwt.io
3. Change algorithm from "RS256" to "none"
4. Modify email claim to target user email
5. Remove signature section from token
6. Use forged token to access target user's dashboard

---

## Key Learnings

- **BOLA/IDOR:** Always validate user ownership of resources
- **Authentication:** Implement proper token validation and expiration
- **Data Exposure:** Only return necessary information in responses
- **Rate Limiting:** Implement proper rate limits on API endpoints
- **Business Logic:** Validate all state transitions and calculations
- **Injection:** Always sanitize and parameterize queries
- **SSRF:** Whitelist allowed URLs and validate all external requests
- **JWT:** Use strong algorithms and verify signatures properly
`
    },
    {
      id: 2,
      title: "Linux Survival Guide for Beginners: Command Line Masterclass",
      excerpt: "Complete guide to surviving and thriving with Linux. Master essential commands, workflows, and become proficient in the terminal.",
      category: "Linux & Systems",
      date: "March 2024",
      readTime: "40 min read",
      tags: ["Linux", "Terminal", "Commands"],
      image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      content: `# Linux Survival Guide for Beginners: Command Line Masterclass

A comprehensive guide to transitioning to Linux and becoming proficient with the command line.

## Why Learn Linux?

### Linux is Ubiquitous
- Powers most web servers and cloud infrastructure
- Found in Android, Embedded systems, IoT devices, Raspberry Pi
- Understanding Linux is essential for any programmer/sysadmin

### Linux is Versatile
- Both Linux and macOS are built on UNIX
- Commands learned in Linux work on macOS and other *nix systems
- Transferable knowledge across multiple platforms

---

## Getting Started with Linux

### Choose Your Distribution

Start with **Ubuntu** - it's beginner-friendly and widely used.

### Overcoming Two Main Challenges

#### 1. Lack of Familiarity
- Use Linux on your personal and work machines
- Follow Linux experts on social media
- Ask colleagues to show you their command history
- Learn from battle-tested commands, not just theoretical examples

**Useful command to learn from others:**
\`\`\`bash
history | awk '{ $1=""; print $0 }' | sort | uniq -c | sort -nr | head -20
\`\`\`

This shows the 20 most frequently used commands.

#### 2. Fear of Screwing Up
- Create a blacklist of dangerous commands (e.g., \`sudo rm -rf /\`)
- Use safe-deletion tools like \`rip\` on your local machine
- Find Linux mentors and ask questions
- Start with non-critical systems

---

## Essential Linux Commands

### Navigation & File Management

**pwd** - Print Working Directory
\`\`\`bash
pwd  # Shows current directory path
\`\`\`

**ls** - List Directory Contents
\`\`\`bash
ls              # Simple listing
ls -la          # Detailed listing with hidden files
ls -l | grep txt # List only text files
\`\`\`

**cd** - Change Directory
\`\`\`bash
cd /home/user        # Navigate to absolute path
cd ..                # Go to parent directory
cd ~                 # Go to home directory
cd -                 # Go to previous directory
\`\`\`

**mkdir** - Make Directory
\`\`\`bash
mkdir new_folder
mkdir -p path/to/deep/folder  # Create nested directories
\`\`\`

### File Operations

**cp** - Copy Files
\`\`\`bash
cp source.txt destination.txt           # Copy file
cp -r source_dir dest_dir              # Copy directory recursively
\`\`\`

**mv** - Move/Rename Files
\`\`\`bash
mv oldname.txt newname.txt  # Rename file
mv file.txt /path/to/dest   # Move file to destination
\`\`\`

**rm** - Remove Files
\`\`\`bash
rm file.txt
rm -r directory_name        # Remove directory recursively
rm -f file.txt             # Force remove without confirmation
\`\`\`

**scp** - Secure Copy
\`\`\`bash
scp local_file user@remote:/path/to/dest     # Copy to remote
scp user@remote:/path/to/file local_path     # Copy from remote
\`\`\`

**find** - Find Files
\`\`\`bash
find . -name "*.txt"                    # Find all text files
find /home -type f -size +100M          # Find files larger than 100MB
find . -name "*.log" -mtime +7 -delete  # Find and delete logs older than 7 days
\`\`\`

### Text Processing

**grep** - Search Text
\`\`\`bash
grep "pattern" file.txt                 # Search in file
grep -r "pattern" /directory            # Search recursively
grep -i "pattern" file.txt             # Case-insensitive search
grep -v "pattern" file.txt             # Inverse match (exclude pattern)
\`\`\`

**awk** - Text Processing
\`\`\`bash
awk '{ $1=""; print $0 }' file.txt     # Remove first column
awk -F',' '{ print $2 }' data.csv      # Extract second column from CSV
\`\`\`

**sed** - Stream Editor
\`\`\`bash
sed 's/old/new/' file.txt               # Replace first occurrence
sed 's/old/new/g' file.txt             # Replace all occurrences
sed '10d' file.txt                      # Delete line 10
\`\`\`

### System Information

**ssh** - Secure Shell
\`\`\`bash
ssh user@hostname                       # Connect to remote server
ssh -i /path/to/key user@hostname      # Connect with SSH key
ssh user@hostname "command"             # Execute command on remote
\`\`\`

**ps** - Process Status
\`\`\`bash
ps aux                  # List all running processes
ps aux | grep "process_name"  # Find specific process
\`\`\`

**top** - Monitor System Resources
\`\`\`bash
top                     # Real-time system monitoring
top -u username        # Monitor processes for specific user
\`\`\`

---

## The Power of Pipes (|)

The pipe symbol lets you pass output from one command as input to the next.

### Examples

**Find all loaded services:**
\`\`\`bash
systemctl list-units --all | grep service | grep loaded
\`\`\`

**Find loaded services but exclude exited ones:**
\`\`\`bash
systemctl list-units --all | grep service | grep loaded | grep -v exited
\`\`\`

**Count word frequency:**
\`\`\`bash
cat file.txt | tr ' ' '\n' | sort | uniq -c | sort -nr | head -10
\`\`\`

**Extract specific data:**
\`\`\`bash
cat data.log | grep "ERROR" | awk -F'[' '{ print $2 }' | sort | uniq -c
\`\`\`

---

## Bash Configuration & Customization

### Bash Profile vs Bashrc

**~/.bashrc** - Executed for interactive non-login shells
**~/.bash_profile** - Executed for login shells

**Best Practice:** Load .bashrc from .bash_profile
\`\`\`bash
# In ~/.bash_profile
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
\`\`\`

### Create Useful Aliases

Add to ~/.bashrc or ~/.bash_profile:
\`\`\`bash
alias ll='ls -la'
alias gs='git status'
alias gc='git commit'
alias ..='cd ..'
alias ...='cd ../..'
\`\`\`

---

## Command Line Editors

### Choosing an Editor

- **Nano** - Good for beginners, simple and straightforward
- **Vim** - Powerful but steep learning curve
- **Emacs** - Emacs commands work in shell and text editor

### Why Choose Emacs?

Most Emacs commands also work in the Linux shell:
- CTRL+A - Go to beginning of line
- CTRL+E - Go to end of line
- CTRL+K - Kill to end of line
- CTRL+Y - Yank (paste) killed text

---

## Documentation: Man Pages vs TLDR

### The Problem with Man Pages
Man pages are comprehensive but overwhelming for beginners.

### The TLDR Solution

**TLDR** (Too Long; Didn't Read) provides practical examples.

**Install TLDR:**
\`\`\`bash
sudo npm install -g tldr
tldr cp   # Get practical examples of cp command
\`\`\`

---

## Key Principles

1. **Start Simple** - Learn basic commands first
2. **Use Man/TLDR** - Don't memorize, reference documentation
3. **Leverage Pipes** - Chain commands for powerful automation
4. **Practice Often** - Build muscle memory
5. **Learn from Others** - Look at experienced users' command history
6. **Be Safe** - Always double-check destructive commands
7. **Document** - Keep your configs backed up

---

## Quick Reference

**Navigation:** pwd, ls, cd, mkdir
**Files:** cp, mv, rm, find, stat
**Text:** grep, awk, sed, sort, uniq
**Process:** ps, top, kill, systemctl
**Network:** ssh, scp, ping, netstat
**System:** uname, df, du, date

Remember: Everyone started as a beginner. The Linux community is generally welcoming and helpful.
`
    },
    {
      id: 3,
      title: "All About Android Pentesting: A Complete Methodology",
      excerpt: "Comprehensive guide to Android application security testing covering static analysis, dynamic analysis, root detection, SSL pinning, and exploitation techniques.",
      category: "Mobile Security",
      date: "Nov 2025",
      readTime: "30 min read",
      tags: ["Android", "Mobile Pentesting", "Security"],
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      content: `# All About Android Pentesting: A Complete Methodology

Android is everywhere—billions of devices, millions of apps, and a massive attack surface that keeps growing every single day. This comprehensive guide covers a proven Android pentesting methodology that works in real-world engagements.

## Why Android Pentesting Matters

- Billions of Android devices worldwide
- Millions of applications with varying security postures
- Massive attack surface for security researchers
- Critical for organizations protecting user data

## Basic Information Gathering

### Extracting and Analyzing the APK

**Which files are included in the package?**

Extract the APK to examine its structure. You can use apktool or simply rename the APK to ZIP and extract:

\`\`\`bash
apktool d app.apk -o decompiled_app
# OR
mv app.apk app.zip
unzip app.zip
\`\`\`

**Checking for native libraries:**

Examine the \`lib/\` folder for native libraries. Some custom \`.so\` files can provide additional attack surface:

\`\`\`
lib/
├── armeabi-v7a/
│   └── libcustom.so
├── arm64-v8a/
│   └── libcustom.so
└── x86/
    └── libcustom.so
\`\`\`

## Static Analysis vs Dynamic Analysis

Android penetration testing involves two critical approaches:

**Static Analysis:** Examining the app's code without executing it
- Find hardcoded secrets and API keys
- Identify logic flaws and security misconfigurations
- Analyze manifest permissions and exported components

**Dynamic Analysis:** Testing the app's behavior at runtime
- Monitor network traffic and memory
- Test API endpoints and authentication mechanisms
- Bypass security checks through instrumentation

## Static Analysis Deep Dive

### Step 1: Understanding AndroidManifest.xml

Think of AndroidManifest.xml as the blueprint of the entire app. It tells you everything about the app's structure, permissions, components, and security settings—all in one place. This single file can reveal extensive attack surface.

**What to look for:**

1. **App Permissions:**
\`\`\`xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
\`\`\`

Ask yourself: Why does the app need these permissions? Are they all necessary?

2. **Backup Enabled Flag:**
\`\`\`xml
<application android:allowBackup="true">
\`\`\`

If \`android:allowBackup="true"\`, an adversary can use ADB to access app backup data:

\`\`\`bash
adb backup -f backup.ab com.example.app
\`\`\`

**Important:** If the allowBackup attribute is missing, it defaults to \`true\` anyway! Always verify.

3. **Debuggable Flag:**
\`\`\`xml
<application android:debuggable="true">
\`\`\`

If this is enabled in production, attackers can:
- Attach debuggers
- Read process memory
- Modify variables at runtime

Unlike allowBackup, debuggable defaults to \`false\`, but developers sometimes leave it enabled in production builds.

4. **Network Security Configuration:**
\`\`\`xml
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
\`\`\`

If \`cleartextTrafficPermitted="true"\`, the app allows unencrypted HTTP connections—a major vulnerability.

5. **SDK Versions:**
\`\`\`xml
<uses-sdk android:minSdkVersion="16" android:targetSdkVersion="22" />
\`\`\`

Lower SDK versions have weaker security and lack modern security features.

6. **Exported Components:**

Four types of components can be exported:

**Activities** - UI screens (login, home, etc.)
- If exported, other apps can launch them directly
- Attackers might bypass login screens

**Services** - Background processes
- If exported, other apps can start/stop them
- Can trigger actions without user interaction

**Content Providers** - Data sharing between apps
- If exported, other apps can read data
- Common source of data leaks

**Broadcast Receivers** - Listen to system messages
- If exported, malicious apps can trigger them
- Can perform actions without user awareness

---

## Decompiling the Application

Use JADX GUI or apktool for decompilation:

\`\`\`bash
# Using apktool
apktool d app.apk -o decompiled

# Using JADX GUI (easier to read)
# Just open the APK file directly
\`\`\`

JADX GUI is preferred as it provides better readability and Java-like code representation.

---

## Hardcoded Secrets & Interesting Strings

This is where you often find low-hanging fruits:

- Hardcoded passwords and API keys
- Backend URLs and endpoints
- Encryption keys
- Tokens and UUIDs
- Backdoor credentials

**Search for interesting strings:**

\`\`\`bash
apkurlgrep app.apk          # Extract URLs
strings app.apk | grep -i password  # Find passwords
strings app.apk | grep -i api       # Find API endpoints
\`\`\`

In JADX GUI, use regex-enabled search to find patterns quickly.

---

## Firebase Misconfiguration

When analyzing interesting strings, you might find Firebase URLs like:

\`\`\`
https://xyz.firebaseio.com/
\`\`\`

Test for misconfiguration:

\`\`\`bash
# Navigate to this URL in browser
https://xyz.firebaseio.com/.json

# You'll see either:
# 1. Permission Denied - Well configured, move on
# 2. Null or JSON data - Database is publicly accessible!
\`\`\`

Test for write access:

\`\`\`bash
# Test write permission
curl -X PUT "https://xyz.firebaseio.com/test.json" -d '{"test":"data"}'

# Test delete permission
curl -X DELETE "https://xyz.firebaseio.com/test.json"
\`\`\`

---

## Sensitive Data Storage

Android provides multiple storage mechanisms. Always check:

1. **SharedPreferences** - For storing key-value pairs
2. **SQL Databases** - For structured data
3. **Files** - In app-specific directories
4. **Logs** - Often contain sensitive information

Check the \`/data/data/com.example.app/\` directory for:
- \`shared_prefs/\` - User credentials, tokens
- \`.db\` files - Databases
- Log files containing sensitive data

---

## Root Detection & Bypass

### How Apps Detect Root

1. **Checking for su binary:**
\`\`\`bash
# Apps look in common paths
/system/bin/su
/system/xbin/su
/sbin/su
\`\`\`

2. **Root Management Apps:**
- Magisk (com.topjohnwu.magisk)
- SuperSU (eu.chainfire.supersu)

3. **System Properties:**
\`\`\`bash
ro.debuggable
ro.secure
ro.build.tags
\`\`\`

4. **Google Play Integrity API** - Cloud-based device verification

5. **Writable System Partitions:** Rooted devices have /system mounted as read-write

### How to Bypass Root Detection

**Method 1: Magisk Hide / Zygisk DenyList**
\`\`\`bash
# In Magisk settings, enable DenyList
# Add your target app to the list
\`\`\`

**Method 2: Frida Scripts**
\`\`\`bash
# Hook root detection functions and return false
frida -U -f com.example.app -l root_bypass.js
\`\`\`

**Method 3: Objection**
\`\`\`bash
# Easy command-line interface for Frida
objection -g com.example.app
\`\`\`

**Method 4: Manual APK Patching**
- Decompile APK
- Find and remove root detection logic
- Recompile and sign

---

## SSL Pinning

SSL Pinning prevents man-in-the-middle (MITM) attacks by validating the server's certificate against a pre-defined certificate embedded in the app.

**Problem:** When SSL pinning is enabled, you can't intercept traffic with Burp Suite because the app rejects your proxy's certificate.

### How Apps Implement SSL Pinning

1. **Network Security Configuration (XML)**
\`\`\`xml
<domain-config>
    <pin-set expiration="2025-12-31">
        <pin digest="SHA-256">cert_hash_here</pin>
    </pin-set>
</domain-config>
\`\`\`

2. **Custom TrustManager** - Manual certificate validation

3. **Third-party Libraries** - OkHttp, TrustKit, etc.

### How to Bypass SSL Pinning

**Method 1: Objection**
\`\`\`bash
objection -g com.example.app
patchapk --skip-resources
# Disables SSL pinning with a single command
\`\`\`

**Method 2: Frida Scripts**
\`\`\`bash
# Use universal SSL pinning bypass scripts
frida -U -f com.example.app -l ssl_pinning_bypass.js
\`\`\`

**Method 3: HTTP Toolkit**
- GUI tool that handles certificate installation automatically
- Works on Windows, Linux, and macOS

**Method 4: Manual Patching**
- Decompile APK
- Find CertificatePinner or TrustManager classes
- Remove or patch the validation logic
- Recompile and sign

---

## APK Signature Verification

**Verify APK Signature:**

\`\`\`bash
apksigner verify --verbose app.apk
\`\`\`

**Janus Vulnerability (CVE-2017-13156):**
- Older Android versions vulnerable to APK signature bypass
- Allows modifying APK without invalidating signature

---

## Anti-Tampering Detection

Test if the app detects tampering:

1. Decompile APK with apktool
2. Modify some files (e.g., change a string value)
3. Recompile the APK
4. Sign with your own key
5. Install and run

**If the app detects tampering:** Good security practices implemented

**If it runs normally:** App lacks proper tamper detection (vulnerability)

---

## Advanced Topics

This methodology covers the foundations of Android pentesting. Advanced topics include:

- WebView vulnerabilities (XSS, JavaScript injection)
- Deep link exploitation for bypassing authentication
- Intent-based attacks
- Cryptography implementation flaws
- Memory analysis

---

## Key Takeaways

1. **Start with manifest:** AndroidManifest.xml reveals most vulnerabilities
2. **Search for hardcoded secrets:** Often found embedded in apps
3. **Check for Firebase misconfiguration:** Common and critical vulnerability
4. **Understand app components:** Activities, services, providers, receivers
5. **Master root detection bypasses:** Essential for dynamic testing
6. **Know SSL pinning techniques:** Needed to intercept encrypted traffic
7. **Analyze source code:** Look for logic flaws and security checks

## Tools You'll Need

- **apktool** - Decompiling and recompiling APK
- **JADX** - Java decompiler with GUI
- **Burp Suite** - Intercepting traffic and analyzing requests
- **Frida** - Runtime instrumentation and hooking
- **Objection** - User-friendly Frida wrapper
- **ADB** - Android Debug Bridge
- **MobSF** - Automated mobile security assessment

---

Happy Hacking! Remember: Understanding the security mechanisms is the first step to bypassing them effectively.
`
    },
    {
      id: 4,
      title: "Introduction to AWS Cloud Security: Complete Framework & Best Practices",
      excerpt: "Comprehensive guide to AWS cloud security covering shared responsibility model, CIS benchmarks, security services, and top 10 security improvements.",
      category: "Cloud Security",
      date: "Apr 2023",
      readTime: "25 min read",
      tags: ["AWS", "Cloud Security", "Infrastructure"],
      image: "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      content: `# Introduction to AWS Cloud Security: Complete Framework & Best Practices

AWS Cloud Security is critical for organizations moving their infrastructure to the cloud. This comprehensive guide covers cloud computing fundamentals, AWS security architecture, and actionable security best practices.

## What is Cloud Computing?

Cloud computing is the on-demand delivery of IT resources over the Internet with **pay-as-you-go pricing**. Instead of buying, owning, and maintaining physical data centers and servers, you access technology services such as:

- Computing power (EC2, Lambda)
- Storage (S3, EBS)
- Databases (RDS, DynamoDB)
- Networking services

All on an as-needed basis from providers like Amazon Web Services (AWS).

---

## Why is Cloud a Buzzword?

### Increase IT Agility and Performance

Adopting cloud computing enables businesses to quickly and easily access a wide range of computing resources on-demand, without significant upfront investment in hardware or infrastructure.

### Nearly Unlimited Scalability

Cloud provides scalable, on-demand access to computing resources. Businesses can easily adjust capacity up or down based on demand, enabling true elasticity.

### Improve Reliability

Cloud computing increases reliability through:
- Built-in redundancy
- Disaster recovery capabilities
- 24/7 monitoring and support
- Ensures applications and data are always available

This reduces downtime risk and data loss, providing a stable IT environment.

### Lower Costs

Cloud computing reduces costs by:
- Eliminating hardware investment needs
- Providing pay-as-you-go pricing models
- Enabling greater cost control and flexibility
- No need to maintain physical infrastructure

---

## Cloud Computing Deployment Models

**Public Cloud**
- Services delivered over the internet
- Shared resources among multiple customers
- Examples: AWS, Azure, Google Cloud

**Private Cloud**
- Infrastructure dedicated to a single organization
- On-premises or hosted by third party
- Maximum control and security

**Hybrid Cloud**
- Combination of public and private cloud
- Allows flexibility to scale and optimize workloads

---

## AWS Shared Responsibility Model

This is the cornerstone of AWS security architecture. It clearly defines who is responsible for what:

### Security IN the Cloud (Customer Responsibility)

**You are responsible for:**
- Securing your applications and data
- Implementing access controls
- Encrypting sensitive data
- Monitoring and testing security measures
- Compliance with regulations and standards
- Maintaining strong security posture

### Security OF the Cloud (AWS Responsibility)

**AWS is responsible for:**
- Physical security of data centers
- Network infrastructure security
- Application security
- Providing security controls and tools:
  - Firewalls
  - Intrusion detection systems
  - Data encryption options
- Regular monitoring and testing of security measures

**Key Takeaway:** Both parties must work together. AWS provides the foundational security, but you must secure your applications and data within the cloud environment.

---

## Reports and Compliance

**AWS Compliance Reports:**
- Available at: https://aws.amazon.com/compliance/
- ISV security and compliance reports: https://aws.amazon.com/artifact/

**Important:** Using AWS security offerings doesn't guarantee compliance. You must:
- Manage and certify applications separately
- Engage with external auditors
- Maintain compliance documentation

---

## CIS Benchmarks

**CIS (Center for Internet Security) Benchmark** is a set of best practice guidelines for securing various IT systems and infrastructure.

CIS Benchmarks include:
- **What it applies to** - Specific systems and configurations
- **What to do** - Recommended security controls
- **Why to do it** - Security rationale
- **How to audit** - Testing procedures
- **How to fix** - Remediation steps

**AWS CIS Benchmark:**
Access the AWS CIS Foundations Benchmark for detailed guidance on securing your AWS infrastructure.

---

## Cyber Security Strategy

Design, implement, and continually improve a cyber discipline aligned to the **National Institute of Standards and Technology (NIST) Cybersecurity Framework (CSF)**.

NIST CSF provides five core functions:

1. **Identify** - Asset inventory and risk assessment
2. **Protect** - Implement safeguards and access controls
3. **Detect** - Monitor for security events
4. **Respond** - Incident response procedures
5. **Recover** - Business continuity and resilience

---

## Native Security Services by AWS

AWS provides comprehensive security services:

**Detection & Monitoring:**
- **GuardDuty** - Threat detection using machine learning
- **AWS Config** - Configuration compliance monitoring
- **Security Hub** - Centralized security findings
- **CloudTrail** - API activity logging and monitoring

**Access Control:**
- **IAM (Identity & Access Management)** - User and permission management
- **Secrets Manager** - Credential rotation and management

**Data Protection:**
- **KMS (Key Management Service)** - Encryption key management
- **Certificate Manager** - SSL/TLS certificate management

**Network Security:**
- **VPC (Virtual Private Cloud)** - Network isolation
- **WAF (Web Application Firewall)** - Application protection
- **Security Groups** - Firewall rules

---

## MITRE ATT&CK Matrix

The ATT&CK (Adversarial Tactics, Techniques & Common Knowledge) matrix provides a framework for identifying tactics and techniques used by threat actors.

**Open-source Testing Tools:**

**MITRE Caldera**
- Automated red team tool
- Simulate adversary behavior

**Atomic Red Team**
- Library of test cases
- Aligned with ATT&CK matrix

**ATT&CK Navigator**
- Web-based visualization tool
- Annotate and explore ATT&CK matrices
- Visualize defensive coverage
- Red/blue team planning

**Use Cases:**
- Test organization's detection capabilities
- Generate event information
- Test alerts and search capabilities
- Identify coverage gaps

---

## AWS Well-Architected Framework

The **AWS Well-Architected Framework** is a comprehensive set of best practices for designing and operating reliable, efficient, and cost-effective systems in the cloud.

It provides a structured approach for:
- Evaluating architectures
- Identifying areas of improvement
- Implementing optimization changes
- Ensuring optimal performance, security, and scalability

### Six Pillars:

1. **Operational Excellence** - Effective operations and continuous improvement
2. **Security** - Protect data and systems, meet compliance
3. **Reliability** - System resilience and recovery
4. **Performance Efficiency** - Efficient resource usage
5. **Cost Optimization** - Maximize business value
6. **Sustainability** - Environmental responsibility

**AWS Well-Architected Tool:**
Available in the AWS Console, answer questions about your application to receive a detailed report on whether your architecture follows best practices.

---

## Top 10 Items to Improve Security in Your AWS Account

### 1. Define Cloud Security Strategy

Establish a comprehensive cloud security strategy and incident response plan including:
- People (roles and responsibilities)
- Processes (procedures and workflows)
- Technology (tools and controls)

### 2. Use Email Distribution Lists

Configure email distribution lists for AWS account contact information instead of individual emails. This ensures critical AWS notifications reach the right team even after personnel changes.

### 3. Configure Backup Plans

Implement automated backup plans for critical systems:
- Point-in-time recovery
- Regular testing of restore procedures
- Disaster recovery site readiness

### 4. Enable Security Services

Enable and configure:
- **GuardDuty** - Threat detection
- **AWS Config** - Configuration compliance
- **Security Hub** - Centralized findings
- **CloudTrail** - Audit logging
- **Service access logs** - API logging

### 5. Implement AWS Foundational Security Best Practices

Use AWS Foundational Security Best Practices to automatically remediate:
- Overly permissive security group rules
- S3 bucket public access
- Unencrypted EBS volumes
- Missing encryption keys

### 6. Ensure Least-Privileged Access

Continuously assess and implement least-privileged access using:
- **IAM Policy Simulator** - Test permissions
- **Access Analyzer** - Identify public/cross-account access
- Regular access reviews
- Remove unused credentials

### 7. Replace Long-Lived Credentials

Migrate from static, long-lived credentials to short-lived alternatives:
- **Temporary security credentials** - Expires after defined period
- **IAM roles** - For services to assume
- **MFA** - Multi-factor authentication
- **Credential rotation** - Regular password changes

### 8. Mitigate OWASP Top 10

Protect against common application vulnerabilities:
- **Input validation** - Sanitize all user inputs
- **Rate limiting** - Prevent brute force attacks
- **Output encoding** - Prevent XSS attacks
- **Use AWS WAF** - Web application firewall rules

### 9. Continuous Patching

Maintain security posture through regular updates:
- Operating system patches
- Application updates
- Dependency vulnerabilities
- Security hotfixes

Use Systems Manager Patch Manager for automated patching.

### 10. Train and Simulate

Build organizational security awareness:
- Regular security training
- Phishing simulations
- Incident response drills
- Red team exercises
- Iterate and improve processes

---

## Implementation Roadmap

**Phase 1: Foundation (Month 1-2)**
- Enable CloudTrail and GuardDuty
- Review IAM permissions
- Implement backup policies
- Define security strategy

**Phase 2: Hardening (Month 3-4)**
- Enable AWS Config and Security Hub
- Implement WAF rules
- Configure KMS encryption
- Set up automated patching

**Phase 3: Continuous Improvement (Ongoing)**
- Regular security assessments
- Incident simulations
- Team training
- Policy updates

---

## Key Takeaways

1. **Shared Responsibility:** Both AWS and customers must secure the cloud environment
2. **Compliance First:** Use AWS compliance reports and CIS benchmarks as reference
3. **Defense in Depth:** Implement multiple layers of security controls
4. **Continuous Monitoring:** Use GuardDuty, Config, and Security Hub for ongoing visibility
5. **Least Privilege:** Regularly audit and minimize IAM permissions
6. **Encryption Always:** Encrypt data in transit and at rest
7. **Incident Readiness:** Have a documented incident response plan
8. **Regular Training:** Keep teams updated on security best practices

---

## References

- AWS Security Best Practices: https://aws.amazon.com/security/best-practices/
- AWS Well-Architected: https://aws.amazon.com/architecture/well-architected/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework/
- CIS AWS Benchmarks: https://docs.aws.amazon.com/securityhub/latest/userguide/cis-aws-foundations-benchmark.html

The cloud security landscape is constantly evolving. Stay updated with AWS security announcements and continuously refine your security posture!
`
    },
    {
      id: 5,
      title: "Mastering Google Dorking: A Complete Guide from Beginner to Advanced",
      excerpt: "Learn advanced Google search techniques to find hidden information, vulnerable systems, and sensitive data exposed on the internet.",
      category: "OSINT & Reconnaissance",
      date: "March 2024",
      readTime: "35 min read",
      tags: ["Google Dorking", "OSINT", "Reconnaissance", "Information Gathering"],
      image: "https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      content: `# Mastering Google Dorking: A Complete Guide from Beginner to Advanced

Google Dorking is an advanced search technique that leverages Google's search operators to find hidden, sensitive, or vulnerable information on the internet. It's an essential OSINT (Open Source Intelligence) tool for security researchers, penetration testers, and ethical hackers.

## What is Google Dorking?

Google Dorking uses specialized search operators and query syntax to pinpoint specific information that ordinary users might not find through regular searches. It's a powerful reconnaissance technique that can reveal:

- Exposed configuration files
- Sensitive credentials and API keys
- Vulnerable systems and applications
- Directory listings
- Administrator panels and login pages
- Sensitive documents and PDFs

---

## Essential Google Dork Operators

### 1. **site:** - Search Within a Specific Domain
\`\`\`
site:example.com
site:example.com filetype:pdf
site:google.com inurl:admin
\`\`\`

**Use Cases:**
- Find all pages indexed from a target domain
- Locate specific file types on a domain
- Discover subdomains through Google's index

### 2. **inurl:** - Search for Keywords in URLs
\`\`\`
inurl:admin
inurl:login
inurl:wp-admin
inurl:config.php
\`\`\`

**Examples:**
- \`inurl:password\` - Find pages with "password" in the URL
- \`inurl:backup\` - Locate backup files accessible via URL

### 3. **intitle:** - Search for Keywords in Page Titles
\`\`\`
intitle:"admin login"
intitle:"index of /"
intitle:"webcam"
intitle:"router admin"
\`\`\`

**Common Findings:**
- Administrative panels
- Directory listings vulnerable to browsing
- Exposed system interfaces

### 4. **intext:** - Search for Text Within Web Pages
\`\`\`
intext:"password" site:example.com
intext:"api_key"
intext:"confidential"
\`\`\`

### 5. **filetype:** - Find Specific File Types
\`\`\`
filetype:pdf site:example.com
filetype:xlsx password
filetype:conf
filetype:sql
\`\`\`

**Common Sensitive File Types:**
- \`.pdf\` - Documents and reports
- \`.xlsx, .xls\` - Spreadsheets with data
- \`.sql\` - Database backups
- \`.conf\` - Configuration files
- \`.log\` - Log files
- \`.bak\` - Backup files

---

## Real-World Dork Examples

### Finding Exposed Credentials

\`\`\`
intitle:"index of" ".git"
intitle:"index of" "config" filetype:php
inurl:api key=
filetype:env "DATABASE_PASSWORD"
\`\`\`

### Discovering Vulnerable Web Servers
\`\`\`
intitle:"Apache Status" site:example.com
intitle:"IIS" "Windows Server"
inurl:cgi-bin
\`\`\`

### Finding Exposed Databases
\`\`\`
filetype:sql password
intext:"CREATE TABLE" filetype:sql
\`\`\`

### Locating Admin Panels
\`\`\`
inurl:wp-admin
inurl:/admin
inurl:phpmyadmin
intitle:"admin login"
\`\`\`

### Searching for Sensitive Documents
\`\`\`
filetype:pdf "confidential" "2024"
filetype:xlsx salary OR budget
intitle:"restricted" filetype:doc
\`\`\`

### Finding CCTV and Webcams
\`\`\`
intitle:"webcam" live view
inurl:axis-cgi/jpg
intitle:"Live View" "Axis"
\`\`\`

---

## Advanced Dork Techniques

### 1. **Combining Multiple Operators**
\`\`\`
site:example.com inurl:admin intitle:"login"
site:example.com filetype:pdf "confidential"
inurl:backup OR inurl:backup.sql filetype:sql
\`\`\`

### 2. **Using Boolean Operators**
\`\`\`
site:example.com (admin OR administrator)
inurl:(config OR configuration) filetype:php
filetype:sql (password OR secret OR key)
\`\`\`

### 3. **Wildcard Searches**
\`\`\`
site:*.example.com admin
inurl:backup*
\`\`\`

### 4. **Negative Search (Exclude Results)**
\`\`\`
intitle:admin -wordpress
filetype:pdf confidential -public
\`\`\`

### 5. **Numeric Range Searches**
\`\`\`
inurl:id= 1..100
\`\`\`

---

## Practical Google Dorking Scenarios

### Scenario 1: Initial Reconnaissance on Target Organization
\`\`\`
site:target.com
site:target.com filetype:pdf
site:target.com inurl:admin
site:target.com inurl:api
\`\`\`

### Scenario 2: Finding Exposed Configuration Files
\`\`\`
site:target.com filetype:conf
site:target.com filetype:config.php
site:target.com "database.yml"
filetype:env "PASSWORD"
\`\`\`

### Scenario 3: Discovering Sensitive Information
\`\`\`
site:target.com filetype:xlsx salary
site:target.com filetype:doc internal
intext:"api_key" OR intext:"api_secret" site:target.com
\`\`\`

### Scenario 4: Locating Backup and Outdated Files
\`\`\`
site:target.com (backup OR old OR obsolete)
site:target.com filetype:bak
inurl:.git
\`\`\`

---

## Legal and Ethical Considerations

### ✅ Legal Use of Google Dorking

1. **Authorized Security Testing** - With written permission from the system owner
2. **Vulnerability Disclosure** - Reporting findings responsibly
3. **Security Research** - Academic and professional research purposes
4. **Public Information Gathering** - General OSINT on public data

### ❌ Illegal Use Cases

1. **Unauthorized Access** - Accessing systems without permission
2. **Data Theft** - Extracting sensitive information unlawfully
3. **Privacy Violation** - Harvesting personal information
4. **Competitive Spying** - Gathering confidential business information

**Legal Framework:**
- Always obtain written authorization before testing
- Follow responsible disclosure practices
- Report findings to the organization privately first
- Abide by local laws regarding computer access

---

## Defensive Measures Against Google Dorking

### 1. **Robots.txt and Meta Tags**
\`\`\`
User-agent: Googlebot
Disallow: /admin
Disallow: /config
\`\`\`

\`\`\`html
<meta name="robots" content="noindex, nofollow">
\`\`\`

### 2. **Remove Sensitive Files**
- Delete backup files from web directories
- Remove outdated configuration files
- Clean up forgotten admin panels

### 3. **Proper Access Controls**
- Implement authentication for sensitive directories
- Use robots.txt to prevent indexing
- Configure .htaccess restrictions

### 4. **Monitor Your Exposure**
- Regularly search your domain on Google
- Use tools like Google Search Console
- Monitor for exposed credentials

### 5. **Content Security**
- Never hardcode secrets in version control
- Use environment variables for sensitive data
- Implement proper logging without exposing credentials

---

## Tools and Resources

### OSINT Tools Complementing Google Dorking
- **Shodan** - IoT and Infrastructure search engine
- **Censys** - Internet-wide scanning and analysis
- **BuiltWith** - Technology and website profiling
- **WHOIS** - Domain and IP registration information
- **DNSdumpster** - DNS reconnaissance tool

### Browser Extensions
- **Google Dorking Helper** - Syntax hints and operator documentation
- **OSINT Extensions** - Enhanced search capabilities

---

## Best Practices for Effective Google Dorking

1. **Start Broad, Then Narrow** - Begin with general searches, then refine
2. **Combine Multiple Operators** - Use site: + filetype: + inurl: together
3. **Test on Known Targets First** - Practice on your own infrastructure
4. **Document Findings** - Keep detailed notes of search queries and results
5. **Stay Updated** - Google operators change; research current techniques
6. **Use Multiple Search Terms** - Different queries reveal different results
7. **Monitor Results** - Set up alerts for sensitive information exposure

---

## Conclusion

Google Dorking is a powerful OSINT technique that can reveal critical security gaps and exposed information. Whether you're a penetration tester, security researcher, or system administrator, mastering Google Dorking is essential for comprehensive security assessments.

Remember: **With great power comes great responsibility.** Always use these techniques ethically and legally, with proper authorization and in compliance with applicable laws.

---

## References

- Google Advanced Search: https://www.google.com/advanced_search
- Google Search Operators: https://support.google.com/websearch/answer/2466433
- OWASP OSINT: https://owasp.org/www-community/Gathering_information
- Shodan: https://www.shodan.io
- Censys: https://censys.io

For more information about responsible disclosure and ethical hacking, visit:
- https://medium.com/@puneetten/mastering-google-dorking-a-complete-guide-from-beginner-to-advanced-e0dc451fdc24
`
    }
  ];

  useEffect(() => {
    setBlogs(fallbackBlogs);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full relative py-12 md:py-20">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2
          className="text-4xl md:text-5xl font-bold font-moderniz mb-4 flex items-center justify-center gap-3"
          style={{
            color: theme === 'dark' ? "#00ffdc" : "#0891b2",
            textShadow: theme === 'dark'
              ? "2px 2px 0 #000754, 4px 4px 0 #4079ff, 0 4px 12px #40ffaa, 0 1px 0 #00ffdc"
              : "none"
          }}
        >
          <FaShieldAlt className="text-4xl" />
          Security & Systems Writeups
        </h2>
        <p className="text-lg dark:text-cyan-200/70 text-slate-600 mt-2 font-cascadia max-w-2xl mx-auto">
          In-depth technical articles on API security, penetration testing, and Linux systems administration.
        </p>
      </motion.div>

      {/* Blogs Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4"
      >
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(blog.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative h-full"
          >
            <div
              className="h-full rounded-2xl overflow-hidden dark:bg-slate-900/90 bg-amber-50 border dark:border-slate-700/50 border-amber-200
              dark:shadow-none shadow-lg transition-all duration-500 hover:border-cyan-400/50 hover:shadow-xl dark:hover:shadow-[0_0_24px_0px_#00ffdc50]
              flex flex-col hover:scale-105 cursor-pointer"
            >
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Blog Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full dark:bg-cyan-900/30 bg-cyan-100
                  dark:text-cyan-300 text-cyan-900 border dark:border-cyan-700/50 border-cyan-300
                  group-hover:border-cyan-400/50 dark:group-hover:border-cyan-400/50 transition-all duration-300 font-semibold">
                    {blog.category}
                  </span>
                </div>

                {/* Date and Read Time */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-2 dark:text-slate-400 text-gray-800">
                    <FaCalendar className="text-xs" />
                    <span>{blog.date}</span>
                  </div>
                  <span className="dark:text-slate-400 text-gray-800 text-xs font-medium">
                    {blog.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold dark:text-white text-black mb-3 font-moderniz line-clamp-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors duration-300">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="dark:text-slate-300 text-gray-800 text-sm mb-4 flex-1 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full dark:bg-slate-800/50 bg-amber-100
                      dark:text-slate-300 text-gray-800 border dark:border-slate-700/50 border-amber-300
                      group-hover:border-cyan-400/50 dark:group-hover:border-cyan-400/50 transition-all duration-300"
                    >
                      <FaTags className="text-xs" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More Button */}
                <motion.button
                  onClick={() => setSelectedBlog(blog)}
                  className="inline-flex items-center gap-2 text-cyan-500 dark:text-cyan-300 font-semibold text-sm
                  hover:gap-3 transition-all duration-300 group"
                >
                  Read Full Article
                  <FaArrowRight className={`transition-transform duration-300 ${hoveredId === blog.id ? 'translate-x-1' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="dark:bg-slate-900 bg-amber-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 dark:bg-slate-900 bg-amber-50 border-b dark:border-slate-800 border-amber-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white text-black font-moderniz flex-1 pr-4">
                  {selectedBlog.title}
                </h2>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="dark:text-slate-400 text-gray-800 hover:dark:text-white hover:text-black transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-slate-800 border-amber-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm dark:text-slate-400 text-gray-800 mb-2">
                      <span>{selectedBlog.date}</span>
                      <span>•</span>
                      <span>{selectedBlog.readTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full dark:bg-cyan-900/30 bg-cyan-100
                          dark:text-cyan-300 text-cyan-900 border dark:border-cyan-700/50 border-cyan-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Markdown-like content */}
                <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none
                  dark:text-slate-300 text-gray-900"
                  style={{
                    '--tw-prose-headings': theme === 'dark' ? '#00ffdc' : '#0891b2',
                    '--tw-prose-links': theme === 'dark' ? '#00ffdc' : '#0891b2',
                    '--tw-prose-code': theme === 'dark' ? '#40ffaa' : '#0891b2',
                    '--tw-prose-pre-code': theme === 'dark' ? '#e2e8f0' : '#1e293b',
                  }}
                >
                  {selectedBlog.content.split('\n').map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={idx} className="text-3xl font-bold mt-6 mb-4" style={{ color: theme === 'dark' ? '#00ffdc' : '#0891b2' }}>{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3" style={{ color: theme === 'dark' ? '#00ffdc' : '#0891b2' }}>{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-xl font-bold mt-4 mb-2" style={{ color: theme === 'dark' ? '#40ffaa' : '#0891b2' }}>{line.substring(4)}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={idx} className="ml-4 my-1">{line.substring(2)}</li>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={idx} className="font-bold my-2">{line.substring(2, line.length - 2)}</p>;
                    } else if (line.startsWith('```')) {
                      return null;
                    } else if (line.startsWith('`') || line.includes('`')) {
                      return <code key={idx} className="dark:bg-slate-800/50 bg-amber-100 px-2 py-1 rounded text-sm font-mono my-1 block" style={{ color: theme === 'dark' ? '#40ffaa' : '#000000' }}>{line.replace(/`/g, '')}</code>;
                    } else if (line === '---') {
                      return <hr key={idx} className="my-6 dark:border-slate-700 border-amber-200" />;
                    } else if (line.trim()) {
                      return <p key={idx} className="my-3 leading-relaxed">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blogs;
