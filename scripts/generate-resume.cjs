/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require("puppeteer-core");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      font-size: 10.5pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 48px;
    }

    /* ── Header ── */
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid #111;
    }

    .header h1 {
      font-size: 28pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #111;
      margin-bottom: 6px;
    }

    .header .subtitle {
      font-size: 11pt;
      font-weight: 500;
      color: #555;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .header .contact-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 9.5pt;
      color: #444;
    }

    .header .contact-row a {
      color: #444;
      text-decoration: none;
    }

    .header .contact-row span {
      color: #bbb;
    }

    /* ── Sections ── */
    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #111;
      border-bottom: 1.5px solid #ddd;
      padding-bottom: 5px;
      margin-bottom: 12px;
    }

    /* ── Experience ── */
    .exp-item {
      margin-bottom: 14px;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }

    .exp-role {
      font-weight: 700;
      font-size: 11pt;
      color: #111;
    }

    .exp-period {
      font-size: 9.5pt;
      color: #777;
      font-weight: 500;
    }

    .exp-company {
      font-size: 10pt;
      color: #555;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .exp-desc {
      font-size: 9.5pt;
      color: #444;
      line-height: 1.55;
    }

    .exp-desc li {
      margin-bottom: 2px;
      margin-left: 16px;
    }

    /* ── Skills ── */
    .skills-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 6px 16px;
      font-size: 9.5pt;
    }

    .skills-grid .label {
      font-weight: 600;
      color: #333;
    }

    .skills-grid .value {
      color: #555;
    }

    /* ── Education ── */
    .edu-item {
      margin-bottom: 10px;
    }

    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .edu-degree {
      font-weight: 700;
      font-size: 10.5pt;
      color: #111;
    }

    .edu-period {
      font-size: 9.5pt;
      color: #777;
    }

    .edu-school {
      font-size: 10pt;
      color: #555;
    }

    /* ── Projects ── */
    .project-item {
      margin-bottom: 10px;
    }

    .project-name {
      font-weight: 700;
      font-size: 10.5pt;
      color: #111;
    }

    .project-tag {
      font-size: 9pt;
      color: #777;
      font-weight: 500;
    }

    .project-desc {
      font-size: 9.5pt;
      color: #444;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <h1>Jibran Sarwar</h1>
      <div class="subtitle">Full-Stack Developer · AI Architect</div>
      <div class="contact-row">
        <span>devjibran0@gmail.com</span>
        <span>|</span>
        <span>+92 355 5123929</span>
        <span>|</span>
        <span>github.com/jibran-jpeg</span>
        <span>|</span>
        <span>Islamabad, Pakistan</span>
      </div>
    </div>

    <!-- Professional Summary -->
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="exp-desc">
        Versatile full-stack developer and AI architect with hands-on experience integrating OpenAI GPT, Google Gemini, and Anthropic Claude APIs into production applications. 
        Proficient in Python, C++, C, JavaScript/TypeScript ecosystems including React, Next.js, Three.js and Node.js. 
        Built Chrome Extensions, AI-powered automation tools, and deployed scalable solutions on AWS. Currently pursuing BS Computer Science at SZABIST while freelancing and co-founding an AI-driven software house.
      </p>
    </div>

    <!-- Experience -->
    <div class="section">
      <div class="section-title">Experience</div>

      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-role">Web Development Intern</span>
          <span class="exp-period">2025</span>
        </div>
        <div class="exp-company">ESQUAL · Islamabad, PK</div>
        <ul class="exp-desc">
          <li>Worked on full-stack web development projects, building responsive frontends with React and Node.js backends</li>
          <li>Gained hands-on experience with AWS deployment, CI/CD pipelines and cloud infrastructure</li>
          <li>Collaborated on industry-level projects following professional software development practices</li>
          <li>Worked with technologies including React, Node.js, Three.js, and AWS services</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-role">AI & Full-Stack Freelancer</span>
          <span class="exp-period">2025 – Present</span>
        </div>
        <div class="exp-company">Fiverr & Local Clients · Global & Pakistan</div>
        <ul class="exp-desc">
          <li>Developing and deploying AI Chatbots and AI Voice Calling systems using GPT, Gemini & Claude APIs for global Fiverr clients</li>
          <li>Building complex n8n automation workflows connecting AI agents with CRMs, databases, and social media</li>
          <li>Handling local clients in Pakistan for web development and AI automation solutions</li>
          <li>Delivering premium web interfaces with modern UI aesthetics (Glassmorphism, Neumorphism)</li>
        </ul>
      </div>
    </div>

    <!-- Technical Skills -->
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <div class="skills-grid">
        <span class="label">Languages</span>
        <span class="value">Python, C++, C, JavaScript, TypeScript</span>

        <span class="label">Frontend</span>
        <span class="value">React, Next.js, Three.js, Flutter, Tailwind CSS, HTML5, CSS3</span>

        <span class="label">Backend</span>
        <span class="value">Node.js, Express.js, Supabase, Firebase, PostgreSQL</span>

        <span class="label">AI & APIs</span>
        <span class="value">OpenAI GPT API, Google Gemini API, Anthropic Claude API, n8n Workflows, AI Voice Agents, Ollama, Agentic AI</span>

        <span class="label">Cloud & DevOps</span>
        <span class="value">AWS (EC2, S3, Lambda), CI/CD Pipelines, Git, GitHub Actions</span>

        <span class="label">Design</span>
        <span class="value">Figma, Glassmorphism, Neumorphism, UI/UX Design, Responsive Design</span>
      </div>
    </div>

    <!-- Projects -->
    <div class="section">
      <div class="section-title">Key Projects</div>

      <div class="project-item">
        <div class="exp-header">
          <span class="project-name">GeoLead — Maps Lead Finder</span>
          <span class="project-tag">Chrome Extension</span>
        </div>
        <p class="project-desc">Built a Google Chrome Extension that scrapes Google Maps for business leads by location, extracting contacts, emails, and phone numbers with automated scrolling and smart deduplication.</p>
      </div>

      <div class="project-item">
        <div class="exp-header">
          <span class="project-name">AI Voice & Chat Integration</span>
          <span class="project-tag">AI & Automation</span>
        </div>
        <p class="project-desc">Built and deployed autonomous AI agents using GPT, Gemini & Claude APIs, capable of handling calls and chats, integrated with backend systems via n8n for real-time data processing.</p>
      </div>

      <div class="project-item">
        <div class="exp-header">
          <span class="project-name">The Skardu Basket</span>
          <span class="project-tag">Full-Stack Web</span>
        </div>
        <p class="project-desc">Developed a premium e-commerce interface focusing on modern aesthetic design patterns including Glassmorphism and Neumorphism, with React and Node.js backend.</p>
      </div>

      <div class="project-item">
        <div class="exp-header">
          <span class="project-name">Portfolio Website</span>
          <span class="project-tag">Three.js & Next.js</span>
        </div>
        <p class="project-desc">Built an immersive portfolio with Three.js scrollytelling animation, deployed on AWS with Next.js and Framer Motion.</p>
      </div>
    </div>

    <!-- Education -->
    <div class="section">
      <div class="section-title">Education</div>

      <div class="edu-item">
        <div class="edu-header">
          <span class="edu-degree">BS Computer Science</span>
          <span class="edu-period">In Progress</span>
        </div>
        <div class="edu-school">SZABIST · Islamabad</div>
      </div>

      <div class="edu-item">
        <div class="edu-header">
          <span class="edu-degree">Higher Secondary Education</span>
        </div>
        <div class="edu-school">Public School and College · Skardu, Gilgit-Baltistan</div>
      </div>
    </div>

  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputPath = path.join(__dirname, "..", "public", "resume.pdf");

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "0mm", right: "0mm" },
  });

  console.log(`✅ Resume PDF generated at: ${outputPath}`);
  await browser.close();
})();
