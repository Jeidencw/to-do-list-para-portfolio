const inputAddTask = document.querySelector('#addTask')
const ul = document.querySelector('#ul')
const popup = document.querySelector('#popup')
const btnPopupSim = document.querySelector('#btnPopupSim')
const btnPopupNao = document.querySelector('#btnPopupNao')
const btnSortAsc = document.querySelector('#btnSortAsc')
const btnSortDesc = document.querySelector('#btnSortDesc')
const search = document.querySelector('#search')

const taskModel = inputValue => ul.innerHTML += `
    <li class="task__container" data-text='${inputValue}'>
        <div class="task__left">
            <input type="checkbox" class="task__checkbox">
            <p class="task__text">${inputValue}</p>
        </div>
        <div class="task__right">
            <i class="ri-pencil-line edit__icon" data-edit='${inputValue}'></i>
            <i class="ri-delete-bin-fill del__icon" data-trash='${inputValue}'></i>
        </div>
    </li>
`


const state = (() => {
    let isEditing = false

    return{
        getIsEditing: () => isEditing,
        setIsEditing: () => isEditing = !isEditing
    }

})()

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

const confirmedDelete = target => {
    target.remove()
    popup.classList.add('hidden')
    saveData()
}

const deleteTask = target => {
    const confirmDelWhithEnter = e => {
        if(e.key === 'Enter'){confirmedDelete(target)}
        window.removeEventListener('keypress', confirmDelWhithEnter)
    }


    popup.classList.remove('hidden')

    window.addEventListener('keypress', confirmDelWhithEnter)
    window.addEventListener('click', e => {
        if(e.target.id === 'popup'){
            popup.classList.add('hidden')
            window.removeEventListener('keypress', confirmDelWhithEnter)
        }
    })
    btnPopupSim.addEventListener('click', () => confirmedDelete(target))
    btnPopupNao.addEventListener('click', () => {
        popup.classList.add('hidden')
        window.removeEventListener('keypress', confirmDelWhithEnter)
    })
}

const editTask = target => {
    if(state.getIsEditing()){
        return
    }

    state.setIsEditing()

    const taskToEdit = target.dataset.text
    const paragraph = target.querySelector('p')

    const deleteIcon = target.querySelector('i[data-trash]')
    const editIcon = target.querySelector('i[data-edit]')

    const inputEdit = document.createElement('input')
    inputEdit.type = 'text'
    inputEdit.className = 'text-lg font-medium bg-gray-50'
    inputEdit.value = taskToEdit

    paragraph.replaceWith(inputEdit)

    inputEdit.focus()

    const switchToParagraph = () => {
        setTimeout(() => {
            paragraph.textContent = inputEdit.value
    
            inputEdit.replaceWith(paragraph)
            
            target.dataset.text = inputEdit.value
            deleteIcon.dataset.thash = inputEdit.value
            editIcon.dataset.edit = inputEdit.value
            saveData()
        }, 0);
    }

    inputEdit.addEventListener('keypress', e => {
        if(e.key === 'Enter'){switchToParagraph()}
    })

    inputEdit.addEventListener('blur', switchToParagraph)

    state.setIsEditing()
}


const searchTask = e => {
    const inputSearch = e.target.value.trim().toLocaleLowerCase()
    const lis = Array.from(document.querySelectorAll('li'))

    const filteredTask = lis.filter(task => task.textContent.toLocaleLowerCase().includes(inputSearch))
    const notFilteredTask = lis.filter(task => !task.textContent.toLocaleLowerCase().includes(inputSearch))

    filteredTask.forEach(task => task.classList.remove('hidden'))
    notFilteredTask.forEach(task => task.classList.add('hidden'))
}

const toggleCheck = e => {
    const check = e.target.checked
    const text = e.target.parentNode.querySelector('p')
    const checkbox = e.target

    if(check){
        text.classList.add('line-through')
        checkbox.setAttribute('checked', true)
    }else{
        text.classList.remove('line-through')
        checkbox.removeAttribute('checked')
    }
    saveData()
}

const saveData = () => {
    const lis = Array.from(document.querySelectorAll('li'))

    const allTasksTexts = lis.map(item => {
        const text = item.dataset.text
        const checked = item.querySelector('input[type="checkbox"]').hasAttribute('checked')

        return {text, checked}
    })
    
    localStorage.setItem('toDoList', JSON.stringify(allTasksTexts))
}

const loadTasks = () => {
    const allTasks = JSON.parse(localStorage.getItem('toDoList'))

    if(allTasks){
        allTasks.forEach(task => {
            taskModel(task.text)

            if(task.checked){
                const li = document.querySelector(`[data-text='${task.text}']`)
                const p = li.querySelector('p')
                const checkbox = li.querySelector('input[type="checkbox"]')

                checkbox.setAttribute('checked', true)
                p.classList.add('line-through')
            }
        })
    }
}

const ulControler = e => {
    const deleteBtn = e.target.dataset.trash
    const editBtn = e.target.dataset.edit
    
    const targetToDelete = document.querySelector(`[data-text='${deleteBtn}']`)
    const targetToEdit = document.querySelector(`[data-text='${editBtn}']`)


    if(e.target.type === 'checkbox'){
        toggleCheck(e)
    }

    if(deleteBtn){
        deleteTask(targetToDelete)
    }

    if(editBtn){
        editTask(targetToEdit)
    }
}

const sort = asc => {
    const lis = Array.from(document.querySelectorAll('li'))

    if(lis){
        const sortedLis = lis.sort((a, b) => {
            const textA = a.dataset.text.toLocaleLowerCase()
            const textB = b.dataset.text.toLocaleLowerCase()

            if(asc){
                return textA.localeCompare(textB)
            }else{
                return textB.localeCompare(textA)
            }
        })
    
        ul.innerHTML = ''

        sortedLis.forEach(li => ul.appendChild(li))
        saveData()
    }
}

btnSortDesc.addEventListener('click', () => sort(false))
btnSortAsc.addEventListener('click', () => sort(true))
window.addEventListener('load', loadTasks)
ul.addEventListener('click', ulControler)
search.addEventListener('input', searchTask)
inputAddTask.addEventListener('keypress', addTask)