// ===================================
//   Baby Tracker - Single Webhook Flow
//   Configure your webhook URL below
// ===================================

// CONFIGURATION: Your webhook URL
const WEBHOOK_URL = 'https://atm.guitarjkp.me/webhook/windmill-tracker'

// State Management
let selectedAmount = null
let selectedDiaperType = null

// DOM Elements
const greetingIcon = document.getElementById('greetingIcon')
const greetingText = document.getElementById('greetingText')
const timeDisplay = document.getElementById('timeDisplay')
const amountButtons = document.querySelectorAll('.amount-btn')
const customBtn = document.getElementById('customBtn')
const customInputWrapper = document.getElementById('customInputWrapper')
const customAmountInput = document.getElementById('customAmountInput')
const customConfirm = document.getElementById('customConfirm')
const diaperButtons = document.querySelectorAll('.diaper-btn')
const selectionSummary = document.getElementById('selectionSummary')
const summaryText = document.getElementById('summaryText')
const saveBtn = document.getElementById('saveBtn')
const toast = document.getElementById('toast')
const toastIcon = document.getElementById('toastIcon')
const toastText = document.getElementById('toastText')

// ===================================
// INITIALIZATION
// ===================================

function init() {
  updateGreeting()
  updateTime()
  registerServiceWorker()
  setupEventListeners()

  // Update time every minute
  setInterval(updateTime, 60000)
  // Update greeting every hour
  setInterval(updateGreeting, 3600000)
}

// Update greeting based on time of day
function updateGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    greetingIcon.textContent = '☀️'
    greetingText.textContent = 'Good morning, Mama'
  } else if (hour >= 12 && hour < 17) {
    greetingIcon.textContent = '🌤️'
    greetingText.textContent = 'Good afternoon, Mama'
  } else if (hour >= 17 && hour < 21) {
    greetingIcon.textContent = '🌅'
    greetingText.textContent = 'Good evening, Mama'
  } else {
    greetingIcon.textContent = '🌙'
    greetingText.textContent = 'Good night, Mama'
  }
}

// Update time display
function updateTime() {
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
  timeDisplay.textContent = `${timeString} • ${dateString}`
}

// Register Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/windmill-tracker/sw.js', {
        scope: '/windmill-tracker/'
      })
      console.log('✓ Service Worker registered')
    } catch (error) {
      console.error('✗ Service Worker registration failed:', error)
    }
  }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
  // Amount button clicks
  amountButtons.forEach(btn => {
    btn.addEventListener('click', handleAmountClick)
  })

  // Custom amount button
  customBtn.addEventListener('click', toggleCustomInput)

  // Custom amount confirm
  customConfirm.addEventListener('click', confirmCustomAmount)

  // Custom amount input - Enter key
  customAmountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      confirmCustomAmount()
    }
  })

  // Diaper button clicks
  diaperButtons.forEach(btn => {
    btn.addEventListener('click', handleDiaperClick)
  })

  // Save button click
  saveBtn.addEventListener('click', handleSave)
}

// ===================================
// FEEDING AMOUNT HANDLERS
// ===================================

function handleAmountClick(e) {
  const btn = e.currentTarget
  const amount = parseInt(btn.dataset.amount)

  // If clicking the same button, deselect it
  if (selectedAmount === amount) {
    selectedAmount = null
    btn.classList.remove('selected')
  } else {
    // Deselect all amount buttons
    amountButtons.forEach(b => b.classList.remove('selected'))

    // Select this button
    selectedAmount = amount
    btn.classList.add('selected')
  }

  // Hide custom input if visible
  if (customInputWrapper.classList.contains('active')) {
    customInputWrapper.classList.remove('active')
    customBtn.classList.remove('selected')
    customAmountInput.value = ''
  }

  updateUI()
}

function toggleCustomInput() {
  const isActive = customInputWrapper.classList.contains('active')

  if (isActive) {
    // Hide custom input
    customInputWrapper.classList.remove('active')
    customBtn.classList.remove('selected')
    customAmountInput.value = ''
    selectedAmount = null
  } else {
    // Show custom input
    customInputWrapper.classList.add('active')
    customBtn.classList.add('selected')

    // Deselect all amount buttons
    amountButtons.forEach(b => b.classList.remove('selected'))
    selectedAmount = null

    // Focus input
    setTimeout(() => customAmountInput.focus(), 100)
  }

  updateUI()
}

function confirmCustomAmount() {
  const value = parseFloat(customAmountInput.value)

  if (!value || value < 0.5 || value > 20) {
    showToast('Please enter a valid amount (0.5-20oz)', true)
    return
  }

  selectedAmount = value
  customInputWrapper.classList.remove('active')
  customBtn.classList.add('selected')

  updateUI()
}

// ===================================
// DIAPER TYPE HANDLERS
// ===================================

function handleDiaperClick(e) {
  const btn = e.currentTarget
  const type = btn.dataset.type

  // If clicking the same button, deselect it
  if (selectedDiaperType === type) {
    selectedDiaperType = null
    btn.classList.remove('selected')
  } else {
    // Deselect all diaper buttons
    diaperButtons.forEach(b => b.classList.remove('selected'))

    // Select this button
    selectedDiaperType = type
    btn.classList.add('selected')
  }

  updateUI()
}

// ===================================
// UI UPDATE
// ===================================

function updateUI() {
  updateSummary()
  updateSaveButton()
}

function updateSummary() {
  const hasSelection = selectedAmount !== null || selectedDiaperType !== null

  if (!hasSelection) {
    selectionSummary.classList.remove('has-selection')
    summaryText.textContent = 'Select feeding or diaper to continue'
    return
  }

  selectionSummary.classList.add('has-selection')

  // Build summary text
  let summary = []

  if (selectedAmount !== null) {
    summary.push(`🍼 ${selectedAmount}oz`)
  }

  if (selectedDiaperType !== null) {
    const typeEmoji = {
      'pee': '💧 Pee',
      'poop': '💩 Poop',
      'both': '💧💩 Both'
    }
    summary.push(typeEmoji[selectedDiaperType])
  }

  summaryText.textContent = summary.join(' + ')
}

function updateSaveButton() {
  const hasSelection = selectedAmount !== null || selectedDiaperType !== null
  saveBtn.disabled = !hasSelection
}

// ===================================
// SAVE & WEBHOOK
// ===================================

async function handleSave() {
  if (selectedAmount === null && selectedDiaperType === null) {
    return
  }

  // Show loading state
  saveBtn.classList.add('loading')
  saveBtn.disabled = true

  // Build entry payload
  const entry = {
    timestamp: new Date().toISOString()
  }

  // Add feeding data if selected
  if (selectedAmount !== null) {
    entry.feeding = {
      amount: selectedAmount,
      unit: 'oz'
    }
  }

  // Add diaper data if selected
  if (selectedDiaperType !== null) {
    entry.diaper = {
      type: selectedDiaperType
    }
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Success!
    showToast('Saved successfully! ✨', false)
    resetForm()

  } catch (error) {
    console.error('Error saving entry:', error)
    showToast('Failed to save. Check internet connection.', true)

    // Remove loading state but keep button enabled to retry
    saveBtn.classList.remove('loading')
    saveBtn.disabled = false
  }
}

// ===================================
// TOAST NOTIFICATION
// ===================================

function showToast(message, isError = false) {
  // Update toast content
  toastText.textContent = message

  if (isError) {
    toast.classList.add('error')
    toastIcon.textContent = '✗'
  } else {
    toast.classList.remove('error')
    toastIcon.textContent = '✓'
  }

  // Show toast
  toast.classList.add('show')

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show')
  }, 3000)
}

// ===================================
// FORM RESET
// ===================================

function resetForm() {
  // Clear selections
  selectedAmount = null
  selectedDiaperType = null

  // Remove all selected classes
  amountButtons.forEach(btn => btn.classList.remove('selected'))
  diaperButtons.forEach(btn => btn.classList.remove('selected'))
  customBtn.classList.remove('selected')

  // Hide custom input
  if (customInputWrapper.classList.contains('active')) {
    customInputWrapper.classList.remove('active')
  }
  customAmountInput.value = ''

  // Update UI
  updateUI()

  // Remove loading state
  saveBtn.classList.remove('loading')
}

// ===================================
// START THE APP
// ===================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
