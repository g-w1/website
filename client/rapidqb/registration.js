fetch('/api/rapidqb/tournament-list')
    .then(response => response.json())
    .then(data => {
        const { tournamentList } = data;
        const tournamentListSelect = document.getElementById('tournament-name');
        for (const tournament of tournamentList) {
            const option = document.createElement('option');
            option.value = tournament._id;
            option.textContent = tournament.name;
            tournamentListSelect.appendChild(option);
        }
    });

getAccountUsername().then(username => {
    document.getElementById('username').textContent = username;
});

const form = document.getElementById('registration-form');
form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');

    if (!form.checkValidity()) {
        return;
    }

    document.getElementById('submit').textContent = 'Registering...';

    const tournament_id = document.getElementById('tournament-name').value;
    const teamName = document.getElementById('team-name').value;

    fetch('/api/rapidqb/register-team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, tournament_id }),
    }).then(response => {
        if (response.ok) {
            window.location.href = '/rapidqb/home';
        } else {
            alert('Something went wrong. Please try again.');
        }
    });
});
