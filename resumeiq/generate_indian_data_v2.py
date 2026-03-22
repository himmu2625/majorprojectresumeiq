import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Directories
output_dir = os.path.join(os.path.dirname(__file__), 'test_data_indian')
os.makedirs(output_dir, exist_ok=True)

# --- NEW JOB DESCRIPTIONS (6 to 10) ---
jds = {
    "jd_6_cyber_security.txt": """Job Title: Cyber Security Analyst
Company: SecureGuard India, Chennai
Experience: 3-5 Years

About the Role:
We are looking for a Cyber Security Analyst to monitor our network and perform vital penetration testing.

Responsibilities:
- Conduct vulnerability assessments and penetration testing (VAPT).
- Monitor SIEM tools for security incidents.
- Ensure compliance with ISO 27001 and GDPR standards.

Required Skills:
- CEH or CISSP Certification
- Experience with Wireshark, Metasploit, Nmap, and Burp Suite
- Deep understanding of Network Security and Cryptography
""",

    "jd_7_android_developer.txt": """Job Title: Senior Android Developer
Company: MobiTech Innovations, Kochi
Experience: 2-4 Years

About the Role:
Looking for a passionate Android dev to build our fast-growing e-commerce app.

Responsibilities:
- Develop natively for Android using Kotlin and Android Studio.
- Implement robust architectural patterns like MVVM.
- Integrate REST APIs and third-party SDKs.

Requirements:
- 2+ years of professional Kotlin experience
- Strong grasp of Coroutines, Room DB, and Jetpack Compose
- Experience publishing apps on the Google Play Store
""",

    "jd_8_blockchain_dev.txt": """Job Title: Blockchain / Web3 Developer
Company: CryptoFlow India, Bengaluru
Experience: 1-3 Years

Role:
Join our DeFi startup in Bengaluru to build smart contracts for Ethereum layer 2 chains.

Skills needed:
- Proficiency in Solidity, Hardhat, and Web3.js / Ethers.js
- Understanding of ERC20, ERC721, and DeFi protocols (Uniswap, Aave)
- Experience deploying and auditing smart contracts
- Backend experience with Node.js is a plus
""",

    "jd_9_cloud_architect.txt": """Job Title: Cloud Solutions Architect
Company: Enterprise Cloud Solutions, Mumbai
Experience: 8+ Years

Role:
Lead our cloud migration strategies for banking clients across India.

Skills:
- AWS Certified Solutions Architect Professional
- Deep expertise in multi-cloud (AWS, Azure, GCP) architecture
- Enterprise network design, microservices, and serverless (Lambda)
- Experience presenting high-level technical strategies to C-level executives
""",

    "jd_10_product_manager.txt": """Job Title: Technical Product Manager
Company: NextGen Startup, Delhi NCR
Experience: 4-6 Years

Role:
Bridge the gap between engineering and business to deliver our B2B SaaS product.

Skills:
- Experience writing PRDs, TRDs, and managing Jira backlogs
- Strong understanding of Agile/Scrum methodologies
- Background in software engineering (B.Tech preferred)
- Excellent communication and stakeholder management
- Data-driven approach using Google Analytics, Mixpanel, SQL
"""
}

# --- NEW RESUMES (11 to 20) ---
resumes = [
    {
        "filename": "res_11_nithya_cyber.pdf",
        "title": "Nithya Menon - InfoSec Analyst",
        "content": """Summary: Certified Ethical Hacker with 3 years securing enterprise networks in Chennai.

Experience:
Security Analyst | Zoho (2021 - Present)
- Performed weekly VAPT on critical public-facing applications using Burp Suite.
- Monitored alerts via Splunk SIEM and handled incident responses.
- Conducted phishing awareness training for 500+ employees.

Skills: Penetration Testing, Wireshark, Metasploit, Splunk, Python Scripting, ISO 27001, Firewall Config.

Education:
B.Tech IT | Anna University (2021)
CEH v12 Certified
"""
    },
    {
        "filename": "res_12_arjun_security.pdf",
        "title": "Arjun Rao - Security Consultant",
        "content": """Summary: Network security expert focused on compliance and firewall configurations. 

Experience:
Consultant | KPMG India (2018 - Present)
- Advised financial institutions on RBI cybersecurity frameworks.
- Configured Cisco ASA and Palo Alto firewalls.
- Managed end-point security via CrowdStrike.

Skills: Network Security, Cisco, Palo Alto, Compliance, Risk Assessment, Windows Server.

Education:
B.E. Electronics | Osmania University (2018)
"""
    },
    {
        "filename": "res_13_vishal_android.pdf",
        "title": "Vishal Nair - Android Developer",
        "content": """Summary: Specialist in modern Android development with Kotlin and Jetpack Compose. Based in Kochi.

Experience:
Mobile Dev | Startup Inc (2022 - Present)
- Migrated the main app from Java to 100% Kotlin.
- Implemented Jetpack Compose reducing UI code by 40%.
- Used Coroutines for background tasks and Room for offline caching.
- Published 3 apps with a combined 500k+ downloads.

Skills: Kotlin, Java, Android Studio, MVVM, Jetpack Compose, Coroutines, Room DB, Retrofit.

Education:
B.Tech Computer Science | CUSAT (2022)
"""
    },
    {
        "filename": "res_14_tara_mobile.pdf",
        "title": "Tara Sharma - Mobile App Dev",
        "content": """Summary: Cross-platform mobile developer with Flutter and React Native experience.

Experience:
Mobile Engineer | AppWorks (2021 - Present)
- Built cross-platform apps using Flutter and Dart.
- Integrated Firebase for push notifications and authentication.
- Basic familiarity with native Kotlin for building custom plugins.

Skills: Flutter, Dart, React Native, Firebase, REST APIs, Git.

Education:
B.CA | Christ University (2021)
"""
    },
    {
        "filename": "res_15_siddharth_web3.pdf",
        "title": "Siddharth Jain - Smart Contract Dev",
        "content": """Summary: Web3 enthusiast building decentralized finance applications in Bengaluru.

Experience:
Blockchain Dev | Polygon Labs (2022 - Present)
- Wrote and optimized Solidity smart contracts for an NFT marketplace.
- Used Hardhat for testing and deployment to Mumbai testnet.
- Integrated frontend using Ethers.js and React.
- Audited ERC20 tokens for reentrancy vulnerabilities.

Skills: Solidity, Hardhat, Web3.js, Ethers.js, React, Node.js, Ethereum, IPFS.

Education:
B.Tech CS | IIT Roorkee (2022)
"""
    },
    {
        "filename": "res_16_aisha_ethereum.pdf",
        "title": "Aisha Khan - Web3 Engineer",
        "content": """Summary: Crypto developer focused on DeFi protocols and backend integration.

Experience:
Software Engineer | WazirX (2021 - 2023)
- Built backend wallet integrations using Node.js and Ethereum RPC nodes.
- Wrote basic smart contracts in Solidity for staking mechanisms.

Skills: JavaScript, Node.js, Solidity, Ethereum RPC, SQL.

Education:
B.Sc Computer Science | Mumbai University (2021)
"""
    },
    {
        "filename": "res_17_manish_architect.pdf",
        "title": "Manish Gupta - Enterprise Cloud Architect",
        "content": """Summary: Veteran IT professional with 10 years experience, including 6 in cloud strategy in Mumbai.

Experience:
Principal Architect | Reliance Jio (2018 - Present)
- Led the migration of legacy on-prem datacenters to AWS, saving $2M annually.
- Designed highly available microservices architectures utilizing EKS, Lambda, and DynamoDB.
- AWS Certified Solutions Architect Professional.

Skills: AWS (EC2, Lambda, S3, RDS, DynamoDB), Azure, GCP, Kubernetes, Terraform, System Design, Leadership.

Education:
M.Tech CS | IIT Delhi (2014)
"""
    },
    {
        "filename": "res_18_ritu_pm.pdf",
        "title": "Ritu Patil - Technical Product Manager",
        "content": """Summary: Ex-software engineer turned PM. Passionate about delivering Agile SaaS products in Delhi NCR.

Experience:
Product Manager | Paytm (2020 - Present)
- Owned the end-to-end roadmap for the seller dashboard.
- Wrote detailed PRDs and collaborated with engineering and design teams via Jira.
- Analyzed user drop-offs via Mixpanel and increased adoption by 22%.

Software Engineer | TCS (2017 - 2020)
- Developed Java backends for banking clients.

Skills: Product Management, Agile/Scrum, Jira, PRD/TRD writing, SQL, Mixpanel, Stakeholder Management, Java.

Education:
MBA | IIM Indore (2020)
B.Tech | NIT Kurukshetra (2017)
"""
    },
    {
        "filename": "res_19_ramesh_ba.pdf",
        "title": "Ramesh Tiwari - Business Analyst",
        "content": """Summary: Detail-oriented Business Analyst with 3 years of experience gathering requirements and analyzing data.

Experience:
Business Analyst | Genpact (2021 - Present)
- Gathered business requirements and translated them into functional specs.
- Managed client relationships and sprint planning.
- Created Tableau dashboards for executive reporting.

Skills: Requirement Gathering, Agile, Tableau, Excel, SQL, Client Communication.

Education:
B.BA | Amity University (2021)
"""
    },
    {
        "filename": "res_20_neha_designer.pdf",
        "title": "Neha Kapoor - Graphic Designer",
        "content": """Summary: Creative graphic designer specializing in branding, marketing collateral, and social media.

Experience:
Senior Designer | Ogilvy India (2019 - Present)
- Designed branding materials for FMCG clients.
- Created visually appealing social media posts and typography layouts.
- Edited promotional videos in Adobe Premiere Pro.

Skills: Adobe Photoshop, Illustrator, Premiere Pro, InDesign, Typography, Branding.

Education:
B.F.A | Delhi College of Art (2019)
"""
    }
]

# Write Job descriptions
for filename, text in jds.items():
    with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
        f.write(text)

print(f"✅ Generated {len(jds)} MORE Indian Job Descriptions")

# Write PDFs
for resume in resumes:
    filepath = os.path.join(output_dir, resume["filename"])
    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter
    
    # Title
    c.setFont("Helvetica-Bold", 16)
    # Ensure ASCII to prevent any reportlab font crashes
    safe_title = resume["title"].encode("ascii", "ignore").decode()
    c.drawCentredString(width / 2.0, height - 50, safe_title)
    
    # Body
    c.setFont("Helvetica", 11)
    textobject = c.beginText(50, height - 80)
    
    safe_content = resume["content"].encode('ascii', 'ignore').decode()
    lines = safe_content.split("\n")
    for line in lines:
        if line.strip().startswith("Experience:") or line.strip().startswith("Skills:") or line.strip().startswith("Education:") or line.strip().startswith("Summary:"):
            textobject.setFont("Helvetica-Bold", 12)
            textobject.textLine(line)
            textobject.setFont("Helvetica", 11)
        else:
            words = line.split(" ")
            new_line = ""
            for word in words:
                if len(new_line) + len(word) < 95:
                    new_line += word + " "
                else:
                    textobject.textLine(new_line)
                    new_line = word + " "
            if new_line:
                textobject.textLine(new_line)
                
    c.drawText(textobject)
    c.save()

print(f"✅ Generated {len(resumes)} MORE Indian PDF Resumes")
print(f"📁 All new files added to: {output_dir}")
