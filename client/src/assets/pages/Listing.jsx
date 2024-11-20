
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper,  SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../../components/Contact';
import { sliderSettings } from "../../sliderSettings.js";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);


  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

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
    <div className='bg-[#EEEEEE]'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide  key={url}>
                <div
                  className='lg:h-[550px] rounded-lg h-[200px] w-[300px] md:h-[450px] md:w-[650px] lg:w-[1250px] mx-auto mb-5 mt-24'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='absolute top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center shadow-gray-300 shadow-sm items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='absolute shadow-gray-300 shadow-sm top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-7xl mx-auto p-3 gap-5'>
            <p className='lg:text-3xl text-lg font-bold'>
              {listing.name} - <span className='text-green-700'>${''}
              {listing.offer
                ? listing.discountedPrice.toLocaleString('en-us') 
                : listing.regularPrice.toLocaleString('en-us') }
              {listing.type === 'rent' && ' / month'}
              </span>
            </p>
            <p className='flex items-center gap-2 mt-[-10px] text-slate-600  lg:text-md text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex mt-2 gap-4'>
              <p className='w-full max-w-[300px] text-green-900 text-center font-bold p-1 rounded-md'>
                ({listing.type === 'rent' ? 'For Rent' : 'For Sale'})
              </p>
              {listing.offer && (
                <p className='w-full max-w-[300px] text-green-900 font-bold text-center p-1 rounded-md'>
                  (${+listing.regularPrice  - +listing.discountedPrice } OFF)
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black lg:text-lg text-sm mt-5'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-bold lg:text-xl text-xs flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
{/*             {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )} */}
{/*             {contact && <Contact listing={listing} />} */}
  <div className="flex gap-5 justify-center">
        <a
            className="mt-4 bg-red-700 w-full max-w-[300px] text-white font-bold text-center p-1 rounded-full"
            href="tel:+919625021125"
          >
            Call now
          </a>
        <a
            className="mt-4 bg-green-700 w-full max-w-[300px] text-white font-bold text-center p-1 rounded-full"
            href="https://wa.me/9625021125"
          >
            Whatsapp
          </a>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
