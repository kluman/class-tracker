export default class Course extends HTMLElement {

  static get observedAttributes() { 
    return []
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({mode: 'open'})
  }

  connectedCallback () {
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
          <input list="periodList" name="period" size="8">
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
          <input name="className" list="classNameList" type="text" autocomplete="off" required>
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
          <select name="day" required>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
          </select>
        </fieldset>
        <fieldset>
          <label for="startTime">Start Time</label>
          <input type="time" name="startTime" min="06:00" max="21:00" required>
        </fieldset>
        <fieldset>
          <label for="endTime">End Time</label>
          <input type="time" name="endTime" min="06:00" max="21:00" required>
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