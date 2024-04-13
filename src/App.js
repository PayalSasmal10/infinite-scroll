import { useEffect, useRef, useState } from "react";
import "./App.css";

const TOTAL_PAGES = 5;

function App() {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [lastElement, setLastElement] = useState(null);


  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if(first.isIntersecting){
          setPageNum((pageno) => pageno+1);
        }
      })
  );

  const callUser = async () => {
    setLoading(true);
    try {
      let response = await fetch(
        `https://randomuser.me/api/?page=${pageNum}&results=25`
      );
      let data = await response.json();
      let all = [...allUsers, ...data.results]
      setAllUsers([...all]);
      console.log(all);
      setLoading(false);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    if (pageNum <= TOTAL_PAGES) {
      callUser();
    }
  }, [pageNum]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if(currentElement){
      currentObserver.observe(currentElement);
    }
    return () =>{
      if(currentElement){
        currentObserver.unobserve(currentElement);
      }
    }
  }, [lastElement])

  const UserCard = ({ data }) => {
    return (
      <div className="p-4 border border-gray-500 rounded bg-white flex items-center">
        <div>
          <img
            src={data.picture.medium}
            className="w-16 h-16 rounded-full border-2 border-green-600"
            alt="user"
          />
        </div>
        <div className="ml-3">
          <p className="text-base font-bold">
            {data.name.first} {data.name.last}
          </p>
          <p className="text-sm text-gray-800">
            {data.location.city} {data.location.country}
          </p>
          <p className="text-sm text-gray-500 break-all">{data.email}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-44 bg-gray-100 p-6">
      <h1 className='text-3xl text-center mt-4 mb-10'>All Users</h1>
      <div className='grid grid-cols-3 gap-4'>
        {allUsers.length > 0 &&
          allUsers.map((user, index) => {
            return index === allUsers.length - 1 &&
             !loading && pageNum <= TOTAL_PAGES ? (

              <div key={`${user.name.first}-${index}`}
                ref={setLastElement}
              >
                <UserCard data={user} />
              </div>
             ):(
              <UserCard data={user} key={`${user.name.first}-${index}`}/>
             )
            
          })}
      </div>
      {loading && <p className="text-center">Loading....</p>}

      {pageNum - 1 === TOTAL_PAGES && (
                <p className='text-center my-10'>♥</p>
            )}
    </div>
  );
}

export default App;
