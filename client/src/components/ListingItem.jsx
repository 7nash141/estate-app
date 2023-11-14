import { Link } from "react-router-dom";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';


export default function ListingItem({ listing }) {
    return (
        <div className="bg-white  gap-4 shadow-md transit-shadow overflow-hidden rounded-lg sm:w-[330px] w-full ">
            <Link to={`/listing/${listing._id}`}>
                <img className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300" src={listing.imageUrls[0]} alt="Listing Cover" />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="truncate text-lg font-semibold text-slate-700 ">{listing.name}</p>
                    <div className=" flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-700 h-4 w-4" />
                        <p className="text-sm text-gray-700 truncate w-full">{listing.address}</p>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-nowrap">{listing.description}</p>
                    <p className="text-slate-700 mt-2 font-semibold">
                        {listing.offer ? '$' + listing.discountPrice.toLocaleString('en-US') : '$' + listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / Month'}
                    </p>
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs">
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        <div className="font-bold text-xs">
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )

}
