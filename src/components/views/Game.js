import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const Player = ({user, profileLink}) => (
  <div className="player container">
    <div className="primary-button" onClick={() => {profileLink(user.id)}}>{user.username}</div>
    <div className="player name"> {user.name} </div>
    <div className="player status"> {user.status} </div>
    <div className="player id">id: {user.id} </div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
  profileLink : PropTypes.func
};

const Game = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);

  

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users');
        
        // Get the returned users and update the state.
        setUsers(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, [users]);

  const goToProfile = (userid) => {
    history.push(`/profile/${userid}`);
  }

  const editMyProfile = () => {
    history.push(`/editProfile`); 
  }

  const logout = () => {
    const id = localStorage.getItem('id');
    api.put('/logout', id);
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    history.push('/login');
   }

  let content = <Spinner/>;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map(user => (
            <Player user={user} key = {user.id} profileLink={goToProfile}/>
          ))}
        </ul>
        <Button
          width="100%"
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
        User overview:
      </p>
      {content}
      <div className="login button-container">
      <Button
          width="100%"
          onClick={() => editMyProfile()}
        >
          Edit my Profile
        </Button>
      </div>
    </BaseContainer>
  );
}

export default Game;
