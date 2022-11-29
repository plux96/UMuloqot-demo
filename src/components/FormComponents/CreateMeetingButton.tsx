import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CreateMeetingButton({
  createMeeting,
  isEdit,
  closeFlyout,
}: {
  createMeeting: () => void;
  isEdit?: boolean;
  closeFlyout?: () => {};
}) {
  const navigate = useNavigate();
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiButton
          color="danger"
          fill
          onClick={() => (isEdit ? closeFlyout!() : navigate("/"))}
        >
          Cancel
        </EuiButton>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton color="primary" fill onClick={createMeeting}>
          {isEdit ? "Edit Meeting" : "Create Meeting"}
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}

// 11570 -> 11 570 000 UZS
// 64,18 -> 64 180 RUB -> 1025 USD
