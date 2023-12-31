import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signOutUserSuccess, signOutUserStart, signOutUserFailure } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { errorHandler } from '../../../api/utils/error.js';
import { Link } from 'react-router-dom'

export default function Profile() {

    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false)
    const [userListings, setUserListings] = useState([])
    const dispatch = useDispatch()

    // use effect is like commponent did update -- every time change will effect the function 
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) *
                    100;
                setFilePerc(Math.round(progress))
            }, (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then
                    ((dowloadUrl) =>

                        setFormData({ ...formData, avatar: dowloadUrl }),

                    )
            }
        )
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }
    const hanleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const result = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
            const data = await result.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message))
                return;
            }
            dispatch(deleteUserSuccess(data))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = res.json()
            if (data.success === false) {
                dispatch(signInFailure(data))
                return;
            }
            dispatch(signOutUserSuccess())

        } catch (error) {
            dispatch(signInFailure(data))

        }
    }
    const handleCreateListing = async () => {

    }

    const handleShowListings = async () => {
        setShowListingsError(false)
        try {
            const res = await fetch(`/api/user/listings/${currentUser._id}`)
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return
            }
            setUserListings(data)
            console.log('came back from server of listing', userListings)
        } catch (error) {
            setShowListingsError(true);

        }

    }


    const handleListDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',

            })
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))

        } catch (error) {


        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4' id='form'>
                <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
                <p className='text-sm self-center'>
                    {fileUploadError ? (<span className='text-red-700'>Error Image Upload(image must be less than 2 mb)</span>) : filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`uploading${filePerc}%`}</span>) : filePerc === 100 ? (<span className='text-green-700'>Image Succefuly Uploaded...! </span>) : ''}
                </p>
                <input defaultValue={currentUser.username} className='border p-3 rounded-lg' type='text' placeholder='userName' id='username' onChange={handleChange} />
                <input defaultValue={currentUser.email} className='border p-3 rounded-lg' type='email' placeholder='email' id='email' onChange={handleChange} />
                <input className='border p-3 rounded-lg' type='password' placeholder='password' id='password' onChange={handleChange} />
                <button disabled={loading} onClick={handleSubmit} type="button" className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 '>{loading ? 'loading...' : 'Update!'}</button>
                <Link className='bg-green-700 text-white p-3 rouned-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>
                    Create Listing..!
                </Link>
            </form>
            <div className='flex justify-between mt-5'>
                <span onClick={hanleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>SignOut</span>
            </div>
            <p className='text-red-700'>{error ? error : ''}</p>
            <p className='text-green-700'>{updateSuccess ? 'User Updated Succefully' : ''}</p>
            <button onClick={handleShowListings} type='button' className='text-green-700 w-full'>Show Listing</button>
            <p className='text-red-700 mt-5' >{showListingsError ? 'Error Showing Lisitngs' : ''}</p>

            {userListings && userListings.length > 0 &&
                <div className="flex flex-col gap-4">
                    <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
                    {userListings.map((listing, index) => (
                        <div className="border rounded-lg p-3 flex justify-between items-center gap-4">
                            <Link to={`../listing/${listing._id}`}>
                                <img key={index} src={listing.imageUrls[0]} alt="lisitng cover" className='h-16 w-16 object-contain' />
                            </Link>
                            <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
                                <p>{listing.name}</p>
                            </Link>
                            <div className="flex flex-col item-center">
                                <button onClick={(e) => { handleListDelete(listing._id) }} type='button' className='text-red-700 uppercase font-semibold'>DELETE</button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button type='button' className='text-green-700 uppercase font-semibold'>EDIT</button>
                                </Link>
                            </div>


                        </div>

                    ))}
                </div>}
        </div>
    )
}
