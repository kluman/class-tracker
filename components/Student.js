export default class Student extends HTMLElement {
    static get observedAttributes() { 
      return ['save', 'import']
    }

    constructor () {
      super()

      this.shadow = this.attachShadow({mode: 'open'})
    }

    connectedCallback () {
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
          li {
            margin: 10px;
          }
        </style>
        <div class="student">
          <label for="firstName">Student</label>
          <input id="firstName" name="firstName" type="text" autocomplete="off" placeholder="add name" required>
          <ol class="courses">
          </ol>
          <div class="actions">
            <i class="icon" title="Add Course">playlist_add</i>
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
        
        this.shadow.querySelectorAll('ext-course').forEach(course => {
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
      const coursesElem = this.shadow.querySelector('.courses')
      const courseElem = document.createElement('ext-course')
      const liElem = document.createElement('li')
      liElem.appendChild(courseElem)
      
      coursesElem.appendChild(liElem)
    }
}