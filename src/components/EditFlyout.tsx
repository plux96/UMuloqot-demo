import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import useToast from "../hooks/useToast";
import { FieldErrorType, MeetingType, UserType } from "../utils/Types";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../utils/FirebaseConfig";
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiTitle,
} from "@elastic/eui";
import MeetingNameField from "./FormComponents/MeetingNameField";
import MeetingMaximumUserField from "./FormComponents/MeetingMaximumUserField";
import MeetingUsersField from "./FormComponents/MeetingUsersField";
import MeetingDateField from "./FormComponents/MeetingDateField";
import CreateMeetingButton from "./FormComponents/CreateMeetingButton";

export default function EditFlyout({
  closeFlyout,
  meetings,
}: {
  closeFlyout: any;
  meetings: MeetingType;
}) {
  useAuth();
  const [users] = useFetchUsers();
  const [createToast] = useToast();
  const [meetingName, setMeetingName] = useState(meetings.meetingName);
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment(meetings.meetingDate));
  const [size, setSize] = useState(1);
  const [status, setStatus] = useState(false);
  const [meetingType] = useState(meetings.meetingType);

  const [showErrors] = useState<{
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

  useEffect(() => {
    if (users) {
      const foundUsers: Array<UserType> = [];
      meetings.invitedUsers.forEach((user: string) => {
        const findUser = users.find(
          (tempUser: UserType) => tempUser.uid === user
        );
        if (findUser) foundUsers.push(findUser);
      });
      setSelectedUsers(foundUsers);
    }
  }, [meetings, users]);

  const onUserChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };

  const editMeeting = async () => {
    const editedMeeting = {
      ...meetings,
      meetingName,
      meetingType,
      invitedUsers: selectedUsers.map((user: UserType) => user.uid),
      maxUsers: size,
      meetingDate: startDate.format("L"),
      status: !status,
    };
    delete editedMeeting.docId;
    const docRef = doc(firebaseDB, "meetings", meetings.docId!);
    await updateDoc(docRef, editedMeeting);
    createToast({ title: "Meeting updated Successfully", type: "success" });
    closeFlyout(true);
  };

  return (
    <div>
      <EuiFlyout ownFocus onClose={() => closeFlyout()}>
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2>{meetings.meetingName}</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiForm>
            <MeetingNameField
              label="Meeting Name"
              placeholder="Meeting Name"
              value={meetingName}
              setMeetingName={setMeetingName}
              isInvalid={showErrors.meetingName.show}
              error={showErrors.meetingName.message}
            />
            {meetingType === "anyone-can-join" ? (
              <MeetingMaximumUserField value={+size} setValue={setSize} />
            ) : (
              <MeetingUsersField
                label="Invite users"
                options={users}
                onChange={onUserChange}
                selectedOptions={selectedUsers}
                singleSelection={
                  meetingType === "1-on-1" ? { asPlainText: true } : false
                }
                isClear={false}
                placeholder="Select a user"
                isInvalid={showErrors.meetingUser.show}
                error={showErrors.meetingUser.message}
              />
            )}

            <EuiSpacer />

            <MeetingDateField
              selected={startDate}
              setStartDate={setStartDate}
            />
            <EuiFormRow>
              <EuiSwitch
                showLabel={false}
                label="Cancel Meeting"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
            </EuiFormRow>
            <EuiSpacer />
            <CreateMeetingButton
              createMeeting={editMeeting}
              isEdit
              closeFlyout={closeFlyout}
            />
          </EuiForm>
        </EuiFlyoutBody>
      </EuiFlyout>
    </div>
  );
}
