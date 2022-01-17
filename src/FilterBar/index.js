import './style.css';

const FilterBar = ({ getFirstPage, query, searchType, setSearchType }) => {
  const handleClick = async (event) => {
    const newSearchType = event.target.innerText;

    setSearchType(newSearchType);
    await getFirstPage(query, newSearchType);
  };

  return (
    <div className="SearchBar">
      <button type="button" onClick={handleClick} className={searchType === 'All' ? 'FilterBarCurrent' : 'FilterButton'}>All</button>
      <button type="button" onClick={handleClick} className={searchType === 'Artist' ? 'FilterBarCurrent' : 'FilterButton'}>Artist</button>
      <button type="button" onClick={handleClick} className={searchType === 'Album' ? 'FilterBarCurrent' : 'FilterButton'}>Album</button>
      <button type="button" onClick={handleClick} className={searchType === 'Track' ? 'FilterBarCurrent' : 'FilterButton'}>Track</button>
    </div>
  );
};

export default FilterBar;
