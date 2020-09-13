/** 
 * Code to run in Chrome's background that will setup a long poll checking if
 * extension has a course that is about start and sending the user the notification(s).
 * 
 * @see {@link https://developer.chrome.com/extensions/background_pages} 
 * @see {@link https://developer.chrome.com/extensions/api_index}
 */

const timeOffset = 300000 // 5 minutes
let record = undefined

/**
 * Updates the `record` variable with storage value. 
 */
function refresh () {
  chrome.storage.sync.get('class-tracker', data => {
    record = data['class-tracker']
  })
}

/**
 * Sends a Notification to the user that a course is about to begin.
 * 
 * @param {string} name The student name.
 * @param {object} course A JSON object of a Course.
 * @see {@link https://developer.chrome.com/extensions/notifications}
 */
function notify (name, course) {
  const title = `Class Tracker / ${name}`
  const message = `${course.className} starts at ${course.startTime}`

  chrome.notifications.create(name, {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: './images/get_started16.png'
  }, (e) => { 
    clear(name) 
  })
}

/**
 * Closes the Notification sent to the user.
 * 
 * @param {string} notificationId Identifier, usually the student name, of the Notification.
 * @see {@link https://developer.chrome.com/extensions/notifications}
 */
function clear (notificationId) {
  setTimeout(() => {
    chrome.notifications.clear(notificationId, () => {})
  }, 15000)
}

/**
 * Pads a number with a '0' if only a single digit.
 * 
 * @param {number} num 
 */
function pad (num) {
    return num.toString().padStart(2, '0')
}

/**
 * Scans the `record` checking to see if any course start times match the
 * current time plus the `offsetTime` set. 
 * 
 * @returns {Array} Empty if none found or object(s) of student name and course.
 */
function findCourses () {
  const courses = []

  if (record) {
    const students = JSON.parse(record)
    const now = new Date()
    now.setMilliseconds(now.getMilliseconds() + timeOffset)
    
    const offsetHour = pad(now.getHours())
    const offsetMin = pad(now.getMinutes())
    const offsetDay = now.getDay().toString()
    
    students.forEach(student => {
      if (student.courses) {
        student.courses.forEach(course => {
          if (course.startTime && course.day) {
            const [ hour, minutes ] = course.startTime.split(':')
            if ((course.day === offsetDay) && (minutes === offsetMin) && (hour === offsetHour)) {
              courses.push({'firstName': student.firstName, 'course': course})
            }
          }
        })
      }
    })  
  }

  return courses
}

/**
 * Do intial setup when extension is installed.
 */
chrome.runtime.onInstalled.addListener(() => {

    // Every minute run check to see if courses are about to begin.
    window.setInterval(() => {
      findCourses().forEach(course => {
        notify(course.firstName, course.course)
      })
    }, 60000)

})

/**
 * Listens for message events coming from other parts of the extension.
 * 
 * @see {@link https://developer.chrome.com/extensions/messaging}
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.refresh) {
    refresh()
  }
})
