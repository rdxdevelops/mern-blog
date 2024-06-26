import {
  Footer as FlowbiteFooter,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
import { useEffect, useRef } from "react";

export default function Footer() {
  const footerIconContainerRef = useRef();
  useEffect(() => {
    footerIconContainerRef.current
      .querySelectorAll("svg")
      .forEach((svg) =>
        svg.classList.add(
          "hover:scale-125",
          "transition-transform",
          "duration-300"
        )
      );
  }, []);

  return (
    <FlowbiteFooter container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Rahul's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="About"></FooterTitle>
              <FooterLinkGroup col>
                <FooterLink
                  href="https://www.freecodecamp.org/"
                  target="_blank"
                  rel="noopener noreferrer">
                  Free Code Camp
                </FooterLink>
                <FooterLink
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer">
                  Rahul's Blog
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow Us"></FooterTitle>
              <FooterLinkGroup col>
                <FooterLink
                  href="https://www.github.com/rdxdevelops"
                  target="_blank"
                  rel="noopener noreferrer">
                  Github
                </FooterLink>
                <FooterLink href="#">Discord</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal"></FooterTitle>
              <FooterLinkGroup col>
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            href="#"
            by="Rahul's Blog"
            year={new Date().getFullYear()}
          />
          <div
            className="flex gap-6 sm:justify-center sm:mt-0 mt-4"
            ref={footerIconContainerRef}>
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitterX} />
            <FooterIcon
              href="https://www.github.com/rdxdevelops"
              icon={BsGithub}
            />
            <FooterIcon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </FlowbiteFooter>
  );
}
