export default function PoliticalLeaning() {
    return (
        <div id="political-leaning">
            <span className="scale-value">
                <label htmlFor="esquerda-radical">Esquerda radical <br />
                    <input type="radio" id="esquerda-radical" name="posicionamento" value="esquerda-radical"/>
                </label>
            </span>
            <span className="scale-value scale-value-color">
                <label htmlFor="esquerda">Esquerda <br />
                    <input type="radio" id="esquerda" name="posicionamento" value="esquerda"/>
                </label>
            </span>
            <span className="scale-value">
                <label htmlFor="centro-esquerda">Centro-esquerda <br />
                    <input type="radio" id="centro-esquerda" name="posicionamento" value="centro-esquerda"/>
                </label>
            </span>
            <span className="scale-value scale-value-color">
                <label htmlFor="centro">Centro <br />
                    <input type="radio" id="centro" name="posicionamento" value="centro"/>
                </label>
            </span>
            <span className="scale-value">
                <label htmlFor="centro-direita">Centro-direita <br />
                    <input type="radio" id="centro-direita" name="posicionamento" value="centro-direita"/>
                </label>
            </span>
            <span className="scale-value scale-value-color">
                <label htmlFor="direita">Direita <br />
                    <input type="radio" id="direita" name="posicionamento" value="direita"/>
                </label>
            </span>
            <span className="scale-value">
                <label htmlFor="extrema-direita">Extrema-direita <br />
                    <input type="radio" id="extrema-direita" name="posicionamento" value="extrema-direita"/>
                </label>
            </span>
        </div>
    )
}