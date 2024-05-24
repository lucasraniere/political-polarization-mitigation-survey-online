interface SeguirButtonProps {
    clickHandler: () => void;
}

export default function SeguirButton(props: SeguirButtonProps) {
    return (
        <div className="next-button">
            <button onClick={props.clickHandler}>Seguir &gt;</button>
        </div>
    )
}