import { EuiFlexGroup, EuiFlexItem, EuiForm, EuiSpacer } from "@elastic/eui";
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

function SingleMeeting() {
  useAuth();
  const navigate = useNavigate();
  const [users] = useFetchUsers();
  const uid = useAppSelector((data) => data.auth.userInfo?.uid);
  const [meetingName, setMeetingName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
  const [createToast] = useToast();
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
      errors = true;
    } else {
      clonedShowError.meetingUser.show = false;
      clonedShowError.meetingUser.message = [];
    }
    setShowErrors(clonedShowError);
    return errors;
  };

  const createMeeting = async () => {
    if (!validateForm()) {
      const meetingId = generateMeetingId();
      await addDoc(meetingsRef, {
        createdBy: uid,
        meetingId,
        meetingName,
        meetingType: "1-on-1",
        invitedUsers: [selectedUsers[0].uid],
        meetingDate: startDate.format("L"),
        maxUsers: 1,
        status: true,
      });
      createToast({
        title: "One to One Meeting Created Successfully",
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
          <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
          />

          <MeetingUsersField
            label="Invite users"
            options={users}
            onChange={onUserChange}
            selectedOptions={selectedUsers}
            singleSelection={{ asPlaingText: true }}
            isClear={false}
            placeholder="Select a user"
            isInvalid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}
          />
          <EuiSpacer />

          <MeetingDateField selected={startDate} setStartDate={setStartDate} />
          <EuiSpacer />
          <CreateMeetingButton createMeeting={createMeeting} />
        </EuiForm>
      </EuiFlexGroup>
    </div>
  );
}

export default SingleMeeting;
