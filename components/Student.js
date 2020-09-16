/**
 * Defines a Student web component.
 */
export default class Student extends HTMLElement {

    constructor () {
      super()

      this.shadow = this.attachShadow({mode: 'open'})
    }

    connectedCallback () {
      let firstName = this.getAttribute('firstName') || ''

      const template = `
        <style>
          .days {
            margin-top: var(--space-med);
          }
        </style>
        <div class="student">
          <div class="inputGroup">
            <label for="firstName">Student</label>
            <input id="firstName" name="firstName" type="text" autocomplete="off" 
              placeholder="add name" value="${firstName}" tabindex="1" required>
          </div>
          <div class="days">
            <slot></slot>
          </div>
          <div class="actions">
            <i class="icon add" id="iconAdd" title="Add Day" tabindex="2">playlist_add</i>
            <i class="icon delete" id="iconDelete" title="Remove Student" tabindex="3">clear</i>
          </div>
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
        const dayElement = document.createElement('ext-day') 
        dayElement.appendChild(document.createElement('ext-course'))    
        this.appendChild(dayElement)
      })

      this.shadow.getElementById('iconDelete').addEventListener('click', () => { 
        firstName = firstName || this.shadow.getElementById('firstName').value

        if (confirm(`Are you sure you want to delete ${firstName}? This action can not be undone.`)) {
          this.remove()
        }    
      })

      this.addEventListener('save', (e) => {
        const data = {}
        data.firstName = this.shadow.getElementById('firstName').value
        data.days = []
        
        this.shadow.querySelector('slot').assignedElements().forEach(day => {
          day.dispatchEvent(new CustomEvent('export', {
            detail: response => {
              data.days.push(response)
            }
          }))
        })

        e.detail(data)
      })
    }
}
