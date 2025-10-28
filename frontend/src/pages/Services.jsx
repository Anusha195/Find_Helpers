import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import CategoryCard from "../components/CategoryCard";
import CategoryServiceRow from "../components/CategoryServiceRow";
import "../services.css";
import plumberImg from "../assets/services/plumber.png";
import electricianImg from "../assets/services/electrician.png";
import cleanerImg from "../assets/services/cleaner.png";
import carpenterImg from "../assets/services/carpenter.png";

import { useNavigate } from "react-router-dom";

const Services = ({ isLoggedIn }) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const fetchCategories = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(
        `http://localhost:5000/api/categories/categories-with-services?${params}`
      );
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFilterApply = () => {
    fetchCategories({
      search,
      minPrice,
      maxPrice,
    });
  };

  const handleBookNow = (service) => {
    console.log("Book now clicked:", service);
  };

  const popularCategories = [
    { name: "Plumbing", image: plumberImg, slug: "plumber" },
    { name: "Electrical Work", image: electricianImg, slug: "electrician" },
    { name: "Cleaning", image: cleanerImg, slug: "cleaner" },
    { name: "Carpenting", image: carpenterImg, slug: "carpenter" },
  ];

  return (
    <div className="services-page">
      <div className="top-filters">
        <div className="filters-row">
          <div className="filter-item">
            <label>Category Search:</label>
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label>Min Price:</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label>Max Price:</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button onClick={handleFilterApply}>Apply Filters</button>
        </div>
      </div>
      <section className="categories-section">
        <h3>Popular Categories</h3>
        <div className="categories-grid">
          {popularCategories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
              onClick={() => navigate(`/category/${category.slug}`)}
            />
          ))}
        </div>
      </section>
      <div className="dynamic-categories">
        {categories.map((cat) => (
          <CategoryServiceRow
            key={cat.id}
            category={cat}
            isLoggedIn={isLoggedIn}
            onAddToCart={addToCart}
            onBookNow={handleBookNow}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
