import { useEffect, useState } from 'react';
import './App.css';
import ProfileCard from './components/profile-card';
import {message, notification, Spin, Tag, Descriptions, Row} from 'antd'
import _ from 'lodash'
import { getProfilesData } from './network' 

function mapProfileData(rawData){
  return rawData.map(({name, email, dob, picture}) => ({
    name: name.first + ' ' + name.last,
    email,
    age: dob.age,
    imgUrl: picture.large
  }))
}
let remainingCardsNum;
const REMAINING_CARD_THRESHOLD = 2;

function App() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setProfileIndex] = useState(0);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [shouldPrefetchProfile, setShouldPrefetchProfile] = useState(false);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    (async function getData (){
      setLoading(true)
      const {results: rawData} = await getProfilesData();
      const profileData = mapProfileData(rawData)
      setProfiles(profileData)
      setLoading(false)
      remainingCardsNum = profileData.length;
    })()  
  }, [])

  useEffect(() => {
    if(shouldPrefetchProfile){
      (async function getData (){  
        notification['success']({
          message: 'Prefetch 5 more cards',
          description:
            `There is only 1 left, time for getting more!` ,
          duration: 1
          });    
        const {results: rawData} = await getProfilesData();
        const profileData = mapProfileData(rawData)   
        remainingCardsNum = profileData.length + remainingCardsNum;  
        setProfiles(profiles.concat(profileData))
        setLoading(false)
        setShouldPrefetchProfile(false)         
      })()
    } 
  }, [shouldPrefetchProfile])

  useEffect(() => {
    const isCurrentCardExist = currentProfileIndex <= profiles.length;
    isCurrentCardExist && setLoading(false)
  }, [isLoading])

  const debouncedSwipe = _.debounce(function handleSwipe(type){
    processCurrentCardAction();
    moveToNextCard();

    function processCurrentCardAction(){
      const changedViewedProfiles = viewedProfiles.concat(
        {...profiles[currentProfileIndex], liked: type === 'like' ? true: false}
      )
      setViewedProfiles(changedViewedProfiles); 
      type === 'like' ?
        message.success('What an awesome profile!', 0.3)
        : message.error('Not my type', 0.3);
    }
    
    function moveToNextCard(){
      setProfileIndex(currentProfileIndex + 1);
      const isNextCardExist = profiles[currentProfileIndex + 1];
      if(!isNextCardExist) {
        setLoading(true) 
        notification['warning']({
          message: 'Oops! Seem like internet connection is slow',
          duration: 1
        }); 
      }
      --remainingCardsNum
      if( remainingCardsNum <= REMAINING_CARD_THRESHOLD){
        setShouldPrefetchProfile(true)
      }
    }    
  }, 200)

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
          <strong>Current profile: {currentProfileIndex + 1}</strong>
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
