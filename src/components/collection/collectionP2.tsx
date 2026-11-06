import CollectionPage from "./collectionPage";
import "./collectionP2page.css";

function CollectionP2() {
  return (
    <CollectionPage
      pageClass="collection-page--evergreen"
      cardSelector=".collection-panel.evergreen"
      titleLines={["EVER", "GREEN"]}
      eyebrow="COLLECTION NO. 02 — LANDSCAPE LIVING"
      description={[
        "A quieter kind of luxury,",
        "surrounded by nature and open space.",
      ]}
      image="/images/img2.webp"
      imageAlt="Evergreen residential landscape"
      imageCaption="GREEN ESCAPES"
      collectionNumber="02"
    />
  );
}

export default CollectionP2;
