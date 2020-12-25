import { useEffect, useState } from 'react';
import './App.css';
import ProfileCard from './components/profile-card';
import {message} from 'antd'
import _ from 'lodash'
import { getProfilesData } from './network'

function App() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    (async function getData (){
      const {results: rawData} = await getProfilesData();
      const profileData = rawData.map(({name, email, dob, picture}) => {
        return {
          name: name.first + ' ' + name.last,
          email,
          age: dob.age,
          imgUrl: picture.large
        }
      })
      setProfiles(profileData)
    })()  
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
          {profiles.map(({name, age, email, imgUrl}, index) => {
            return <ProfileCard 
                imgUrl={imgUrl} 
                name={name}
                age={age}
                email={email}
                handleSwipe={debouncedSwipe} 
                isShow={index === currentProfileIndex}
              />
          })} 
        </div>
    </div>
  );
}

export default App;
