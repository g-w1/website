fetch('/api/rapidqb/my-team-list')
    .then(response => response.json())
    .then(data => {
        const { tournamentList: teamList } = data;

        for (const team of teamList) {
            const { name, tournament } = team;

            const listGroupItem = document.createElement('li');
            listGroupItem.className = 'list-group-item';

            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between';

            const b1 = document.createElement('b');
            b1.textContent = `Team ${titleCase(name)}`;

            const b2 = document.createElement('b');
            b2.textContent = `Tournament ${titleCase(tournament.name)}`;

            div.appendChild(b1);
            div.appendChild(b2);
            listGroupItem.appendChild(div);

            const ul = document.createElement('ul');

            const li = document.createElement('li');
            li.textContent = 'Packet 1: ';

            const a1 = document.createElement('a');
            a1.textContent = 'Play';

            li.appendChild(a1);
            ul.appendChild(li);
            listGroupItem.appendChild(ul);

            document.getElementById('team-list').appendChild(listGroupItem);
        }
    });
