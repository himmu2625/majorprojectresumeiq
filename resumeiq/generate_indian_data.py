import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Directories
output_dir = os.path.join(os.path.dirname(__file__), 'test_data_indian')
os.makedirs(output_dir, exist_ok=True)

# --- JOB DESCRIPTIONS ---
jds = {
    "jd_1_react_frontend.txt": """Job Title: SDE-1 (Frontend React)
Company: TechNinja Solutions, Bengaluru
Experience: 1-3 Years

About the Role:
We are looking for a passionate Frontend Developer to join our core product team in Bengaluru. You will be migrating legacy code to modern React paradigms.

Responsibilities:
- Build pixel-perfect, buttery smooth UIs across both mobile and desktop.
- Maintain and improve standard React Native / Next.js codebases.
- Work closely with the Design and Backend team to build RESTful APIs.

Required Skills:
- 1+ years building production-grade web applications with React.js / Next.js
- Proficiency in JavaScript (ES6+), TypeScript, and TailwindCSS
- Solid understanding of Redux or Context API for state management
- Basic understanding of Webpack and Vite
""",

    "jd_2_python_backend.txt": """Job Title: Senior Backend Developer (Python)
Company: PaySwift India, Hyderabad
Experience: 4-7 Years

About the Role:
PaySwift is revolutionizing digital payments in India. We need a strong Python backend engineer to optimize transaction systems.

Responsibilities:
- Architect, build, and maintain highly scalable backend services using Python and FastAPI.
- Manage large-scale PostgreSQL and NoSQL databases (MongoDB).
- Integrate with banking gateways and UPI protocols.

Requirements:
- 4+ years of professional backend development
- Expert in Python, Django, or FastAPI
- Experience with Docker, Kubernetes, and AWS (EC2, S3)
- Strong grasp of Data Structures and system design
""",

    "jd_3_data_scientist.txt": """Job Title: Machine Learning Engineer
Company: DataGyan AI, Pune
Experience: 2-5 Years

Role:
Join our AI-research lab in Pune to build next-generation NLP models for Indic languages.

Responsibilities:
- Train and fine-tune transformer models for Text Classification and NER.
- Deploy scalable inferencing APIs using FastAPI and TorchServe.

Skills:
- Proficiency in Python, PyTorch, and HuggingFace Transformers
- Experience with NLP techniques (TF-IDF, Word2Vec, BERT)
- Familiarity with MLOps pipelines (MLflow, Docker)
- Strong statistics and mathematics background
""",

    "jd_4_mern_fullstack.txt": """Job Title: MERN Full Stack Developer
Company: InnovateTech India, Gurugram
Experience: 2+ Years

Role:
Looking for a Full Stack engineer to build a massive B2B e-commerce platform from scratch.

Skills Needed:
- Deep expertise in MongoDB, Express.js, React.js, and Node.js
- Experience building RESTful and GraphQL APIs
- Knowledge of AWS, CI/CD, and Redis caching
- Problem-solving mindset with a B.Tech in Computer Science
""",

    "jd_5_devops.txt": """Job Title: DevOps & Cloud Engineer
Company: CloudScale India, Noida
Experience: 3-6 Years

Role:
Maintain 99.99% uptime for our SaaS offerings. 

Skills:
- AWS (VPC, EC2, RDS, IAM, CloudFront)
- Infrastructure as Code using Terraform or CloudFormation
- CI/CD using Jenkins or GitHub Actions
- Strong Linux administration and Bash scripting
- Kubernetes and Docker
"""
}

# --- RESUMES ---
resumes = [
    {
        "filename": "res_1_amit_react.pdf",
        "title": "Amit Sharma - Frontend React Developer",
        "content": """Summary: Highly energetic Frontend Developer with 2 years of experience building modern web apps. Based in Bengaluru.

Experience:
Frontend Engineer | FreshWorks India (2022 - Present)
- Developed responsive UI using React.js, TypeScript, and TailwindCSS.
- Improved page load speed by 30% through lazy loading and Vite optimization.
- Collaborated with backend teams to integrate REST APIs for dashboard modules.

Skills: JavaScript, TypeScript, React.js, Next.js, Redux, HTML, CSS, TailwindCSS, Git, REST APIs.

Education:
B.Tech Computer Science | VIT Vellore (2018 - 2022)
"""
    },
    {
        "filename": "res_2_priya_frontend.pdf",
        "title": "Priya Patel - UI Developer",
        "content": """Summary: UI/UX Developer with a strong eye for design. 3 years of experience.

Experience:
UI Developer | TCS, Pune (2020 - 2023)
- Created reusable component libraries using React.js and Material UI.
- Converted Figma mockups into responsive HTML/CSS designs.
- Maintained legacy Angular codebases before migrating to React.

Skills: HTML, CSS, JavaScript, React.js, Angular, Figma, Bootstrap, SCSS.

Education:
B.E. Information Technology | Pune University (2020)
"""
    },
    {
        "filename": "res_3_rahul_python.pdf",
        "title": "Rahul Verma - Senior Backend Engineer",
        "content": """Summary: Senior software engineer specializing in scalable Python backends and distributed systems. 5 years of experience in Hyderabad's fintech sector.

Experience:
Backend Lead | Zomato (2020 - Present)
- Architected high-throughput microservices using FastAPI and Python.
- Scaled PostgreSQL clusters to handle 1M+ daily transactions.
- Containerized applications using Docker and orchestrated via Kubernetes on AWS.

Software Engineer | Infosys (2018 - 2020)
- Developed internal tools using Django and Celery.
- Wrote complex SQL queries and optimized database schemas.

Skills: Python, FastAPI, Django, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, System Design, REST APIs, Redis.

Education:
B.Tech Computer Science | NIT Warangal (2018)
"""
    },
    {
        "filename": "res_4_sneha_ml.pdf",
        "title": "Sneha Reddy - ML Engineer",
        "content": """Summary: Machine learning enthusiast and researcher focusing on NLP and deep learning. 3 years of industry experience.

Experience:
Data Scientist | Flipkart, Bengaluru (2021 - Present)
- Built semantic search algorithms using PyTorch and HuggingFace models.
- Deployed real-time inference endpoints via FastAPI and Docker.
- Orchestrated MLOps pipelines using MLflow.

Skills: Python, PyTorch, TensorFlow, Scikit-Learn, Pandas, HuggingFace, BERT, NLP, FastAPI, Docker, SQL.

Education:
M.Tech Data Science | IIT Bombay (2021)
"""
    },
    {
        "filename": "res_5_karthik_mern.pdf",
        "title": "Karthik Iyer - MERN Full Stack",
        "content": """Summary: Full-stack developer with 2.5 years of experience building complete end-to-end Javascript applications.

Experience:
Software Engineer | Swiggy (2021 - Present)
- Designed backend services using Node.js and Express.js.
- Developed dynamic frontends using React.js and Redux.
- Optimized MongoDB aggregate queries reducing latency by 200ms.
- Setup CI/CD pipelines through GitHub Actions.

Skills: JavaScript, Node.js, Express.js, React.js, MongoDB, Redis, GraphQL, Docker, AWS.

Education:
B.E. Computer Science | BITS Pilani (2021)
"""
    },
    {
        "filename": "res_6_pooja_devops.pdf",
        "title": "Pooja Singh - Cloud & DevOps Engineer",
        "content": """Summary: DevOps professional with 4 years of experience managing scalable AWS infrastructures and automating deployment pipelines. Based in Noida.

Experience:
DevOps Engineer | HCLTech (2019 - Present)
- Automated infrastructure provisioning using Terraform.
- Managed EKS (Kubernetes) clusters and Docker container registries.
- Maintained Jenkins CI/CD pipelines handling 50+ builds a day.
- Implemented robust monitoring using Prometheus and Grafana.

Skills: AWS (EC2, S3, RDS, VPC), Terraform, Linux, Bash Scripting, Jenkins, Docker, Kubernetes, Ansible.

Education:
B.Tech IT | Amity University (2019)
"""
    },
    {
        "filename": "res_7_vikas_java.pdf",
        "title": "Vikas Kumar - Java Backend Developer",
        "content": """Summary: Core Java developer with 6 years of experience in enterprise banking applications.

Experience:
System Analyst | Wipro (2017 - Present)
- Developed backend banking modules using Java 8, Spring Boot, and Hibernate.
- Interacted with Oracle databases using JDBC.
- Created SOAP and REST web services for internal bank modules.

Skills: Java, Spring Boot, Hibernate, Oracle SQL, SOAP, Jenkins, Maven.

Education:
B.E. Computer Science | RGPV Bhopal (2017)
"""
    },
    {
        "filename": "res_8_anjali_ux.pdf",
        "title": "Anjali Desai - UI/UX Designer",
        "content": """Summary: Passionate product designer focusing on user-centric interfaces. 4 years of experience.

Experience:
Product Designer | Razorpay (2019 - Present)
- Conducted user research and A/B testing increasing conversion by 15%.
- Created high-fidelity wireframes and interactive prototypes in Figma.
- Worked closely with React engineers to ensure design consistency.

Skills: Figma, Adobe XD, Sketch, User Research, Prototyping, Wireframing, CSS.

Education:
B.Des | NID Ahmedabad (2019)
"""
    },
    {
        "filename": "res_9_rohan_data_analyst.pdf",
        "title": "Rohan Gupta - Data Analyst",
        "content": """Summary: Analytical thinker skilled in translating raw data into business intelligence. 

Experience:
Data Analyst | Fractal Analytics (2020 - Present)
- Created interactive dashboards using Tableau and PowerBI.
- Extracted and cleaned data using Python (Pandas) and complex SQL queries.
- Presented actionable insights to stakeholders.

Skills: Python, Pandas, SQL, Tableau, PowerBI, Excel, Statistical Analysis.

Education:
B.Sc Mathematics | Delhi University (2020)
"""
    },
    {
        "filename": "res_10_vikram_cloud.pdf",
        "title": "Vikram Singh - Junior System Admin",
        "content": """Summary: IT professional with 1 year experience in managing local servers and basic AWS cloud setup.

Experience:
IT Admin | TechM (2022 - Present)
- Managed Windows Server and Active Directory for 500+ employees.
- Basic shell scripting for nightly backups.
- Configured basic AWS EC2 instances for internal testing.

Skills: Windows Server, Linux Basics, Shell Scripting, Active Directory, AWS (EC2), Networking.

Education:
Diploma IT | Government Polytechnic (2022)
"""
    }
]

# Write Job descriptions
for filename, text in jds.items():
    with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
        f.write(text)

print(f"✅ Generated {len(jds)} Indian Job Descriptions")

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

print(f"✅ Generated {len(resumes)} Indian PDF Resumes")
print(f"📁 All files saved to: {output_dir}")
