import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
} from "@elastic/eui";
import moment from "moment";
import React, { useId, useState } from "react";
import CreateMeetingButton from "../components/FormComponents/CreateMeetingButton";
import MeetingDateField from "../components/FormComponents/MeetingDateField";
import MeetingNameField from "../components/FormComponents/MeetingNameField";
import MeetingUsersField from "../components/FormComponents/MeetingUsersField";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import { meetingsRef } from "../utils/FirebaseConfig";
import { generateMeetingId } from "../utils/generateMeetingId";
import { FieldErrorType, UserType } from "../utils/Types";
import { addDoc } from "firebase/firestore";
import { useAppSelector } from "../app/hook";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import MeetingMaximumUserField from "../components/FormComponents/MeetingMaximumUserField";

function VideoConference() {
  useAuth();
  const navigate = useNavigate();
  const [users] = useFetchUsers();
  const [createToast] = useToast();

  const uid = useAppSelector((data) => data.auth.userInfo?.uid);
  const [meetingName, setMeetingName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
  const [size, setSize] = useState(1);
  const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);

  const [showErrors, setShowErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUser: {
      show: false,
      message: [],
    },
  });

  const onUserChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };

  const validateForm = () => {
    let errors = false;
    const clonedShowError = { ...showErrors };
    if (!meetingName.length) {
      clonedShowError.meetingName.show = true;
      clonedShowError.meetingName.message = ["Please Enter Meeting Name"];
      errors = true;
    } else {
      clonedShowError.meetingName.show = false;
      clonedShowError.meetingName.message = [];
    }
    if (!selectedUsers.length) {
      clonedShowError.meetingUser.show = true;
      clonedShowError.meetingUser.message = ["Please select a User"];
      errors = anyoneCanJoin ? false : true;
    } else {
      clonedShowError.meetingUser.show = false;
      clonedShowError.meetingUser.message = [];
    }
    setShowErrors(clonedShowError);
    return errors;
  };

  const createMeeting = async () => {
    if (!validateForm()) {
      console.log("hello");
      const meetingId = generateMeetingId();
      await addDoc(meetingsRef, {
        createdBy: uid,
        meetingId,
        meetingName,
        meetingType: anyoneCanJoin ? "anyone-can-join" : "video-conference",
        invitedUsers: anyoneCanJoin
          ? []
          : selectedUsers.map((user: UserType) => user.uid),
        meetingDate: startDate.format("L"),
        maxUsers: anyoneCanJoin ? 100 : size,
        status: true,
      });
      createToast({
        title: anyoneCanJoin
          ? "Anyone can join meeting created successfully"
          : "Video Conference created successfully",
        type: "success",
      });
      navigate("/");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Header />
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiForm>
          <EuiFormRow display="columnCompressedSwitch" label="Anyone can join">
            <EuiSwitch
              showLabel={false}
              label="Anyone cna Join"
              checked={anyoneCanJoin}
              onChange={(e) => setAnyoneCanJoin(e.target.checked)}
              compressed
            />
          </EuiFormRow>
          <EuiSpacer />
          <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
          />
          {anyoneCanJoin ? (
            <MeetingMaximumUserField value={+size} setValue={setSize} />
          ) : (
            <MeetingUsersField
              label="Invite users"
              options={users}
              onChange={onUserChange}
              selectedOptions={selectedUsers}
              singleSelection={false}
              isClear={false}
              placeholder="Select a user"
              isInvalid={showErrors.meetingUser.show}
              error={showErrors.meetingUser.message}
            />
          )}

          <EuiSpacer />

          <MeetingDateField selected={startDate} setStartDate={setStartDate} />
          <EuiSpacer />
          <CreateMeetingButton createMeeting={createMeeting} />
        </EuiForm>
      </EuiFlexGroup>
    </div>
  );
}

export default VideoConference;
