/**
 * Handles all interaction for the `options.html` page.
 */
import Course from './components/Course.js'
import Day from './components/Day.js'
import Student from './components/Student.js'

customElements.define('ext-student', Student)
customElements.define('ext-day', Day)
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
  const studentElement = document.createElement('ext-student')
  const dayElement = document.createElement('ext-day')
  
  dayElement.appendChild(document.createElement('ext-course'))
  studentElement.appendChild(dayElement)
  studentsDiv.append(studentElement)
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
    document.location = document.location
  })
}

/**
 * If stored data recreates the form using the various web components.
 */
function load () {
  chrome.storage.sync.get('class-tracker', data => {
    const record = data['class-tracker']

    if (record) {
      const students = JSON.parse(record)
      students.forEach(student => {
        const studentElement = document.createElement('ext-student')
        studentElement.setAttribute('firstName', student.firstName || '')

        studentsDiv.appendChild(studentElement)

        student.days.forEach(day => {
          const dayElement = document.createElement('ext-day')
          dayElement.setAttribute('day', day.index)

          studentElement.appendChild(dayElement)

          day.courses.forEach(course => {
            const courseElement = document.createElement('ext-course')
            courseElement.setAttribute('period', course.period || '')
            courseElement.setAttribute('className', course.className || '')
            courseElement.setAttribute('day', course.day || '')
            courseElement.setAttribute('startTime', course.startTime || '')
            courseElement.setAttribute('endTime', course.endTime || '')
            courseElement.setAttribute('displayTime', course.displayTime || '')
            courseElement.setAttribute('triggerTime', course.triggerTime || '')

            dayElement.appendChild(courseElement)
          })
        })
      })
    }
  })
}
