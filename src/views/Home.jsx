import AboutUs from "../components/AboutUs.jsx";
import Categories from "../components/Categories.jsx";
import MostLikeProperty from "../components/Properies/MostLikeProperty.jsx";
import MostViewProperty from "../components/Properies/MostViewProperty.jsx";
import NearByProperty from "../components/Properies/NearByProperty.jsx";
import RecentlyAdded from "../components/Properies/RecentlyAdded.jsx";

import Slider from "../components/Slider.jsx";

export default function Home() {
  return (
    <>
      <Slider />
      <Categories />
      <NearByProperty />
      <RecentlyAdded />
      <MostLikeProperty />
      <MostViewProperty />
      <AboutUs />
    </>
  );
}
