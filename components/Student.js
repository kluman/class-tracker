export default class Student extends HTMLElement {
    static get observedAttributes() { 
      return []
    }

    constructor () {
      super()

      this.shadow = this.attachShadow({mode: 'open'})
    }

    connectedCallback () {
      const firstName = this.getAttribute('firstName') || ''

      const template = `
        <style>
          .student {
            margin-bottom: 10px;
          }
          .courses {
            min-height: 50px;
            list-style: none;
            margin: 0;
            border: solid 1px #cdcdcd;
          }
        </style>
        <div class="student">
          <label for="firstName">Student</label>
          <input id="firstName" name="firstName" type="text" autocomplete="off" 
            placeholder="add name" value="${firstName}" tabindex="1" required>
          <div class="courses">
            <slot></slot>
          </div>
          <div class="actions">
            <i class="icon" title="Add Course" tabindex="2">playlist_add</i>
          </div>
        </div>
      `
      
      // Create shadow DOM markup
      this.shadow.innerHTML = template

      // Apply main styles to the shadow dom
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', 'styles/styles.css');
      this.shadow.appendChild(linkElem);

      // Add event hanlders
      this.shadow.querySelector('.actions .icon').addEventListener('click', (e) => {
        this.add()
      })

      this.addEventListener('save', e => {
        const data = {}
        data.firstName = this.shadow.getElementById('firstName').value
        data.courses = []
        
        this.shadow.querySelector('slot').assignedElements().forEach(course => {
          course.dispatchEvent(new CustomEvent('export', {
            detail: response => {
              data.courses.push(response)
            }
          }))
        })

        e.detail(data)
      })
    }

    disconnectedCallback () {
    }

    attributeChangedCallback (name, oldValue, newValue) {
    }

    add () {
      const course = document.createElement('ext-course')
      
      this.appendChild(course)
    }
}