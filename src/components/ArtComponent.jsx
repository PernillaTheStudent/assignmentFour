import { useEffect, useState } from "react";
import Loading from "../Loading";

const ArtComponent = ({ apiLink, thumbnail, title }) => {
    const [manifestData, setManifestData] = useState(null);

    const { alt_text: altText } = thumbnail;
    console.log({ altText })
    // let altText = thumbnail.alt_text;
    console.log({ title })

    useEffect(() => {
        fetch(apiLink)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then((jsonData) => {
                setManifestData(jsonData);
            })
            .catch((error) => {
                console.error('Error fetching additional info:', error);
            });

    }, [apiLink]);

    if (!manifestData) {
        return <div>Loading... </div>;
        // return <Loading />;
    }

    // let licenseLinks = manifestData.info.license_links
    let artPiece = manifestData.data;
    let imageUrl = "https://www.artic.edu/iiif/2/" + artPiece.image_id + "/full/400,/0/default.jpg"
    // console.log({ artPiece })

    
    const truncateTitle = (title) => {
        const MAX_TITLE_lENGTH = 36;
        console.log({title})
        if (title === '"Untitled"') {
            return "No Title"
        }
        if (title.length <= MAX_TITLE_lENGTH) {
            return title
        } else {
            const lastSpaceIndex = title.lastIndexOf(' ', MAX_TITLE_lENGTH - 3); // Find the last space within the truncation limit
            if (lastSpaceIndex === -1) {
                // If no space found, truncate the title to the exact limit and add '...'
                return title.slice(0, MAX_TITLE_lENGTH - 3) + '...';
            } else {
                // Otherwise, truncate from the last space and add '...'
                return title.slice(0, lastSpaceIndex) + '...';
            }

        }
    };

    const shortenedTitle = truncateTitle(title);

    return <>
        <div className="art-wrapper">
            <div className="art-frame" >
                <div className="frame-content">
                    <img className="art-pic" alt="Art item" src={imageUrl} />
                    <div className="artist">
                        <h2>{shortenedTitle}</h2>
                        {artPiece.artist_title&& <h3>{`By ${artPiece.artist_title}`}</h3>}
                    </div>
                    <div className="view-button">
                        <button>View</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ArtComponent;