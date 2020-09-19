/**
 * Checks the element's value against its constraints and also reports the validity status.
 * 
 * @param {*} element The HTML element to check against validity constraints.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation}
 */
function addValidityCheck (element) {
  element.checkValidity()
  element.reportValidity()

  element.addEventListener('input', (e) => {
    element.checkValidity()
    element.reportValidity()
  })
}

export default addValidityCheck
