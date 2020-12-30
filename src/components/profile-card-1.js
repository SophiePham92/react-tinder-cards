import { Typography } from "antd";

const { Text } = Typography;

const ProfileCard = ({ imgUrl, name, email, age }) => {
  return (
    <div
      style={{
        borderRadius: 8,
        boxShadow: "0 2px 10px 0 rgba(0,0,0,0.05)",
        backgroundPosition: "50% 0%",
        backgroundSize: "auto 100%",
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imgUrl})`,
        transition: "opacity 0.5s",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1), #333)",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: "0 0 8px 8px",
          pointerEvents: "none",
        }}
      >
        <Text
          strong
          style={{
            fontSize: "32px",
            color: "#fff",
            maxWidth: "80%",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "inline-block",
          }}
        >{`${name} ${age}`}</Text>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
