import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
