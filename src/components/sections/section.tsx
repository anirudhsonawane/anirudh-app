type Collection = {
  number: string;
  title: string;
  description: string;
  theme: string;
  image: string;
  imageAlt: string;
};

const collections: Collection[] = [
  {
    number: "01",
    title: "By The Sea",
    description: "Coastal, Marina &\nSeafront properties",
    theme: "sea",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Luxury coastal property",
  },
  {
    number: "02",
    title: "Evergreen",
    description: "Golf Resorts, parks &\nForest Oasis",
    theme: "evergreen",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Luxury property surrounded by greenery",
  },
  {
    number: "03",
    title: "Urban Living",
    description: "City center & Old city\nvibes and lifestyle",
    theme: "urban",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Contemporary urban property",
  },
  {
    number: "04",
    title: "Rare Gems",
    description: "One of a kind & Unique\nconcept Properties",
    theme: "gems",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Unique luxury property",
  },
];

export default function CollectionsSection() {
  return (
    <section
      className="collections-section"
      id="selection"
      aria-label="Explore our property collections"
    >
      <div className="collections-container">
        <div className="collections-heading">
          <span>OUR COLLECTIONS</span>
          <span>DISCOVER EXCEPTIONAL PLACES</span>
        </div>

        <div className="collections-grid">
          {collections.map((collection) => (
            <article
              className={`collection-card collection-${collection.theme}`}
              key={collection.number}
            >
              <div className="collection-content">
                <div className="collection-card-top">
                  <span className="collection-mark" aria-label="Realevate">
                    <span className="collection-mark-line" />R
                  </span>

                  <span className="collection-number">{collection.number}</span>
                </div>

                <h2 className="collection-title">{collection.title}</h2>

                <p className="collection-description">
                  {collection.description.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>

                <span className="collection-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className="collection-image">
                <img
                  src={collection.image}
                  alt={collection.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="collections-footer">
          <span>REALEVATE — PROPERTY COLLECTIONS</span>
          <span>01 — 04</span>
        </div>
      </div>
    </section>
  );
}
