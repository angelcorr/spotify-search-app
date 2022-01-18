import axios from 'axios';

import './style.css';

const getImage = (result) =>
  (result.type === 'track' ? result.album.images[1]?.url : result.images[1]?.url) ||
  'https://via.placeholder.com/120x120';

const getUrl = (result) => result?.external_urls?.spotify || 'https://www.spotify.com/';

const addAllTypesToNextUrl = (nextUrl) => {
  const baseUrl = nextUrl.substring(0, nextUrl.indexOf('?'));
  const query = nextUrl.substring(nextUrl.indexOf('?'));

  const searchParams = new URLSearchParams(query);
  searchParams.set('type', 'album,artist,track');
  return `${baseUrl}?${searchParams.toString()}`;
};

const ResultsForAll = ({ token, results, setResults, setLoading, nextUrl, setNextUrl }) => {
  const handleShowMore = async () => {
    setLoading(true);

    const headers = { Authorization: `Bearer ${token}` };
    // Adding all types to just albums next URL
    const { data } = await axios.get(addAllTypesToNextUrl(nextUrl), { headers });
    const results = [...data.albums.items, ...data.artists.items, ...data.tracks.items];
    const newNextUrl = data.albums.next; // Using albums as reference next URL
    setNextUrl(newNextUrl);
    setResults((oldResults) => [...oldResults, ...results]);

    setLoading(false);
  };

  const displayFiveCount = results.length - (results.length % 5);
  const displayFive = results.slice(0, displayFiveCount);

  return (
    <div className="Results">
      <div className="ResultList">
        {displayFive.map(result => (
          <a href={getUrl(result)} target="_blank" rel="noreferrer">
            <div key={result.id} className="Result">
              <img src={getImage(result)} alt={result.name} />
              <div>
                <p>{result.name}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {(displayFive.length > 0 && nextUrl) && (
        <div className='ShowMore'>
          <button type="button" onClick={handleShowMore}>Show 5 more</button>
        </div>
      )}
    </div>
  );
};

const ResultsForType = ({ token, results, setResults, setLoading, nextUrl, setNextUrl, searchType }) => {
  const handleShowMore = async () => {
    setLoading(true);

    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(nextUrl, { headers });
    const results = data[searchType.toLowerCase() + 's'].items;
    const newNextUrl = data[searchType.toLowerCase() + 's'].next;
    setNextUrl(newNextUrl);
    setResults((oldResults) => [...oldResults, ...results]);

    setLoading(false);
  };

  return (
    <div className='Results'>
      <div className="ResultList">
        {results.map(result => (
          <a href={getUrl(result)} target="_blank" rel="noreferrer">
            <div key={result.id} className="Result">
              <img src={getImage(result)} alt={result.name} />
              <p> {result.name} </p>
            </div>
          </a>
        ))}
      </div>

      {(results.length > 0 && nextUrl) && (
        <div className="ShowMore">
          <button type="button" onClick={handleShowMore}>Show 5 more</button>
        </div>
      )}
    </div>
  );
};

const Results = ({ token, results, setResults, searchType, setLoading, nextUrl, setNextUrl }) => {
  if (searchType === 'All') {
    return <ResultsForAll token={token} results={results} setResults={setResults} setLoading={setLoading} nextUrl={nextUrl} setNextUrl={setNextUrl} />
  }

  return <ResultsForType token={token} results={results} setResults={setResults} setLoading={setLoading} nextUrl={nextUrl} setNextUrl={setNextUrl} searchType={searchType} />;
};

export default Results;
