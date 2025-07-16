import MostLikeProperty from "../../components/Properies/MostLikeProperty.jsx";
import MostViewProperty from "../../components/Properies/MostViewProperty.jsx";
import NearByProperty from "../../components/Properies/NearByProperty.jsx";
import RecentlyAdded from "../../components/Properies/RecentlyAdded.jsx";
import AboutUs from "./AboutUs.jsx";
import Categories from "./Categories.jsx";
import PropertyGuild from "./PropertyGuild.jsx";
import Slider from "./Slider.jsx";

export default function Home() {
  return (
    <>
      <Slider />
      <PropertyGuild />
      <Categories />
      <NearByProperty />
      <RecentlyAdded />
      <MostLikeProperty />
      <MostViewProperty />
      {/* <Partner /> */}
      <AboutUs />
    </>
  );
}
