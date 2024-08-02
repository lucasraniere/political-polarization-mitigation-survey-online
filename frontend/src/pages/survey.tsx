import PolarizationPopUp from '@/components/survey/PolarizationPopUp';
import Questionnaire from '@/components/survey/Questionnaire';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Survey() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [tweetNumber, setTweetNumber] = useState(0);
    const [maxProgresTweet, setMaxProgressTweet] = useState(0);
    const [participantId, setParticipantId] = useState("");
    const [currentSessionId, setCurrentSessionId] = useState("");
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [answerQ1, setAnswerQ1] = useState(0);
    const [answerQ2, setAnswerQ2] = useState(0);
    const [answerQ3, setAnswerQ3] = useState(0);
    const [answerQ4, setAnswerQ4] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);

    // backend functions
    const checkParticipant = async (pId: string) => {
        const response = await fetch(`/api/check_participant/${pId}`);
        const data = await response.json();
        return data;
    };

    const checkAnswers = async (pId: string, tweetNumber: number) => {
        const answerId = pId + 'T' + String(tweetNumber);
        const response = await fetch(`/api/check_answer/${answerId}`);
        const data = await response.json();
        return data;
    };

    const getTexts = async (idText1: string, idText2: string) => {
        const response = await fetch(`/api/get_texts/${idText1}/${idText2}`);
        const data = await response.json();
        return data;
    };

    const createAnswer = async (pId: string, sId: string, tweetNumber: number) => {
        const response = await fetch('/api/create_answer/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'pId': pId, 'sId': sId, 'tweetNumber': tweetNumber})
        });
        const data = await response.json();
        return data;
    };

    const setAnswers = async (aId: string, answers: object) => {
        const response = await fetch(`/api/set_answers/${aId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(answers)
        });
        const data = await response.json();
        return data;
    };

    const setParticipantStatus = async (pId: string, status: string) => {
        const response = await fetch('/api/set_participant_status/', {
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
            default:
                return -1;
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
            default:
                return "ERROR";
        }
    };

    const getCurrentAnswers = () => {
        return {
            q1: answerQ1,
            q2: answerQ2,
            q3: answerQ3,
            q4: answerQ4,
            timeSpent: timeSpent
        };
    };

    const resetAnswers = () => {
        setAnswerQ1(0);
        setAnswerQ2(0);
        setAnswerQ3(0);
        setAnswerQ4(0);
        setTimeSpent(0);
    };

    const getAnswer = async (answerId:string) => {
        const response = await fetch(`/api/get_answer/${answerId}`);
        const data = await response.json();
        return data;
    };

    const goToPreviousTweet = () => {
        const previousTweet = tweetNumber - 1;
        const previousAnswerId = participantId + 'T' + String(previousTweet);
        getAnswer(previousAnswerId).then((data) => {
            setTweetNumber(previousTweet);
            setText1(data.text1);
            setText2(data.text2);
            setAnswerQ1(data.q1);
            setAnswerQ2(data.q2);
            setAnswerQ3(data.q3);
            setAnswerQ4(data.q4);
            setTimeSpent(data.time);
        });
    };

    // button handlers
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
                setAnswers(participantId + 'T' + String(tweetNumber), getCurrentAnswers()).
                then(() => {
                    var nextState = "";
                    if (tweetNumber+1 > maxProgresTweet) {
                        setMaxProgressTweet(tweetNumber+1);
                        nextState = getNextStatus(tweetNumber) || "";
                    } else {
                        nextState = 'tweet_'+String(maxProgresTweet);
                    }
                    setParticipantStatus(participantId, nextState).then(() => {
                        const currentTweet = tweetNumber + 1;
                        setTweetNumber(currentTweet);
                        getAnswer(participantId+'T'+currentTweet).then((data) => {
                            if (data) {
                                setText1(data.text1);
                                setText2(data.text2);
                                const q1 = data.q1 ? data.q1 : 0;
                                const q2 = data.q2 ? data.q2 : 0;
                                const q3 = data.q3 ? data.q3 : 0;
                                const q4 = data.q4 ? data.q4 : 0;
                                setAnswerQ1(q1);
                                setAnswerQ2(q2);
                                setAnswerQ3(q3);
                                setAnswerQ4(q4);
                                setTimeSpent(data.time);
                            } else {
                                createAnswer(participantId, currentSessionId, currentTweet).then((data) => {
                                    setText1(data.text1);
                                    setText2(data.text2);
                                    resetAnswers();
                                });
                            }
                        });
                    });
                });
            }
        }
    };

    const handlePreviousButton = () => {
        const hasSomeAnswer = (answerQ1 != 0 || answerQ2 != 0 || answerQ3 != 0 || answerQ4 != 0);
        const hasAllAnswer = (answerQ1 != 0 && answerQ2 != 0 && answerQ3 != 0 && answerQ4 != 0);
        if (hasSomeAnswer && tweetNumber === maxProgresTweet) {
            const confimation = confirm("Tem certeza que quer voltar? Suas respostas serão perdidas.");
            if (confimation) {
                goToPreviousTweet();
            }
        } else if (hasAllAnswer) {
            setAnswers(participantId + 'T' + String(tweetNumber), getCurrentAnswers()).then(() => {
                goToPreviousTweet();
            });
        } else {
            goToPreviousTweet();
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const pId = queryParams.get("PROLIFIC_PID") || "";
        const sId = queryParams.get("SESSION_ID") || "";
        setParticipantId(pId || "");
        setCurrentSessionId(sId || "");
        try {
            checkParticipant(pId).then((data) => {
                if (data.status !== 'finished' && data.status !== 'answered') {
                    const currentTweet = getTweetNumber(data.status);
                    setTweetNumber(currentTweet);
                    setMaxProgressTweet(currentTweet);
                    checkAnswers(pId, currentTweet).then((data) => {
                        if (data) {
                            setTimeSpent(data.time);
                            getTexts(data.text1, data.text2).then((data) => {
                                setText1(data.text1);
                                setText2(data.text2);
                            });
                        } else {
                            createAnswer(pId, sId, currentTweet).then((data) => {
                                setText1(data.text1);
                                setText2(data.text2);
                                setTimeSpent(0);
                            });
                        }
                    });
                } else {
                    router.push(`/ending/?PROLIFIC_PID=${pId}`);
                }
            });
        } catch (error) {
            console.error(error);
            router.push(`/survey/?PROLIFIC_PID=${pId}`);
        }
        const interval = setInterval(() => {
            setTimeSpent(timeSpent => timeSpent + 1);
        }, 1000);
        return () => clearInterval(interval);
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

                question1={answerQ1}
                question2={answerQ2}
                question3={answerQ3}
                question4={answerQ4}
            />
            <div className="nav-buttons">
                {
                    tweetNumber > 1 ?
                    <div className="previous-button">
                        <button onClick={handlePreviousButton}>&lt; Tweet Anterior</button>
                    </div>
                    : null
                }
                <div className="next-button">
                    <button onClick={handleNextButton}>Próximo Tweet &gt;</button>
                </div>
            </div>
        </main>
    )
}