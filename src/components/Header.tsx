import {
  EuiHeader,
  EuiBreadcrumb,
  EuiText,
  EuiTextColor,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
} from "@elastic/eui";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { changeTheme } from "../app/slices/AuthSlice";
import {
  getCreateMeetingBreadCrumbs,
  getSingleMeetingBreadCrumbs,
  getVideoConferenceMeetingBreadCrumbs,
} from "../utils/breadCrumbs";

const logout = () => {
  signOut(firebaseAuth);
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = useAppSelector((data) => data.auth.userInfo?.name);
  const isDarkTheme = useAppSelector((data) => data.auth.isDarkTheme);
  const [breadCrumbs, setBreadCrumbs] = useState([{ text: "Dashboard" }]);
  const [isResponsive, setIsResponsive] = useState(false);
  const dispatch = useDispatch();

  const invertTheme = () => {
    const theme = localStorage.getItem("u-theme");
    localStorage.setItem("u-theme", theme === "light" ? "dark" : "light");
    dispatch(changeTheme({ isDarkTheme: !isDarkTheme }));
  };

  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/create") {
      setBreadCrumbs(getCreateMeetingBreadCrumbs(navigate));
    } else if (pathname === "/create1on1") {
      setBreadCrumbs(getSingleMeetingBreadCrumbs(navigate));
    } else if (pathname === "/createvideoconference") {
      setBreadCrumbs(getVideoConferenceMeetingBreadCrumbs(navigate));
    }
  }, [location, navigate]);

  const section = [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw" }}>
              <EuiTextColor color="#0b5cff">UMuloqot</EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },
    {
      items: [
        <>
          {username ? (
            <EuiText>
              <h3>
                <EuiTextColor color="white">Hello, </EuiTextColor>
                <EuiTextColor color="#0b5cff">{username}</EuiTextColor>
              </h3>
            </EuiText>
          ) : null}
        </>,
      ],
    },
    {
      items: [
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          direction="row"
          style={{ gap: "2vw" }}
        >
          <EuiFlexItem
            grow={false}
            style={{
              flexBasis: "fit-content",
            }}
          >
            {isDarkTheme ? (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="sun"
                display="fill"
                size="s"
                color="warning"
                arial-label="invertTheme-button"
              />
            ) : (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="moon"
                display="fill"
                size="s"
                color="ghost"
                arial-label="invertTheme-button"
              />
            )}
          </EuiFlexItem>
          <EuiFlexItem
            grow={false}
            style={{
              flexBasis: "fit-content",
              cursor: "pointer",
            }}
            onClick={logout}
          >
            <EuiButtonIcon
              iconType="lock"
              display="fill"
              aria-label="logout-button"
            />
            <EuiText>
              <h4>
                <EuiTextColor color="white">Loguot</EuiTextColor>
              </h4>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>,
      ],
    },
  ];
  const responsiveSection = [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw" }}>
              <EuiTextColor color="#0b5cff">UMuloqot</EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },

    {
      items: [
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          direction="row"
          style={{ gap: "2vw" }}
        >
          <EuiFlexItem
            grow={false}
            style={{
              flexBasis: "fit-content",
            }}
          >
            {isDarkTheme ? (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="sun"
                display="fill"
                size="s"
                color="warning"
                arial-label="invertTheme-button"
              />
            ) : (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="moon"
                display="fill"
                size="s"
                color="ghost"
                arial-label="invertTheme-button"
              />
            )}
          </EuiFlexItem>
          <EuiFlexItem
            grow={false}
            style={{
              flexBasis: "fit-content",
              cursor: "pointer",
            }}
            onClick={logout}
          >
            <EuiButtonIcon
              iconType="lock"
              display="fill"
              aria-label="logout-button"
            />
            <EuiText>
              <h4>
                <EuiTextColor color="white">Loguot</EuiTextColor>
              </h4>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>,
      ],
    },
  ];

  useEffect(() => {
    if (window.innerWidth < 480) setIsResponsive(true);
  }, []);

  return (
    <>
      <EuiHeader
        style={{ minHeight: "8vh" }}
        theme="dark"
        sections={isResponsive ? responsiveSection : section}
      />
      <EuiHeader
        style={{ minHeight: "8vh" }}
        sections={[{ breadcrumbs: breadCrumbs }]}
      />
    </>
  );
}

export default Header;
