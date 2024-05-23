import PolarizationPopUp from '@/components/survey/PolarizationPopUp';
import Questionnaire from '@/components/survey/Questionnaire';
import { useState } from 'react';

export default function Survey() {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <main>
            <header>
                <h4>Tweet 1 de 4</h4>
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
            <Questionnaire disabled={showPopup}/>
            <div className="next-button">
                <button>Próximo Tweet &gt;</button>
            </div>
        </main>
    )
}