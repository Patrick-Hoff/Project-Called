import './style.css'
import { TbError404 } from "react-icons/tb";

function Error() {
    return(
        <div className="error">
            <TbError404 className="errorIcon"/>
            <span>
                Página não localizada
            </span>
        </div>
    )
}

export default Error