import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import ListingItem from '../components/ListingItem.jsx';

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [renListings, setRentListings] = useState([]);
    SwiperCore.use([Navigation])
    console.log('sale', saleListings)
    console.log('rent', renListings)
    console.log('offer', offerListings)

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch(`/api/listing/get?offer=true&limit=4`);
                const data = await res.json();
                setOfferListings(data)
                fetchRentListings();

            } catch (error) {
                console.log(error);
            }

        }
        const fetchRentListings = async () => {
            try {
                const res = await fetch(`/api/listing/get?type=rent&limit=4`);
                const data = await res.json();
                setRentListings(data)
                fetchSaleListings();

            } catch (error) {
                console.log(error);
            }
        }
        const fetchSaleListings = async () => {
            try {
                const res = await fetch(`/api/listing/get?type=sale&limit=4`);
                const data = await res.json();
                setSaleListings(data)
            } catch (error) {
                console.log(error)
            }

        }


        fetchOfferListings();
    }, [])


    return (
        <div className=''>
            {/* top */}
            <div className="flex flex-col gap-6 p-28 px-3 max-w-7xl mx-auto">
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6-xl'>find Your Next <span className='text-slate-500'>Perfect</span><br /> Place With Ease</h1>
                <div className="text-gray-400 text-xs sm:text-sm ">
                    Hanna Estate will help you find you find your home fast , east and comfortable Our experts support are always available...
                    <br />
                    We have a wide range of properties for you to choose from
                </div>
                <div className="">
                    <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to={`/search`}>
                        let's Start now...
                    </Link>
                </div>
            </div>
            {/* Swiper */}

            <Swiper navigation>
                {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
                    <SwiperSlide >
                        <div key={listing._id} className="h-[550px] " style={{ background: `url(${listing.imageUrls[0]}) center no-repeat` }}></div>
                    </SwiperSlide>
                ))}


            </Swiper>
            {/* Listings results for offer , sale and rent*/}
            <div className=" mx-auto max-w-8xl p-2 flex flex-col gap-10 my-10">
                {
                    offerListings && offerListings.length > 0 && (
                        <div className="mx-auto">
                            <div className="my-7">
                                <h2 className='text-2xl font-semibold text-slate-700 '>Recent Offers</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to='/search?offer=true'>
                                    Show More Offers...
                                </Link>
                            </div>
                            <div className="flex gap-4 flex-wrap  justify-center">
                                {offerListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )
                }
                {
                    saleListings && saleListings.length > 0 && (
                        <div className="mx-auto">
                            <div className="my-7">
                                <h2 className='text-2xl font-semibold text-slate-700 '>Recent places for sale</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to='/search?type=sale'>
                                    Show More places for Selling...
                                </Link>
                            </div>
                            <div className="flex gap-4 flex-wrap  justify-center">
                                {saleListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )
                }
                {
                    renListings && renListings.length > 0 && (
                        <div className="mx-auto">
                            <div className="my-7">
                                <h2 className='text-2xl font-semibold text-slate-700 '>Recent places for rent</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to='/search?type=rent'>
                                    Show More place to Rent...
                                </Link>
                            </div>
                            <div className="flex gap-4 flex-wrap  justify-center">
                                {renListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
} 
