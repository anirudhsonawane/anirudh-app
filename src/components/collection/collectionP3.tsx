import CollectionPage from "./collectionPage";
import "./collectionP3page.css";

function CollectionP3() {
  return (
    <CollectionPage
      pageClass="collection-page--urban"
      cardSelector=".collection-panel.urban"
      titleLines={["URBAN", "LIVING"]}
      eyebrow="COLLECTION NO. 03 — CITY EDITION"
      description={[
        "A collection shaped by the energy",
        "of the city and its everyday rhythm.",
      ]}
      image="/images/img3.webp"
      imageAlt="Urban residential architecture"
      imageCaption="CITY LIVING"
      collectionNumber="03"
    />
  );
}

export default CollectionP3;
