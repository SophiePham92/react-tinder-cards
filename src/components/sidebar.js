import { Layout, Menu, Row, Col, Empty } from "antd";
import { HeartOutlined, CloseOutlined } from "@ant-design/icons";

const { Header, Sider } = Layout;

const SideBar = ({ viewSelected, selectView, viewedProfiles }) => {
  const profiles = viewedProfiles.filter(({ liked }) =>
    viewSelected === "favorites" ? liked : !liked
  );
  return (
    <Sider theme="light" width={320}>
      <Header
        style={{
          padding: "0 16px",
          fontFamily: "Comfortaa, sans-serif",
          fontWeight: "bold",
          background: "linear-gradient(250deg, #335C81, #1B2845)",
        }}
      >
        <p style={{ color: "white", fontSize: "24px" }}>Hello Coder Push.</p>
      </Header>
      <Menu
        onClick={(e) => selectView(e.key)}
        selectedKeys={[viewSelected]}
        mode="horizontal"
      >
        <Menu.Item
          style={{ marginRight: 0 }}
          key="favorites"
          icon={<HeartOutlined />}
        >
          Favorites
        </Menu.Item>
        <Menu.Item key="skips" icon={<CloseOutlined />}>
          Skips
        </Menu.Item>
      </Menu>
      <Row
        gutter={[16, 16]}
        style={{
          overflow: "scroll",
          padding: 8,
          margin: 0,
          width: "100%",
          maxHeight: "calc(100vh - 112px)",
        }}
      >
        {profiles.length ? (
          profiles.map(({ imgUrl, lastName }, index) => {
            return (
              <Col span={8} style={{ height: 120 }} key={index}>
                <img
                  style={{
                    objectFit: "cover",
                    borderRadius: 4,
                    width: "100%",
                    height: "100%",
                  }}
                  src={imgUrl}
                />
                <div
                  style={{
                    position: "relative",
                    borderRadius: "0px 0px 4px 4px",
                    bottom: 22,
                    paddingLeft: 8,
                    fontWeight: "600",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                  }}
                >
                  {lastName}
                </div>
              </Col>
            );
          })
        ) : (
          <Empty
            description={
              viewSelected === "favorites" ? "No favorite" : "No skip"
            }
            style={{ width: "100%", padding: "72px 0" }}
          />
        )}
      </Row>
    </Sider>
  );
};

export default SideBar;
