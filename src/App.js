import "antd/dist/antd.css";
import "./App.css";
import { useEffect, useState } from "react";
import { notification, Spin, Layout } from "antd";
import SideBar from "./components/sidebar";
import { getProfilesData } from "./network";
import {
  debounce,
  getLocalViewedProfiles,
  setLocalViewedProfiles,
} from "./utilities";
import ProfileCards from "./components/profile-cards";

const { Footer, Content } = Layout;
const REMAINING_PROFILES_THRESHOLD = 2;

function App() {
  const [profiles, setProfiles] = useState([]);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [viewSelected, setViewSelected] = useState("favorites");

  useEffect(() => {
    (async function getData() {
      setViewedProfiles(getLocalViewedProfiles());
      const fetchedProfiles = await getProfilesData();
      setProfiles([...profiles, ...fetchedProfiles]);
    })();
  }, []);

  const debouncedSwipe = debounce(function handleSwipe(type) {
    const [head, ...tail] = profiles;

    processCurrentCardAction();
    moveToNextCard();

    function processCurrentCardAction() {
      const updatedViewedProfiles = [
        ...viewedProfiles,
        { ...head, liked: type === "like" },
      ];
      setViewedProfiles(updatedViewedProfiles);
      setLocalViewedProfiles(updatedViewedProfiles);
    }

    function moveToNextCard() {
      const isTimeToPrefetchData = tail.length <= REMAINING_PROFILES_THRESHOLD;
      const isLoading = !tail.length;
      if (isTimeToPrefetchData) {
        notification.success({
          message: "Prefetch 5 more cards",
          duration: 1,
        });
        (async function getData() {
          const fetchedProfiles = await getProfilesData();
          setProfiles([...tail, ...fetchedProfiles]);
        })();
      } else {
        setProfiles([...tail]);
      }
      if (isLoading) {
        notification.warning({
          message: "Oops! Seem like internet connection is slow",
          duration: 1,
        });
      }
    }
  }, 300);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar
        viewSelected={viewSelected}
        selectView={setViewSelected}
        viewedProfiles={viewedProfiles}
      />
      <Layout>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin spinning={!profiles.length}>
            <ProfileCards profiles={profiles} handleSwipe={debouncedSwipe} />
            {/* <div style={{ position: "relative", width: 240, height: 400 }}>
              {profiles.map(({ name, age, email, imgUrl }, index) => {
                return (
                  <ProfileCard
                    key={imgUrl + index}
                    imgUrl={imgUrl}
                    name={name}
                    age={age}
                    email={email}
                    handleSwipe={debouncedSwipe}
                    isShow={index === 0}
                  />
                );
              })}
            </div> */}
          </Spin>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          React Swiper App ©2020 Created by Trang Pham
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
