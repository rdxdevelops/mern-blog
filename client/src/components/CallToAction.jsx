import { Button } from "flowbite-react";
export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 items-center justify-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl">
          Want to learn more about JavaScript?
        </h2>
        <p className="text-gray-500 my-2">Check out these resources with free code camp.</p>
        <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
          <a href="https://www.freecodecamp.org/news/full-javascript-course-for-beginners/" target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://www.freecodecamp.org/news/content/images/2021/06/javascriptfull.png"
          alt="course image"
        />
      </div>
    </div>
  );
}
