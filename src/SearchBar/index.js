import './style.css';

const SearchBar = ({ getFirstPage, query, setQuery }) => {
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await getFirstPage(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Search:
        <input value={query} onChange={handleChange} />
      </label>
    </form>
  );
};

export default SearchBar;
