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

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [newUserName, setNewUserName] = useState(null);
    const [newBirthDate, setNewBirthDate] = useState(null);
    const [userName, setUserName] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
  

  

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:

    async function fetchData() {
      try {
        const id = localStorage.getItem('id');
        const response = await api.get(`/users/${id}`);
        console.log("Response:", response);
        setUserName(response.data.username);
        setBirthDate(response.data.birthDate);
       


        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        //await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        //setUser(response.data);
        
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, [newBirthDate, newUserName, userName, birthDate]);

  const  goToHomePage = () => {
    history.push('/game');
  };

  const saveChanges = async () => {
      const requestBody = ({
          "username": newUserName,
          "birthDate": newBirthDate,
        });
        const response = await api.put( `/editProfile/${localStorage.getItem('id')}`, requestBody);
          console.log(" response ", response);
          alert("Changes saved!");
          history.push('/game');
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
        onChange={n => setNewUserName(n)}
        />
      <p className="game paragraph">
        Your Current Birthday: {birthDate}
      </p>
      <div>
        <FormField
          type="date"
          value={newBirthDate}
          onChange={n => setNewBirthDate(n)}
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
