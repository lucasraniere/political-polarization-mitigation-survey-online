export default function Questionnaire() {
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
                <div className="label1">Concordo<br />Totalmente</div>
                <div className="label2 scale-value-color">Concordo</div>
                <div className="label3">Não concordo<br />nem discordo</div>
                <div className="label4 scale-value-color">Discordo</div>
                <div className="label5">Discordo<br />Totalmente</div>
                <div className="opt1_1">
                    <input type="radio" id="concordo-totalmente-1" name="question-1" />
                </div>
                <div className="opt2_1 scale-value-color">
                    <input type="radio" id="concordo-1" name="question-1" />
                </div>
                <div className="opt3_1">
                    <input type="radio" id="nao-nem-1" name="question-1" />
                </div>
                <div className="opt4_1 scale-value-color">
                    <input type="radio" id="discordo-1" name="question-1" />
                </div>
                <div className="opt5_1">
                    <input type="radio" id="discordo-totalmente-1" name="question-1" />
                </div>
                <div className="opt1_2">
                    <input type="radio" id="concordo-totalmente-2" name="question-2" />
                </div>
                <div className="opt2_2 scale-value-color">
                    <input type="radio" id="concordo-2" name="question-2" />
                </div>
                <div className="opt3_2">
                    <input type="radio" id="nao-nem-2" name="question-2" />
                </div>
                <div className="opt4_2 scale-value-color">
                    <input type="radio" id="discordo-2" name="question-2" />
                </div>
                <div className="opt5_2">
                    <input type="radio" id="discordo-totalmente-2" name="question-2" />
                </div>
                <div className="opt1_3">
                    <input type="radio" id="concordo-totalmente-3" name="question-3" />
                </div>
                <div className="opt2_3 scale-value-color">
                    <input type="radio" id="concordo-3" name="question-3" />
                </div>
                <div className="opt3_3">
                    <input type="radio" id="nao-nem-3" name="question-3" />
                </div>
                <div className="opt4_3 scale-value-color">
                    <input type="radio" id="discordo-3" name="question-3" />
                </div>
                <div className="opt5_3">
                    <input type="radio" id="discordo-totalmente-3" name="question-3" />
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
                    <input type="radio" id="text-1" name="question-4" />
                </div>
                <div className="opt2 scale-value-color">
                    <input type="radio" id="text-2" name="question-4" />
                </div>
                <div className="opt3">
                    <input type="radio" id="mesmo-grau" name="question-4" />
                </div>
                <div className="opt4 scale-value-color">
                    <input type="radio" id="incapaz" name="question-4" />
                </div>
            </div>
        </div>
    );
}