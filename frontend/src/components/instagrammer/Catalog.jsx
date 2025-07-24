import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../css/Catalog.css';

function Catalog () {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/otherSeller")
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to fetch data:", err));
  }, []);

  const filtered = data.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.acc?.toLowerCase().includes(search.toLowerCase())
  );

  return (
	<div className="catalog-container">
	<div className="catalog-header">
		<h2>Catalog</h2>
		<input
		type="text"
		placeholder="Search by name or acc"
		value={search}
		onChange={(e) => setSearch(e.target.value)}
		className="catalog-search"
		/>
	</div>

	<div className="catalog-grid">
		{filtered.map((item, index) => (
		<div key={index} className="catalog-card">
			<p><strong>Name:</strong> {item.name}</p>
			<p><strong>Size:</strong> {item.size}</p>
			<p><strong>Condition:</strong> {item.condition}</p>
			<p><strong>Price:</strong> {item.price}</p>
			<p><strong>Account:</strong> {item.acc}</p>
		</div>
		))}
	</div>
	</div>
  );
}

export default Catalog;
