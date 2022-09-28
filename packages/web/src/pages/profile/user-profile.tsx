import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const UserProfile: React.FC = () => {
  useEffect(() => {
    // THIS LOADS THE DAT FROM THE DATABASE
    (async () => {
      const docRef = doc(getFirestore(), "test", "mockProfile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })();
  }, []);

  // Maybe use as useEffect? It's up to you
  const saveProfile = async ({ twitchProfile = "whatever", youtubeProfile = "aasdfasd" }) => {
    // THIS SAVES THE DATA
    const userProfileRef = doc(getFirestore(), "test/mockProfile");
    await setDoc(userProfileRef, { twitchProfile, youtubeProfile }, { merge: true });
    // You can also send just one field to be updated
    await setDoc(userProfileRef, { youtubeProfile }, { merge: true });
  };

  return (
    <>
      <Row justify="center" style={{ paddingTop: "20px" }}>
        <Col xs={23} xxl={17}>
          USER PROFILE
        </Col>
      </Row>
    </>
  );
};

export default UserProfile;
