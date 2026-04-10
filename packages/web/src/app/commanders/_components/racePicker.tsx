import React from "react";
import { Col, Row } from "antd";

import routes from "../../../routes";
import Link from "next/link";
import { Tip } from "../../../components/tip";
import { getGeneralIconImport } from "../../../coh/generalIconImports";
import Image from "next/image";

const imageWidth = 220;
const imageHeight = 220;

export const RacePicker = () => {
  const myCenterStyle = {
    justifyContent: "center",
    padding: "10px",
  };

  return (
    <>
      <div>
        <div style={{ textAlign: "center", paddingTop: 10, fontSize: "larger" }}>
          <Tip
            text={
              <>
                You can see the most picked Commanders over at{" "}
                <Link href={routes.statsBase()} prefetch={false}>stats page</Link>.
              </>
            }
          />
        </div>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <Link href={routes.commanderList("wermacht")} prefetch={false}>
              <div style={myCenterStyle}>
                <Image
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconImport("wermacht")}
                  alt="wermacht"
                />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link href={routes.commanderList("wgerman")} prefetch={false}>
              <div style={myCenterStyle}>
                <Image
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconImport("wgerman")}
                  alt="wgerman"
                />
              </div>
            </Link>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <Link href={routes.commanderList("soviet")} prefetch={false}>
              <div style={myCenterStyle}>
                <Image
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconImport("soviet")}
                  alt="soviet"
                />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link href={routes.commanderList("british")} prefetch={false}>
              <div style={myCenterStyle}>
                <Image
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconImport("british")}
                  alt="british"
                />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link href={routes.commanderList("usf")} prefetch={false}>
              <div style={myCenterStyle}>
                <Image
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconImport("usf")}
                  alt="usf"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};
