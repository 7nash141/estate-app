import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import ListingItem from "../components/ListingItem.jsx";

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false)
    console.log(listings);


    useEffect(() => {


        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || sortFromUrl || orderFromUrl || offerFromUrl) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === "true" ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            });
        }
        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();

            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else { setShowMore(false) }
            setListings(data);
            setLoading(false);

        }
        fetchListings()
    }, [location.search])
    const handlChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({ ...sidebardata, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === "offer") {
            setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({ ...sidebardata, sort, order })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const seacrQuery = urlParams.toString();
        navigate(`/search?${seacrQuery}`)
        console.log('query', seacrQuery)
    }
    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json();

        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data])
    }


    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2  md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2 ">
                        <span className='whitespace-nowrap' >Search Term:</span>
                        <input onChange={handlChange} value={sidebardata.searchTerm} type="text" id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full' />
                    </div>
                    <div className="flex gap-2 flex-wrap item-center">
                        <label type="text">Type</label>
                        <div className="flex gap-2">
                            <input checked={sidebardata.type === 'all'} onChange={handlChange} type="checkbox" id="all" className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input checked={sidebardata.type === 'rent'} onChange={handlChange} type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handlChange} checked={sidebardata.type === 'sale'} type="checkbox" id="sale" className='w-5' />
                            <span>sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handlChange} checked={sidebardata.offer} type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap item-center">
                        <label type="text">Amenities:</label>
                        <div className="flex gap-2">
                            <input checked={sidebardata.parking} onChange={handlChange} type="checkbox" id="parking" className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input checked={sidebardata.furnished} onChange={handlChange} type="checkbox" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label>Sort: </label>
                        <select onChange={handlChange} defaultValue={'created_at_desc'} id="sort_order" className='border rounded-lg p-3'>
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt-desc">Latest</option>
                            <option value="createdAt-asc">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80'>Search</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-800 '>Listing Resault :</h1>
                <div className="p-7 flex flex-wrap gap-4 w-full">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-slate-700">No Listing Found </p>
                    )}
                    {loading && (
                        <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
                    )}
                    {!loading && listings && listings.map((listing) => (

                        < ListingItem key={listing._id} listing={listing} />
                    ))}
                    {showMore && (
                        <button type='button' className="text-green-700 text-center w-full hover:underline p-7" onClick={onShowMoreClick}>Show More</button>
                    )}
                </div>
            </div>
        </div>
    )
}
