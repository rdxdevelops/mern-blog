import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComponent from "../components/DashboardComponent";

export default function Dashboard({ isSidebarVisibleInDashboard }) {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    // flex-col md:flex-row
    <div className="min-h-screen flex">
      <div
        className={`md:w-56 ${
          isSidebarVisibleInDashboard ? "w-full block" : "hidden md:block"
        }`}>
        <DashSidebar />
      </div>
      <div className={`${isSidebarVisibleInDashboard && "hidden"} w-full`}>
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "comments" && <DashComments />}
        {(tab === "dashboard" || !tab) && <DashboardComponent />}
      </div>
    </div>
  );
}
