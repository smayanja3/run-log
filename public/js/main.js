const editForm = document.querySelector('#editForm')
const deleteBtn = document.querySelector('#deleteBtn')

// ---------------------- EDIT FORM  ----------------------//
//------- PUT/ UPDATE
if (editForm) {
    editForm.addEventListener('submit', function (event) {
        event.preventDefault()

        const form = document.getElementById('editForm')
        const id = form.dataset.id


        const updatedRun = {
            date: document.querySelector('[name= "date"]').value,
            distance:document.querySelector('[name= "distance"]').value,
            minutes: document.querySelector('[name= "minutes"]').value,
            seconds: document.querySelector('[name= "seconds"]').value,
            route: document.querySelector('[name= "route"]').value,
            feel: document.querySelector('[name= "feel"]').value,
            rating: document.querySelector('[name= "rating"]').value,
            notes: document.querySelector('[name= "notes"]').value,
        }

        console.log('sending', id, updatedRun)

        fetch(`/runs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRun) 
        })

        .then(res => {
            console.log('server answered:', res.status, res.ok)
            if(res.ok) {
                window.location.href = `/runs/${id}`
            } else {
                return res.json().then(data => {
                    document.getElementById('error-message').innerText = data.error
                })
            }
        })
    })
}

//---------------------- DELETE  ----------------------//
//------- DELETE/REMOVE

if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
        const sure = confirm('Delete this anime from your watchlist?')

        if (!sure) return // <-- another pop up im thinkin Clicked cancel so STOP

        const id = this.dataset.id

        console.log('deleting', id)

        fetch(`/runs/${id}`, {
            method: 'delete'
        })
            .then(res => {
                console.log('server approved:', res.status, res.ok)
                if (res.ok) {
                    window.location.href = ('/runs') 
                } else {
                    return res.json().then(data => {
                        document.getElementById('error-message').innerText = data.error
                    })
                }
            })
    })
}