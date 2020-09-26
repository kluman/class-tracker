import addValidityCheck from './addValidityCheck.js'

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
          .studentHeader {
            position: sticky;
            top: 0;
            display: flex;
            background: var(--white);
          }
          .student .inputGroup {
            margin: var(--space-med);
            font-size: 17px;
          }
          .days {
            margin-top: var(--space-med);
          }
          .actions {
            padding: var(--space-sm);
          }
        </style>
        <div class="student">
          <div class="studentHeader">
            <div class="inputGroup">
              <label for="firstName">Student</label>
              <input id="firstName" name="firstName" type="text" autocomplete="off" 
                placeholder="add name" value="${firstName}" tabindex="1" required>
            </div>
            <div class="actions">
              <i class="icon add" id="iconAdd" title="Add Day" tabindex="2">playlist_add</i>
              <i class="icon delete active" part="delete" id="iconDelete" title="Remove Student" tabindex="3">clear</i>
              <i class="icon restore" part="restore" tabindex="0" id="iconRestore" title="Restore Student">restore</i>
            </div>
          </div>
          <div class="days">
            <slot></slot>
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

      this.shadow.getElementById('iconDelete').addEventListener('click', (e) => {
        this.setAttribute('deleted', '')
      })
  
      this.shadow.getElementById('iconRestore').addEventListener('click', (e) => {
        this.removeAttribute('deleted')
      })

      addValidityCheck(this.shadow.getElementById('firstName'))

      this.addEventListener('save', (e) => {
        if (!this.hasAttribute('deleted')) {
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
        }
      })
    }
}
