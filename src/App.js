import { useEffect, useState } from 'react';
import './App.css';
import ProfileCard from './components/profile-card';
import profileData from './mock-data';
import {message} from 'antd'
import _ from 'lodash'

function App() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    setProfiles(profileData)
  }, [])

  const debouncedSwipe = _.debounce(function handleSwipe(type){
    const isLastCard = profiles.length - 1 === currentProfileIndex;
    if(type === 'like'){
      message.success('What an awesome profile!', 0.3)
    } else {
      message.error('Not my type', 0.3)
    }
    setProfileIndex(
      !isLastCard
      ? currentProfileIndex + 1
      : 0
    );
  }, 500)

  return (
    <div className="App">
        <p>
          Hello CoderPush.
        </p>
        <p>
          <strong>{currentProfileIndex}</strong>
        </p> 
        <div style={{position: 'relative', width: 240}}>
          {profileData.map(({name, age, distance, text, pics}, index) => {
            return <ProfileCard 
                imgUrls={pics} 
                name={name}
                age={age}
                text={text}
                distance={distance}
                handleSwipe={debouncedSwipe} 
                isShow={index === currentProfileIndex}
              />
          })} 
        </div>
    </div>
  );
}

export default App;
