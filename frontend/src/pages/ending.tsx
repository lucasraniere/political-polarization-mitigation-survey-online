export default function EndingPage() {
    const setParticipantStatus = async (pId: string, status: string) => {
        const response = await fetch('/api/set_participant_status/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'pId': pId, 'status': status})
        });
        const data = await response.json();
        return data;
    };

    const endClick = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const participantId = urlParams.get('PROLIFIC_PID');

        setParticipantStatus((participantId ? participantId : ''), 'finished').then(() => {
            window.location.href = 'https://app.prolific.com/submissions/complete?cc=CKGSLL86';
        });
    }

    return (
        <div id="ending">
            <h1>Muito obrigado pela sua participação!</h1>
            <h3>Para finalizar o survey clique no botão abaixo para ser redirecionado
                de volta ao Prolific.</h3>
            <button onClick={endClick}>Finalizar</button>
        </div>
    )
}