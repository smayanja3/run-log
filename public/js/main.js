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