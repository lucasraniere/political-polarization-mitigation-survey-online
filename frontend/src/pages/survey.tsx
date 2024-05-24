import PolarizationPopUp from '@/components/survey/PolarizationPopUp';
import Questionnaire from '@/components/survey/Questionnaire';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Survey() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [tweetNumber, setTweetNumber] = useState(4);
    const [answerQ1, setAnswerQ1] = useState(0);
    const [answerQ2, setAnswerQ2] = useState(0);
    const [answerQ3, setAnswerQ3] = useState(0);
    const [answerQ4, setAnswerQ4] = useState(0);

    const handleNextButton = () => {
        if (answerQ1 === 0 || answerQ2 === 0 || answerQ3 === 0 || answerQ4 === 0) {
            alert("Por favor, responda todas as perguntas antes de prosseguir.");
        } else {
            if (tweetNumber === 4) {
                router.push("/ending");
            }
        }
    };

    return (
        <main>
            <header>
                <h4>Tweet {tweetNumber+1} de 4</h4>
                <button id="inter-button" onClick={() => setShowPopup(!showPopup)}> ? </button>
            </header>
            <div>
                {
                    showPopup ? <PolarizationPopUp closePopUp={() => setShowPopup(false)}/> : null
                }
            </div>
            <div id="text-areas">
                    <label htmlFor='text-1'>Texto 1:<br />
                        <textarea id='text-1' readOnly value={"Tweet text 1"}/>
                    </label>
                <label htmlFor='text-2'>Texto 2:<br />
                    <textarea id='text-2' readOnly value={"Tweet text 2"}/>
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