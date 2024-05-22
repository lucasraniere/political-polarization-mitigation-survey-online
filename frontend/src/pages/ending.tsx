export default function EndingPage() {
    const participantGroup = 'machineGroup';
    const prolificEndUrls = {
        'machineGroup': 'https://app.prolific.com/machine',
        'humanGroup': 'https://app.prolific.com/human',
        'controlGroup': 'https://app.prolific.com/control'
    };
    const endClick = () => {
        console.log('Survey finished');
        window.location.href = prolificEndUrls[participantGroup];
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