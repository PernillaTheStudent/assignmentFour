import { useEffect, useState } from 'react'
import { useLocation, NavLink } from "react-router-dom"
import Loading from './Loading'
import ArtComponent from "./components/ArtComponent"

import "./styles/app.css";

function App() {

  const [isLoading, setIsLoading] = useState(true)
  const [artworks, setArtworks] = useState([]);

  let artWorkTypeId = useLocation().pathname.split("/")[2];

  useEffect(() => {
    let subscribed = true;

    const fetchData = async (id) => {
      try {
        const response = await fetch(
          'https://api.artic.edu/api/v1/artworks/search?limit=20&page=1',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: {
                term: {
                  artwork_type_id: id,
                },
              },
            }),
          }
        );

        if (response.ok) {
          const jsonData = await response.json();
          console.log({ jsonData })
          setArtworks(jsonData.data);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subscribed) {
      if (artWorkTypeId === undefined) {
        fetchData(1)
      } else {
        fetchData(artWorkTypeId);
      }
    }

    return () => {
      subscribed = false;
    }
  }, [artWorkTypeId]);

  return (
    <>
      <div className="main-wrapper">
        <div className="wrapper">
          <header className="header">
            <h1>Explore Artists & Art Pieces</h1>
            <h3>– With Art from The Art Institute of Chicago</h3>
          </header>
          <div className="menu">
            <NavLink className="tab" to="/paintings/1">
              <h3><span style={{ color: 'rgb(199, 124, 63)' }}>&#x2665;</span> Paintings</h3>
            </NavLink>
            <NavLink className="tab" to="/drawings/14">
              <h3><span style={{ color: "#BFA054" }}>&#x2666;</span> Drawings</h3>
            </NavLink>
            <NavLink className="tab" to="/prints/18">
              <h3><span style={{ color: "#767943" }}>&#x2663;</span> Prints</h3>
            </NavLink>
            <NavLink className="tab" to="/sculptures/3">
              <h3><span style={{ color: "#D9A739" }}>&#x2660;</span> Sculptures</h3>
            </NavLink>
          </div>
          <div className="type-of-art">
            {artWorkTypeId === "1" || artWorkTypeId === undefined ? <h2>Paintings</h2> : null}
            {artWorkTypeId === "14" ? <h2>Drawings</h2> : null}
            {artWorkTypeId === "18" ? <h2>Prints & Drawings</h2> : null}
            {artWorkTypeId === "3" ? <h2>Sculptures</h2> : null}
          </div>
          <div className="content">

            {isLoading ? <Loading /> :
              artworks.map((art) => {
                console.log({ art })
                let apiLink = art.api_link
                return <>
                  {
                    <ArtComponent key={art.id} apiLink={apiLink} {...art} />
                  }
                </>
              })}
          </div>
        </div>
        <div className="footer">
          <NavLink to="https://www.figma.com/community/file/1148855963126865475">Based on NickelFox design</NavLink>
        </div>
      </div>
    </>
  );
}

export default App;
