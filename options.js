/**
 * Handles all interaction for the `options.html` page.
 */
import Course from './components/Course.js'
import Student from './components/Student.js'

customElements.define('ext-student', Student)
customElements.define('ext-course', Course)

const addIcon = document.querySelector('.add')
const saveIcon = document.querySelector('.save')
const studentsDiv = document.querySelector('.students')

document.addEventListener('DOMContentLoaded', (e) => {

  addIcon.addEventListener('click', add)
  saveIcon.addEventListener('click', save)

  load()
})

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

  chrome.storage.sync.set({'class-tracker': JSON.stringify(record)}, () => {
    alert('Saved')
    chrome.runtime.sendMessage({refresh: true})
  })
}

function load () {
  chrome.storage.sync.get('class-tracker', data => {
    const record = data['class-tracker']

    if (record) {
      const students = JSON.parse(record)
      students.forEach(student => {
        const studentElem = document.createElement('ext-student')
        studentElem.setAttribute('firstName', student.firstName || '')

        studentsDiv.appendChild(studentElem)

        if (student.courses) {
          student.courses.forEach(course => {
            const courseElem = document.createElement('ext-course')
            courseElem.setAttribute('period', course.period || '')
            courseElem.setAttribute('className', course.className || '')
            courseElem.setAttribute('day', course.day || '')
            courseElem.setAttribute('startTime', course.startTime || '')
            courseElem.setAttribute('endTime', course.endTime || '')

            studentElem.appendChild(courseElem)
          })
        }
      })
    }
  })
}
