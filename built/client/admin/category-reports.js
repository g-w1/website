"use strict";
function TossupCard({ tossup }) {
    const _id = tossup._id;
    const packetName = tossup.packet.name;
    function onClick() {
        document.getElementById('question-id').value = _id;
        document.getElementById('question-type').textContent = 'tossup';
        document.getElementById('old-category').value = `${tossup.category} / ${tossup.subcategory}`;
    }
    const powerParts = tossup.question.split('(*)');
    return (React.createElement("div", { className: "card my-2" },
        React.createElement("div", { className: "card-header d-flex justify-content-between clickable", "data-bs-toggle": "collapse", "data-bs-target": `#question-${_id}` },
            React.createElement("b", null,
                tossup.set.name,
                " | ",
                tossup.category,
                " | ",
                tossup.subcategory,
                " ",
                tossup.alternate_subcategory ? ' (' + tossup.alternate_subcategory + ')' : '',
                " | ",
                tossup.difficulty),
            React.createElement("b", null,
                "Packet ",
                tossup.packet.number,
                " | Question ",
                tossup.questionNumber)),
        React.createElement("div", { className: "card-container collapse show", id: `question-${_id}` },
            React.createElement("div", { className: "card-body" },
                React.createElement("span", { dangerouslySetInnerHTML: {
                        __html: powerParts.length > 1 ? '<b>' + powerParts[0] + '(*)</b>' + powerParts[1] : tossup.question,
                    } }),
                React.createElement("hr", { className: "my-3" }),
                React.createElement("div", null,
                    React.createElement("b", null, "ANSWER:"),
                    " ",
                    React.createElement("span", { dangerouslySetInnerHTML: {
                            __html: tossup?.formatted_answer ?? tossup.answer,
                        } }))),
            React.createElement("div", { className: "card-footer", onClick: onClick, id: `fix-category-${_id}`, "data-bs-toggle": "modal", "data-bs-target": "#fix-category-modal" },
                React.createElement("small", { className: "text-muted" }, packetName ? 'Packet ' + packetName : React.createElement("span", null, "\u00A0")),
                React.createElement("small", { className: "text-muted float-end" },
                    React.createElement("a", { href: "#" }, "Fix Category"))))));
}
function BonusCard({ bonus }) {
    const _id = bonus._id;
    const packetName = bonus.packet.name;
    const bonusLength = bonus.parts.length;
    const indices = [];
    for (let i = 0; i < bonusLength; i++) {
        indices.push(i);
    }
    function getBonusPartLabel(index, defaultValue = 10, defaultDifficulty = '') {
        const value = bonus.values ? (bonus.values[index] ?? defaultValue) : defaultValue;
        const difficulty = bonus.difficulties ? (bonus.difficulties[index] ?? defaultDifficulty) : defaultDifficulty;
        return `[${value}${difficulty}]`;
    }
    function onClick() {
        document.getElementById('question-id').value = _id;
        document.getElementById('question-type').textContent = 'bonus';
        document.getElementById('old-category').value = `${bonus.category} / ${bonus.subcategory}`;
    }
    return (React.createElement("div", { className: "card my-2" },
        React.createElement("div", { className: "card-header d-flex justify-content-between clickable", "data-bs-toggle": "collapse", "data-bs-target": `#question-${_id}` },
            React.createElement("b", null,
                bonus.set.name,
                " | ",
                bonus.category,
                " | ",
                bonus.subcategory,
                " ",
                bonus.alternate_subcategory ? ' (' + bonus.alternate_subcategory + ')' : '',
                " | ",
                bonus.difficulty),
            React.createElement("b", null,
                "Packet ",
                bonus.packet.number,
                " | Question ",
                bonus.questionNumber)),
        React.createElement("div", { className: "card-container collapse show", id: `question-${_id}` },
            React.createElement("div", { className: "card-body" },
                React.createElement("p", null, bonus.leadin),
                indices.map((i) => React.createElement("div", { key: `${bonus._id}-${i}` },
                    React.createElement("hr", null),
                    React.createElement("p", null,
                        React.createElement("span", null,
                            getBonusPartLabel(i),
                            " "),
                        React.createElement("span", null, bonus.parts[i])),
                    React.createElement("div", null,
                        React.createElement("b", null, "ANSWER: "),
                        React.createElement("span", { dangerouslySetInnerHTML: { __html: (bonus?.formatted_answers ?? bonus.answers)[i] } }))))),
            React.createElement("div", { className: "card-footer", onClick: onClick, "data-bs-toggle": "modal", "data-bs-target": "#fix-category-modal" },
                React.createElement("small", { className: "text-muted" }, packetName ? 'Packet ' + packetName : React.createElement("span", null, "\u00A0")),
                React.createElement("small", { className: "text-muted float-end" },
                    React.createElement("a", { href: "#" }, "Fix Category"))))));
}
function Reports() {
    let [tossups, setTossups] = React.useState([]);
    let [bonuses, setBonuses] = React.useState([]);
    React.useEffect(() => {
        fetch('/api/admin/list-reports?' + new URLSearchParams({ reason: 'wrong-category' }))
            .then(response => response.json())
            .then(data => {
            tossups = data.tossups;
            bonuses = data.bonuses;
            setTossups(tossups);
            setBonuses(bonuses);
        });
        document.getElementById('fix-category-submit').addEventListener('click', function () {
            const _id = document.getElementById('question-id').value;
            const type = document.getElementById('question-type').textContent;
            this.disabled = true;
            this.textContent = 'Submitting...';
            fetch('/api/admin/update-subcategory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id,
                    type,
                    subcategory: document.getElementById('new-category').value,
                }),
            }).then(response => {
                document.getElementById('fix-category-close').click();
                this.disabled = false;
                this.textContent = 'Submit';
                if (!response.ok) {
                    alert('Error updating subcategory');
                    return;
                }
                switch (type) {
                    case 'tossup':
                        tossups = tossups.filter(tossup => tossup._id !== _id);
                        setTossups(tossups);
                        break;
                    case 'bonus':
                        bonuses = bonuses.filter(bonus => bonus._id !== _id);
                        setBonuses(bonuses);
                        break;
                }
            });
        });
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "row text-center" },
            React.createElement("h3", { id: "tossups" }, "Tossups")),
        React.createElement("div", { className: "float-row mb-3" },
            React.createElement("span", { className: "text-muted float-start" },
                "Showing ",
                tossups.length,
                " tossups"),
            React.createElement("a", { className: "float-end", href: "#bonuses" }, "Jump to bonuses")),
        tossups.map(tossup => React.createElement(TossupCard, { key: tossup._id, tossup: tossup })),
        React.createElement("div", { className: "row text-center mt-5" },
            React.createElement("h3", { id: "bonuses" }, "Bonuses")),
        React.createElement("div", { className: "float-row mb-3" },
            React.createElement("span", { className: "text-muted float-start" },
                "Showing ",
                bonuses.length,
                " bonuses"),
            React.createElement("a", { className: "float-end", href: "#tossups" }, "Jump to tossups")),
        bonuses.map(bonus => React.createElement(BonusCard, { key: bonus._id, bonus: bonus }))));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Reports, null));
