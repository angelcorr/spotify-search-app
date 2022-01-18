import { useState } from 'react';
import axios from 'axios';

import './App.css';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import Results from './Results';
import Authorization from './Authorization';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('All');
  const [nextUrl, setNextUrl] = useState(null);
  const [token, setToken] = useState(null);

  const getFirstPage = async (query, searchTypeInput = searchType) => {
    if (!query) return;

    setLoading(true);

    const params = {
      q: query,
      type: searchTypeInput === 'All' ? 'album,artist,track' : searchTypeInput.toLowerCase(),
      limit: searchTypeInput === 'All' ? 2 : 5,
      offset: 0,
    };
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get('https://api.spotify.com/v1/search', { params, headers });

    const results = searchTypeInput === 'All' ?
      [...data.albums.items, ...data.artists.items, ...data.tracks.items] :
      data[`${searchTypeInput.toLowerCase()}s`].items;
    const nextUrl = searchTypeInput === 'All' ?
      data.albums.next : // Using albums as reference next URL
      data[`${searchTypeInput.toLowerCase()}s`].next;
    setNextUrl(nextUrl);
    setResults(results);

    setLoading(false);
  };

  if (!token) return <Authorization token={token} setToken={setToken} />;

  return (
    <main className="App">
      {loading && 
        <div className="SpinnerLoading">
          <img 
            src="./loader_transparent.gif"
            alt="Spinner loading"
          />
        </div>
      }
      <section className="SearchFilterBar">
        <SearchBar getFirstPage={getFirstPage} query={query} setQuery={setQuery} />
        <FilterBar getFirstPage={getFirstPage} query={query} searchType={searchType} setSearchType={setSearchType} />
      </section>
      <section>
        <Results token={token} results={results} searchType={searchType} setLoading={setLoading} setResults={setResults} nextUrl={nextUrl} setNextUrl={setNextUrl} />
      </section>
    </main>
  );
}

export default App;
