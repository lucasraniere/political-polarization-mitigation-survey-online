import PolarizationDef from "../PolarizationDef";

interface PolarizationPopUpProps {
    closePopUp: () => void;
}

export default function PolarizationPopUp(props: PolarizationPopUpProps) {
    return (
        <div className="popup-container">
            <div className="popup-body">
                <PolarizationDef />
                <button id="popup-button" onClick={props.closePopUp}> Fechar X</button>
            </div>
        </div>
    )
}