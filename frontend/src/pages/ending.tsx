import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EndingPage() {
    const router = useRouter();
    type URLCodes = {
        [dict_key: string]: string;
    };
    const urlCodes: URLCodes = {
        'machine' : 'C1B3VICO',
        'human' : 'CWRVAUTB',
        'placebo' : 'C2Q0LH1X',
        'default' : 'CKGSLL86'
    }
    const [participantId, setParticipantId] = useState('');
    const [participantGroup, setParticpantGroup] = useState('');

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
            const urlCode = urlCodes[participantGroup] || urlCodes['default'];
            window.location.href = `https://app.prolific.com/submissions/complete?cc=${urlCode}`;
        });
    }

    const getParticipantGroup = async (pId: string) => {
        const response = await fetch(`/api/get_participant_group/${pId}`);
        const data = await response.json();
        return data;
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const pId = queryParams.get("PROLIFIC_PID") || "";
        setParticipantId(pId || "");
        try {
            getParticipantGroup(pId).then((data) => {
                setParticpantGroup(data.group);
            });
        } catch (error) {
            console.error(error);
            router.push(`/ending/?PROLIFIC_PID=${participantId}`);
        }
    }, []);

    return (
        <div id="ending">
            <h1>Muito obrigado pela sua participação!</h1>
            <h3>Para finalizar o survey clique no botão abaixo para ser redirecionado
                de volta ao Prolific.</h3>
            <button onClick={endClick}>Finalizar</button>
        </div>
    )
}