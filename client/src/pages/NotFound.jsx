import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-start gap-4 m-7">
      <h2 className="text-3xl text-red-500">404 Not Found</h2>
      <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
      <Link to={'/'} className="text-teal-500 hover:underline">Go to home</Link>
    </div>
  );
}
