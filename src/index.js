import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { createTimeLine, formatTime } from "./helpers";
import { Flex, Box } from "grid-styled";

const scenes = ["Stora", "Klippan", "Bryggan"];

const Header = () => (
  <Flex flexDirection="column" justifyContent="center">
    <Box
      css={{ padding: 0, margin: 0, height: "50px", textAlign: "center" }}
      color="white"
      width={1}
      bg="#5E7586"
    >
      <p>Schema</p>
    </Box>
  </Flex>
);

const CurrentTimeMarker = styled.div`
  border: 1px solid black;
  position: absolute;
  width: 100%;
  top: ${props => props.top}px;
  z-index: 199;
`;

const SceneBlock = styled.div`
  width: 100px;
  height: 30px;
  border: 1px solid lightgrey;
  text-align: center;
  p {
    margin: 0;
  }
}
`;

const Time = styled.div`
  min-height: ${props => props.height}px;
  height: ${props => props.height}px;
  border-bottom: 1px solid white;
  border-right: 1px solid brown;
  font-size: 0.7em;
  text-align: center;
  font-family: 'Courier'
`;

const Line = styled.div`
  height: ${props => props.height}px;
  border-bottom: 1px dotted grey;
`;

const SceneName = styled.div`
  width: 150px;
  text-align: center;
  border-right: 1px solid white;
`;

const TimeLineRow = styled.div`
  position: absolute;
  width: 150px;
  margin-left: 50px;
  top: 0;
  bottom: 0;
  border-right: 1px solid grey;
  left: ${props => props.left}px;
  display: flex;
  justify-content: center;
`;

const start = new Date();
start.setHours(8);
start.setMinutes(0);
const end = new Date();
end.setDate(end.getDate() + 1);
end.setHours(3);
end.setMinutes(0);
let timeline = createTimeLine(new Date(start), end, 30).map(formatTime);

const tap = (val, fn) => {
  fn(val);
  return val;
};

const parseTime = event => {
  const [startHours, startMinutes] = event.timeStart.split(":");
  const [endHours, endMinutes] = event.timeEnd.split(":");
  return {
    start: tap(new Date(), d => {
      d.setHours(startHours);
      d.setMinutes(startMinutes);
    }),
    end: tap(new Date(), d => {
      d.setHours(endHours);
      d.setMinutes(endMinutes);
    })
  };
};

const calculatePosition = (timeIndex, eventTime, pxPerMinute) => {
  const minutes = (eventTime.start - timeIndex) / 1000 / 60;
  return minutes * pxPerMinute;
};

const calculateShowLength = ({ start, end }, pxPerMinute) => {
  const minutes = (end - start) / 1000 / 60;
  return minutes * pxPerMinute;
};

const Row = props => (
  <Flex {...props} flexDirection="row">
    {props.children}
  </Flex>
);
const Column = props => (
  <Flex {...props} flexDirection="column">
    {props.children}
  </Flex>
);

const EventWrapper = styled.div`
 position: absolute;
 background: orange;
 width: 90%;
 min-height: 40px;
 height: ${props => props.height}px;
 top: ${props => props.top}px;
  p {
    padding: 0;
    margin: 0;
  }
}
`;
const Event = props => {
  return (
    <EventWrapper {...props}>
      <p>{props.name}</p>
      <p>
        {props.timeStart} - {props.timeEnd}
      </p>
    </EventWrapper>
  );
};

const events = {
  stora: [
    {
      scene: "Stora",
      timeStart: "10:00",
      timeEnd: "11:00",
      name: "The kooks"
    },
    {
      scene: "Klippan",
      timeStart: "08:00",
      timeEnd: "09:20",
      name: "Elvis"
    },
    {
      scene: "Klippan",
      timeStart: "14:00",
      timeEnd: "14:20",
      name: "Intro"
    }
  ],
  klippan: [
    {
      scene: "Klippan",
      timeStart: "16:00",
      timeEnd: "19:00",
      name: "Rolling stones"
    },
    {
      scene: "Klippa",
      timeStart: "08:00",
      timeEnd: "12:00",
      name: "Elvis"
    }
  ],
  bryggan: [
    {
      scene: "Klippan",
      timeStart: "12:00",
      timeEnd: "23:00",
      name: "Dj davine"
    }
  ]
};

function App() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Header />
      <Box style={{ position: "relative" }}>
        <Column style={{ position: "absolute" }}>
          <Row bg="lightblue" width={1}>
            <Box bg="lightgreen" width="50px" css={{ height: "50px" }} />
            {scenes.map(x => (
              <SceneName>
                <p>{x}</p>
              </SceneName>
            ))}
          </Row>
          <Row style={{ position: "relative" }}>
            <Column
              width="50px"
              bg="lightgreen"
              css={{ height: "100%", minWidth: "50px" }}
            >
              {timeline.map((x, i) => <Time height={30}>{x}</Time>)}
            </Column>
            <Column width={1} bg="lightyellow">
              <CurrentTimeMarker
                top={calculatePosition(start, { start: new Date() }, 31 / 30)}
              />
              {timeline.map(x => <Line height={30} />)}
              {scenes.map((x, i) => {
                return (
                  <TimeLineRow left={150 * i}>
                    {(events[x.toLowerCase()] || []).map(b => (
                      <Event
                        top={calculatePosition(start, parseTime(b), 31 / 30)}
                        height={calculateShowLength(parseTime(b), 31 / 30)}
                        {...b}
                      />
                    ))}
                  </TimeLineRow>
                );
              })}
            </Column>
          </Row>
        </Column>
      </Box>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
