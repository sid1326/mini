// Global variables
let currentUser = null
const papers = []

// Page navigation
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => (page.style.display = "none"))
  document.getElementById(pageId).style.display = "block"
}

function showDashboard() {
  showPage("dashboard-page")
  updateDashboard()
}

function showGeneratePage() {
  showPage("generate-page")
}

// Authentication
function login() {
  const email = document.querySelector('#login-form input[type="email"]').value
  const password = document.querySelector('#login-form input[type="password"]').value

  // Simulate login (replace with actual API call)
  if (email && password) {
    currentUser = { email: email }
    showDashboard()
  } else {
    alert("Please enter valid credentials")
  }
}

function register() {
  const name = document.querySelector('#register-form input[type="text"]').value
  const email = document.querySelector('#register-form input[type="email"]').value
  const password = document.querySelector('#register-form input[type="password"]').value
  const confirmPassword = document.querySelector('#register-form input[type="password"]:last-child').value

  // Simulate registration (replace with actual API call)
  if (name && email && password && password === confirmPassword) {
    currentUser = { email: email }
    showDashboard()
  } else {
    alert("Please fill all fields and ensure passwords match")
  }
}

function logout() {
  currentUser = null
  showPage("auth-page")
}

// Dashboard
function updateDashboard() {
  document.getElementById("total-papers").textContent = papers.length
  document.getElementById("completed-papers").textContent = papers.filter((p) => p.status === "completed").length
  document.getElementById("in-progress-papers").textContent = papers.filter((p) => p.status === "in-progress").length

  const papersList = document.getElementById("papers-list")
  papersList.innerHTML = ""
  papers.forEach((paper) => {
    const paperElement = document.createElement("div")
    paperElement.className = "card"
    paperElement.innerHTML = `
            <h3>${paper.title}</h3>
            <p>Status: ${paper.status}</p>
            <button class="btn" onclick="viewPaper(${paper.id})">View</button>
            ${paper.status === "completed" ? `<button class="btn primary" onclick="downloadPaper(${paper.id})">Download</button>` : ""}
        `
    papersList.appendChild(paperElement)
  })
}

// Paper generation
function generatePaper() {
  const topic = document.getElementById("paper-topic").value
  const keywords = document.getElementById("paper-keywords").value
  const paperType = document.getElementById("paper-type").value
  const notes = document.getElementById("paper-notes").value

  if (!topic) {
    alert("Please enter a paper topic")
    return
  }

  // Simulate paper generation (replace with actual API call)
  const newPaper = {
    id: papers.length + 1,
    title: topic,
    status: "in-progress",
    keywords: keywords,
    type: paperType,
    notes: notes,
  }
  papers.push(newPaper)

  showPage("processing-page")
  simulateProcessing(newPaper.id)
}

// Processing simulation
function simulateProcessing(paperId) {
  let progress = 0
  const stages = [
    "Initializing",
    "Analyzing Topic",
    "Gathering Research",
    "Generating Content",
    "Adding Citations",
    "Final Formatting",
  ]
  const steps = [
    "Topic analysis",
    "Research gathering",
    "Content generation",
    "Citations and references",
    "Formatting and final review",
  ]

  const progressIndicator = document.getElementById("progress-indicator")
  const progressText = document.getElementById("progress-text")
  const currentStage = document.getElementById("current-stage")
  const timeElapsed = document.getElementById("time-elapsed")
  const processingSteps = document.getElementById("processing-steps")

  steps.forEach((step) => {
    const li = document.createElement("li")
    li.textContent = step
    processingSteps.appendChild(li)
  })

  const startTime = Date.now()

  const interval = setInterval(() => {
    progress += Math.random() * 2
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
      papers.find((p) => p.id === paperId).status = "completed"
      showPage("success-page")
    }

    progressIndicator.style.width = `${progress}%`
    progressText.textContent = `${Math.round(progress)}%`

    const stageIndex = Math.min(Math.floor(progress / (100 / stages.length)), stages.length - 1)
    currentStage.textContent = stages[stageIndex]

    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    timeElapsed.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    const completedSteps = Math.floor(progress / 20)
    processingSteps.querySelectorAll("li").forEach((li, index) => {
      if (index < completedSteps) {
        li.style.color = "green"
        li.textContent = `✓ ${li.textContent}`
      }
    })
  }, 100)
}

// Paper actions
function viewPaper(paperId) {
  const paper = papers.find((p) => p.id === paperId)
  alert(`Viewing paper: ${paper.title}`)
  // Implement actual paper viewing logic
}

function downloadPaper(paperId) {
  const paper = papers.find((p) => p.id === paperId)
  alert(`Downloading paper: ${paper.title}`)
  // Implement actual paper download logic
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")
      if (tab.dataset.tab === "login") {
        document.getElementById("login-form").style.display = "block"
        document.getElementById("register-form").style.display = "none"
      } else {
        document.getElementById("login-form").style.display = "none"
        document.getElementById("register-form").style.display = "block"
      }
    })
  })

  // Initial page load
  showPage("auth-page")
})

