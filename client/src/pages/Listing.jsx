import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { useSelector } from 'react-redux'
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import Contact from '../components/Contact'







export default function Listing() {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    const [contact, setContact] = useState(false)
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchLisitng = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchLisitng();
    }, [params.listingId])
    return (
        <main>
            {loading && (<p className='text-center my-7 text-2xl'>Loading....</p>)}
            {error && (<p className='text-center my-7 text-2xl'>Somthing Went wrong</p>)}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[550px] center no-repeat" style={{ background: `url(${url})` }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6 '>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${" "}
                            {listing.offer ? listing.discountPrice.toLocaleString('en-US')// will make the number as number with (fwasel )
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && '/ Month'}
                        </p>
                        <p className='flex items-center mt-6 gap-2 text-slate-800 my-2 text-sm'><FaMapMarkerAlt className='text-green-700' />{listing.address}</p>

                        <div className='flex gap-4'>
                            <p className='bg-red-900 text-white w-full max-w-[200px] text-center rounded-md p-1'>{listing.type === 'rent' ? "For Rent" : "For Sale"}</p>
                            {listing.offer && (
                                <p className='bg-green-900 text-white w-full max-w-[200px] text-center rounded-md p-1'>${listing.regularPrice - listing.discountPrice} Discount</p>
                            )}
                        </div>
                        <p className='text-slate-800 break-words'><span className='font-semibold text-black'>Descreption - {" "}</span>{listing.description}</p>
                        <ul className='text-sm font-semibold text-green-900 flex gap-4 m-2 flex-wrap' >
                            <li className='flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-green-900'>
                                <FaBed />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-green-900'>
                                <FaBath />
                                {listing.bathrooms > 1 ? `${listing.bathrooms} BathRooms` : `${listing.bathrooms} BathRoom `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-green-900'>
                                <FaParking />
                                {listing.parking ? 'Parking Spot' : "No Parking"}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-green-900'>
                                <FaChair />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button onClick={() => setContact(true)} type='button' className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3'>Contact LandLord</button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </>

            )
            }
        </main >
    )
}
