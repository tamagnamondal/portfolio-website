// State Management
let portfolioData = null;
let isAdminMode = false;

// Hashed PIN for admin authentication (SHA-256 hash of 'tamagna2026')
const HASHED_ADMIN_PIN = "ba8138f160dc03adf791db32b713fc97ad2415946a57665b4f98806adf111660";

// Helper function to hash string to hex using Web Crypto API
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Typewriter Effect Variables
const rolesToCycle = [
  "Data Scientist",
  "B.Tech CSE Student",
  "Machine Learning Enthusiast",
  "Problem Solver",
  "Hardware & Software Explorer"
];
let currentRoleIndex = 0;
let currentTextChar = 0;
let isDeletingRole = false;
let typewriterTimer = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadPortfolioData();
  renderAllSections();
  setupScrollEvents();
  startTypewriter();
});

// Load data from localStorage or default configurations
function loadPortfolioData() {
  const localDataStr = localStorage.getItem("tamagna_portfolio_config");
  if (localDataStr) {
    try {
      portfolioData = JSON.parse(localDataStr);
    } catch (e) {
      console.error("Failed to parse local portfolio settings. Restoring defaults.", e);
      portfolioData = { ...DEFAULT_PORTFOLIO_DATA };
    }
  } else {
    // Clone DEFAULT_PORTFOLIO_DATA
    portfolioData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  }
}

// Save data to localStorage and re-render
function saveAndReloadData() {
  localStorage.setItem("tamagna_portfolio_config", JSON.stringify(portfolioData));
  renderAllSections();
}

// Render UI Components
function renderAllSections() {
  renderProfileInfo();
  renderSkills();
  renderProjects();
  renderCertifications();
  renderContactInfo();
  updateAdminUI();
  updateSectionCounts();
}

// Update dashboard stats & count labels
function updateSectionCounts() {
  document.getElementById("stat-count-skills").innerText = portfolioData.skills.length;
  document.getElementById("stat-count-projects").innerText = portfolioData.projects.length;
  document.getElementById("skills-catalogued-num").innerText = portfolioData.skills.length;
}

// Render Profile Details
function renderProfileInfo() {
  const p = portfolioData.profile;
  
  // Tab Title
  document.title = `${p.name} | ${p.title}`;
  
  // Hero section
  document.getElementById("hero-first-name").innerText = p.name.split(" ")[0] || "";
  document.getElementById("hero-last-name").innerText = p.name.split(" ").slice(1).join(" ") || "";
  document.getElementById("hero-system-version").innerText = p.systemName || "SYSTEM_ONLINE // PORTFOLIO_v1.0";
  document.getElementById("hero-title-role").innerText = p.title;
  
  document.getElementById("hero-stat-coords").innerText = `${p.latitude}, ${p.longitude}`;
  document.getElementById("hero-stat-university").innerText = p.university;
  document.getElementById("hero-stat-degree").innerText = p.degree;

  // Coordinate side telemetry
  document.getElementById("telemetry-lat").innerText = p.latitude;
  document.getElementById("telemetry-lon").innerText = p.longitude;
  document.getElementById("telemetry-univ").innerText = p.university.toUpperCase();

  // About bio text
  document.getElementById("about-bio-text").innerText = p.bio;
  document.getElementById("about-status").innerText = p.status;

  // Footer profile info
  document.getElementById("footer-profile-name").innerText = p.name;
  document.getElementById("footer-profile-title").innerText = p.title;
  document.getElementById("footer-copyright-name").innerText = p.name;
  document.getElementById("footer-coords").innerText = `${p.latitude}, ${p.longitude}`;
  document.getElementById("footer-univ-name").innerText = `${p.university}, ${p.location}`;

  // Info blocks
  const infoBlocksContainer = document.getElementById("profile-info-blocks");
  infoBlocksContainer.innerHTML = `
    <!-- Institution Block -->
    <div class="card-dark bullet-card blue-theme">
      <div class="bullet-icon-box">🎓</div>
      <div class="bullet-info">
        <div class="bullet-label">Institution</div>
        <div class="bullet-title">${p.university}</div>
        <div class="bullet-desc">${p.location}</div>
      </div>
    </div>
    
    <!-- Degree Block -->
    <div class="card-dark bullet-card green-theme">
      <div class="bullet-icon-box">📜</div>
      <div class="bullet-info">
        <div class="bullet-label">Degree</div>
        <div class="bullet-title">${p.degree}</div>
        <div class="bullet-desc">${p.degreeDetail}</div>
      </div>
    </div>
    
    <!-- Focus Area Block -->
    <div class="card-dark bullet-card orange-theme">
      <div class="bullet-icon-box">🧠</div>
      <div class="bullet-info">
        <div class="bullet-label">Focus Area</div>
        <div class="bullet-title">${p.focusArea}</div>
        <div class="bullet-desc">${p.focusDetail}</div>
      </div>
    </div>
  `;
}

// Render Skills section
function renderSkills() {
  const container = document.getElementById("skills-container");
  container.innerHTML = "";
  
  if (portfolioData.skills.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: var(--text-secondary); font-family: var(--font-mono);">
        No skills added yet. Visit Admin panel to register skills.
      </div>
    `;
    return;
  }

  // Group by category
  const grouped = {};
  portfolioData.skills.forEach(skill => {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill);
  });

  // Render each category
  for (const category in grouped) {
    const card = document.createElement("div");
    card.className = "card-dark skill-category-card";
    
    let itemsHTML = "";
    grouped[category].forEach(skill => {
      itemsHTML += `
        <div class="skill-item-row editable-area">
          <div class="edit-trigger-overlay">
            <button class="edit-action-btn" onclick="openSkillForm('${skill.id}', event)">✏️</button>
            <button class="edit-action-btn btn-delete" onclick="deleteSkill('${skill.id}', event)">❌</button>
          </div>
          <div class="skill-meta">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-percentage">${skill.level}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" style="width: ${skill.level}%"></div>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <h3 class="skill-category-title">
        <span style="color: var(--accent-purple); font-size: 0.8rem;">⌁</span> ${category}
      </h3>
      <div class="skills-list">
        ${itemsHTML}
      </div>
    `;
    container.appendChild(card);
  }

  // Add "New Skill Card" inside Edit Mode
  const addCard = document.createElement("div");
  addCard.className = "add-new-card";
  addCard.onclick = () => openSkillForm(null);
  addCard.innerHTML = `
    <div class="add-card-content">
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
      <span>ADD NEW SKILL</span>
    </div>
  `;
  container.appendChild(addCard);
}

// Render Projects section
function renderProjects() {
  const container = document.getElementById("projects-container");
  container.innerHTML = "";

  if (portfolioData.projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-secondary); font-family: var(--font-mono);">
        SCANNING FOR PROJECTS... NONE RECORDED.
      </div>
    `;
    return;
  }

  portfolioData.projects.forEach(proj => {
    const card = document.createElement("div");
    card.className = "card-dark project-card editable-area";
    
    // Tag list HTML
    let tagsHTML = "";
    if (proj.tags && Array.isArray(proj.tags)) {
      proj.tags.forEach(t => {
        tagsHTML += `<span class="project-tag">${t}</span>`;
      });
    }

    card.innerHTML = `
      <div class="edit-trigger-overlay">
        <button class="edit-action-btn" onclick="openProjectForm('${proj.id}', event)">✏️ EDIT</button>
        <button class="edit-action-btn btn-delete" onclick="deleteProject('${proj.id}', event)">❌ DELETE</button>
      </div>
      
      <div class="project-icon-row">
        <div class="project-folder-icon">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
        </div>
        <div class="project-links">
          ${proj.github ? `
            <a class="project-link-item" href="${proj.github}" target="_blank" title="GitHub Code">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path></svg>
            </a>
          ` : ''}
          ${proj.live ? `
            <a class="project-link-item" href="${proj.live}" target="_blank" title="Live Preview">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          ` : ''}
        </div>
      </div>
      
      <h3 class="project-title">${proj.title}</h3>
      <p class="project-desc">${proj.description}</p>
      
      <div class="project-tags">
        ${tagsHTML}
      </div>
    `;
    container.appendChild(card);
  });

  // Add "New Project Card" inside Edit Mode
  const addCard = document.createElement("div");
  addCard.className = "add-new-card";
  addCard.onclick = () => openProjectForm(null);
  addCard.innerHTML = `
    <div class="add-card-content">
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
      <span>ADD NEW PROJECT</span>
    </div>
  `;
  container.appendChild(addCard);
}

// Render Certifications section
function renderCertifications() {
  const container = document.getElementById("certs-container");
  container.innerHTML = "";

  if (portfolioData.certifications.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-secondary); font-family: var(--font-mono);">
        LOADING CERTIFICATIONS... NONE RECORDED.
      </div>
    `;
    return;
  }

  portfolioData.certifications.forEach(cert => {
    const card = document.createElement("div");
    card.className = "card-dark cert-card editable-area";

    card.innerHTML = `
      <div class="edit-trigger-overlay">
        <button class="edit-action-btn" onclick="openCertForm('${cert.id}', event)">✏️</button>
        <button class="edit-action-btn btn-delete" onclick="deleteCert('${cert.id}', event)">❌</button>
      </div>
      
      <div class="cert-badge-box">🎖️</div>
      <div class="cert-info">
        <h3 class="cert-name">${cert.name}</h3>
        <div class="cert-issuer">${cert.issuer}</div>
        <div class="cert-meta-row">
          <span class="cert-date">${cert.date}</span>
          ${cert.link ? `
            <a class="cert-link-btn" href="${cert.link}" target="_blank">
              Verify Link ↗
            </a>
          ` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Add "New Certification Card" inside Edit Mode
  const addCard = document.createElement("div");
  addCard.className = "add-new-card";
  addCard.onclick = () => openCertForm(null);
  addCard.innerHTML = `
    <div class="add-card-content">
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
      <span>ADD CERTIFICATION</span>
    </div>
  `;
  container.appendChild(addCard);
}

// Render Contact information details
function renderContactInfo() {
  const c = portfolioData.contact;
  const p = portfolioData.profile;

  document.getElementById("contact-email-link").innerText = c.email;
  document.getElementById("contact-email-link").href = `mailto:${c.email}`;
  
  document.getElementById("contact-phone-link").innerText = c.phone;
  document.getElementById("contact-phone-link").href = `tel:${c.phone.replace(/\s+/g, '')}`;

  document.getElementById("coord-lat-val").innerText = p.latitude;
  document.getElementById("coord-lon-val").innerText = p.longitude;
  document.getElementById("coord-loc-name").innerText = `// ${p.university}, ${p.location}`;
}

// Navigation scroll animations and toggle effects
function setupScrollEvents() {
  const navbar = document.getElementById("navbar");
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });
}

// Typewriter Cycle logic for Hero Role subhead
function startTypewriter() {
  const target = document.getElementById("hero-title-role");
  
  function type() {
    const fullText = rolesToCycle[currentRoleIndex];
    
    if (isDeletingRole) {
      // Deleting character
      target.innerHTML = `role: <span class="role-value">${fullText.substring(0, currentTextChar)}</span><span style="color: var(--accent-cyan); animation: pulseGlow 0.1s infinite">|</span>`;
      currentTextChar--;
      
      if (currentTextChar < 0) {
        isDeletingRole = false;
        currentRoleIndex = (currentRoleIndex + 1) % rolesToCycle.length;
        typewriterTimer = setTimeout(type, 300);
      } else {
        typewriterTimer = setTimeout(type, 50);
      }
    } else {
      // Typing character
      target.innerHTML = `role: <span class="role-value">${fullText.substring(0, currentTextChar)}</span><span style="color: var(--accent-cyan); animation: pulseGlow 0.1s infinite">|</span>`;
      currentTextChar++;
      
      if (currentTextChar > fullText.length) {
        isDeletingRole = true;
        // Pause at completion before deletion starts
        typewriterTimer = setTimeout(type, 2000);
      } else {
        typewriterTimer = setTimeout(type, 100);
      }
    }
  }
  
  type();
}

// Toast Notifications System
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  
  const toast = document.createElement("div");
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  
  const icon = type === 'error' ? '❌' : '⚡';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  // Remove toast after animation complete
  setTimeout(() => {
    toast.style.animation = "slideInToast 0.3s ease-in reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// Modals management
function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// Admin PIN handling
function handleAdminToggle() {
  if (isAdminMode) {
    // If active, prompt configuration dashboard instead
    openModal("config-modal");
  } else {
    // Otherwise authorize entry
    openModal("pin-modal");
  }
}

async function verifyAdminPIN(event) {
  event.preventDefault();
  const inputPin = document.getElementById("admin-pin").value;
  const hashedInput = await sha256(inputPin);
  
  if (hashedInput === HASHED_ADMIN_PIN) {
    isAdminMode = true;
    closeModal("pin-modal");
    document.getElementById("admin-pin").value = "";
    
    document.body.classList.add("edit-mode");
    document.getElementById("admin-toggle-btn").classList.add("active");
    
    // Change Admin Button Options
    document.getElementById("admin-btn-text").innerHTML = "SETTINGS";
    document.getElementById("telemetry-status").innerHTML = "ADMIN // EDIT_MODE";
    
    // Quick Add Floating Menu link to admin toggle button
    showToast("Authorization Granted. Edit Mode active.");
    saveAndReloadData();
  } else {
    showToast("Authorization Failed. Invalid PIN.", "error");
  }
}

function exitAdminMode() {
  isAdminMode = false;
  document.body.classList.remove("edit-mode");
  document.getElementById("admin-toggle-btn").classList.remove("active");
  document.getElementById("admin-btn-text").innerHTML = "ADMIN";
  document.getElementById("telemetry-status").innerHTML = "ONLINE";
  closeModal("config-modal");
  showToast("Logged out from admin settings.");
  saveAndReloadData();
}

function updateAdminUI() {
  if (isAdminMode) {
    document.body.classList.add("edit-mode");
    document.getElementById("admin-toggle-btn").classList.add("active");
    document.getElementById("admin-btn-text").innerHTML = "SETTINGS";
    document.getElementById("telemetry-status").innerHTML = "ADMIN // EDIT_MODE";
  } else {
    document.body.classList.remove("edit-mode");
    document.getElementById("admin-toggle-btn").classList.remove("active");
    document.getElementById("admin-btn-text").innerHTML = "ADMIN";
    document.getElementById("telemetry-status").innerHTML = "ONLINE";
  }
}

// PROFILE EDITING MANAGEMENT
function openProfileModal(event) {
  if (event) event.stopPropagation();
  if (!isAdminMode) return;
  
  const p = portfolioData.profile;
  const c = portfolioData.contact;

  document.getElementById("edit-prof-name").value = p.name;
  document.getElementById("edit-prof-title").value = p.title;
  document.getElementById("edit-prof-bio").value = p.bio;
  document.getElementById("edit-prof-lat").value = p.latitude;
  document.getElementById("edit-prof-lon").value = p.longitude;
  document.getElementById("edit-prof-locname").value = p.location;
  document.getElementById("edit-prof-univ").value = p.university;
  document.getElementById("edit-prof-degree").value = p.degree;
  document.getElementById("edit-prof-degreedetail").value = p.degreeDetail;
  document.getElementById("edit-prof-focus").value = p.focusArea;
  document.getElementById("edit-prof-focusdetail").value = p.focusDetail;
  
  document.getElementById("edit-contact-email").value = c.email;
  document.getElementById("edit-contact-phone").value = c.phone;
  document.getElementById("edit-contact-github").value = c.githubUrl || "";
  document.getElementById("edit-contact-linkedin").value = c.linkedinUrl || "";

  openModal("profile-modal");
}

function saveProfileData(event) {
  event.preventDefault();
  
  portfolioData.profile.name = document.getElementById("edit-prof-name").value;
  portfolioData.profile.title = document.getElementById("edit-prof-title").value;
  portfolioData.profile.bio = document.getElementById("edit-prof-bio").value;
  portfolioData.profile.latitude = document.getElementById("edit-prof-lat").value;
  portfolioData.profile.longitude = document.getElementById("edit-prof-lon").value;
  portfolioData.profile.location = document.getElementById("edit-prof-locname").value;
  portfolioData.profile.university = document.getElementById("edit-prof-univ").value;
  portfolioData.profile.degree = document.getElementById("edit-prof-degree").value;
  portfolioData.profile.degreeDetail = document.getElementById("edit-prof-degreedetail").value;
  portfolioData.profile.focusArea = document.getElementById("edit-prof-focus").value;
  portfolioData.profile.focusDetail = document.getElementById("edit-prof-focusdetail").value;

  portfolioData.contact.email = document.getElementById("edit-contact-email").value;
  portfolioData.contact.phone = document.getElementById("edit-contact-phone").value;
  portfolioData.contact.githubUrl = document.getElementById("edit-contact-github").value;
  portfolioData.contact.linkedinUrl = document.getElementById("edit-contact-linkedin").value;

  closeModal("profile-modal");
  showToast("Profile data updated successfully.");
  saveAndReloadData();
}

// SKILLS EDITING MANAGEMENT
function openSkillForm(skillId, event) {
  if (event) event.stopPropagation();
  
  const form = document.getElementById("skill-form");
  form.reset();

  if (skillId) {
    document.getElementById("skill-modal-title").innerText = "EDIT SKILL";
    const skill = portfolioData.skills.find(s => s.id === skillId);
    if (skill) {
      document.getElementById("edit-skill-id").value = skill.id;
      document.getElementById("edit-skill-cat").value = skill.category;
      document.getElementById("edit-skill-name").value = skill.name;
      document.getElementById("edit-skill-level").value = skill.level;
    }
  } else {
    document.getElementById("skill-modal-title").innerText = "ADD NEW SKILL";
    document.getElementById("edit-skill-id").value = "";
  }

  openModal("skill-modal");
}

function saveSkillData(event) {
  event.preventDefault();
  
  const id = document.getElementById("edit-skill-id").value;
  const category = document.getElementById("edit-skill-cat").value;
  const name = document.getElementById("edit-skill-name").value;
  const level = parseInt(document.getElementById("edit-skill-level").value);

  if (id) {
    // Edit existing skill
    const skillIndex = portfolioData.skills.findIndex(s => s.id === id);
    if (skillIndex > -1) {
      portfolioData.skills[skillIndex] = { id, name, category, level };
      showToast(`Skill '${name}' updated.`);
    }
  } else {
    // Add new skill
    const newId = "s_" + Date.now();
    portfolioData.skills.push({ id: newId, name, category, level });
    showToast(`New skill '${name}' catalogued.`);
  }

  closeModal("skill-modal");
  saveAndReloadData();
}

function deleteSkill(skillId, event) {
  if (event) event.stopPropagation();
  
  const skill = portfolioData.skills.find(s => s.id === skillId);
  if (!skill) return;

  if (confirm(`Are you sure you want to delete '${skill.name}' skill?`)) {
    portfolioData.skills = portfolioData.skills.filter(s => s.id !== skillId);
    showToast(`Skill '${skill.name}' deleted.`);
    saveAndReloadData();
  }
}

// PROJECTS EDITING MANAGEMENT
function openProjectForm(projId, event) {
  if (event) event.stopPropagation();

  const form = document.getElementById("project-form");
  form.reset();

  if (projId) {
    document.getElementById("project-modal-title").innerText = "EDIT PROJECT";
    const proj = portfolioData.projects.find(p => p.id === projId);
    if (proj) {
      document.getElementById("edit-proj-id").value = proj.id;
      document.getElementById("edit-proj-title").value = proj.title;
      document.getElementById("edit-proj-desc").value = proj.description;
      document.getElementById("edit-proj-tags").value = proj.tags.join(", ");
      document.getElementById("edit-proj-github").value = proj.github || "";
      document.getElementById("edit-proj-live").value = proj.live || "";
    }
  } else {
    document.getElementById("project-modal-title").innerText = "ADD NEW PROJECT";
    document.getElementById("edit-proj-id").value = "";
  }

  openModal("project-modal");
}

function saveProjectData(event) {
  event.preventDefault();

  const id = document.getElementById("edit-proj-id").value;
  const title = document.getElementById("edit-proj-title").value;
  const description = document.getElementById("edit-proj-desc").value;
  const tagsStr = document.getElementById("edit-proj-tags").value;
  const github = document.getElementById("edit-proj-github").value;
  const live = document.getElementById("edit-proj-live").value;

  const tags = tagsStr.split(",").map(t => t.trim()).filter(t => t.length > 0);

  if (id) {
    // Edit existing project
    const projIndex = portfolioData.projects.findIndex(p => p.id === id);
    if (projIndex > -1) {
      portfolioData.projects[projIndex] = { id, title, description, tags, github, live };
      showToast(`Project '${title}' saved.`);
    }
  } else {
    // Add new project
    const newId = "p_" + Date.now();
    portfolioData.projects.push({ id: newId, title, description, tags, github, live });
    showToast(`New project '${title}' added.`);
  }

  closeModal("project-modal");
  saveAndReloadData();
}

function deleteProject(projId, event) {
  if (event) event.stopPropagation();

  const proj = portfolioData.projects.find(p => p.id === projId);
  if (!proj) return;

  if (confirm(`Are you sure you want to delete '${proj.title}' project?`)) {
    portfolioData.projects = portfolioData.projects.filter(p => p.id !== projId);
    showToast(`Project '${proj.title}' deleted.`);
    saveAndReloadData();
  }
}

// CERTIFICATIONS EDITING MANAGEMENT
function openCertForm(certId, event) {
  if (event) event.stopPropagation();

  const form = document.getElementById("cert-form");
  form.reset();

  if (certId) {
    document.getElementById("cert-modal-title").innerText = "EDIT CERTIFICATION";
    const cert = portfolioData.certifications.find(c => c.id === certId);
    if (cert) {
      document.getElementById("edit-cert-id").value = cert.id;
      document.getElementById("edit-cert-name").value = cert.name;
      document.getElementById("edit-cert-issuer").value = cert.issuer;
      document.getElementById("edit-cert-date").value = cert.date;
      document.getElementById("edit-cert-link").value = cert.link || "";
    }
  } else {
    document.getElementById("cert-modal-title").innerText = "ADD CERTIFICATION";
    document.getElementById("edit-cert-id").value = "";
  }

  openModal("cert-modal");
}

function saveCertData(event) {
  event.preventDefault();

  const id = document.getElementById("edit-cert-id").value;
  const name = document.getElementById("edit-cert-name").value;
  const issuer = document.getElementById("edit-cert-issuer").value;
  const date = document.getElementById("edit-cert-date").value;
  const link = document.getElementById("edit-cert-link").value;

  if (id) {
    // Edit existing certification
    const certIndex = portfolioData.certifications.findIndex(c => c.id === id);
    if (certIndex > -1) {
      portfolioData.certifications[certIndex] = { id, name, issuer, date, link };
      showToast("Certification saved.");
    }
  } else {
    // Add new certification
    const newId = "c_" + Date.now();
    portfolioData.certifications.push({ id: newId, name, issuer, date, link });
    showToast("Certification registered.");
  }

  closeModal("cert-modal");
  saveAndReloadData();
}

function deleteCert(certId, event) {
  if (event) event.stopPropagation();

  const cert = portfolioData.certifications.find(c => c.id === certId);
  if (!cert) return;

  if (confirm(`Are you sure you want to delete '${cert.name}'?`)) {
    portfolioData.certifications = portfolioData.certifications.filter(c => c.id !== certId);
    showToast("Certification deleted.");
    saveAndReloadData();
  }
}

// CONTACT FORM SUBMISSIONS & LOGGER
function handleContactSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById("form-name").value;
  const email = document.getElementById("form-email").value;
  const message = document.getElementById("form-message").value;
  const timestamp = new Date().toISOString();

  // Create message payload
  const payload = {
    id: "msg_" + Date.now(),
    name,
    email,
    message,
    timestamp
  };

  // Get messages log queue
  let messagesQueue = [];
  const existingQueueStr = localStorage.getItem("tamagna_portfolio_messages");
  if (existingQueueStr) {
    try {
      messagesQueue = JSON.parse(existingQueueStr);
    } catch(e) {
      messagesQueue = [];
    }
  }

  messagesQueue.push(payload);
  localStorage.setItem("tamagna_portfolio_messages", JSON.stringify(messagesQueue));

  // Reset form
  document.getElementById("portfolio-contact-form").reset();
  
  showToast("Message transmitted successfully!");
  
  // If admin mode is active, alert them about new messages queue update
  if (isAdminMode) {
    showToast("New message logged in settings dashboard.");
  }
}

// Message panel loading
function openMessagesPanel() {
  closeModal("config-modal");
  const container = document.getElementById("messages-queue-container");
  container.innerHTML = "";

  let messagesQueue = [];
  const existingQueueStr = localStorage.getItem("tamagna_portfolio_messages");
  if (existingQueueStr) {
    try {
      messagesQueue = JSON.parse(existingQueueStr);
    } catch(e) {
      messagesQueue = [];
    }
  }

  // Reverse list so newest are on top
  messagesQueue.reverse();

  if (messagesQueue.length === 0) {
    container.innerHTML = `<div class="msg-empty-text">No messages received yet.</div>`;
  } else {
    let listHTML = `<div class="msg-list">`;
    messagesQueue.forEach(msg => {
      const formattedDate = new Date(msg.timestamp).toLocaleString();
      listHTML += `
        <div class="msg-card">
          <div class="msg-meta-row">
            <span class="msg-sender-name">${msg.name} (${msg.email})</span>
            <span>${formattedDate}</span>
          </div>
          <div class="msg-text">${msg.message}</div>
        </div>
      `;
    });
    listHTML += `</div>`;
    container.innerHTML = listHTML;
  }

  openModal("messages-modal");
}

function clearAllMessages() {
  if (confirm("Are you sure you want to clear all message logs?")) {
    localStorage.removeItem("tamagna_portfolio_messages");
    showToast("Message logs cleared.");
    openMessagesPanel(); // Refresh
  }
}

// BACKUP & EXPORT MANAGEMENT
function exportDataToFile() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `portfolio_config_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("JSON file downloaded.");
}

function copyDataToClipboard() {
  const jsonStr = JSON.stringify(portfolioData, null, 2);
  const declarationStr = `const DEFAULT_PORTFOLIO_DATA = ${jsonStr};`;
  
  navigator.clipboard.writeText(declarationStr).then(() => {
    showToast("Code content copied. Paste into 'data.js' to overwrite defaults.");
  }).catch(err => {
    console.error("Failed to copy text", err);
    showToast("Clipboard copy failed. View console logs.", "error");
  });
}

function importDataFromFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Basic structure validation check
      if (importedData.profile && importedData.skills && importedData.projects && importedData.certifications && importedData.contact) {
        portfolioData = importedData;
        saveAndReloadData();
        closeModal("config-modal");
        showToast("Configurations imported successfully.");
      } else {
        showToast("Invalid JSON. Missing required fields.", "error");
      }
    } catch(err) {
      showToast("Failed to parse JSON file.", "error");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function resetDataToDefaults() {
  if (confirm("This will overwrite all customized settings and restore defaults. Proceed?")) {
    localStorage.removeItem("tamagna_portfolio_config");
    loadPortfolioData();
    renderAllSections();
    closeModal("config-modal");
    showToast("Configurations reset to codebase defaults.");
  }
}

// Add shortcut in config Modal to open messages
const configModalBody = document.querySelector("#config-modal .modal-body");
if (configModalBody) {
  const messagesShortcutDiv = document.createElement("div");
  messagesShortcutDiv.innerHTML = `
    <hr style="border: 0; border-top: 1px solid rgba(0, 212, 255, 0.1); margin-top: 1.5rem;" />
    <div style="margin-top: 1.5rem;">
      <div style="color: var(--accent-green); font-family: var(--font-mono); font-weight: 700; margin-bottom: 0.5rem;">[4] VISITOR INBOX MESSAGES</div>
      <p style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">View and manage messages sent by visitors through the contact form.</p>
      <button class="btn btn-primary" style="border-color: var(--accent-green); color: var(--accent-green);" onclick="openMessagesPanel()">OPEN INBOX</button>
    </div>
  `;
  configModalBody.appendChild(messagesShortcutDiv);
}

// Add a logout/save button to the config modal footer
const configModalFooter = document.querySelector("#config-modal .modal-footer");
if (configModalFooter) {
  configModalFooter.innerHTML = `
    <button class="btn btn-outline" style="border-color: var(--accent-orange); color: var(--accent-orange);" onclick="exitAdminMode()">EXIT EDIT MODE</button>
    <button class="btn btn-outline" onclick="closeModal('config-modal')">CLOSE</button>
  `;
}
