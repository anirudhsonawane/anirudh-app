import CollectionPage from "./collectionPage";
import "./collectionP4page.css";

function CollectionP4() {
  return (
    <CollectionPage
      pageClass="collection-page--gems"
      cardSelector=".collection-panel.gems"
      titleLines={["RARE", "GEMS"]}
      eyebrow="COLLECTION NO. 04 — THE EXCEPTIONAL"
      description={[
        "Distinctive spaces and uncommon ideas,",
        "selected for those who seek the rare.",
      ]}
      image="/images/img4.webp"
      imageAlt="Distinctive architectural property"
      imageCaption="RARE FINDS"
      collectionNumber="04"
    />
  );
}

export default CollectionP4;
