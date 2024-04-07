import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
export default function DashSidebar() {
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
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem
            href="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={HiUser}
            label={"User"}
            labelColor="dark">
            Profile
          </SidebarItem>

          <SidebarItem icon={HiArrowSmRight}>Sign Out</SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
