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
import { Link, useLocation} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar({ onDashboardSidebarToggle }) {
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
        <SidebarItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Link
              onClick={() => onDashboardSidebarToggle(false)}
              to={"/dashboard?tab=dashboard"}
              className="block w-full h-full">
              <SidebarItem
                active={tab === "dashboard" || !tab}
                icon={HiChartPie}
                as={"div"}>
                Dashboard
              </SidebarItem>
            </Link>
          )}

          <Link
            onClick={() => onDashboardSidebarToggle(false)}
            to={"/dashboard?tab=profile"}
            className="w-full">
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as={"div"}>
              Profile
            </SidebarItem>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link
                onClick={() => onDashboardSidebarToggle(false)}
                to={"/dashboard?tab=posts"}
                className="w-full">
                <SidebarItem
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as={"div"}>
                  Posts
                </SidebarItem>
              </Link>
              <Link
                onClick={() => onDashboardSidebarToggle(false)}
                to={"/dashboard?tab=users"}
                className="w-full">
                <SidebarItem active={tab === "users"} icon={HiUsers} as={"div"}>
                  Users
                </SidebarItem>
              </Link>
              <Link
                onClick={() => onDashboardSidebarToggle(false)}
                to={"/dashboard?tab=comments"}
                className="w-full">
                <SidebarItem
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as={"div"}>
                  Comments
                </SidebarItem>
              </Link>
            </>
          )}

          <SidebarItem
            icon={HiArrowSmRight}
            onClick={handleSignout}
            className="cursor-pointer w-full text-red-500 dark:text-red-500">
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
