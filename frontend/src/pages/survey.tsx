import PolarizationPopUp from '@/components/survey/PolarizationPopUp';
import Questionnaire from '@/components/survey/Questionnaire';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get } from 'http';

export default function Survey() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [tweetNumber, setTweetNumber] = useState(0);
    const [participantId, setParticipantId] = useState("");
    const [currentSessionId, setCurrentSessionId] = useState("");
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [answerQ1, setAnswerQ1] = useState(0);
    const [answerQ2, setAnswerQ2] = useState(0);
    const [answerQ3, setAnswerQ3] = useState(0);
    const [answerQ4, setAnswerQ4] = useState(0);

    // backend functions
    const checkParticipant = async (pId: string) => {
        const response = await fetch(`http://localhost:5000/check_participant/${pId}`);
        const data = await response.json();
        return data;
    };

    const checkAnswers = async (pId: string, tweetNumber: number) => {
        const answerId = pId + 'T' + String(tweetNumber);
        const response = await fetch(`http://localhost:5000/check_answer/${answerId}`);
        const data = await response.json();
        return data;
    };

    const getTexts = async (idText1: string, idText2: string) => {
        const response = await fetch(`http://localhost:5000/get_texts/${idText1}/${idText2}`);
        const data = await response.json();
        return data;
    };

    const createAnswer = async (pId: string, sId: string, tweetNumber: number) => {
        const response = await fetch('http://localhost:5000/create_answer/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'pId': pId, 'sId': sId, 'tweetNumber': tweetNumber})
        });
        const data = await response.json();
        return data;
    };

    const setAnswers = async (aId: string, answers: object) => {
        const response = await fetch(`http://localhost:5000/set_answers/${aId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(answers)
        });
        const data = await response.json();
        return data;
    };

    const setParticipantStatus = async (pId: string, status: string) => {
        const response = await fetch('http://localhost:5000/set_participant_status/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'pId': pId, 'status': status})
        });
        const data = await response.json();
        return data;
    };

    // utils
    const getTweetNumber = (status:string) => {
        switch (status) {
            case 'tweet_1':
                return 1;
            case 'tweet_2':
                return 2;
            case 'tweet_3':
                return 3;
            case 'tweet_4':
                return 4;
        }
    };

    const getNextStatus = (ttNumber:number) => {
        switch (ttNumber) {
            case 1:
                return 'tweet_2';
            case 2:
                return 'tweet_3';
            case 3:
                return 'tweet_4';
            case 4:
                return 'answered';
        }
    };

    const getCurrentAnswers = () => {
        return {
            q1: answerQ1,
            q2: answerQ2,
            q3: answerQ3,
            q4: answerQ4
        };
    };

    // button handler
    const handleNextButton = () => {
        if (answerQ1 === 0 || answerQ2 === 0 || answerQ3 === 0 || answerQ4 === 0) {
            alert("Por favor, responda todas as perguntas antes de prosseguir.");
        }
        else {
            if (tweetNumber === 4) {
                setAnswers(participantId + 'T' + String(tweetNumber), getCurrentAnswers()).then(() => {
                    setParticipantStatus(participantId, 'answered').then(() => {
                        router.push(`/ending/?PROLIFIC_PID=${participantId}`);
                    });
                });
            }
            else {
                setAnswers(participantId + 'T' + String(tweetNumber), getCurrentAnswers()).then(() => {
                    setParticipantStatus(participantId, getNextStatus(tweetNumber)).then(() => {
                        router.refresh();
                    });
                });
            }
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const pId = queryParams.get("PROLIFIC_PID");
        const sId = queryParams.get("SESSION_ID");
        setParticipantId(pId || "");
        setCurrentSessionId(sId || "");
        try {
            checkParticipant(pId).then((data) => {
                const currentTweet = getTweetNumber(data.status);
                setTweetNumber(currentTweet);
                checkAnswers(pId, currentTweet).then((data) => {
                    if (data) {
                        getTexts(data.text1, data.text2).then((data) => {
                            setText1(data.text1);
                            setText2(data.text2);
                        });
                    } else {
                        createAnswer(pId, sId, currentTweet).then((data) => {
                            setText1(data.text1);
                            setText2(data.text2);
                        });
                    }
                });
            });
        } catch (error) {
            console.error(error);
            router.push(`/survey/?PROLIFIC_PID=${pId}`);
        }
    }, []);

    return (
        <main>
            <header>
                <h4>Tweet {tweetNumber} de 4</h4>
                <button id="inter-button" onClick={() => setShowPopup(!showPopup)}> ? </button>
            </header>
            <div>
                {
                    showPopup ? <PolarizationPopUp closePopUp={() => setShowPopup(false)}/> : null
                }
            </div>
            <div id="text-areas">
                    <label htmlFor='text-1'>Texto 1:<br />
                        <textarea id='text-1' readOnly value={text1}/>
                    </label>
                <label htmlFor='text-2'>Texto 2:<br />
                    <textarea id='text-2' readOnly value={text2}/>
                </label>
            </div>
            <Questionnaire
                handleAnswerQ1={setAnswerQ1}
                handleAnswerQ2={setAnswerQ2}
                handleAnswerQ3={setAnswerQ3}
                handleAnswerQ4={setAnswerQ4}
            />
            <div className="next-button">
                <button onClick={handleNextButton}>Próximo Tweet &gt;</button>
            </div>
        </main>
    )
}