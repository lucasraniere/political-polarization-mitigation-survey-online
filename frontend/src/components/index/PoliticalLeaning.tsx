interface PoliticalLeaningProps {
    changeHandler: (leaning: number) => void;
}

export default function PoliticalLeaning(props: PoliticalLeaningProps) {
    return (
        <div id="political-leaning">
            <span className="scale-value">
                <label htmlFor="esquerda-radical">Esquerda radical <br />
                    <input type="radio" id="esquerda-radical" name="posicionamento" value="esquerda-radical" onChange={() => props.changeHandler(1)} />
                </label>
            </span>
            <span className="scale-value scale-value-color">
                <label htmlFor="esquerda">Esquerda <br />
                    <input type="radio" id="esquerda" name="posicionamento" value="esquerda"
                    onChange={() => props.changeHandler(2)} />
                </label>
            </span>
            <span className="scale-value">
                <label htmlFor="centro-esquerda">Centro-esquerda <br />
                    <input type="radio" id="centro-esquerda" name="posicionamento" value="centro-esquerda" onChange={() => props.changeHandler(3)} />
                </label>
            </span>
            <span className="scale-value scale-value-color">
                <label htmlFor="centro">Centro <br />
                    <input type="radio" id="centro" name="posicionamento" value="centro"
                    onChange={() => props.changeHandler(4)} />
                </label>
            </span>
            <span className="scale-value">
                <label htmlFor="centro-direita">Centro-direita <br />
                    <input type="radio" id="centro-direita" name="posicionamento" value="centro-direita" onChange={() => props.changeHandler(5)} />
                </label>
            </span>
            <span className="scale-value scale-value-color">
                <label htmlFor="direita">Direita <br />
                    <input type="radio" id="direita" name="posicionamento" value="direita" onChange={() => props.changeHandler(6)} />
                </label>
            </span>
            <span className="scale-value">
                <label htmlFor="extrema-direita">Extrema-direita <br />
                    <input type="radio" id="extrema-direita" name="posicionamento" value="extrema-direita" onChange={() => props.changeHandler(7)} />
                </label>
            </span>
        </div>
    )
}