/** 
 * Code to run in Chrome's background that will setup a long poll checking if
 * extension has a course that is about start and sending the user the notification(s).
 * 
 * @see {@link https://developer.chrome.com/extensions/background_pages} 
 * @see {@link https://developer.chrome.com/extensions/api_index}
 */

const timeOffset = 300000 // 5 minutes

/**
 * Sets up alarm event to trigger every minute.
 */
chrome.alarms.create('class-tracker', {
  when: Date.now(),
  periodInMinutes: 1
})

/**
 * Listens for triggered Alarm event and executes check for notifications.
 * 
 * @see {@link https://developer.chrome.com/extensions/alarms}
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'class-tracker') {
    findCourses().then(courses => {
      courses.forEach(course => {
        notify(course.firstName, course.course)
      })
    })
  } else if (alarm.name === 'class-tracker-clear') {
    chrome.notifications.clear(no)
  }
})

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
 * Checks storage for saved data and checks if current time plus the `offsetTime` set. 
 * 
 * @returns {Array} Empty if none found or object(s) of student name and course.
 */
function findCourses () {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('class-tracker', data => {
      const courses = []

      if (data && data["class-tracker"]) {
        const students = JSON.parse(data["class-tracker"])
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

      resolve(courses)
    })
  })
}
