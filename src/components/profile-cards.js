import { useState } from "react";
import { Row, Button, Space, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import css from "./component.module.css";

const { Text } = Typography;

const ProfileCards = ({ profiles, handleSwipe }) => {
  return (
    <div className={css.swipingList}>
      {profiles
        .slice()
        .reverse()
        .map(({ imgUrl, name, email, age }, index) => {
          return (
            <SwipableWrapper
              key={name}
              className={css.swipingWrapper}
              onSwipeLeft={() => handleSwipe("skip")}
              onSwipeRight={() => handleSwipe("like")}
            >
              <div
                className={css.profileCard}
                style={{ backgroundImage: `url(${imgUrl})` }}
              >
                <div className={css.profileCardDescription}>
                  <Text
                    className={css.profileCardDescriptionTitle}
                    strong
                  >{`${name} ${age}`}</Text>
                  <p>{email}</p>
                </div>
              </div>
              <span className={`${css.swipingMessage} ${css.likeMessage}`}>
                LIKE
              </span>
              <span className={`${css.swipingMessage} ${css.skipMessage}`}>
                SKIP
              </span>
            </SwipableWrapper>
          );
        })}
      <Row justify="center" className={css.toolbar}>
        <Space size={64}>
          <Button
            danger
            className={css.toolbarButton}
            size="large"
            shape="circle"
            icon={<CloseOutlined size="large" />}
            onClick={() => handleSwipe("skip")}
          />
          <Button
            className={css.toolbarButton}
            shape="circle"
            icon={<CheckOutlined style={{ color: "#52c41a" }} />}
            onClick={() => handleSwipe("like")}
          />
        </Space>
      </Row>
    </div>
  );
};

function getMovingStyle({ x, y, rotate, opacity = 1 }) {
  return {
    transform: `translate3d(${x}px, ${y}px, 0px) rotate(${rotate}deg) scale(1,1)`,
    transformOrigin: "center center",
    opacity: opacity,
  };
}
function getXYFromTransformCss(transformCss) {
  const xyRegex = /(-|)\d{0,4}px/g;
  const [xInPixel, yInPixel] = transformCss.match(xyRegex);
  return {
    x: Number(xInPixel.replace("px", "")),
    y: Number(yInPixel.replace("px", "")),
  };
}

const SwipableWrapper = ({
  children,
  style,
  onSwipeLeft,
  onSwipeRight,
  ...otherProps
}) => {
  const initialStyle = {
    transform: `translate3d(0px, 0px, 0px) rotate(0deg) scale(1,1)`,
  };
  const [initialXY, setInitialXY] = useState(null);

  const handleMouseDown = ({ pageY, pageX }) => {
    setInitialXY({ x: pageX, y: pageY });
  };

  const handleMouseMove = ({ currentTarget, pageX, pageY }) => {
    if (!initialXY) return;

    const swipingEl = currentTarget;
    const changedXY = {
      x: pageX - initialXY.x,
      y: pageY - initialXY.y,
      rotate: (pageX - initialXY.x) / 10,
    };
    const newStyleCss = getMovingStyle(changedXY);
    Object.entries(newStyleCss).forEach(([key, value]) => {
      swipingEl.style[key] = value;
    });

    const calculatedMessageOpacity = Math.abs(changedXY.x) / 100;
    const messageElIndex = changedXY.x >= 0 ? 1 : 2;
    swipingEl.children[messageElIndex].style.opacity =
      calculatedMessageOpacity < 1 ? calculatedMessageOpacity : 1;
  };

  const handleMouseUp = ({ currentTarget }) => {
    setInitialXY(null);
    const swipingEl = currentTarget;
    const { x } = getXYFromTransformCss(swipingEl.style.transform);
    const shouldRemoveCard = Math.abs(x) >= 100;
    if (shouldRemoveCard) {
      swipingEl.style.opacity = 0;
      setTimeout(() => {
        x >= 0 ? onSwipeRight() : onSwipeLeft();
      }, 500);
    } else {
      swipingEl.style.transform = initialStyle.transform;
      const [_cardEl, skipMessageEl, likeMessageEl] = swipingEl.children;
      skipMessageEl.style.opacity = 0;
      likeMessageEl.style.opacity = 0;
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ ...style, transform: initialStyle.transform }}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default ProfileCards;
