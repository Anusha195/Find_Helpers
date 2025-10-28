const CategoryCard = ({ name, image, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <img src={image} alt={name} className="category-img" />
      <p>{name}</p>
    </div>
  );
};

export default CategoryCard;
