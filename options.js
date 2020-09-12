import Course from './components/Course.js'
import Student from './components/Student.js'

customElements.define('ext-student', Student)
customElements.define('ext-course', Course)

const extId = chrome.runtime.id
const addIcon = document.querySelector('.add')
const saveIcon = document.querySelector('.save')
const studentsDiv = document.querySelector('.students')

document.addEventListener('DOMContentLoaded', (e) => {

  addIcon.addEventListener('click', add)
  saveIcon.addEventListener('click', save)


  // window.setInterval(poll, 5000)
  /*
  chrome.notifications.create('fcjkphjfejldlmpkklmcfeoeoipnlacm', {
    type:'basic',message:'hi',title:'test',iconUrl:'./images/get_started16.png'
  }, (e) => { console.log(e) })
  */

  /*
  chrome.notifications.clear('fcjkphjfejldlmpkklmcfeoeoipnlacm')
  */
  
})

function poll () {
  console.log(`poll -> ${new Date()}`)
}

function add () {
  const student = document.createElement('ext-student')
  studentsDiv.append(student)
}

function save () {
  const record = []

  document.querySelectorAll('ext-student').forEach(student => {
    student.dispatchEvent(new CustomEvent('save', {
      detail: response => {
        record.push(response)
      }
    }))
  })

  console.log(record)

  chrome.storage.sync.set({'class-tracker': JSON.stringify(record)}, () => {
    alert('Saved')
  });
}

function load () {
  chrome.storage.sync.get('class-tracker', data => console.log(data['class-tracker']))
}
