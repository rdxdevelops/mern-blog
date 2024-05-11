import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

export default function Header() {
  const { pathname: path, search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const searchTermFromURL = urlParams.get("searchTerm");
    searchTermFromURL ? setSearchTerm(searchTermFromURL) : setSearchTerm("");
  }, [search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) {
      return;
    }
    setShowSearchBox(false);
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <Navbar className="border-b-2">
      {/* show search box on smaller screens when search icon is clicked */}

      {showSearchBox && (
        <div className="w-full flex gap-2">
          <div className="w-full flex justify-center items-center rounded-full border border-gray-300 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-700">
            <form
              onSubmit={handleSearch}
              className="relative w-full flex items-center">
              <AiOutlineSearch size={25} className="absolute left-4" />
              <input
                type="text"
                autoComplete="off"
                placeholder="Search posts"
                className="w-full border-none bg-inherit pl-12 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <RxCross2
                  size="20"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 cursor-pointer hover:text-teal-500"
                />
              )}
            </form>
          </div>
          <button
            onClick={() => setShowSearchBox(false)}
            className="text-teal-500">
            Cancel
          </button>
        </div>
      )}

      {/* show the complete navbar on larger screens and on smaller screens only when search icon is not clicked */}

      {!showSearchBox && (
        <>
          <Link
            to="/"
            className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Rahul's
            </span>
            Blog
          </Link>
          <form onSubmit={handleSearch}>
            <TextInput
              type="text"
              placeholder="Search..."
              rightIcon={AiOutlineSearch}
              className="hidden lg:inline"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <Button
            onClick={() => setShowSearchBox(true)}
            className="w-12 h-10 lg:hidden"
            color="gray"
            pill>
            <AiOutlineSearch />
          </Button>
          <div className="flex gap-2 md:order-2">
            <Button
              className="w-12 h-10 hidden sm:inline"
              color="gray"
              pill
              onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar alt="user" rounded img={currentUser.profilePicture} />
                }>
                <DropdownHeader>
                  <span className="block text-sm">@{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">
                    {currentUser.email}
                  </span>
                </DropdownHeader>

                {currentUser.isAdmin && (
                  <Link to={"/dashboard?tab=dashboard"}>
                    <DropdownItem>Dashboard</DropdownItem>
                  </Link>
                )}
                <Link to={"/dashboard?tab=profile"}>
                  <DropdownItem>Profile</DropdownItem>
                </Link>
                <DropdownDivider />
                <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
              </Dropdown>
            ) : (
              <Link to="/sign-in">
                <Button gradientDuoTone="purpleToBlue" outline>
                  Sign In
                </Button>
              </Link>
            )}
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            {/* Navbar.Link as well as Link components return <a> tags and one a tag cannot be a descendent of another a tag, so we add assertion as = {'div'} to each of the Navbar.Link components */}
            <Navbar.Link active={path === "/"} as={"div"}>
              <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={"div"}>
              <Link to="/about">About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/projects"} as={"div"}>
              <Link to="/projects">Projects</Link>
            </Navbar.Link>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
}
