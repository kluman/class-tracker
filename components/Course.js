/**
 * Defines a Course web component.
 */
export default class Course extends HTMLElement {

  constructor () {
    super()

    this.shadow = this.attachShadow({mode: 'open'})
  }

  connectedCallback () {
    const period = this.getAttribute('period') || ''
    const className = this.getAttribute('className') || ''
    const startTime = this.getAttribute('startTime') || ''

    const template = `
      <style>
        .inputGroup {
          margin-right: var(--space-med);
          margin-bottom: 0;
        }
        .course {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
      <div class="course">
        <div class="inputGroup">
          <label for="period">Period</label>
          <input list="periodList" name="period" size="8" tabindex="1" value="${period}">
          <datalist id="periodList">
            <option value="1">
            <option value="2">
            <option value="3">
            <option value="4">
            <option value="5">
            <option value="Lunch">
            <option value="6">
            <option value="7">
            <option value="8">
            <option value="9">
            <option value="10">
          </datalist>
        </div>
        <div class="inputGroup">
          <label for="className">Class</label>
          <input name="className" list="classNameList" type="text" tabindex="2" autocomplete="off" value="${className}" required>
          <datalist id="classNameList">
            <option value="Art">
            <option value="Break">
            <option value="English">
            <option value="Elective">
            <option value="Foreign Language">
            <option value="Government">
            <option value="History">
            <option value="Lunch">
            <option value="Math">
            <option value="Music">
            <option value="PE">
            <option value="Resource">
            <option value="Science">
            <option value="Study Hall">
          </datalist>
        </div>
        <div class="inputGroup">
          <label for="startTime">Start Time</label>
          <input type="time" name="startTime" min="06:00" max="21:00" value="${startTime}" tabindex="4" required>
        </div>
        <span class="actions">
          <i class="icon delete" id="iconDelete" title="Delete Course">clear</i>
        </span>
      </div>
    `

    // Create shadow DOM markup.
    this.shadow.innerHTML = template

    // Apply main styles to the shadow dom.
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'styles/components.css');
    this.shadow.appendChild(linkElem);

    // Set all event listeners.
    this.shadow.getElementById('iconDelete').addEventListener('click', (e) => {
      this.remove()
    })

    this.addEventListener('export', (e) => {
      const data = {}

      this.shadow.querySelectorAll('input').forEach(input => {
        data[input.getAttribute('name')] = input.value ? input.value : ''
      })

      e.detail(data)
    })
  }
}
