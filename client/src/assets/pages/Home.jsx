import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../../components/ListingItem";
import { sliderSettings } from "../../sliderSettings.js";

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true");
        const data = await res.json();
        // console.log(data)
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent");
        const data = await res.json();
        setRentListings(data);
        fetchsaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchsaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  const SliderButtons = () => {
    const swiper = useSwiper();
    return (
      <div className=" font-black relative text-slate-800 flex gap-2">
        <button
          className="bg-slate-200 shadow-sm rounded-md mt-3 p-3 hover:opacity-80"
          onClick={() => swiper.slidePrev()}
        >
          &lt;
        </button>
        <button
          className="bg-slate-200 shadow-sm rounded-md mt-3 p-3 hover:opacity-80"
          onClick={() => swiper.slideNext()}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#EEEEEE]">
      {/* top */}
      <div className="bg-[#131110]">
        <div className="flex flex-col sm:gap-6 gap-3 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="mt-16 text-white font-bold sm:text-3xl text-xl lg:text-6xl">
            Find your next <span className="text-[#40A2D8]">perfect</span>{" "}
            <br /> place with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            skyEstate is the best place to find your next perfect place to live.{" "}
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            className="text-xs sm:text-sm text-[#008DDA] hover:underline"
            to={"/search"}
          >
            Let's get started
          </Link>
        </div>
      </div>

      {/* listing results */}

      {offerListings && offerListings.length > 0 && (
        <div className="max-w-6xl mx-auto p-3 gap-8 my-10">
          <div>
            <h2 className="sm:text-3xl text-xl font-bold text-slate-700">Recent offers</h2>
            <Link
              className="sm:text-sm text-[0.7rem] text-blue-800 hover:underline"
              to={"/search?offer=true"}
            >
              Show more offers
            </Link>
          </div>
          <Swiper {...sliderSettings}>
            <SliderButtons />
            <div className="flex flex-wrap item-center">
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <ListingItem listing={listing} key={listing._id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      )}
      {saleListings && saleListings.length > 0 && (
        <div className="max-w-6xl mx-auto p-3 gap-8 my-10">
          <div>
            <h2 className="sm:text-3xl text-xl font-bold text-slate-700">Recent places for sale</h2>
            <Link
              className="sm:text-sm text-[0.7rem] text-blue-800 hover:underline"
              to={"/search?offer=true"}
            >
              Show more offers
            </Link>
          </div>
          <Swiper {...sliderSettings}>
            <SliderButtons />
            <div className="flex flex-wrap item-center">
              {saleListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <ListingItem listing={listing} key={listing._id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      )}
      {rentListings && rentListings.length > 0 && (
        <div className="max-w-6xl mx-auto p-3 gap-8 my-10">
          <div>
            <h2 className="sm:text-3xl text-xl font-bold text-slate-700">Recent places for rent</h2>
            <Link
              className="sm:text-sm text-[0.7rem] text-blue-800 hover:underline"
              to={"/search?offer=true"}
            >
              Show more offers
            </Link>
          </div>
          <Swiper {...sliderSettings}>
            <SliderButtons />
            <div className="flex flex-wrap item-center">
              {rentListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <ListingItem listing={listing} key={listing._id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      )}

    </div>
  );
}

export default Home;
