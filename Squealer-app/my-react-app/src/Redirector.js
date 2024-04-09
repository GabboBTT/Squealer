import {useNavigate} from 'react-router-dom';

function Redirector(){
    const navigate = useNavigate();

    window.onload = () => {           //serve per entrare in home appena viene avviato il programma
        navigate("/squealer-app/home");
      };
}

export default Redirector;