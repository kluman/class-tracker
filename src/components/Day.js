import addValidityCheck from './addValidityCheck.js'

/**
 * Defines a Day web component used to hold a Student's set of Courses.
 */
export default class Student extends HTMLElement {
  constructor () {
    super()

    this.shadow = this.attachShadow({mode: 'open'})
  }
  
  connectedCallback () {
    let day = this.getAttribute('day') || ''

    const template = `
      <style>
        .day .inputGroup {
          margin: var(--space-med) 0;
          font-size: 17px;
        }
        .actions {
          display: inline-block;
          background: var(--color-complimentary-light);
          border: solid 1px var(--color-complimentary);
          border-radius: 5px;
          padding: var(--space-sm);
        }
      </style>
      <div class="day">
        <fieldset>
          <legend>Choose the day and add courses</legend>
          <div class="inputGroup">
            <label for="day">Day</label>
            <select id="day" name="day" tabindex="3" required>
              <option value=""></option>
              <option value="1" ${day === '1' ? 'selected' : ''}>Monday</option>
              <option value="2" ${day === '2' ? 'selected' : ''}>Tuesday</option>
              <option value="3" ${day === '3' ? 'selected' : ''}>Wednesday</option>
              <option value="4" ${day === '4' ? 'selected' : ''}>Thursday</option>
              <option value="5" ${day === '5' ? 'selected' : ''}>Friday</option>
              <option value="6" ${day === '6' ? 'selected' : ''}>Saturday</option>
              <option value="0" ${day === '0' ? 'selected' : ''}>Sunday</option>
            </select>
          </div>
          <div class="courses">
            <slot></slot>
          </div>
          <div class="actions">
            <i class="icon add" id="iconAdd" title="Add Course" tabindex="2">add_task</i>
            <i class="icon copy" id="iconCopy" title="Copy Day Course" tabindex="3">content_copy</i>
            <i class="icon delete active" part="delete" id="iconDelete" title="Remove Day and Courses" tabindex="4">delete</i>
            <i class="icon restore" part="restore" tabindex="0" id="iconRestore" title="Restore Day">restore</i>
          </div>
        </fieldset>
      </div>
    `
      
    // Create shadow DOM markup.
    this.shadow.innerHTML = template

    // Apply main styles to the shadow dom
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'styles/components.css');
    this.shadow.appendChild(linkElem);

    // Add event hanlders.
    this.shadow.getElementById('iconAdd').addEventListener('click', () => {      
      this.appendChild(document.createElement('ext-course'))
    })

    this.shadow.getElementById('iconDelete').addEventListener('click', (e) => {
      this.setAttribute('deleted', '')
    })

    this.shadow.getElementById('iconRestore').addEventListener('click', (e) => {
      this.removeAttribute('deleted')
    })

    addValidityCheck(this.shadow.getElementById('day'))

    this.shadow.getElementById('iconCopy').addEventListener('click', () => { 
      const clone = this.cloneNode(true)  
      const day = this   
      this.closest('ext-student').appendChild(clone)

      day.shadow.querySelector('slot').assignedElements().forEach((course, i) => {
        course.shadow.querySelectorAll('input').forEach((input) => {
          const name = input.getAttribute('name')
          clone.shadow.querySelector('slot').assignedElements()[i]
            .shadow.querySelector(`input[name="${name}"]`).value = input.value ? input.value : ''
        })
      })
    })

    this.addEventListener('export', (e) => {
      if (!this.hasAttribute('deleted')) {
        const data = {}
        const day = this.shadow.getElementById('day')
        data.index = day.options[day.selectedIndex].value
        data.courses = []

        this.shadow.querySelector('slot').assignedElements().forEach(course => {
          course.dispatchEvent(new CustomEvent('export', {
            detail: response => {
              data.courses.push(response)
            }
          }))
        })

        e.detail(data)
      }
    })
  }
}
