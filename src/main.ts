import { sendToLocalStorage } from './models/testmodel.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="Model">
      <div id="add">
        <input id="name"></input>
        <input id="desc"></input>
        <button id="sendB" onClick=sendToLocalStorage()>wyślij</button>
      </div>
    </div>
  </div>
`
sendToLocalStorage()
