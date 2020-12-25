import { useEffect, useState } from 'react';
import './App.css';
import ProfileCard from './components/profile-card';
import {message, notification, Spin, Tag, Descriptions, Row} from 'antd'
import _ from 'lodash'
import { getProfilesData } from './network' 

function skimProfileData(rawData){
  return rawData.map(({name, email, dob, picture}) => ({
    name: name.first + ' ' + name.last,
    email,
    age: dob.age,
    imgUrl: picture.large
  }))
}

const REMAINING_PROFILES_THRESHOLD = 2;

function App() {
  const [profiles, setProfiles] = useState([]);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [currentProfileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    (async function getData (){
      const {results: rawData} = await getProfilesData();
      setProfiles(profiles.concat(skimProfileData(rawData)));
    })()  
  }, [])

  const countRemainingProfiles = (currentProfileIndex, profiles) => (
    profiles.length - currentProfileIndex  - 1
  )

  const debouncedSwipe = _.debounce(function handleSwipe(type){
    const remainingProfileCount = countRemainingProfiles(currentProfileIndex, profiles)
    
    processCurrentCardAction();
    moveToNextCard();

    function processCurrentCardAction(){
      const changedViewedProfiles = viewedProfiles.concat(
        {...profiles[currentProfileIndex], liked: type === 'like'}
      )
      setViewedProfiles(changedViewedProfiles); 
      type === 'like' ?
        message.success('What an awesome profile!', 0.3)
        : message.error('Not my type', 0.3);
    }
    
    function moveToNextCard(){
      const isTimeToPrefetchData = remainingProfileCount <= REMAINING_PROFILES_THRESHOLD;
      const isLoading = !remainingProfileCount;
      setProfileIndex(currentProfileIndex + 1); 
      if(isTimeToPrefetchData){
        notification.success({
            message: 'Prefetch 5 more cards',
            duration: 1
          }); 
        (async function getData (){              
          const {results: rawData} = await getProfilesData();
          setProfiles(profiles.concat(skimProfileData(rawData)))    
        })()
      }
      if(isLoading) {
        notification.warning({
          message: 'Oops! Seem like internet connection is slow',
          duration: 1
        }); 
      }  
    }    
  }, 300)

  const remainingProfileCount = countRemainingProfiles(currentProfileIndex, profiles) + 1;
  const isLoading = !remainingProfileCount;
  const shouldPrefetchProfile = remainingProfileCount <= REMAINING_PROFILES_THRESHOLD; 

  return (
    <div className="App">
        <p>
          Hello CoderPush.
        </p>
        <Row justify='center'>
          <Descriptions column={2} style={{background: 'white', padding: '12px 24px', margin: '0 24px 24px', width: 400}} title="App State" layout="horizontal">
          <Descriptions.Item label="Profile count">
            <strong style={{color: 'brown'}}>
              {profiles.length}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Viewed profile count"> 
            <strong style={{color: 'brown'}}>
               {viewedProfiles.length || '0'}
            </strong>  
          </Descriptions.Item>     
          <Descriptions.Item label="Prefetch Data">
            <Tag color={shouldPrefetchProfile ? 'success': 'grey'}>
              {shouldPrefetchProfile.toString()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Is Loading">
            <Tag color={isLoading ? 'success': 'grey'}>
              {isLoading.toString()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
        </Row>        
        <p>
          <strong>Current profile index: {currentProfileIndex + 1}</strong>
        </p>
        {
          isLoading
          ?
          <Spin tip="Loading..."></Spin>
          :
          <div style={{position: 'relative', width: 240, height: 400}}>
            {profiles.map(({name, age, email, imgUrl}, index) => {
              return <ProfileCard 
                  key={imgUrl + index}
                  imgUrl={imgUrl} 
                  name={name}
                  age={age}
                  email={email}
                  handleSwipe={debouncedSwipe} 
                  isShow={index === currentProfileIndex}
                />
            })} 
          </div>
        }
    </div>
  );
}

export default App;
