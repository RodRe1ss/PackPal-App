import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

import { getDatabase, ref, onValue, push, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'


const inputEl = document.getElementById('inputEl')
const btnEl = document.getElementById('btnEl')
const packList = document.getElementById('packList')
const container = document.querySelector('.container')
const errorM = document.getElementById('error')
errorM.style.opacity = '0'

const appSettings = {
  databaseURL: 'https://playground-72fbf-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const dataBase = getDatabase(app)
const itemsInDB = ref(dataBase, 'Packing Item')

btnEl.addEventListener('click', () => {
  let inputVal = inputEl.value

  if (inputVal) {
  sendToDbase(inputVal)
  
  clearInput()
  } else {
    errorMessage()
    
    setTimeout(hideError, 2000)
    
  }
})

function errorMessage() {
  inputEl.style.border = '2px solid #c1121f'
  errorM.style.opacity = '1'
}

function hideError() {
  inputEl.style.border = ''
  errorM.style.opacity = '0'
}

onValue(itemsInDB,function(snapshot) {

  if (snapshot.exists()) {
  let itemsArray = Object.entries(snapshot.val())
  
  clearPackList()
  
  for (let i = 0; i < itemsArray.length; i++) {
    let currentItem = itemsArray[i]
    
    renderInput(currentItem)
    }
  } else {
    packList.innerHTML = `<p>No items listed yet...</p>`
    let pEl = container.querySelector('p')

    if (pEl) {
      pEl.style.margin = '20px auto'
      pEl.style.fontSize = '20px'
      pEl.style.color = '#777777'
    }
  }
})


function clearInput() {
  inputEl.value = ''
}

function clearPackList() {
   packList.innerHTML = ''
}

function renderInput(item) {

  let itemId = item[0]
  let itemVal = item[1]

  const listItems = document.createElement('li')
  listItems.textContent = itemVal

  listItems.addEventListener('dblclick', () => {
    let exactLoc = ref(dataBase, `Packing Item/${itemId}`)

    remove(exactLoc)
  })
  
  packList.append(listItems)

  
}

function sendToDbase(value) {
  push(itemsInDB, value)
}