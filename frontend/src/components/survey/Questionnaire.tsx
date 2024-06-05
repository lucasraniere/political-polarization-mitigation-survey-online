interface QuestionnaireProps {
    handleAnswerQ1: (value: number) => void;
    handleAnswerQ2: (value: number) => void;
    handleAnswerQ3: (value: number) => void;
    handleAnswerQ4: (value: number) => void;

    question1: number;
    question2: number;
    question3: number;
    question4: number;
}

export default function Questionnaire(props: QuestionnaireProps) {
    return (
        <div>
            <div className="first-questionnaire">
                <div className="scape"></div>
                <div className="question1">
                    O texto 1 apresenta sinais de polarização:
                </div>
                <div className="question2">
                    O texto 2 apresenta sinais de polarização:
                </div>
                <div className="question3">
                Os dois textos têm as mesmas ideias e temas centrais:
                </div>
                <div className="label1">Discordo<br />Totalmente</div>
                <div className="label2 scale-value-color">Discordo</div>
                <div className="label3">Não concordo<br />nem discordo</div>
                <div className="label4 scale-value-color">Concordo</div>
                <div className="label5">Concordo<br />Totalmente</div>
                <div className="opt1_1">
                    <input type="radio" id="discordo-totalmente-1" name="question-1"
                    onChange={() => props.handleAnswerQ1(1)}
                    checked={props.question1===1 ? true : false} />
                </div>
                <div className="opt2_1 scale-value-color">
                    <input type="radio" id="discordo-1" name="question-1"
                    onChange={() => props.handleAnswerQ1(2)}
                    checked={props.question1===2 ? true : false} />
                </div>
                <div className="opt3_1">
                    <input type="radio" id="nao-nem-1" name="question-1"
                    onChange={() => props.handleAnswerQ1(3)}
                    checked={props.question1===3 ? true : false} />
                </div>
                <div className="opt4_1 scale-value-color">
                    <input type="radio" id="concordo-1" name="question-1"
                    onChange={() => props.handleAnswerQ1(4)}
                    checked={props.question1===4 ? true : false} />
                </div>
                <div className="opt5_1">
                    <input type="radio" id="concordo-totalmente-1" name="question-1"
                    onChange={() => props.handleAnswerQ1(5)}
                    checked={props.question1===5 ? true : false} />
                </div>
                <div className="opt1_2">
                    <input type="radio" id="discordo-totalmente-2" name="question-2"
                    onChange={() => props.handleAnswerQ2(1)}
                    checked={props.question2===1 ? true : false} />
                </div>
                <div className="opt2_2 scale-value-color">
                    <input type="radio" id="discordo-2" name="question-2"
                    onChange={() => props.handleAnswerQ2(2)}
                    checked={props.question2===2 ? true : false} />
                </div>
                <div className="opt3_2">
                    <input type="radio" id="nao-nem-2" name="question-2"
                    onChange={() => props.handleAnswerQ2(3)}
                    checked={props.question2===3 ? true : false} />
                </div>
                <div className="opt4_2 scale-value-color">
                    <input type="radio" id="concordo-2" name="question-2"
                    onChange={() => props.handleAnswerQ2(4)}
                    checked={props.question2===4 ? true : false} />
                </div>
                <div className="opt5_2">
                    <input type="radio" id="concordo-totalmente-2" name="question-2"
                    onChange={() => props.handleAnswerQ2(5)}
                    checked={props.question2===5 ? true : false} />
                </div>
                <div className="opt1_3">
                    <input type="radio" id="discordo-totalmente-3" name="question-3"
                    onChange={() => props.handleAnswerQ3(1)}
                    checked={props.question3===1 ? true : false} />
                </div>
                <div className="opt2_3 scale-value-color">
                    <input type="radio" id="discordo-3" name="question-3"
                    onChange={() => props.handleAnswerQ3(2)}
                    checked={props.question3===2 ? true : false} />
                </div>
                <div className="opt3_3">
                    <input type="radio" id="nao-nem-3" name="question-3"
                    onChange={() => props.handleAnswerQ3(3)}
                    checked={props.question3===3 ? true : false} />
                </div>
                <div className="opt4_3 scale-value-color">
                    <input type="radio" id="concordo-3" name="question-3"
                    onChange={() => props.handleAnswerQ3(4)}
                    checked={props.question3===4 ? true : false} />
                </div>
                <div className="opt5_3">
                    <input type="radio" id="concordo-totalmente-3" name="question-3"
                    onChange={() => props.handleAnswerQ3(5)}
                    checked={props.question3===5 ? true : false} />
                </div>
            </div>
            <div className="second-questionnaire">
                <div className="scape"></div>
                <div className="question">Qual dos dois textos você considera ter um maior grau de polarização?</div>
                <div className="label1">Texto 1</div>
                <div className="label2 scale-value-color">Texto 2</div>
                <div className="label3">Mesmo<br/>Grau</div>
                <div className="label4 scale-value-color">Incapaz de<br />Definir</div>
                <div className="opt1">
                    <input type="radio" id="text-1" name="question-4"
                    onChange={() => props.handleAnswerQ4(1)}
                    checked={props.question4===1 ? true : false} />
                </div>
                <div className="opt2 scale-value-color">
                    <input type="radio" id="text-2" name="question-4"
                    onChange={() => props.handleAnswerQ4(2)}
                    checked={props.question4===2 ? true : false} />
                </div>
                <div className="opt3">
                    <input type="radio" id="mesmo-grau" name="question-4"
                    onChange={() => props.handleAnswerQ4(3)}
                    checked={props.question4===3 ? true : false} />
                </div>
                <div className="opt4 scale-value-color">
                    <input type="radio" id="incapaz" name="question-4"
                    onChange={() => props.handleAnswerQ4(4)}
                    checked={props.question4===4 ? true : false} />
                </div>
            </div>
        </div>
    );
}