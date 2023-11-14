import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {
    const [landLord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')
    console.log('message', message);

    const onChange = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {

        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json();
                setLandLord(data)

            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();

    }, [listing.userRef])


    return (
        <div>
            {landLord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landLord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <textarea className='mt-4  w-full border p-3 rounded-lg' name="message" id="message" rows="2" value={message} onChange={onChange} placeholder='Enter Youre Message Here '></textarea>
                    <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90' to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
                </div>
            )}
        </div>
    )
}
