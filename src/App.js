import { useState } from 'react';
import axios from 'axios';

import './App.css';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import Results from './Results';
import getToken from './getToken';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('All');
  const [nextUrl, setNextUrl] = useState(null);

  const getFirstPage = async (query, searchTypeInput = searchType) => {
    if (!query) return;

    setLoading(true);

    const params = {
      q: query,
      type: searchTypeInput === 'All' ? 'album,artist,track' : searchTypeInput.toLowerCase(),
      limit: searchTypeInput === 'All' ? 2 : 5,
      offset: 0,
    };
    const headers = { Authorization: `Bearer ${getToken()}` };
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

  return (
    <main className="App">
      <section className="SearchFilterBar">
        <SearchBar getFirstPage={getFirstPage} query={query} setQuery={setQuery} />
        {loading && 
          <div className="SpinnerLoading">
            <img 
              src="./loader_transparent.gif"
              alt="Spinner loading"
            />
          </div>}
        <FilterBar getFirstPage={getFirstPage} query={query} searchType={searchType} setSearchType={setSearchType} />
      </section>
      <section>
        <Results results={results} searchType={searchType} setLoading={setLoading} setResults={setResults} nextUrl={nextUrl} setNextUrl={setNextUrl} />
      </section>
    </main>
  );
}

export default App;
