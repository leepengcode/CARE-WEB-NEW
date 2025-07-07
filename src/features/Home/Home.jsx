import MostLikeProperty from "../../components/Properies/MostLikeProperty.jsx";
import MostViewProperty from "../../components/Properies/MostViewProperty.jsx";
import NearByProperty from "../../components/Properies/NearByProperty.jsx";
import RecentlyAdded from "../../components/Properies/RecentlyAdded.jsx";
import useScrollAtTop from "../../hooks/useScrollAtTop";
import Categories from "./Categories.jsx";
import Partner from "./Partner.jsx";
import PropertyGuild from "./PropertyGuild.jsx";
import Slider from "./Slider.jsx";

export default function Home() {
  const isAtTop = useScrollAtTop();

  return (
    <>
      <Slider isMenuAtTop={isAtTop} />
      <PropertyGuild />
      <Categories />
      <NearByProperty />
      <RecentlyAdded />
      <MostLikeProperty />
      <MostViewProperty />
      <Partner />
      {/* <AboutUs /> */}
    </>
  );
}
