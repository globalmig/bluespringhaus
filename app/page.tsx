import Image from "next/image";
import Search from "./components/common/Search";
import HeroSlider from "./components/home/HeroSlider";
import CardItem from "./components/common/CardItem";

export default function Home() {
  return (
    <div>
      <div className="relative">
        <HeroSlider />
        <div className="absolute top-80 left-1/2 transform -translate-x-1/2 w-full z-20 md:block hidden">
          <Search />
        </div>

        {/* TODO: 중복 코드 수정 */}
        {/* TODO: 데이터 연결되게 수정 */}
        <div className="my-10 md:my-20">
          <CardItem />
        </div>
        <div className="my-10 md:my-20">
          <CardItem />
        </div>
        <div className="my-10 md:my-20">
          <CardItem />
        </div>
        <div className="my-10 md:my-20">
          <CardItem />
        </div>
      </div>
    </div>
  );
}
