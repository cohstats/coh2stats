import { Col, Row, Form, Input, Button } from "antd";
import React, { useEffect } from "react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const inputList = [
  {
    label: "Twitch Profile",
    pattern: /^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/,
    name: "twitchProfile",
  },
  {
    label: "Youtube Profile",
    pattern:
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
    name: "youtubeProfile",
  },
  {
    label: "Reddit Profile",
    pattern:
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/, // Update Later
    name: "redditProfile",
  },
  {
    label: "Twitter Profile",
    pattern: /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
    name: "twitterProfile",
  },
  {
    label: "CoH 2 Org Profile",
    pattern:
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/, // Update Later
    name: "coh2orgProfile",
  },
];

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

  const onFinish = (values: any) => {
    console.log("Success:", values);
    //save profile here
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row justify="center" style={{ paddingTop: "20px" }}>
        <Col xs={23} xxl={17}>
          <Form
            name="userProfileForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {inputList.map((item) => (
              <Form.Item
                label={`${item.label}`}
                name={`${item.name}`}
                rules={[
                  { message: `Please enter a valid ${item.label}!`, pattern: item.pattern },
                ]}
              >
                <Input />
              </Form.Item>
            ))}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UserProfile;
