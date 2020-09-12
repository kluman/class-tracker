export default class Course extends HTMLElement {

  static get observedAttributes() { 
    return []
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({mode: 'open'})
  }

  connectedCallback () {
    const period = this.getAttribute('period') || ''
    const className = this.getAttribute('className') || ''
    const day = this.getAttribute('day') || ''
    const startTime = this.getAttribute('startTime') || ''
    const endTime = this.getAttribute('endTime') || ''

    const template = `
      <style>
        .course {
          display: flex;
          margin-bottom: 20px;
        }
        fieldset {
          border: none;
        }
      </style>
      <div class="course">
        <i class="icon" title="Delete Course">delete_sweep</i>
        <fieldset>
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
        </fieldset>
        <fieldset>
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
        </fieldset>
        <fieldset>
          <label for="day">Day</label>
          <select id="day" name="day" tabindex="3" required>
            <option value="1" ${day === 1 ? 'selected' : ''}>Monday</option>
            <option value="2" ${day === 2 ? 'selected' : ''}>Tuesday</option>
            <option value="3" ${day === 3 ? 'selected' : ''}>Wednesday</option>
            <option value="4" ${day === 4 ? 'selected' : ''}>Thursday</option>
            <option value="5" ${day === 5 ? 'selected' : ''}>Friday</option>
          </select>
        </fieldset>
        <fieldset>
          <label for="startTime">Start Time</label>
          <input type="time" name="startTime" min="06:00" max="21:00" value="${startTime}" tabindex="4" required>
        </fieldset>
        <fieldset>
          <label for="endTime">End Time</label>
          <input type="time" name="endTime" min="06:00" max="21:00" value="${endTime}" tabindex="5" required>
        </fieldset>
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
    this.shadow.querySelector('.course .icon').addEventListener('click', (e) => {
      this.remove(e.target)
    })

    this.addEventListener('export', e => {
      const data = {}

      this.shadow.querySelectorAll('input').forEach(input => {
        data[input.getAttribute('name')] = input.value ? input.value : ''
      })

      const day = this.shadow.getElementById('day')
      data.day = day.options[day.selectedIndex].value

      e.detail(data)
    })
  }

  disconnectedCallback () {
  }

  attributeChangedCallback (name, oldValue, newValue) {
 
  }

  remove (target) {
    target.closest('.course').remove()
  }
}