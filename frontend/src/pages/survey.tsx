import PolarizationPopUp from '@/components/survey/PolarizationPopUp';
import Questionnaire from '@/components/survey/Questionnaire';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Survey() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [tweetNumber, setTweetNumber] = useState(0);
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

    // utils
    const getTweetNumber = (status:string) => {
        if (status === 'tweet_1') {
            return 1;
        } else if (status === 'tweet_2') {
            return 2;
        } else if (status === 'tweet_3') {
            return 3;
        } else if (status === 'tweet_4') {
            return 4;
        }
    };

    // button handler
    const handleNextButton = () => {
        if (answerQ1 === 0 || answerQ2 === 0 || answerQ3 === 0 || answerQ4 === 0) {
            alert("Por favor, responda todas as perguntas antes de prosseguir.");
        } else {
            if (tweetNumber === 4) {
                router.push("/ending");
            }
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const pId = queryParams.get("PROLIFIC_PID");
        try {
            checkParticipant(pId).then((data) => {
                const currentTweet = getTweetNumber(data.status);
                setTweetNumber(currentTweet);
                checkAnswers(pId, currentTweet).then((data) => {
                    if (data) {
                        console.log("Answers found for this tweet.");
                        // set texts and answers and update session
                    } else {
                        console.log("No answers found for this tweet.");
                        // create new answer with Id and shuffle texts
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