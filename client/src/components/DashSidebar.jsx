import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiUsers,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup>
          {currentUser.isAdmin && (
            <SidebarItem
              href="/dashboard?tab=dashboard"
              active={tab === "dashboard" || !tab}
              icon={HiChartPie}>
              Dashboard
            </SidebarItem>
          )}

          <SidebarItem
            href="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark">
            Profile
          </SidebarItem>

          {currentUser.isAdmin && (
            <>
              <SidebarItem
                href="/dashboard?tab=posts"
                active={tab === "posts"}
                icon={HiDocumentText}>
                Posts
              </SidebarItem>
              <SidebarItem
                href="/dashboard?tab=users"
                active={tab === "users"}
                icon={HiUsers}>
                Users
              </SidebarItem>
              <SidebarItem
                href="/dashboard?tab=comments"
                active={tab === "comments"}
                icon={HiAnnotation}>
                Comments
              </SidebarItem>
            </>
          )}

          <SidebarItem icon={HiArrowSmRight} onClick={handleSignout}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
