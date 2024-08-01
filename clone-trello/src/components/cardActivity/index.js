import React, { useEffect, useState } from "react";
import "./style.scss";
import * as constants from "../../shared/constants";
import CardActivityService from "../../api/Services/cardActivity";
import signalR from "../../utils/signalR";

const CardActivity = (cardId) => {
  const [cardActivity, setCardActivity] = useState([]);

  const handleGetCardActivity = async () => {
    let query = { cardId: cardId.cardId };
    try {
      const response = await CardActivityService.getAllCardActivity(query);
      if (response.data.code == 200) {
        console.log("get activity ok!");
        setCardActivity(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleReceiveCardActivity = (cardActivity) => {
      setCardActivity((preCardActivity) => {
        if (!preCardActivity.find((a) => a.id === cardActivity.id)) {
          return [...preCardActivity, cardActivity];
        }
        return preCardActivity;
      });
    };

    signalR.signalREventEmitter.on(
      "ReceiveActivity",
      handleReceiveCardActivity
    );

    return () => {
      signalR.signalREventEmitter.off(
        "ReceiveActivity",
        handleReceiveCardActivity
      );
    };
  }, []);

  useEffect(() => {
    handleGetCardActivity();
  }, []);

  return (
    <React.Fragment>
      {cardActivity.map((cardActivities, key) => (
        <div className="d-flex gap-2 p-1" key={key}>
          <div className="block__user-activity">
            <img src={constants.USER_UNDEFINE_URL} />
          </div>
          <div className="d-flex flex-column">
            <div className="d-flex gap-1">
              <span>name</span>
              <span>activity</span>
            </div>
            <span>time</span>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default CardActivity;
