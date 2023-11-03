const btnDark = document.querySelectorAll('.toggle-dark')
const sun = document.querySelector('.sun')
const moon = document.querySelector('.moon')
const body = document.querySelector('body')

const browserTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
const userTheme = localStorage.getItem('userTheme') ? localStorage.getItem('userTheme') : browserTheme

const initialTheme = browserTheme && userTheme === 'dark'

if (initialTheme) {
    document.body.classList.add("dark")
    localStorage.setItem('userTheme', 'dark')
}

const switchIcons = () => {
    const control = body.classList.contains('dark')

    sun.style.display = control ? 'block' : 'none'
    moon.style.display = control ? 'none' : 'block'
}

switchIcons()

btnDark.forEach(btn => {
    btn.addEventListener('click', () => {
        body.classList.toggle('dark')

        const control = body.classList.contains('dark')

        switchIcons()
        
        localStorage.setItem('userTheme', control ? 'dark' : 'light')
    })
})

