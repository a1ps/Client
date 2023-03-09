import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const Player = ({user}) => (

  <BaseContainer>
      <p className="game paragraph">
      Username: {user.username}
      </p>
      <p className="game paragraph">
      Creation Date: {user.creationDate}
      </p>
      <p className="game paragraph">
      Status: {user.status}
      </p>
      <p className="game paragraph">
      Birthday: {BirthdayDisplay(user)}
      </p>
  </BaseContainer>
);

function BirthdayDisplay(user){
  if(user.birthDate == null){
    return "None of your buisness";
  }else{
    return user.birthDate;
  }
}

Player.propTypes = {
  user: PropTypes.object
};

const Profile = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  //get the url to the id from the url
  const url = window.location.href;

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:

    async function fetchData() {
      try {
        const id = url.substring(url.lastIndexOf('/') + 1);
        console.log(id);
        const response = await api.get( `/users/${id}`);

        // Get the returned users and update the state.
        setUser(response.data);

      } catch (error) {
        alert(`This user does not exist: \n${handleError(error)}`);
        
      }
    }

    fetchData();
  }, [url]);

  const goToHomePage = () => {
    history.push('/game');
  }


  let content = "This user does not exist.";

  if (user) {
    content = (
      <div className="game">
        <ul className="game user-list">
            <Player user={user}/>
        </ul>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
       User Profile:
      </p>
      {content}
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

export default Profile;
