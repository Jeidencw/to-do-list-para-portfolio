const inputAddTask = document.querySelector('#addTask')
const ul = document.querySelector('#ul')
const popup = document.querySelector('#popup')
const btnPopupSim = document.querySelector('#btnPopupSim')
const btnPopupNao = document.querySelector('#btnPopupNao')


const taskModel = inputValue => ul.innerHTML += `
    <li class="flex items-center justify-between p-3 border-b" data-text='${inputValue}'>
        <div class="flex items-center">
            <input type="checkbox" class="mr-2 text-green-500">
            <p class="text-lg font-medium">${inputValue}</p>
        </div>
        <div class="flex text-gray-600">
            <i class="ri-pencil-line hover:text-green-800 text-lg mr-2" data-edit='${inputValue}'></i>
            <i class="ri-delete-bin-fill hover:text-red-800 text-lg" data-trash='${inputValue}'></i>
        </div>
    </li>
`

const addTask = e => {
    if(e.key === 'Enter'){
        const inputValue = inputAddTask.value.trim()
        
        if(inputValue){
            taskModel(inputValue)
            saveData()
        }

        inputAddTask.value = ''
    }
}

const deleteTask = target => {
    popup.classList.remove('hidden')
        
        btnPopupSim.addEventListener('click', () => {
            target.remove()
            popup.classList.add('hidden')
            saveData()
        })

        btnPopupNao.addEventListener('click', () => popup.classList.add('hidden'))
}

const editTask = target => {
    const taskToEdit = target.dataset.text
    const paragraph = target.querySelector('p')

    const inputEdit = document.createElement('input')
    inputEdit.type = 'text'
    inputEdit.className = 'text-lg font-medium bg-gray-50'
    inputEdit.value = taskToEdit

    paragraph.replaceWith(inputEdit)

    inputEdit.focus()

    inputEdit.addEventListener('keypress', e => {
        if(e.key === 'Enter'){
            paragraph.textContent = inputEdit.value

            inputEdit.replaceWith(paragraph)
        }
    })
}

const saveData = () => {
    const lis = Array.from(document.querySelectorAll('li'))

    const allTasksTexts = lis.map(item => item.dataset.text)
    
    localStorage.setItem('toDoList', JSON.stringify(allTasksTexts))
}

const loadTasks = () => {
    const allTasks = JSON.parse(localStorage.getItem('toDoList'))

    allTasks.forEach(task => taskModel(task))
}


const ulControler = e => {
    const deleteBtn = e.target.dataset.trash
    const editBtn = e.target.dataset.edit
    
    const targetToDelete = document.querySelector(`[data-text='${deleteBtn}']`)
    const targetToEdit = document.querySelector(`[data-text='${editBtn}']`)


    if(deleteBtn){
        deleteTask(targetToDelete)
    }

    if(editBtn){
        editTask(targetToEdit)
    }
}

window.addEventListener('load', loadTasks)
ul.addEventListener('click', ulControler)
inputAddTask.addEventListener('keypress', addTask)