import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const FormField = props => {
    return (
      <div className="login field">
        <input
          type={props.type}
          className="login input"
          placeholder="Put your changes here.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
        </div>
    );
  };

FormField.propTypes = {
    type: PropTypes.any,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

const EditProfile = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const [newUserName, setNewUserName] = useState(null);
  const [newBirthDate, setNewBirthDate] = useState(null);
  const [userName, setUserName] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:

    async function fetchData() {
      try {
        const id = localStorage.getItem('id');
        const response = await api.get(`/users/${id}`);
        setUserName(response.data.username);
        setBirthDate(response.data.birthDate);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, [newBirthDate, newUserName, userName, birthDate]);

  const  goToHomePage = () => {
    history.push('/game');
  };

  const saveChanges = async () => {
    try {
      if (newBirthDate == null){
        setNewBirthDate(null);
      }
      const requestBody = ({
        "username": newUserName,
        "birthDate": newBirthDate,
      }); 
      await api.put( `/users/${localStorage.getItem('id')}`, requestBody);
        alert("Changes saved!");
        history.push(`/profile/${localStorage.getItem('id')}`);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
    
  };


  return (
    <BaseContainer className="game container">
    <h2>Happy Coding!</h2>
    <p className="game paragraph">
      Change your Profile:
    </p>
    <div>
      <p className="game paragraph">
          Your Current Username: {userName}
      </p>
      <FormField
        value={newUserName}
        onChange={nun => setNewUserName(nun)}
        />
      <p className="game paragraph">
        Your Current Birthday: {birthDate}
      </p>
      <div>
        <FormField
          type="date"
          value={newBirthDate}
          onChange={b => setNewBirthDate(b)}
          />
      </div>
    </div>
    <div className="login button-container">
      <Button
        width="100%"
        onClick={() => saveChanges()}
      >
        Save your Changes
      </Button>
    </div>

        
    <div className="login button-container">
        <Button
            width="100%"
            onClick={() => goToHomePage()}
        >
        Go to Home Page
        </Button>
    </div>
    </BaseContainer>
  );
}

export default EditProfile;
